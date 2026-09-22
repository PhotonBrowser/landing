import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragment = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform float storm;
uniform float lightning;

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
  for (int i = 0; i < 4; i++) { value += amplitude * noise(p); p *= 2.0; amplitude *= 0.5; }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = uv * vec2(2.4, 1.7);
  vec2 slowSpace = p * 0.72 + vec2(time * 0.018, time * 0.006);
  vec2 fastSpace = p * 1.28 + vec2(-time * 0.028, time * 0.012);
  vec2 warp = vec2(fbm(slowSpace * 0.55 + vec2(2.4, 7.1)), fbm(slowSpace * 0.55 + vec2(8.3, 1.6)));
  float baseShape = fbm(slowSpace + (warp - 0.5) * 0.9);
  float baseDetail = fbm(slowSpace * 2.2 + 4.0);
  float baseCloud = smoothstep(0.37, 0.58, baseShape + baseDetail * 0.1);
  float highCloud = smoothstep(0.48, 0.68, fbm(fastSpace + vec2(3.7, 1.2)));
  float cloud = pow(mix(baseCloud, highCloud, 0.22), 0.72);
  float rim = smoothstep(0.24, 0.72, cloud) * (1.0 - smoothstep(0.62, 0.98, cloud));
  vec3 sky = mix(vec3(0.45, 0.78, 0.88), vec3(0.66, 0.88, 0.94), uv.y);
  vec3 light = mix(vec3(0.98, 1.0, 1.0), vec3(0.52, 0.57, 0.63), storm);
  light += vec3(0.08, 0.1, 0.12) * rim * (1.0 - storm);
  light += vec3(0.26, 0.29, 0.32) * lightning * (0.25 + cloud * 0.75);
  sky = mix(sky, vec3(0.32, 0.4, 0.48), storm);
  sky += vec3(0.72, 0.78, 0.84) * lightning * (0.18 + 0.42 * uv.y);
  float focus = smoothstep(0.95, 0.2, distance(uv, vec2(0.5, 0.52)));
  gl_FragColor = vec4(mix(sky, light, min(0.98, cloud + focus * 0.03)), 1.0);
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
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
		gl.useProgram(program);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const position = gl.getAttribLocation(program, "position");
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
		const resolution = gl.getUniformLocation(program, "resolution");
		const time = gl.getUniformLocation(program, "time");
		const storm = gl.getUniformLocation(program, "storm");
		const lightning = gl.getUniformLocation(program, "lightning");
		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let frame = 0;
		let stormLevel = 0;
		let stormTarget = 0;
		let stormEndTimer = 0;
		const started = performance.now();
		const weatherTransitionMs = 2_500;
		const stormAudioTailMs = 7_000;
		let stormTransitionStart = started;
		let stormTransitionFrom = 0;
		let lightningLevel = 0;
		let lightningTimer = 0;
		let lastRender = started;
		let lastAudioStormLevel = -1;
		let stormClosing = false;
		const isDev = import.meta.env.DEV;
		const permanentStorm = false;
		const stormChance = isDev ? 0.85 : 0.5;
		const cycleDelay = isDev ? 15_000 : 5 * 60_000;
		let cycleTimer = 0;
		const scheduleLightning = (delay: number) => {
			lightningTimer = window.setTimeout(() => {
				if (stormTarget === 1 && !stormClosing) {
					const baseIntensity = 0.72 + Math.random() * 0.28;
					const pulseCount = 2 + Math.floor(Math.random() * 3);
					let pulse = 0;
					const flashPulse = () => {
						const intensity = baseIntensity * (1 - pulse * 0.16) * (0.82 + Math.random() * 0.18);
						lightningLevel = intensity;
						if (pulse === 0) window.dispatchEvent(new CustomEvent("weather:lightning", { detail: { intensity: baseIntensity } }));
						document.body.classList.add("lightning-flash");
						window.setTimeout(() => {
							lightningLevel = 0;
							document.body.classList.remove("lightning-flash");
							pulse += 1;
							if (pulse < pulseCount && stormTarget === 1) window.setTimeout(flashPulse, 35 + Math.random() * 110);
						}, 32 + Math.random() * 42);
					};
					flashPulse();
					scheduleLightning(7_000 + Math.random() * 12_000);
				}
			}, delay);
		};
		const scheduleStorm = (delay: number) => {
			cycleTimer = window.setTimeout(() => {
				if (!permanentStorm && Math.random() >= stormChance) return scheduleStorm(cycleDelay);
				stormTransitionFrom = stormLevel;
				stormTransitionStart = performance.now();
				stormTarget = 1;
				stormClosing = false;
				document.body.classList.add("storm-mode");
				document.body.dataset.weather = "storm";
				scheduleLightning(4_000 + Math.random() * 5_000);
				if (reducedMotion) document.body.classList.add("storm-active");
				if (permanentStorm) return;
				const duration = isDev ? 30_000 : 30_000 + Math.random() * 30_000;
				stormEndTimer = window.setTimeout(() => {
					stormClosing = true;
					window.clearTimeout(lightningTimer);
					stormEndTimer = window.setTimeout(() => {
						stormTransitionFrom = stormLevel;
						stormTransitionStart = performance.now();
						stormTarget = 0;
						document.body.classList.remove("storm-mode");
						document.body.classList.remove("lightning-flash");
						document.body.dataset.weather = "clear";
						window.setTimeout(() => scheduleStorm(cycleDelay), weatherTransitionMs);
					}, stormAudioTailMs);
				}, duration);
			}, delay);
		};
		scheduleStorm(permanentStorm ? 0 : cycleDelay);

		const render = (now: number) => {
			const delta = Math.min((now - lastRender) / 1000, 0.05);
			lastRender = now;
			const dpr = Math.min(window.devicePixelRatio, 2);
			const width = canvas.clientWidth * dpr;
			const height = canvas.clientHeight * dpr;
			if (canvas.width !== width || canvas.height !== height) {
				canvas.width = width;
				canvas.height = height;
				gl.viewport(0, 0, width, height);
			}
			gl.uniform2f(resolution, width, height);
			gl.uniform1f(time, reducedMotion ? 0 : (now - started) / 1000);
			if (reducedMotion) {
				stormLevel = stormTarget;
			} else {
				const progress = Math.min(1, (now - stormTransitionStart) / weatherTransitionMs);
				const eased = progress * progress * (3 - progress * 2);
				stormLevel = stormTransitionFrom + (stormTarget - stormTransitionFrom) * eased;
			}
			lightningLevel *= Math.exp(-delta * 14);
			if (Math.abs(stormLevel - lastAudioStormLevel) > 0.02) {
				lastAudioStormLevel = stormLevel;
				window.dispatchEvent(new CustomEvent("weather:intensity", { detail: { intensity: stormLevel } }));
			}
			document.body.classList.toggle("storm-active", stormLevel > 0.72);
			gl.uniform1f(storm, stormLevel);
			gl.uniform1f(lightning, lightningLevel);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			if (!reducedMotion) frame = requestAnimationFrame(render);
		};
		render(started);
		return () => {
			window.clearTimeout(cycleTimer);
			window.clearTimeout(stormEndTimer);
			window.clearTimeout(lightningTimer);
			document.body.classList.remove("storm-mode");
			document.body.classList.remove("storm-active");
			document.body.classList.remove("lightning-flash");
			document.body.dataset.weather = "clear";
			cancelAnimationFrame(frame);
		};
	}, []);

	return <canvas ref={canvasRef} className="background-shader" aria-hidden="true" />;
}
