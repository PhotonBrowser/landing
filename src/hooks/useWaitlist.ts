import { type FormEvent, useState } from 'react';
import { WAITLIST_API_DELAY_MS, WAITLIST_COPY } from '../constants/waitlist';
import { supabase } from '../utils/supabase';

export type WaitlistState =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'duplicate'
  | 'error';

export function useWaitlist() {
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
      await new Promise((resolve) =>
        setTimeout(resolve, WAITLIST_API_DELAY_MS),
      );
      const { error } = await supabase
        .from('waitlist')
        .insert({ email: emailField.value.trim().toLowerCase() });

      if (error?.code === '23505') {
        setState('duplicate');
        return;
      }

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
