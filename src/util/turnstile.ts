export type Turnstile = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      language: string;
      size: string;
      theme: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
      'timeout-callback': () => void;
    },
  ) => string;
  reset: (widget: string) => void;
  remove: (widget: string) => void;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let scriptPromise: Promise<Turnstile> | null = null;

export const loadTurnstile = (): Promise<Turnstile> => {
  if (scriptPromise) return scriptPromise;
  if (window.turnstile && typeof window.turnstile.render === 'function') {
    return Promise.resolve(window.turnstile);
  }
  scriptPromise = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    let settled = false;
    const fail = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      script.remove();
      scriptPromise = null;
      reject(new Error('Turnstile could not load'));
    };
    const timer = window.setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      if (settled) return;
      const api = window.turnstile;
      if (!api || typeof api.render !== 'function') {
        fail();
        return;
      }
      // Async scripts are already loaded here. Calling ready() on them can throw.
      settled = true;
      window.clearTimeout(timer);
      script.onload = null;
      script.onerror = null;
      resolve(api);
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
};
