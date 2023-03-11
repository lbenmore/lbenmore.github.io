import { $$, onReady } from './libs/utils.js';
import Starfield from './starfield.js';

((win, doc) => {
  
  const initFns = () => {
    new Starfield({
      target: $$('main'),
      starData: {
        color: 'var(--txt-primary)'
      }
    });
  };
  
  onReady(initFns);
})(window, window.document);