import type { TargetAndTransition, Transition } from 'motion/react';

export interface MotionPreset {
  initial: TargetAndTransition;
  whileInView: TargetAndTransition;
  transition: Transition;
}

export const motionPresets = {
  springy: {
    initial: { opacity: 0, scale: 0.9, y: 12 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
  morphing: {
    initial: { opacity: 0, scale: 0.75, borderRadius: '50%', rotate: -4 },
    whileInView: { opacity: 1, scale: 1, borderRadius: '16px', rotate: 0 },
    transition: { type: 'spring', stiffness: 200, damping: 24 },
  },
  blurUp: {
    initial: { opacity: 0, y: 24, filter: 'blur(8px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.48, ease: 'easeOut' },
  },
  fadeUp: {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  fade: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.36, ease: 'easeOut' },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.92 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
} satisfies Record<string, MotionPreset>;

export type MotionPresetName = keyof typeof motionPresets;
