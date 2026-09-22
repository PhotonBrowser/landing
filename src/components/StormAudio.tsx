import { Volume2, VolumeX } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const rainSource = "/audio/light-rain-loop.mp3";
const thunderSources = [
	"/audio/rain-thunder-storm.mp3",
	"/audio/thunder-distant.mp3",
	"/audio/thunder-big-rumble.mp3",
	"/audio/thunder-rain-storm.mp3",
	"/audio/thunder-storm-rumble.mp3",
	"/audio/thunder-forest-storm.mp3",
	"/audio/thunderstorm-background.mp3",
	"/audio/storm-rumble-starting.mp3",
];
const thunderFadeDuration = 3_000;

const isRaining = () => document.body.classList.contains("storm-mode");

export default function StormAudio() {
	const rainContextRef = useRef<AudioContext | null>(null);
	const rainSourceRef = useRef<AudioBufferSourceNode | null>(null);
	const rainGainRef = useRef<GainNode | null>(null);
	const rainBufferRef = useRef<AudioBuffer | null>(null);
	const rainStartRef = useRef<Promise<void> | null>(null);
	const thunderTimersRef = useRef(new Set<number>());
	const thunderPlayersRef = useRef(new Set<HTMLAudioElement>());
	const thunderCleanupRef = useRef(new Map<HTMLAudioElement, () => void>());
	const lastThunderIndexRef = useRef(-1);
	const enabledRef = useRef(false);
	const [enabled, setEnabled] = useState(false);

	const stopRain = () => {
		rainSourceRef.current?.stop();
		rainSourceRef.current?.disconnect();
		rainGainRef.current?.disconnect();
		rainSourceRef.current = null;
		rainGainRef.current = null;
	};

	const startRain = () => {
		if (rainSourceRef.current) return Promise.resolve();
		if (rainStartRef.current) return rainStartRef.current;

		rainStartRef.current = (async () => {
			const context = rainContextRef.current ?? new AudioContext();
			rainContextRef.current = context;
			void context.resume();
			let buffer = rainBufferRef.current;
			if (!buffer) {
				const response = await fetch(rainSource);
				buffer = await context.decodeAudioData(await response.arrayBuffer());
				rainBufferRef.current = buffer;
			}
			if (!enabledRef.current || !isRaining()) return;
			const source = context.createBufferSource();
			const gain = context.createGain();
			source.buffer = buffer;
			source.loop = true;
			source.loopStart = 0;
			source.loopEnd = buffer.duration;
			gain.gain.value = 0;
			source.connect(gain).connect(context.destination);
			source.start();
			rainSourceRef.current = source;
			rainGainRef.current = gain;
		})().finally(() => {
			rainStartRef.current = null;
		});

		return rainStartRef.current;
	};

	const fadeRain = (target: number, duration = 2_500, stopWhenDone = false) => {
		const context = rainContextRef.current;
		const gain = rainGainRef.current;
		if (!context || !gain) return;
		const now = context.currentTime;
		gain.gain.cancelScheduledValues(now);
		gain.gain.setValueAtTime(gain.gain.value, now);
		gain.gain.linearRampToValueAtTime(target, now + duration / 1000);
		if (stopWhenDone) {
			window.setTimeout(() => {
				if (rainGainRef.current === gain && !isRaining()) stopRain();
			}, duration + 50);
		}
	};

	useEffect(() => {
		enabledRef.current = enabled;
		const syncRain = async () => {
			if (!enabled) return;
			if (!isRaining()) {
				fadeRain(0, 2_500, true);
				return;
			}
			await startRain();
			if (enabledRef.current && isRaining()) fadeRain(0.14);
		};
		const onIntensity = (event: Event) => {
			if (!enabledRef.current || !isRaining()) return;
			const intensity = (event as CustomEvent<{ intensity: number }>).detail.intensity;
			fadeRain(0.025 + intensity * 0.12, 500);
		};
		const onLightning = (event: Event) => {
			if (!enabledRef.current || !isRaining()) return;
			const intensity = (event as CustomEvent<{ intensity: number }>).detail.intensity;
			const timer = window.setTimeout(() => {
				thunderTimersRef.current.delete(timer);
				let sourceIndex = Math.floor(Math.random() * thunderSources.length);
				while (thunderSources.length > 1 && sourceIndex === lastThunderIndexRef.current) {
					sourceIndex = Math.floor(Math.random() * thunderSources.length);
				}
				lastThunderIndexRef.current = sourceIndex;
				const player = new Audio(thunderSources[sourceIndex]);
				const peakVolume = 0.07 + intensity * 0.09;
				player.volume = peakVolume;
				player.playbackRate = 0.96 + Math.random() * 0.08;
				thunderPlayersRef.current.add(player);
				let startFadeNearEnd = () => {};
				const cleanup = () => {
					player.pause();
					player.removeEventListener("ended", cleanup);
					player.removeEventListener("timeupdate", startFadeNearEnd);
					thunderPlayersRef.current.delete(player);
					thunderCleanupRef.current.delete(player);
				};
				player.addEventListener("ended", cleanup);
				void player.play().catch(cleanup);
				let fadeStartedAt: number | null = null;
				const fade = (now: number) => {
					if (!thunderPlayersRef.current.has(player)) return;
					if (Number.isFinite(player.duration)) {
						const remaining = (player.duration - player.currentTime) / player.playbackRate;
						if (fadeStartedAt === null && remaining <= thunderFadeDuration / 1000) {
							fadeStartedAt = now;
						}
						if (fadeStartedAt !== null) {
							const progress = Math.min(1, (now - fadeStartedAt) / thunderFadeDuration);
							player.volume = peakVolume * (1 - progress);
						}
					}
					requestAnimationFrame(fade);
				};
				startFadeNearEnd = () => {
					if (fadeStartedAt !== null || !Number.isFinite(player.duration)) return;
					const remaining = (player.duration - player.currentTime) / player.playbackRate;
					if (remaining <= thunderFadeDuration / 1000) {
						fadeStartedAt = performance.now();
						player.removeEventListener("timeupdate", startFadeNearEnd);
						requestAnimationFrame(fade);
					}
				};
				thunderCleanupRef.current.set(player, cleanup);
				player.addEventListener("timeupdate", startFadeNearEnd);
				startFadeNearEnd();
			}, 280 + Math.random() * 620);
			thunderTimersRef.current.add(timer);
		};
		let wasRaining = isRaining();
		const observer = new MutationObserver(() => {
			const raining = isRaining();
			if (raining === wasRaining) return;
			wasRaining = raining;
			void syncRain();
		});
		observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
		window.addEventListener("weather:lightning", onLightning);
		window.addEventListener("weather:intensity", onIntensity);
		void syncRain();

		return () => {
			observer.disconnect();
			window.removeEventListener("weather:lightning", onLightning);
			window.removeEventListener("weather:intensity", onIntensity);
		};
	}, [enabled]);

	const toggle = () => {
		const next = !enabled;
		enabledRef.current = next;
		setEnabled(next);
		if (!next) {
			thunderTimersRef.current.forEach((timer) => window.clearTimeout(timer));
			thunderTimersRef.current.clear();
			fadeRain(0, 900, true);
			thunderCleanupRef.current.forEach((cleanup) => cleanup());
		}
	};

	return (
		<motion.button
			className="audio-toggle"
			type="button"
			aria-label="Toggle storm sounds"
			aria-pressed={enabled}
			onClick={toggle}
			whileTap={{ scale: 0.97 }}
			transformTemplate={(transform) => `${transform} translateZ(0)`}
			transition={{ type: "spring", stiffness: 420, damping: 46, mass: 0.8 }}
		>
			{enabled ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
			<span>{enabled ? "Sound on" : "Sound off"}</span>
		</motion.button>
	);
}
