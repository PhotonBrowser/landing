import { useWaitlist as useClerkWaitlist } from '@clerk/react';
import { type FormEvent, useState } from 'react';
import { WAITLIST_COPY } from '../constants/waitlist';

export type WaitlistState = 'idle' | 'submitting' | 'success' | 'error';

export function useWaitlist() {
  const { waitlist } = useClerkWaitlist();
  const [state, setState] = useState<WaitlistState>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const emailField = form.elements.namedItem('email');

    if (
      !(emailField instanceof HTMLInputElement) ||
      !emailField.validity.valid
    ) {
      setValidationError(
        emailField instanceof HTMLInputElement &&
          emailField.validity.valueMissing
          ? WAITLIST_COPY.emailRequired
          : WAITLIST_COPY.emailInvalid,
      );
      if (emailField instanceof HTMLInputElement) {
        emailField.focus();
      }
      return;
    }

    setValidationError(null);
    setState('submitting');

    try {
      const { error } = await waitlist.join({
        emailAddress: emailField.value.trim().toLowerCase(),
      });

      if (error) throw error;

      form.reset();
      setState('success');
    } catch {
      setState('error');
    }
  }

  function clearValidationError() {
    if (validationError) setValidationError(null);
  }

  return { state, submit, validationError, clearValidationError };
}
