import { $$, onReady } from './libs/utils.js';

((win, doc) => {
  const on = 'addEventListener';
  
  const initFns = () => {
    console.log($$('main').textContent);
  };
  
  onReady(initFns);
})(window, window.document);