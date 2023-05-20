export const $$ = (selector, forceArray, context) => {
  const ctx = context || document;
  const el = selector instanceof HTMLElement
    ? selector
    : forceArray || ctx.querySelectorAll(selector).length > 1
      ? [...ctx.querySelectorAll(selector)].map(x => x)
      : ctx.querySelector(selector);

  const evalTouchPoints = (el, evtName, startEvt, endEvt, callback) => {
    const isTouchDevice = !!('TouchEvent' in window);
    const points = { start: {}, end: {} };
    let isValid = false;

    points.start.x = isTouchDevice
      ? startEvt.changedTouches[0].clientX
      : startEvt.clientX;

    points.start.y = isTouchDevice
      ? startEvt.changedTouches[0].clientY
      : startEvt.clientY;

    points.end.x = isTouchDevice
      ? endEvt.changedTouches[0].clientX
      : endEvt.clientX;

    points.end.y = isTouchDevice
      ? endEvt.changedTouches[0].clientY
      : endEvt.clientY;

    switch (evtName) {
      case 'swipeleft':
        isValid = (
          points.start.x - points.end.x > 100 &&
          Math.abs(points.start.y - points.end.y) < 20
        );
        break;
        
      case 'swiperight':
        isValid = (
          points.end.x - points.start.x > 100 &&
          Math.abs(points.start.y - points.end.y) < 20
        );
        break;
        
      case 'swipeup':
        isValid = (
          points.start.y - points.end.y > 100 &&
          Math.abs(points.start.x - points.end.x) < 20
        );
        break;
        
      case 'swipedown':
        isValid = (
          points.end.y - points.start.y > 100 &&
          Math.abs(points.start.x - points.end.x) < 20
        );
        break;
    }

    if (isValid) {
      const consolidatedEvt = {};
      for (const key in endEvt) consolidatedEvt[key] = endEvt[key];
      consolidatedEvt.type = evtName;
      consolidatedEvt.startEvent = startEvt;

      callback(consolidatedEvt);
    }
  };

  const initTouchPoints = (el, evtName, callback) => {
    const isTouchDevice = !!('TouchEvent' in window);
    const startEvtName = isTouchDevice ? 'touchstart' : 'mousedown';
    const endEvtName = isTouchDevice ? 'touchend' : 'mouseup';

    $$(el).on(startEvtName, (startEvt) => {
      $$(el).on(endEvtName, (endEvt) => {
        evalTouchPoints(el, evtName, startEvt, endEvt, callback);
      }, {once: true});
    });
  };
      
  if (el) {
    el.css = (property, value, delay, callback) => {
      if (el.length) {
        el.forEach(_el => $$(_el).css(property, value, delay, callback));
        return el;
      }

      let props = {}, val, del, cb;

      if (property && typeof property === 'object') {
        for (const prop in property) {
          props[prop] = property[prop];
        }
        del = typeof value === 'number' ? value : typeof delay === 'number' ? delay : 0;
        cb = typeof value === 'function' ? value : typeof delay === 'function' ? delay : typeof callback === 'function' ? callback : () => {};
      } else if (typeof property === 'string') {
        val = value;
        props[property] = val;
        cb = typeof delay === 'function' ? delay : typeof callback === 'function' ? callback : () => {};
        del = typeof delay === 'number' ? delay : 0;
      }

      setTimeout(() => {
        for (const prop in props) {
          el.style[prop] = props[prop]
        }

        cb();
      }, del);

      return el;
    };

    el.animate = (properties, duration, delay, ease, callback) => {
      if (el.length) {
        el.forEach(_el => $$(_el).animate(properties, duration, delay, ease, callback));
        return el;
      }

      let dur, del, eas, cb;
      let transition = '';

      cb = typeof duration === 'function' ? duration : typeof delay === 'function' ? delay : typeof ease === 'function' ? ease : typeof callback === 'function' ? callback : () => {};
      eas = typeof duration === 'string' ? duration : typeof delay === 'string' ? delay : typeof ease === 'string' ? ease : 'ease';
      del = typeof duration === 'number' && !delay ? duration : typeof delay === 'number' ? delay : 0;
      dur = typeof duration === 'number' ? duration : 500;

      for (const prop in properties) {
        transition += `${prop} ${dur}ms ${eas}, `;
      }
      transition = transition.slice(0, -2);

      $$(el).css('transition', transition, del, () => {
        $$(el).css(properties, cb);
      });

      return el;
    };

    el.off = (evtName, callback) => {
      if (el.length) {
        el.forEach(_el => $$(_el).off(evtName, callback));
        return el;
      }
      
      el.removeEventListener(evtName, callback);
      
      return el;
    };

    el.on = (evtName, callback, options) => {
      if (el.length) {
        el.forEach(_el => $$(_el).on(evtName, callback, options));
        return el;
      }

      switch (evtName) {
        case 'swipeleft':
        case 'swiperight':
        case 'swipeup':
        case 'swipedown':
          initTouchPoints(el, evtName, callback);
          break;

        default:
          el.addEventListener(evtName, callback, options);
      }

      return el;
    };

    el.once = (evtName, callback) => {
      if (el.length) {
        el.forEach(_el => $$(_el).once(evtName, callback));
        return el;
      }

      const cb = (evt) => {
        callback(evt);
        $$(el).off(evtName, cb);
      }
      
      $$(el).on(evtName, cb);

      return el;
    };

    el.$$ = (selector, forceArray, context) => {
      if (el.length) {
        return el.map(_el => $$(_el).$$(selector, forceArray, context));
      }

      return $$(selector, forceArray, context || el);
    }
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
