const div = document.createElement('div');
const link = document.createElement('link');

const { pageName } = document.currentScript.dataset;

link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', '/header/header.css');

div.innerHTML = `
  <header>
  <input type="checkbox" id="menuToggle" hidden>
  <label class="curtain" for="menuToggle"></label>
  <div>
    <h1>
      Lisa
      Benmore
    </h1>
    <h2>
      ${pageName}
    </h2>
  </div>

  <nav>
    <label for="menuToggle"></label>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/projects">Projects</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    <ul>
  </nav>
  </header>
`;

document.head.appendChild(link);
document.currentScript.parentNode.replaceChild(div, document.currentScript);