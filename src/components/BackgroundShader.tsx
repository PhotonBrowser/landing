import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragment = `
precision highp float;
uniform vec2 resolution;
uniform vec2 cssResolution;
uniform vec2 referenceResolution;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) {
  float value = 0.0, amplitude = 0.5;
  for (int i = 0; i < 3; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; }
  return value;
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = (uv - vec2(0.5)) * cssResolution * (1.7 / referenceResolution.y)
    + referenceResolution * (0.85 / referenceResolution.y);
  vec2 slowSpace = p * 0.72;
  vec2 fastSpace = p * 1.28;
  vec2 deepSpace = p * 0.44;
  vec2 warp = vec2(fbm(slowSpace * 0.55 + vec2(2.4, 7.1)), fbm(slowSpace * 0.55 + vec2(8.3, 1.6)));
  float baseShape = fbm(slowSpace + (warp - 0.5) * 0.9);
  float baseDetail = fbm(slowSpace * 2.2 + 4.0);
  float baseCloud = smoothstep(0.37, 0.58, baseShape + baseDetail * 0.1);
  float highCloud = smoothstep(0.48, 0.68, fbm(fastSpace + vec2(3.7, 1.2)));
  float deepCloud = smoothstep(0.34, 0.64, fbm(deepSpace + vec2(5.2, 2.8)));
  float wispyCloud = smoothstep(0.54, 0.72, fbm(p * 3.6 + vec2(1.8, 6.4)));
  float cloud = clamp(pow(mix(baseCloud, highCloud, 0.22) * 0.72 + deepCloud * 0.28 + wispyCloud * 0.12, 0.72), 0.0, 1.0);
  float rim = smoothstep(0.24, 0.72, cloud) * (1.0 - smoothstep(0.62, 0.98, cloud));
  vec3 sky = mix(vec3(0.1, 0.16, 0.23), vec3(0.13, 0.2, 0.28), uv.y);
  vec3 light = vec3(0.23, 0.3, 0.38) + vec3(0.06, 0.08, 0.1) * rim;
  light -= vec3(0.1, 0.12, 0.14) * deepCloud * (0.3 + 0.7 * (1.0 - uv.y));
  float focus = 1.0 - smoothstep(0.2, 0.95, distance(uv, vec2(0.5, 0.52)));
  gl_FragColor = vec4(mix(sky, light, min(0.98, cloud + focus * 0.03)), 1.0);
}`;

export default function BackgroundShader() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const lightningRef = useRef<HTMLDivElement>(null);
	const dirtRef = useRef<HTMLDivElement>(null);

	// Procedural lens-dirt plate: soft smudges, dust specks and wipe streaks on
	// black. Rendered once and revealed only by lightning (screen blend), so the
	// hero looks clean until a flash scatters light across the grime.
	const renderDirtPlate = (host: HTMLElement) => {
		const width = 512;
		const height = 288;
		const dirt = document.createElement("canvas");
		dirt.width = width;
		dirt.height = height;
		const context = dirt.getContext("2d");
		if (!context) return;
		context.fillStyle = "#000";
		context.fillRect(0, 0, width, height);

		// Broad smudges.
		for (let i = 0; i < 16; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			const radius = 40 + Math.random() * 130;
			const alpha = 0.02 + Math.random() * 0.05;
			const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
			gradient.addColorStop(0, `rgba(255,255,255,${alpha.toFixed(3)})`);
			gradient.addColorStop(1, "rgba(255,255,255,0)");
			context.fillStyle = gradient;
			context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
		}

		// Fine dust specks.
		for (let i = 0; i < 260; i++) {
			const x = Math.random() * width;
			const y = Math.random() * height;
			const radius = 0.4 + Math.random() * 1.4;
			const alpha = 0.05 + Math.random() * 0.16;
			context.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI * 2);
			context.fill();
		}

		// Faint wipe streaks.
		context.save();
		context.translate(width / 2, height / 2);
		context.rotate(-0.5 + Math.random() * 0.2);
		for (let i = 0; i < 3; i++) {
			const y = (Math.random() - 0.5) * height;
			const thickness = 14 + Math.random() * 30;
			const alpha = 0.015 + Math.random() * 0.025;
			const gradient = context.createLinearGradient(0, y - thickness, 0, y + thickness);
			gradient.addColorStop(0, "rgba(255,255,255,0)");
			gradient.addColorStop(0.5, `rgba(255,255,255,${alpha.toFixed(3)})`);
			gradient.addColorStop(1, "rgba(255,255,255,0)");
			context.fillStyle = gradient;
			context.fillRect(-width, y - thickness, width * 2, thickness * 2);
		}
		context.restore();

		host.style.backgroundImage = `url(${dirt.toDataURL()})`;
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		const lightningOverlay = lightningRef.current;
		const dirtOverlay = dirtRef.current;
		const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
		if (!canvas || !lightningOverlay || !dirtOverlay || !gl) return;

		const compile = (type: number, source: string) => {
			const shader = gl.createShader(type);
			if (!shader) throw new Error("Shader creation failed");
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Shader compilation failed");
			return shader;
		};
		const program = gl.createProgram();
		if (!program) return;
		gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "Shader program linking failed");
		gl.useProgram(program);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		const resolution = gl.getUniformLocation(program, "resolution");
		const cssResolution = gl.getUniformLocation(program, "cssResolution");
		const referenceResolution = gl.getUniformLocation(program, "referenceResolution");

		const renderCloudPlate = () => {
			const width = Math.max(1, Math.round(canvas.clientWidth));
			const height = Math.max(1, Math.round(canvas.clientHeight));
			const renderScale = width * height > 1_500_000 ? 0.75 : width * height > 800_000 ? 0.85 : 1;
			const pixelWidth = Math.max(1, Math.round(width * renderScale));
			const pixelHeight = Math.max(1, Math.round(height * renderScale));
			if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
				canvas.width = pixelWidth;
				canvas.height = pixelHeight;
				gl.viewport(0, 0, pixelWidth, pixelHeight);
			}
			gl.uniform2f(resolution, pixelWidth, pixelHeight);
			gl.uniform2f(cssResolution, width, height);
			gl.uniform2f(referenceResolution, width, height);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			canvas.classList.add("shader-ready");
			window.dispatchEvent(new Event("photon:shader-ready"));
		};

		const card = canvas.closest<HTMLElement>(".cloud-card");
		if (!card) return;
		renderCloudPlate();
		renderDirtPlate(dirtOverlay);
		let resizeTimer = 0;
		const onResize = () => {
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(renderCloudPlate, 120);
		};
		window.addEventListener("resize", onResize, { passive: true });

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		const stormLevel = 1;
		let lightningTimer = 0;
		const lightningPulseTimers = new Set<number>();
		let cardOccluded = false;
		// Production cadence: every 15s a 75% chance of lightning. Dev strikes
		// faster (every 4s, always) so the effect is easy to verify.
		const lightningInterval = import.meta.env.DEV ? 4_000 : 15_000;
		const lightningChance = import.meta.env.DEV ? 1 : 0.75;
		const nextLightningDelay = () => lightningInterval;
		const scheduleLightningPulse = (callback: () => void, delay: number) => {
			const timer = window.setTimeout(() => {
				lightningPulseTimers.delete(timer);
				callback();
			}, delay);
			lightningPulseTimers.add(timer);
		};

		document.body.classList.add("storm-mode", "storm-active");
		document.body.dataset.weather = "storm";
		window.dispatchEvent(new CustomEvent("weather:intensity", { detail: { intensity: stormLevel } }));
		const scheduleLightning = (delay: number) => {
			lightningTimer = window.setTimeout(() => {
				lightningTimer = 0;
				if (!cardOccluded && !document.hidden) {
					if (Math.random() < lightningChance) {
						const baseIntensity = 0.68 + Math.random() * 0.32;
						card.style.setProperty("--lightning-x", `${16 + Math.random() * 68}%`);
						card.style.setProperty("--lightning-y", `${16 + Math.random() * 68}%`);
						const pulseCount = 2 + Math.floor(Math.random() * 4);
						let pulse = 0;
						const flashPulse = () => {
							const intensity = baseIntensity * (0.62 + Math.random() * 0.38) * (1 - pulse * (0.08 + Math.random() * 0.14));
							card.style.setProperty("--lightning-opacity", String(intensity));
							if (pulse === 0) window.dispatchEvent(new CustomEvent("weather:lightning", { detail: { intensity: baseIntensity } }));
							scheduleLightningPulse(() => {
								card.style.setProperty("--lightning-opacity", "0");
								pulse += 1;
								if (pulse < pulseCount && !cardOccluded && !document.hidden) scheduleLightningPulse(flashPulse, 45 + Math.random() * 260);
							}, 18 + Math.random() * 68);
						};
						flashPulse();
					}
					scheduleLightning(nextLightningDelay());
				}
			}, delay);
		};
		const clearLightning = () => {
			window.clearTimeout(lightningTimer);
			lightningTimer = 0;
			lightningPulseTimers.forEach(window.clearTimeout);
			lightningPulseTimers.clear();
			card.style.setProperty("--lightning-opacity", "0");
		};
		const updateOcclusion = () => {
			const section = document.querySelector<HTMLElement>(".content-section");
			if (!section) return;
			const cardBounds = card.getBoundingClientRect();
			const sectionBounds = section.getBoundingClientRect();
			const nextOccluded = sectionBounds.top <= cardBounds.top && sectionBounds.bottom >= cardBounds.bottom;
			if (nextOccluded === cardOccluded) return;
			cardOccluded = nextOccluded;
			if (cardOccluded) clearLightning();
			else if (!reducedMotion.matches && !document.hidden && !lightningTimer) scheduleLightning(nextLightningDelay());
		};
		const updateAnimationState = () => {
			if (document.hidden || cardOccluded || reducedMotion.matches) clearLightning();
			else if (!lightningTimer) scheduleLightning(nextLightningDelay());
		};

		document.addEventListener("visibilitychange", updateAnimationState);
		window.addEventListener("scroll", updateOcclusion, { passive: true });
		window.addEventListener("resize", updateOcclusion);
		reducedMotion.addEventListener("change", updateAnimationState);
		updateOcclusion();
		if (!reducedMotion.matches && !cardOccluded && !document.hidden) scheduleLightning(nextLightningDelay());

		return () => {
			document.removeEventListener("visibilitychange", updateAnimationState);
			window.removeEventListener("scroll", updateOcclusion);
			window.removeEventListener("resize", updateOcclusion);
			reducedMotion.removeEventListener("change", updateAnimationState);
			window.removeEventListener("resize", onResize);
			window.clearTimeout(resizeTimer);
			clearLightning();
			document.body.classList.remove("storm-mode", "storm-active");
			document.body.dataset.weather = "clear";
		};
	}, []);

	return (
		<>
			<canvas ref={canvasRef} className="background-shader" aria-hidden="true" />
			<div ref={lightningRef} className="background-lightning" aria-hidden="true" />
			<div ref={dirtRef} className="lens-dirt" aria-hidden="true" />
		</>
	);
}
