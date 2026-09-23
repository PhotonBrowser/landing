import { useEffect, useRef } from "react";
import { weatherConfig } from "../config/weather";

type Drop = { x: number; y: number; vx: number; vy: number; length: number; depth: number; phase: number };
type Splash = { x: number; y: number; age: number; vx: number; vy: number; life: number };
type Collider = { left: number; right: number; top: number; bottom: number };
type Cursor = { x: number; y: number } | null;
const dropStyles = [
	{ color: "rgb(150 187 214 / 42%)", alpha: 0.22, width: 0.6 },
	{ color: "rgb(188 216 236 / 52%)", alpha: 0.38, width: 1 },
	{ color: "rgb(220 237 248 / 64%)", alpha: 0.55, width: 1.3 },
];
// Shape each glyph collider so drops hit the letters instead of their full line boxes.
const textColliderBands = [0.2, 0.4, 0.58, 0.74, 0.88, 0.98, 0.94, 0.82, 0.62, 0.38, 0.18];
export default function RainOverlay() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const host = canvas?.closest<HTMLElement>(".cloud-card");
		const context = canvas?.getContext("2d");
		if (!canvas || !host || !context) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const colliderRoot = host.closest<HTMLElement>(".hero-sticky") ?? host;
		const { rain } = weatherConfig;
		const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
		const lowEnd = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || navigator.hardwareConcurrency <= 4 || nav.connection?.saveData === true;
		const particleScale = lowEnd ? 0.5 : 1;
		const spawn = (height: number): Drop => {
			const layer = Math.random();
			const depth = layer < 0.3 ? 0.2 + Math.random() * 0.2 : layer < 0.78 ? 0.5 + Math.random() * 0.25 : 0.82 + Math.random() * 0.18;
			return { x: Math.random(), y: -12 / height, vx: rain.wind * (0.4 + depth * 1.05), vy: rain.dropSpeed.minimum + depth * rain.dropSpeed.depthScale, length: rain.dropLength.minimum + depth * rain.dropLength.depthScale, depth, phase: Math.random() * Math.PI * 2 };
		};
		const drops: Drop[] = [];
		const splashes: Splash[] = [];
		let frame = 0;
		let previous = performance.now();
		let spawnTimer = 0;
		let stormProgress = 0;
		let colliders: Collider[] = [];
		const colliderBuckets = new Map<number, Collider[]>();
		let cursor: Cursor = null;
		let bounds = host.getBoundingClientRect();
		let collidersDirty = true;
		let layoutTimer = 1;
		let lastDraw = previous;
		let rainFrames = 0;
		let lastRainReport = previous;
		let rainFps = 0;
		const performanceOverlay = import.meta.env.DEV ? document.createElement("pre") : null;
		if (performanceOverlay) {
			performanceOverlay.setAttribute("aria-hidden", "true");
			performanceOverlay.style.cssText = "position:fixed;right:8px;bottom:8px;z-index:100;margin:0;pointer-events:none;color:white;text-shadow:0 1px 3px #000;font:11px/1.4 monospace;white-space:pre;opacity:.85";
			document.body.append(performanceOverlay);
		}
		const updatePerformanceOverlay = () => {
			if (!performanceOverlay) return;
			performanceOverlay.textContent = [
				`Rain ${rainFps} fps · ${drops.length} drops · ${splashes.length} splashes`,
				"Clouds rendered once; CSS drift",
				`Rain canvas ${canvas.width}×${canvas.height} · DPR ${window.devicePixelRatio.toFixed(1)}`,
			].join("\n");
		};

		const updateCursor = (event: PointerEvent) => {
			cursor = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
		};
		const clearCursor = () => {
			cursor = null;
		};
		host.addEventListener("pointermove", updateCursor, { passive: true });
		host.addEventListener("pointerleave", clearCursor);

		const collectColliders = () => {
			const next: Collider[] = [];
			const hostRect = host.getBoundingClientRect();
			const elements = [...colliderRoot.querySelectorAll<HTMLElement>("button, input, .badge, h1, p")].filter((element) => !element.closest(".site-nav"));
			for (const element of elements) {
				if (element.matches("button, input, .badge")) {
					const rect = element.getBoundingClientRect();
					next.push({ left: rect.left - hostRect.left, right: rect.right - hostRect.left, top: rect.top - hostRect.top, bottom: rect.bottom - hostRect.top });
					continue;
				}
				const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
				let node: Node | null;
				while ((node = walker.nextNode())) {
					const text = node.textContent ?? "";
					if (!text.trim()) continue;
					const range = document.createRange();
					for (let character = 0; character < text.length; character += 1) {
						if (!text[character].trim()) continue;
						range.setStart(node, character);
						range.setEnd(node, character + 1);
						const rect = range.getBoundingClientRect();
						if (rect.width === 0 || rect.height === 0) continue;
						const left = rect.left - hostRect.left;
						const center = left + rect.width / 2;
						for (let band = 0; band < textColliderBands.length; band += 1) {
							const bandWidth = rect.width * textColliderBands[band];
							const bandTop = rect.top - hostRect.top + (rect.height * band) / textColliderBands.length;
							next.push({
								left: center - bandWidth / 2,
								right: center + bandWidth / 2,
								top: bandTop,
								bottom: bandTop + rect.height / textColliderBands.length,
							});
						}
					}
				}
			}
			colliders = next;
			colliderBuckets.clear();
			for (const collider of colliders) {
				const firstBucket = Math.floor(collider.left / 64);
				const lastBucket = Math.floor(collider.right / 64);
				for (let bucket = firstBucket; bucket <= lastBucket; bucket += 1) {
					const entries = colliderBuckets.get(bucket);
					if (entries) entries.push(collider);
					else colliderBuckets.set(bucket, [collider]);
				}
			}
			collidersDirty = false;
		};
		let colliderRefreshTimer = 0;
		const invalidateColliders = () => {
			if (colliderRefreshTimer) return;
			colliderRefreshTimer = window.setTimeout(() => {
				colliderRefreshTimer = 0;
				collidersDirty = true;
			}, 80);
		};
		const resizeObserver = new ResizeObserver(invalidateColliders);
		resizeObserver.observe(host);
		resizeObserver.observe(colliderRoot);
		const mutationObserver = new MutationObserver(invalidateColliders);
		mutationObserver.observe(colliderRoot, { childList: true, characterData: true, subtree: true });
		window.addEventListener("resize", invalidateColliders, { passive: true });
		window.addEventListener("scroll", invalidateColliders, { passive: true, capture: true });
		document.fonts?.ready.then(invalidateColliders);

		const draw = (now: number) => {
			if (document.hidden) {
				frame = 0;
				return;
			}
			if (now - lastDraw < 1000 / 30) {
				frame = requestAnimationFrame(draw);
				return;
			}
			lastDraw = now;
			rainFrames += 1;
			if (now - lastRainReport >= 1_000) {
				rainFps = Math.round((rainFrames * 1_000) / (now - lastRainReport));
				rainFrames = 0;
				lastRainReport = now;
				updatePerformanceOverlay();
			}
			const delta = Math.min((now - previous) / 1000, 0.05);
			previous = now;
			layoutTimer += delta;
			if (layoutTimer > 0.25) {
				bounds = host.getBoundingClientRect();
				const dpr = 1;
				const width = Math.round(bounds.width * dpr);
				const height = Math.round(bounds.height * dpr);
				if (canvas.width !== width || canvas.height !== height) {
					canvas.width = width;
					canvas.height = height;
					context.setTransform(dpr, 0, 0, dpr, 0, 0);
				}
				layoutTimer = 0;
			}
			context.clearRect(0, 0, bounds.width, bounds.height);
			const stormMode = document.body.classList.contains("storm-mode");
			context.strokeStyle = "rgb(255 255 255 / 46%)";
			context.lineWidth = 0.8;
			if (collidersDirty) {
				collectColliders();
			}
			if (!stormMode) {
				drops.length = 0;
				splashes.length = 0;
				spawnTimer = 0;
				stormProgress = 0;
			} else {
				stormProgress = Math.min(1, stormProgress + delta / rain.rampDuration);
				spawnTimer += delta;
				const spawnInterval = rain.spawnInterval.light - stormProgress * (rain.spawnInterval.light - rain.spawnInterval.heavy);
				const targetDrops = Math.round((140 + (rain.maxDrops - 140) * stormProgress) * particleScale);
				while (spawnTimer > spawnInterval && drops.length < targetDrops) {
					drops.push(spawn(bounds.height));
					spawnTimer -= spawnInterval;
				}
			}

			const dropPaths = [new Path2D(), new Path2D(), new Path2D()];
			let keptDrops = 0;
			for (let index = 0; index < drops.length; index += 1) {
				const drop = drops[index];
				const previousY = drop.y * bounds.height;
				const previousX = drop.x * bounds.width;
				drop.vy += rain.gravity * delta;
				const gust = Math.sin(now * 0.0007 + drop.phase) * 80 + Math.sin(now * 0.0017) * 35;
				drop.x += ((drop.vx + gust * (0.35 + drop.depth)) * delta) / bounds.width;
				drop.y += (drop.vy * delta) / bounds.height;
				const nextY = drop.y * bounds.height;
				const x = drop.x * bounds.width;
				const cursorHit = cursor && Math.abs(x - cursor.x) < 14 && previousY < cursor.y && nextY >= cursor.y;
				const horizontalSpeed = x - previousX;
				const verticalSpeed = nextY - previousY;
				let hitY = bounds.height;
				let hit: Collider | undefined;
				if (verticalSpeed > 0) {
					const firstBucket = Math.floor(Math.min(previousX, x) / 64);
					const lastBucket = Math.floor(Math.max(previousX, x) / 64);
					for (let bucket = firstBucket; bucket <= lastBucket && !hit; bucket += 1) {
						hit = colliderBuckets.get(bucket)?.find((rect) => {
							if (nextY < rect.top || previousY > rect.bottom) return false;
							const impactY = Math.max(rect.top, previousY);
							const progress = (impactY - previousY) / verticalSpeed;
							const impactX = previousX + horizontalSpeed * progress;
							if (impactX < rect.left || impactX > rect.right) return false;
							hitY = impactY;
							return true;
						});
					}
				}
				if (cursorHit || hit || nextY >= bounds.height) {
					const impactY = cursorHit ? cursor.y : hit ? hitY : bounds.height;
					const splashCount = Math.round((drop.depth > rain.foregroundDepth ? rain.foregroundSplashCount : rain.backgroundSplashCount) * particleScale);
					for (let particle = 0; particle < splashCount; particle += 1) {
						splashes.push({ x, y: impactY, age: 0, vx: (Math.random() - 0.5) * 90, vy: -75 - Math.random() * 75, life: 0.18 + Math.random() * 0.16 });
					}
					continue;
				}
				if (nextY > bounds.height + drop.length || x < -drop.length || x > bounds.width + drop.length) {
					continue;
				}
				const speed = Math.hypot(drop.vx, drop.vy);
				const path = dropPaths[drop.depth < 0.45 ? 0 : drop.depth < 0.78 ? 1 : 2];
				path.moveTo(x, nextY);
				path.lineTo(x - (drop.vx / speed) * drop.length, nextY - (drop.vy / speed) * drop.length);
				drops[keptDrops] = drop;
				keptDrops += 1;
			}
			drops.length = keptDrops;
			for (let layer = 0; layer < dropPaths.length; layer += 1) {
				context.globalAlpha = dropStyles[layer].alpha;
				context.strokeStyle = dropStyles[layer].color;
				context.lineWidth = dropStyles[layer].width;
				context.stroke(dropPaths[layer]);
			}

			context.globalAlpha = 1;
			context.strokeStyle = "rgb(255 255 255 / 64%)";
			let keptSplashes = 0;
			for (let index = 0; index < splashes.length; index += 1) {
				const splash = splashes[index];
				splash.age += delta;
				if (splash.age > splash.life) continue;
				splash.vy += rain.gravity * delta;
				splash.x += splash.vx * delta;
				splash.y += splash.vy * delta;
				context.globalAlpha = 1 - splash.age / splash.life;
				context.beginPath();
				context.arc(splash.x, splash.y, 1.2, 0, Math.PI * 2);
				context.fillStyle = "rgb(210 232 246 / 56%)";
				context.fill();
				splashes[keptSplashes] = splash;
				keptSplashes += 1;
			}
			splashes.length = keptSplashes;
			context.globalAlpha = 1;
			frame = requestAnimationFrame(draw);
		};

		frame = requestAnimationFrame(draw);
		const onVisibilityChange = () => {
			if (document.hidden) {
				cancelAnimationFrame(frame);
				frame = 0;
				return;
			}
			if (!frame) {
				previous = performance.now();
				lastDraw = previous;
				lastRainReport = previous;
				rainFrames = 0;
				frame = requestAnimationFrame(draw);
			}
		};
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
			window.clearTimeout(colliderRefreshTimer);
			window.removeEventListener("resize", invalidateColliders);
			window.removeEventListener("scroll", invalidateColliders, true);
			if (performanceOverlay) {
				performanceOverlay.remove();
			}
			host.removeEventListener("pointermove", updateCursor);
			host.removeEventListener("pointerleave", clearCursor);
			cancelAnimationFrame(frame);
		};
	}, []);

	return <canvas ref={canvasRef} className="rain-overlay" aria-hidden="true" />;
}
