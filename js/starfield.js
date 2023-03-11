class Star {
  constructor (target, starData, i) {
    this.target = target;
    this.starData = starData;
    this.index = i;
    this.element = document.createElement('div');
    
    this.init();
  }
  
  init () {
    this.stylize();
    this.addToDom();
  }
  
  stylize () {
    Object.assign(this.element.style, {
      position: 'absolute',
      top: `${Math.random() * this.starData.containerSize.height}px`,
      left: `${Math.random() * this.starData.containerSize.width}px`,
      width: '1px',
      height: '1px',
      backgroundColor: `${this.starData.color}`
    });
  }
  
  addToDom () {
    this.target.appendChild(this.element);
  }
  
  destroy () {
    this.target.removeChild(this.element);
  }
}

class StarPane {
  constructor (target, starData, i) {
    this.target = target;
    this.starData = starData;
    this.index = i;
    
    this.id = Math.random().toString(16).slice(2);
    this.element = document.createElement('div');
    this.zoom = document.createElement('style');
    this.stars = [];
    
    this.init();
  }
  
  init () {
    this.populate();
    this.stylize();
    this.addToDom();
  }
  
  populate () {
    for (let i = 0; i < this.starData.density; i++) {
      this.stars.push(new Star(this.element, this.starData, i));
    }
  }
  
  stylize () {
    const { speed, numPanes } = this.starData;
    const delay = speed / numPanes * -1 * this.index;
    
    this.zoom.innerHTML = `
      @keyframes zoom_${this.id} {
        from {
          transform: translateZ(-200vw)
        }
        
        to {
          transform: translateZ(100vw);
        }
      }
    `;
    
    document.head.appendChild(this.zoom);
    
    Object.assign(this.element.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      animationDelay: `${delay}ms`,
      animationDuration: `${this.starData.speed}ms`,
      animationIterationCount: 'infinite',
      animationName: `zoom_${this.id}`,
      animationTimingFunction: 'linear'
    });
  }
  
  addToDom () {
    this.target.appendChild(this.element);
  }
  
  destroy () {
    this.stars.forEach(star => star.destroy());
    this.target.removeChild(this.element);
    document.head.removeChild(this.zoom);
  }
}

export default class Starfield {
  constructor (options) {
    this.target = options.target || document.body;
    
    this.starData = options.starData || {};
    this.starData.color = this.starData.color || '#fff';
    this.starData.speed = this.starData.speed || 1000 * 10;
    this.starData.numPanes = this.starData.numPanes || 10;
    
    this.elements = {};
    this.resizeDebounce = null;
    this.timeouts = [];
    
    this.init();
  }
  
  init () {
    this.setContainerSize();
    this.setStarDensity();
    this.populate();
    this.stylize();
    this.addToDom();
    this.attachListeners();
  }
  
  setContainerSize () {
    const { width, height } = this.target.getBoundingClientRect();
    return (this.starData.containerSize = { width, height });
  }
  
  setStarDensity () {
    const { width, height } = this.starData.containerSize;
    const area = width * height;
    const density = area / 10000;
    return (this.starData.density = density);
  }
  
  populate () {
    this.elements.container = document.createElement('div');
    this.elements.panes = [];
    
    for (let i = 0; i < this.starData.numPanes; i++) {
      this.elements.panes.push(
        new StarPane(this.elements.container, this.starData, i)
      );
    }
    
    this.elements.stars = this.elements.panes.reduce((total, current) => (total.push(...current.stars), total), []);
  }
  
  stylize () {
    if (getComputedStyle(this.target).position === 'static') {
      Object.assign(this.target.style, {
        position: 'relative',
      });
    }
    
    Object.assign(this.elements.container.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      transformStyle: 'preserve-3d',
      perspective: '100vw'
    });
  }
  
  addToDom () {
    this.target.appendChild(this.elements.container);
  }
  
  attachListeners () {
    this.onResize = this.onResize.bind(this);
    
    addEventListener('resize', this.onResize);
  }
  
  detachListeners () {
    removeEventListener('resize', this.onResize);
  }
  
  onResize () {
    clearTimeout(this.resizeDebounce);
    
    this.resizeDebounce = setTimeout(() => {
      this.destroy();
      this.init();
    }, 500);
    
    this.timeouts.push(this.resizeDebounce);
  }
  
  destroy () {
    this.detachListeners();
    this.elements.panes.forEach(pane => pane.destroy());
    this.target.removeChild(this.elements.container);
    this.timeouts.forEach(to => clearTimeout(to));
  }
}