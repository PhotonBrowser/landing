import { useEffect, useRef } from "react";
import { weatherConfig } from "../config/weather";

type Drop = { x: number; y: number; vx: number; vy: number; length: number; depth: number; phase: number };
type Splash = { x: number; y: number; age: number; vx: number; vy: number; life: number };
type Collider = { left: number; right: number; top: number };
type Cursor = { x: number; y: number } | null;

export default function RainOverlay() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const host = canvas?.closest<HTMLElement>(".cloud-card");
		const context = canvas?.getContext("2d");
		if (!canvas || !host || !context) return;
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
		let colliderTimer = 0;
		let stormProgress = 0;
		const maxDrops = Math.round(rain.maxDrops * particleScale);
		let colliders: Collider[] = [];
		let cursor: Cursor = null;
		let bounds = host.getBoundingClientRect();
		let layoutTimer = 1;

		const updateCursor = (event: PointerEvent) => {
			const rect = host.getBoundingClientRect();
			cursor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		};
		const clearCursor = () => {
			cursor = null;
		};
		host.addEventListener("pointermove", updateCursor);
		host.addEventListener("pointerleave", clearCursor);

		const collectColliders = () => {
			const next: Collider[] = [];
			const hostRect = host.getBoundingClientRect();
			const elements = [...host.querySelectorAll<HTMLElement>("button, input, .badge, h1, p")].filter((element) => !element.closest(".site-nav"));
			for (const element of elements) {
				if (element.matches("button, input, .badge")) {
					const rect = element.getBoundingClientRect();
					next.push({ left: rect.left - hostRect.left, right: rect.right - hostRect.left, top: rect.top - hostRect.top });
					continue;
				}
				const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
				let node: Node | null;
				while ((node = walker.nextNode())) {
					const text = node.textContent ?? "";
					for (let character = 0; character < text.length; character += 1) {
						if (!text[character].trim()) continue;
						const range = document.createRange();
						range.setStart(node, character);
						range.setEnd(node, character + 1);
						const rect = range.getBoundingClientRect();
						if (rect.width > 0 && rect.height > 0) {
							const left = rect.left - hostRect.left;
							const center = left + rect.width / 2;
							const bands = [0.35, 0.7, 0.95, 0.7, 0.35];
							bands.forEach((width, band) => {
								const bandWidth = rect.width * width;
								next.push({ left: center - bandWidth / 2, right: center + bandWidth / 2, top: rect.top - hostRect.top + (rect.height * band) / bands.length });
							});
						}
					}
				}
			}
			colliders = next;
		};

		const draw = (now: number) => {
			const delta = Math.min((now - previous) / 1000, 0.05);
			previous = now;
			layoutTimer += delta;
			if (layoutTimer > 0.1) {
				bounds = host.getBoundingClientRect();
				const dpr = Math.min(window.devicePixelRatio, lowEnd ? 1 : 2);
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
			colliderTimer += delta;
			if (colliderTimer > 0.1) {
				collectColliders();
				colliderTimer = 0;
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

			for (let index = drops.length - 1; index >= 0; index -= 1) {
				const drop = drops[index];
				const previousY = drop.y * bounds.height;
					drop.vy += rain.gravity * delta;
				const gust = Math.sin(now * 0.0007 + drop.phase) * 80 + Math.sin(now * 0.0017) * 35;
				drop.x += ((drop.vx + gust * (0.35 + drop.depth)) * delta) / bounds.width;
				drop.y += (drop.vy * delta) / bounds.height;
				const nextY = drop.y * bounds.height;
				const x = drop.x * bounds.width;
				const cursorHit = cursor && Math.abs(x - cursor.x) < 14 && previousY < cursor.y && nextY >= cursor.y;
				const hit = colliders.find((rect) => x >= rect.left && x <= rect.right && previousY < rect.top && nextY >= rect.top);
				if (cursorHit || hit || nextY >= bounds.height) {
					const impactY = cursorHit ? cursor.y : hit?.top ?? bounds.height;
					const splashCount = Math.round((drop.depth > rain.foregroundDepth ? rain.foregroundSplashCount : rain.backgroundSplashCount) * particleScale);
					for (let particle = 0; particle < splashCount; particle += 1) {
						splashes.push({ x, y: impactY, age: 0, vx: (Math.random() - 0.5) * 90, vy: -75 - Math.random() * 75, life: 0.18 + Math.random() * 0.16 });
					}
					drops.splice(index, 1);
					continue;
				}
				if (nextY > bounds.height + drop.length || x < -drop.length || x > bounds.width + drop.length) {
					drops.splice(index, 1);
					continue;
				}
				const speed = Math.hypot(drop.vx, drop.vy);
				context.globalAlpha = rain.dropOpacity.minimum + drop.depth * rain.dropOpacity.depthScale;
				context.lineWidth = 0.45 + drop.depth * 0.9;
				context.strokeStyle = drop.depth < 0.45 ? "rgb(150 187 214 / 42%)" : drop.depth < 0.78 ? "rgb(188 216 236 / 52%)" : "rgb(220 237 248 / 64%)";
				context.beginPath();
				context.moveTo(x, nextY);
				context.lineTo(x - (drop.vx / speed) * drop.length, nextY - (drop.vy / speed) * drop.length);
				context.stroke();
			}

			context.globalAlpha = 1;
			context.strokeStyle = "rgb(255 255 255 / 64%)";
			for (let index = splashes.length - 1; index >= 0; index -= 1) {
				const splash = splashes[index];
				splash.age += delta;
				if (splash.age > splash.life) {
					splashes.splice(index, 1);
					continue;
				}
				splash.vy += rain.gravity * delta;
				splash.x += splash.vx * delta;
				splash.y += splash.vy * delta;
				context.globalAlpha = 1 - splash.age / splash.life;
				context.beginPath();
				context.arc(splash.x, splash.y, 1.2, 0, Math.PI * 2);
				context.fillStyle = "rgb(210 232 246 / 56%)";
				context.fill();
			}
			context.globalAlpha = 1;
			frame = requestAnimationFrame(draw);
		};

		frame = requestAnimationFrame(draw);
		return () => {
			host.removeEventListener("pointermove", updateCursor);
			host.removeEventListener("pointerleave", clearCursor);
			cancelAnimationFrame(frame);
		};
	}, []);

	return <canvas ref={canvasRef} className="rain-overlay" aria-hidden="true" />;
}
