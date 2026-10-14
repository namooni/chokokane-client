export const getTodayJST = (): string =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date());

export const openNativePicker = (input: HTMLInputElement) => {
  if (input.disabled) return;
  try {
    if (typeof input.showPicker === 'function') input.showPicker();
    else input.focus();
  } catch {
    input.focus();
  }
};
