import { $$, onReady } from '../js/libs/utils.js';

onReady(async () => {
  const { hash } = location;
  const projectName = hash.slice(1);

  if (projectName) {
    const ifm = $$('iframe');
    const title = $$('head title');
    const headerH2 = $$('header h2');

    const formattedName = projectName
      .replace(/[_-]/g, (...args) => {
        return ' ';
      })
      .replace(/\//g, '')
      .replace(/^([a-z])[a-zA-Z]*?|( [a-z])/g, (...args) => {
        const [_, m1, m2] = args;
        if (m1) return m1.toUpperCase();
        if (m2) return m2.toUpperCase();
      });

    ifm.src = `../projects/projects/${projectName}`;

    title.innerHTML = title.innerHTML.replace('Project', formattedName);
    headerH2.innerHTML = formattedName;
  }
});