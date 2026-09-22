import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type State = "idle" | "input" | "loading" | "joined";

export default function WaitlistButton() {
	const [state, setState] = useState<State>("idle");
	const inputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (state === "input") inputRef.current?.focus();
	}, [state]);

	useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!inputRef.current?.checkValidity()) {
			inputRef.current?.reportValidity();
			return;
		}
		setState("loading");
		timerRef.current = setTimeout(() => setState("joined"), 2000);
	}

	return (
		<motion.form
			className={`waitlist-control ${state === "input" ? "waitlist-form" : state === "loading" ? "waitlist-loading" : state === "joined" ? "waitlist-success" : ""}`}
			onSubmit={submit}
			initial={{ width: "11rem" }}
			animate={{ width: state === "input" ? "16rem" : state === "loading" ? "2.5rem" : state === "joined" ? "9.25rem" : "11rem" }}
			transition={{ type: "spring", stiffness: 420, damping: 46, mass: 0.8 }}
		>
			<AnimatePresence initial={false} mode="sync">
				{state === "idle" && (
					<motion.button
						key="idle"
						className="button waitlist-view"
						type="button"
						onClick={() => setState("input")}
						initial={{ opacity: 0, filter: "blur(2px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, filter: "blur(2px)" }}
						transition={{ duration: 0.14 }}
					>
						<ArrowRight size={15} aria-hidden="true" /> Join the Waitlist
					</motion.button>
				)}

				{state === "input" && (
					<motion.div
						key="input"
						className="waitlist-view"
						initial={{ opacity: 0, filter: "blur(2px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, filter: "blur(2px)" }}
						transition={{ duration: 0.14 }}
					>
						<input ref={inputRef} name="email" type="email" placeholder="Your email" autoComplete="email" required />
						<button className="waitlist-submit" type="submit" aria-label="Join waitlist">
							<Check size={16} aria-hidden="true" />
						</button>
					</motion.div>
				)}

				{state === "loading" && (
					<motion.div
						key="loading"
						className="waitlist-view waitlist-loader"
						initial={{ opacity: 0, filter: "blur(2px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, filter: "blur(2px)" }}
						transition={{ duration: 0.14, delay: 0.2 }}
					>
						<svg className="loader-container" viewBox="0 0 40 40" height="40" width="40" aria-label="Joining waitlist">
							<circle className="loader-track" cx="20" cy="20" r="17.5" pathLength="100" strokeWidth="5" fill="none" />
							<circle className="loader-car" cx="20" cy="20" r="17.5" pathLength="100" strokeWidth="5" fill="none" />
						</svg>
					</motion.div>
				)}

				{state === "joined" && (
					<motion.div
						key="joined"
						className="waitlist-view"
						aria-live="polite"
						initial={{ opacity: 0, filter: "blur(2px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						transition={{ type: "spring", stiffness: 500, damping: 28 }}
					>
						<Check size={17} strokeWidth={2.5} aria-hidden="true" /> On the waitlist
					</motion.div>
				)}
			</AnimatePresence>
		</motion.form>
	);
}
