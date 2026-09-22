export const weatherConfig = {
	rain: {
		maxDrops: 2_000,
		wind: 280,
		gravity: 1_100,
		rampDuration: 1,
		spawnInterval: {
			light: 0.016,
			heavy: 0.005,
		},
		dropSpeed: {
			minimum: 900,
			depthScale: 550,
		},
		dropLength: {
			minimum: 8,
			depthScale: 34,
		},
		dropOpacity: {
			minimum: 0.06,
			depthScale: 0.38,
		},
		foregroundDepth: 0.72,
		foregroundSplashCount: 12,
		backgroundSplashCount: 4,
	},
} as const;
