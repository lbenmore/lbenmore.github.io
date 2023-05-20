import { $$, onReady, preload } from './libs/utils.js';

onReady(async () => {
  preload([
    '/assets/alien-attack.jpeg',
    '/assets/core.jpeg',
    '/assets/library.jpeg',
    '/assets/scroll.jpeg',
    '/assets/steve.jpeg',
    '/assets/whack-a-mouse.jpeg',
    '/assets/winter-wonderblocks.jpeg',
  ], async () => {
    const container = document.createElement('div');
    const threshold = [ 0.75 ];
    
    const projects = await fetch('./js/data/projects.json')
      .then(res => res.json())
      .catch(err => console.error(err.message));
      
    const onVisible = (entries) => {
      entries.forEach(entry => {
        const { 
          target: card,
          isIntersecting: visible
        } = entry;
        
        card.querySelectorAll('.fade-in, .fade-out').forEach(el => {
          if (visible) {
            el.classList.replace('fade-in', 'fade-out');
          } else {
            el.classList.replace('fade-out', 'fade-in');
          }
        });
      });
    };
    
    projects.forEach(project => {
      const card = document.createElement('div');
      const io = new IntersectionObserver(onVisible, { threshold });
      
      card.innerHTML = `
        <div class="card">
          <div class="card__background"></div>
          <h3 class="card__title fade-in">${project.title}</h3>
          <div class="card__tags fade-in">
            ${project.tags.map(tag => `
              <span class="card__tag card__tag--${tag.color}">
                ${tag.label}
              </span>
            `).join('')}
          </div>
          <div class="card__description fade-in">${project.description}</div>
          <div class="card__links fade-in">
            ${project.links.map(link => `
              <a 
                class="card__link" 
                href="${link.href}" 
                target="_blank"
                ${link.attributes && Object.keys(link.attributes).map(attr => `${attr}=${link.attributes[attr]}`) || ''}
              >
                ${link.label}
              </a>
            `).join('')}
          </div>
        </div>
      `;
      
      card.style.setProperty('--card-bkg', `url("${project.image}")`);
      
      container.appendChild(card);
      
      io.observe(card);
    });
    
    $$('main').innerHTML = '';
    $$('main').appendChild(container);
  });
});