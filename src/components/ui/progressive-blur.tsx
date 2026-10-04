'use client';
import type { HTMLMotionProps } from 'motion/react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const GRADIENT_ANGLES = {
  top: 0,
  right: 90,
  bottom: 180,
  left: 270,
};

export type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES;
  blurLayers?: number;
  className?: string;
  blurIntensity?: number;
} & HTMLMotionProps<'div'>;

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 4,
  className,
  blurIntensity = 6,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.min(Math.max(blurLayers, 2), 4);
  const strength = [0.12, 0.28, 0.55, 1];
  const fadeStarts = [0, 14, 32, 52];
  const fadeEnds = [24, 42, 64, 84];

  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction];
        const layerIndex = Math.min(index, strength.length - 1);
        const gradient = `linear-gradient(${angle}deg, transparent ${fadeStarts[layerIndex]}%, black ${fadeEnds[layerIndex]}%)`;

        return (
          <motion.div
            key={fadeStarts[layerIndex]}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${blurIntensity * strength[layerIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurIntensity * strength[layerIndex]}px)`,
            }}
            {...props}
          />
        );
      })}
    </div>
  );
}
