import { motion } from 'motion/react';
import type { ComponentProps } from 'react';
import {
  type MotionPreset,
  type MotionPresetName,
  motionPresets,
} from './presets';

const tags = {
  div: motion.div,
  a: motion.a,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  section: motion.section,
  button: motion.button,
  img: motion.img,
} as const;

export type AnimatedTag = keyof typeof tags;

export type AnimatedProps<T extends AnimatedTag = 'div'> = {
  as?: T;
  preset?: MotionPresetName;
  delay?: number;
} & Omit<ComponentProps<(typeof tags)[T]>, 'as'>;

export function Animated<T extends AnimatedTag = 'div'>(
  props: AnimatedProps<T>,
) {
  const { as, preset = 'fadeUp', delay = 0, ...rest } = props;
  const active: MotionPreset = motionPresets[preset ?? 'fadeUp'];

  // Concrete tag internally: the generic T is only resolved at the call
  // site, so TS can't verify props against tags[T] here.
  const Tag = tags[as ?? 'div'] as typeof motion.div;

  return (
    <Tag
      initial={active.initial}
      whileInView={active.whileInView}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ ...active.transition, delay }}
      {...(rest as unknown as ComponentProps<typeof motion.div>)}
    />
  );
}
