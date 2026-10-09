import { BorderBeam } from 'border-beam';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { type CSSProperties, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { xLink } from '../config/site';
import {
  WAITLIST_COPY,
  WAITLIST_MORPH_SPRING,
  WAITLIST_SURFACE,
} from '../constants/waitlist';
import { useWaitlist, type WaitlistState } from '../hooks/useWaitlist';

const MotionBorderBeam = motion.create(BorderBeam);

function SurfaceContent({
  state,
  shouldReduceMotion,
  hasEntered,
  onSubmit,
  validationError,
  onEmailChange,
}: {
  state: WaitlistState;
  shouldReduceMotion: boolean | null;
  hasEntered: boolean;
  onSubmit: ReturnType<typeof useWaitlist>['submit'];
  validationError: string | null;
  onEmailChange: () => void;
}) {
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 0.16,
        ease: 'easeOut' as const,
        delay: hasEntered ? 0 : 0.4,
      };
  const textTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: 'easeOut' as const };
  const textRevealDelay = shouldReduceMotion ? 0 : hasEntered ? 0.12 : 0.5;
  const isComplete = state === 'success';

  return (
    <AnimatePresence mode="wait">
      {state === 'submitting' ? (
        <motion.div
          key="submitting"
          initial={
            shouldReduceMotion ? false : { opacity: 0, filter: 'blur(5px)' }
          }
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          className="flex h-9 w-full items-center justify-center gap-2 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          <Spinner
            className="size-5 motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">{WAITLIST_COPY.submitting}</span>
        </motion.div>
      ) : isComplete ? (
        <motion.div
          key="complete"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="relative flex w-full min-w-0 flex-col items-center gap-1 overflow-hidden text-center"
          role="status"
          aria-live="polite"
        >
          <motion.h2
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 3, filter: 'blur(4px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ ...textTransition, delay: textRevealDelay }}
            className="max-w-full whitespace-nowrap font-heading text-lg font-medium tracking-tight"
          >
            {WAITLIST_COPY.ready}
          </motion.h2>
          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 3, filter: 'blur(4px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ ...textTransition, delay: textRevealDelay + 0.04 }}
            className="max-w-full whitespace-nowrap text-sm text-on-overlay/85 sm:text-base"
          >
            We’ll let you know when Photon is ready.
          </motion.p>
          <motion.a
            href={xLink.href}
            target="_blank"
            rel="noreferrer"
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 3, filter: 'blur(4px)' }
            }
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ ...textTransition, delay: textRevealDelay + 0.08 }}
            className="max-w-full whitespace-nowrap text-sm text-on-overlay/85 underline decoration-on-overlay/50 underline-offset-4 transition-colors hover:decoration-on-overlay sm:text-base"
          >
            Follow @PhotonBrowser on X →
          </motion.a>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          aria-label="Join the Photon waitlist"
          onSubmit={onSubmit}
          noValidate
          initial={
            shouldReduceMotion ? false : { opacity: 0, filter: 'blur(5px)' }
          }
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(4px)' }}
          transition={transition}
          className="flex w-full items-center gap-1"
        >
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <div className="relative min-w-0 flex-1">
            <Input
              id="waitlist-email"
              name="email"
              type="email"
              required
              autoComplete="off"
              data-protonpass-ignore="true"
              data-1p-ignore="true"
              data-lpignore="true"
              data-bwignore="true"
              placeholder="Enter your email"
              aria-invalid={Boolean(validationError)}
              aria-describedby={
                validationError ? 'waitlist-email-error' : undefined
              }
              onChange={onEmailChange}
              className="h-9 min-w-0 w-full !rounded-[calc(var(--surface-radius)-4px)] border-transparent bg-transparent px-4 py-2 text-xs text-on-overlay shadow-none placeholder:text-on-overlay-muted focus-visible:border-transparent focus-visible:ring-0 aria-invalid:border-transparent aria-invalid:ring-0"
            />
            {validationError && (
              <span
                id="waitlist-email-error"
                role="alert"
                className="t-built-by-tooltip t-validation-tooltip"
              >
                {validationError}
              </span>
            )}
          </div>
          <Button
            type="submit"
            className="h-9 !rounded-[10px] bg-paper px-4 py-2 text-xs text-foreground shadow-sm transition-colors duration-500 hover:bg-white/90"
          >
            Join waitlist
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export function WaitlistSurface() {
  const shouldReduceMotion = useReducedMotion();
  const [hasEntered, setHasEntered] = useState(false);
  const { state, submit, validationError, clearValidationError } =
    useWaitlist();
  const dimensions =
    state === 'submitting'
      ? WAITLIST_SURFACE.submitting
      : state === 'success'
        ? WAITLIST_SURFACE.complete
        : WAITLIST_SURFACE.idle;

  return (
    <>
      <MotionBorderBeam
        size="md"
        colorVariant="colorful"
        strength={state === 'success' ? 0 : 1}
        active={state !== 'success' && shouldReduceMotion !== true}
        theme="dark"
        initial={
          shouldReduceMotion
            ? false
            : {
                borderRadius: `${dimensions.radius}px`,
                height: `${dimensions.height}px`,
                padding: dimensions.padding,
                width: `min(${dimensions.width}px, 100%)`,
                opacity: 0,
                y: 16,
              }
        }
        animate={{
          borderRadius: `${dimensions.radius}px`,
          height: `${dimensions.height}px`,
          padding: dimensions.padding,
          width: `min(${dimensions.width}px, 100%)`,
          opacity: 1,
          y: 0,
        }}
        style={
          {
            '--surface-radius': `${dimensions.radius}px`,
            backdropFilter: 'blur(5px) saturate(150%)',
            WebkitBackdropFilter: 'blur(5px) saturate(150%)',
          } as CSSProperties
        }
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                ...WAITLIST_MORPH_SPRING,
                delay: hasEntered ? 0 : 0.4,
                opacity: {
                  duration: 0.32,
                  ease: 'easeOut',
                  delay: hasEntered ? 0 : 0.4,
                },
              }
        }
        onAnimationComplete={() => setHasEntered(true)}
        className={`waitlist-surface mx-auto mt-4 flex w-fit max-w-full items-center bg-overlay text-on-overlay ${
          validationError ? '!overflow-visible' : 'overflow-hidden'
        }`}
      >
        <SurfaceContent
          state={state}
          shouldReduceMotion={shouldReduceMotion}
          hasEntered={hasEntered}
          onSubmit={submit}
          validationError={validationError}
          onEmailChange={clearValidationError}
        />
      </MotionBorderBeam>
      {state === 'error' && (
        <p className="text-xs text-on-overlay" role="alert">
          {WAITLIST_COPY.error}
        </p>
      )}
    </>
  );
}
