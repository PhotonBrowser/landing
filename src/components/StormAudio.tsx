import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const thunderSources = [
	"/audio/rain-thunder-storm.mp3",
	"/audio/thunder-distant.mp3",
	"/audio/thunder-big-rumble.mp3",
];

export default function StormAudio() {
	const rainRef = useRef<HTMLAudioElement>(null);
	const fadeFrameRef = useRef(0);
	const thunderTimersRef = useRef(new Set<number>());
	const thunderPlayersRef = useRef(new Set<HTMLAudioElement>());
	const [enabled, setEnabled] = useState(false);

	const fadeRain = (target: number, duration = 2_500, pauseWhenDone = false) => {
		const rain = rainRef.current;
		if (!rain) return;
		cancelAnimationFrame(fadeFrameRef.current);
		const startVolume = rain.volume;
		const started = performance.now();
		const tick = (now: number) => {
			const progress = Math.min(1, (now - started) / duration);
			rain.volume = startVolume + (target - startVolume) * (progress * progress * (3 - progress * 2));
			if (progress < 1) fadeFrameRef.current = requestAnimationFrame(tick);
			else if (pauseWhenDone) rain.pause();
		};
		fadeFrameRef.current = requestAnimationFrame(tick);
	};

	useEffect(() => {
		const rain = rainRef.current;
		if (!rain) return;

		const syncRain = () => {
			if (!enabled) return;
			if (!document.body.classList.contains("storm-mode")) {
				fadeRain(0, 2_500, true);
				return;
			}
			void rain.play().catch(() => setEnabled(false));
			fadeRain(0.14);
		};
		const onIntensity = (event: Event) => {
			if (!enabled || !document.body.classList.contains("storm-mode")) return;
			const intensity = (event as CustomEvent<{ intensity: number }>).detail.intensity;
			fadeRain(0.025 + intensity * 0.12, 500);
		};
		const onLightning = (event: Event) => {
			if (!enabled || !document.body.classList.contains("storm-mode")) return;
			const intensity = (event as CustomEvent<{ intensity: number }>).detail.intensity;
			const timer = window.setTimeout(() => {
				thunderTimersRef.current.delete(timer);
				const source = thunderSources[Math.floor(Math.random() * thunderSources.length)];
				const player = new Audio(source);
				const peakVolume = 0.07 + intensity * 0.09;
				player.volume = peakVolume;
				player.playbackRate = 0.96 + Math.random() * 0.08;
				thunderPlayersRef.current.add(player);
				void player.play();
				const started = performance.now();
				const fade = (now: number) => {
					const progress = Math.min(1, (now - started) / 5_500);
					player.volume = peakVolume * (1 - progress);
					if (progress < 1) requestAnimationFrame(fade);
					else {
						player.pause();
						thunderPlayersRef.current.delete(player);
					}
				};
				requestAnimationFrame(fade);
			}, 550 + Math.random() * 450);
			thunderTimersRef.current.add(timer);
		};
		const observer = new MutationObserver(syncRain);
		observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
		window.addEventListener("weather:lightning", onLightning);
		window.addEventListener("weather:intensity", onIntensity);
		syncRain();

		return () => {
			observer.disconnect();
			window.removeEventListener("weather:lightning", onLightning);
			window.removeEventListener("weather:intensity", onIntensity);
		};
	}, [enabled]);

	const toggle = () => {
		const rain = rainRef.current;
		const next = !enabled;
		setEnabled(next);
		if (!next) {
			thunderTimersRef.current.forEach((timer) => window.clearTimeout(timer));
			thunderTimersRef.current.clear();
			fadeRain(0, 900, true);
			thunderPlayersRef.current.forEach((player) => player.pause());
			thunderPlayersRef.current.clear();
			return;
		}
		if (rain) {
			rain.volume = 0;
			if (document.body.classList.contains("storm-mode")) {
				void rain.play().catch(() => setEnabled(false));
				fadeRain(0.14);
			}
		}
	};

	return (
		<>
			<audio className="storm-audio-source" ref={rainRef} src="/audio/light-rain-loop.wav" loop preload="none" />
			<button className="audio-toggle" type="button" aria-label="Toggle storm sounds" aria-pressed={enabled} onClick={toggle}>
				{enabled ? <Volume2 size={15} aria-hidden="true" /> : <VolumeX size={15} aria-hidden="true" />}
				<span>{enabled ? "Sound on" : "Sound off"}</span>
			</button>
		</>
	);
}
