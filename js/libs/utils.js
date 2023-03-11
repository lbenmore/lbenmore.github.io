export const $$ = (selector, forceArray, context) => {
  const el = selector instanceof HTMLElement
    ? document.querySelector(selector)
    : forceArray || document.querySelectorAll(selector).length > 1
      ? document.querySelectorAll(selector).map(x => x)
      : document.querySelector(selector);
      
  if (el) {
    
  }
  
  return el;
};

export const onReady = (callback) => {
  document.readyState === 'complete'
    ? callback()
    : document.addEventListener('readystatechange', () => (
        document.readyState === 'complete' && callback()
      ));
};
