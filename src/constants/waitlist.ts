export const WAITLIST_API_DELAY_MS = 1500;

export const WAITLIST_MORPH_SPRING = {
  type: 'spring' as const,
  stiffness: 240,
  damping: 30,
  mass: 0.8,
};

export const WAITLIST_SURFACE = {
  idle: { radius: 16, height: 44, padding: '4px', width: 384 },
  submitting: { radius: 22, height: 44, padding: '4px 16px', width: 280 },
  complete: { radius: 18, height: 112, padding: '12px 16px', width: 344 },
} as const;

export const WAITLIST_COPY = {
  ready: 'You’re on the list!',
  duplicate: 'You’re already on the waitlist!',
  submitting: 'Joining the waitlist…',
  error: 'Something went wrong. Please try again.',
  emailRequired: 'Enter your email address',
  emailInvalid: 'Use a valid email',
} as const;
