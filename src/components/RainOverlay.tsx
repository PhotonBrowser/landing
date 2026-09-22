import { useEffect, useRef } from "react";

type Drop = { x: number; y: number; vx: number; vy: number; length: number };
type Splash = { x: number; y: number; age: number; vx: number; vy: number; life: number };
type Collider = { left: number; right: number; top: number };

const gravity = 680;
const wind = 240;

export default function RainOverlay() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const host = canvas?.closest<HTMLElement>(".cloud-card");
		const context = canvas?.getContext("2d");
		if (!canvas || !host || !context) return;
		const spawn = (height: number): Drop => ({ x: Math.random(), y: -12 / height, vx: wind * (0.85 + Math.random() * 0.3), vy: 360 + Math.random() * 220, length: 12 + Math.random() * 14 });
		const drops: Drop[] = [];
		const splashes: Splash[] = [];
		let frame = 0;
		let previous = performance.now();
		let spawnTimer = 0;
		let colliderTimer = 0;
		let stormProgress = 0;
		const maxDrops = 900;
		let colliders: Collider[] = [];
		let bounds = host.getBoundingClientRect();
		let layoutTimer = 1;

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
				const dpr = Math.min(window.devicePixelRatio, 2);
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
				stormProgress = Math.min(1, stormProgress + delta / 2.5);
				spawnTimer += delta;
				const spawnInterval = 0.04 - stormProgress * 0.028;
				const targetDrops = Math.round(80 + (maxDrops - 80) * stormProgress);
				while (spawnTimer > spawnInterval && drops.length < targetDrops) {
					drops.push(spawn(bounds.height));
					spawnTimer -= spawnInterval;
				}
			}

			for (let index = drops.length - 1; index >= 0; index -= 1) {
				const drop = drops[index];
				const previousY = drop.y * bounds.height;
				drop.vy += gravity * delta;
				drop.x += (drop.vx * delta) / bounds.width;
				drop.y += (drop.vy * delta) / bounds.height;
				const nextY = drop.y * bounds.height;
				const x = drop.x * bounds.width;
				const hit = colliders.find((rect) => x >= rect.left && x <= rect.right && previousY < rect.top && nextY >= rect.top);
				if (hit || nextY >= bounds.height) {
					const impactY = hit?.top ?? bounds.height;
					for (let particle = 0; particle < 6; particle += 1) {
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
				context.beginPath();
				context.moveTo(x, nextY);
				context.lineTo(x - (drop.vx / speed) * drop.length, nextY - (drop.vy / speed) * drop.length);
				context.stroke();
			}

			context.strokeStyle = "rgb(255 255 255 / 64%)";
			for (let index = splashes.length - 1; index >= 0; index -= 1) {
				const splash = splashes[index];
				splash.age += delta;
				if (splash.age > splash.life) {
					splashes.splice(index, 1);
					continue;
				}
				splash.vy += gravity * delta;
				splash.x += splash.vx * delta;
				splash.y += splash.vy * delta;
				context.globalAlpha = 1 - splash.age / splash.life;
				context.beginPath();
				context.arc(splash.x, splash.y, 1.2, 0, Math.PI * 2);
				context.fillStyle = "rgb(255 255 255 / 72%)";
				context.fill();
			}
			context.globalAlpha = 1;
			frame = requestAnimationFrame(draw);
		};

		frame = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(frame);
	}, []);

	return <canvas ref={canvasRef} className="rain-overlay" aria-hidden="true" />;
}
