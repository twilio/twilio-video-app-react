export const browserName = (() => {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return null;
  }
  if (/Chrome|CriOS/.test(navigator.userAgent)) {
    return 'chrome';
  }
  if (/Firefox|FxiOS/.test(navigator.userAgent)) {
    return 'firefox';
  }
  if (/Safari/.test(navigator.userAgent)) {
    return 'safari';
  }
  return null;
})();

export const isMobile = (() => {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();
