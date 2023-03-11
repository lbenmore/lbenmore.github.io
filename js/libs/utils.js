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

export const preload = (assets, callback) => {
  const total = assets.length;
  let loaded = 0;
  
  const checkLoad = (loaded) => {
    if (loaded === total) callback();
  }
  
  if (typeof assets === 'string') assets = [ assets ];
  
  assets.forEach(asset => {
    fetch(asset)
      .then(() => {
        checkLoad(++loaded);
      })
      .catch((err) => {
        console.error(`error fetching asset: ${asset}`, err);
          checkLoad(++loaded);
      });
  });
};

export const onReady = (callback) => {
  document.readyState === 'complete'
    ? callback()
    : document.addEventListener('readystatechange', () => (
        document.readyState === 'complete' && callback()
      ));
};
