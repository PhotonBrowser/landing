import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragment = `
precision highp float;
uniform vec2 resolution;
uniform vec2 cssResolution;
uniform vec2 referenceResolution;
uniform float time;
uniform float storm;
uniform float lightning;
uniform vec2 lightningPosition;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

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
  // Keep the cloud field anchored to its initial size as the card reveals more canvas.
  vec2 p = (uv - vec2(0.5)) * cssResolution * (1.7 / referenceResolution.y)
    + referenceResolution * (0.85 / referenceResolution.y);
  vec2 slowSpace = p * 0.72 + vec2(time * 0.018, time * 0.006);
  vec2 fastSpace = p * 1.28 + vec2(-time * 0.028, time * 0.012);
  vec2 deepSpace = p * 0.44 + vec2(-time * 0.006, time * 0.003);
  vec2 warp = vec2(fbm(slowSpace * 0.55 + vec2(2.4, 7.1)), fbm(slowSpace * 0.55 + vec2(8.3, 1.6)));
  float baseShape = fbm(slowSpace + (warp - 0.5) * 0.9);
  float baseDetail = fbm(slowSpace * 2.2 + 4.0);
  float baseCloud = smoothstep(0.37, 0.58, baseShape + baseDetail * 0.1);
  float highCloud = smoothstep(0.48, 0.68, fbm(fastSpace + vec2(3.7, 1.2)));
  float deepCloud = smoothstep(0.34, 0.64, fbm(deepSpace + vec2(5.2, 2.8)));
  float wispyCloud = smoothstep(0.54, 0.72, fbm(p * 3.6 + vec2(time * 0.009, -time * 0.004) + vec2(1.8, 6.4)));
  float cloud = clamp(pow(mix(baseCloud, highCloud, 0.22) * 0.72 + deepCloud * 0.28 + wispyCloud * 0.12, 0.72), 0.0, 1.0);
  float rim = smoothstep(0.24, 0.72, cloud) * (1.0 - smoothstep(0.62, 0.98, cloud));
  vec2 flashOffset = (uv - lightningPosition) * vec2(1.0, 1.3);
  float lightningArea = exp(-dot(flashOffset, flashOffset) * 11.0);
  float cloudDetail = clamp(baseDetail * 0.45 + deepCloud * 0.35 + wispyCloud * 0.2, 0.0, 1.0);
  vec3 sky = mix(vec3(0.45, 0.78, 0.88), vec3(0.66, 0.88, 0.94), uv.y);
  vec3 light = mix(vec3(0.98, 1.0, 1.0), vec3(0.23, 0.3, 0.38), storm);
  light += vec3(0.06, 0.08, 0.1) * rim;
  light -= vec3(0.1, 0.12, 0.14) * deepCloud * (0.3 + 0.7 * (1.0 - uv.y));
  light += vec3(0.24, 0.28, 0.34) * lightning * lightningArea * cloud * (0.24 + cloudDetail * 0.76);
  sky = mix(sky, vec3(0.1, 0.16, 0.23), storm);
  float cloudGap = 1.0 - smoothstep(0.28, 0.72, cloud);
  sky += vec3(0.72, 0.8, 0.92) * lightning * cloudGap * (0.05 + lightningArea * 0.95) * (0.24 + 0.76 * uv.y);
  // Keep smoothstep's edges ordered; reversed edges are undefined in GLSL ES.
  float focus = 1.0 - smoothstep(0.2, 0.95, distance(uv, vec2(0.5, 0.52)));
  vec3 color = mix(sky, light, min(0.98, cloud + focus * 0.03));
  float flash = lightning * (0.11 + lightningArea * 0.55);
  color = min(vec3(1.0), color + vec3(0.72, 0.82, 0.96) * flash);
  gl_FragColor = vec4(color, 1.0);
}`;

export default function BackgroundShader() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const gl = canvas?.getContext("webgl", { antialias: false, alpha: false });
		if (!canvas || !gl) return;

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
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw new Error(gl.getProgramInfoLog(program) ?? "Shader program linking failed");
		}
		gl.useProgram(program);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		const resolution = gl.getUniformLocation(program, "resolution");
		const cssResolutionUniform = gl.getUniformLocation(program, "cssResolution");
		const referenceResolutionUniform = gl.getUniformLocation(program, "referenceResolution");
		const time = gl.getUniformLocation(program, "time");
		const storm = gl.getUniformLocation(program, "storm");
		const lightning = gl.getUniformLocation(program, "lightning");
		const lightningPosition = gl.getUniformLocation(program, "lightningPosition");
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let frame = 0;
		const started = performance.now();
		let shaderTime = 0;
		let lightningLevel = 0;
		let lightningTimer = 0;
		const lightningPulseTimers = new Set<number>();
		let cardOccluded = false;
		let lastRender = started;
		let lastAudioStormLevel = -1;
		let performanceFrames = 0;
		let lastPerformanceReport = started;
		let currentLightningPosition: [number, number] = [0.5, 0.5];
		let referenceCssWidth = 0;
		let referenceCssHeight = 0;
		const stormLevel = 1;
		const stormTarget = 1;
		const lightningChance = 0.68;
		const nextLightningDelay = () => 18_000 + Math.random() * 42_000;
		const scheduleLightningPulse = (callback: () => void, delay: number) => {
			const timer = window.setTimeout(() => {
				lightningPulseTimers.delete(timer);
				callback();
			}, delay);
			lightningPulseTimers.add(timer);
		};

		document.body.classList.add("storm-mode", "storm-active");
		document.body.dataset.weather = "storm";
		const scheduleLightning = (delay: number) => {
			lightningTimer = window.setTimeout(() => {
				lightningTimer = 0;
				if (stormTarget === 1 && !cardOccluded && !document.hidden) {
					if (Math.random() < lightningChance) {
						const baseIntensity = 0.68 + Math.random() * 0.32;
						currentLightningPosition = [0.16 + Math.random() * 0.68, 0.16 + Math.random() * 0.68];
						const pulseCount = 2 + Math.floor(Math.random() * 4);
						let pulse = 0;
						const flashPulse = () => {
							const intensity = baseIntensity * (0.62 + Math.random() * 0.38) * (1 - pulse * (0.08 + Math.random() * 0.14));
							lightningLevel = intensity;
							if (pulse === 0) window.dispatchEvent(new CustomEvent("weather:lightning", { detail: { intensity: baseIntensity } }));
							scheduleLightningPulse(() => {
								lightningLevel = 0;
								pulse += 1;
								if (pulse < pulseCount && stormTarget === 1 && !cardOccluded && !document.hidden) {
									scheduleLightningPulse(flashPulse, 45 + Math.random() * 260);
								}
							}, 18 + Math.random() * 68);
						};
						flashPulse();
					}
					scheduleLightning(nextLightningDelay());
				}
			}, delay);
		};

		const render = (now: number) => {
			if (document.hidden || cardOccluded) {
				frame = 0;
				return;
			}
			if (now - lastRender < 1000 / 60) {
				frame = requestAnimationFrame(render);
				return;
			}
			const delta = Math.min((now - lastRender) / 1000, 0.05);
			lastRender = now;
			if (!reducedMotion) shaderTime += delta;
			const pixelArea = canvas.clientWidth * canvas.clientHeight;
			// The cloud shader is fragment-heavy; slight downsampling preserves its soft look
			// while cutting fragment work on large canvases.
			const renderScale = pixelArea > 1_500_000 ? 0.75 : pixelArea > 800_000 ? 0.85 : 1;
			const dpr = Math.min(window.devicePixelRatio, 1) * renderScale;
			const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
			const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
			const cssWidth = Math.max(1, canvas.clientWidth);
			const cssHeight = Math.max(1, canvas.clientHeight);
			if (referenceCssWidth === 0) {
				referenceCssWidth = cssWidth;
				referenceCssHeight = cssHeight;
			}
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
				gl.viewport(0, 0, width, height);
			}
			gl.uniform2f(resolution, width, height);
			gl.uniform2f(cssResolutionUniform, cssWidth, cssHeight);
			gl.uniform2f(referenceResolutionUniform, referenceCssWidth, referenceCssHeight);
			gl.uniform1f(time, reducedMotion ? 0 : shaderTime);
			lightningLevel *= Math.exp(-delta * 14);
			if (Math.abs(stormLevel - lastAudioStormLevel) > 0.02) {
				lastAudioStormLevel = stormLevel;
				window.dispatchEvent(new CustomEvent("weather:intensity", { detail: { intensity: stormLevel } }));
			}
			gl.uniform1f(storm, stormLevel);
			gl.uniform1f(lightning, lightningLevel);
			gl.uniform2f(lightningPosition, currentLightningPosition[0], currentLightningPosition[1]);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			canvas.classList.add("shader-ready");
			if (import.meta.env.DEV) {
				performanceFrames += 1;
				if (now - lastPerformanceReport >= 1_000) {
					window.dispatchEvent(new CustomEvent("page:shader-performance", {
						detail: {
							fps: Math.round((performanceFrames * 1_000) / (now - lastPerformanceReport)),
							width,
							height,
						},
					}));
					performanceFrames = 0;
					lastPerformanceReport = now;
				}
			}
			if (!reducedMotion) frame = requestAnimationFrame(render);
		};
		const updateAnimationState = () => {
			if (document.hidden || cardOccluded) {
				cancelAnimationFrame(frame);
				frame = 0;
				window.clearTimeout(lightningTimer);
				lightningTimer = 0;
				lightningPulseTimers.forEach(window.clearTimeout);
				lightningPulseTimers.clear();
				lightningLevel = 0;
				return;
			}

			if (!reducedMotion && !frame) {
				lastRender = performance.now();
				lastPerformanceReport = lastRender;
				performanceFrames = 0;
				frame = requestAnimationFrame(render);
			}
			if (!reducedMotion && !lightningTimer) scheduleLightning(nextLightningDelay());
		};
		const card = canvas.closest<HTMLElement>(".cloud-card");
		const occludingSection = document.querySelector<HTMLElement>(".content-section");
		const updateOcclusion = () => {
			if (!card || !occludingSection) return;
			const cardBounds = card.getBoundingClientRect();
			const sectionBounds = occludingSection.getBoundingClientRect();
			const nextOccluded = sectionBounds.top <= cardBounds.top && sectionBounds.bottom >= cardBounds.bottom;
			if (nextOccluded === cardOccluded) return;
			cardOccluded = nextOccluded;
			updateAnimationState();
		};
		const onVisibilityChange = () => {
			updateAnimationState();
		};
		document.addEventListener("visibilitychange", onVisibilityChange);
		window.addEventListener("scroll", updateOcclusion, { passive: true });
		window.addEventListener("resize", updateOcclusion);
		updateOcclusion();
		render(started);
		if (!reducedMotion && !cardOccluded && !document.hidden) {
			scheduleLightning(12_000 + Math.random() * 18_000);
		}
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("scroll", updateOcclusion);
			window.removeEventListener("resize", updateOcclusion);
			window.clearTimeout(lightningTimer);
			lightningPulseTimers.forEach(window.clearTimeout);
			lightningPulseTimers.clear();
			document.body.classList.remove("storm-mode");
			document.body.classList.remove("storm-active");
			document.body.dataset.weather = "clear";
			cancelAnimationFrame(frame);
		};
	}, []);

	return <canvas ref={canvasRef} className="background-shader" aria-hidden="true" />;
}
