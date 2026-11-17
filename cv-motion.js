/* Interactive, content-driven axonometric resume illustration.
   Inspired by the dimensional-drawing workflow; all geometry here is original.
   The print-ready resume remains the source of truth for all displayed text. */
(() => {
  'use strict';

  const paper = document.getElementById('flat-cv');
  const drawing = document.getElementById('cv-drawing');
  const stack = document.getElementById('drawing-stack');
  const legend = document.getElementById('drawing-legend-list');
  const control = document.getElementById('explode-cv');
  const state = document.getElementById('drawing-state');
  if (!paper || !drawing || !stack || !legend || !control) return;

  const sections = [...paper.querySelectorAll('.cv-section')];
  const projects = [...sections[3].querySelectorAll('.cv-project')];
  const practices = [...sections[4].querySelectorAll('.cv-practice-item')];
  const layers = [
    { label: 'IDENTITY', description: 'Name, focus, and links', source: paper.querySelector('.cv-heading') },
    { label: 'PROFILE', description: 'Professional summary', source: sections[0] },
    { label: 'EDUCATION', description: 'University and current study', source: sections[1] },
    { label: 'SKILLS', description: 'Technologies and foundations', source: sections[2] },
    { label: 'PROJECT / 01', description: 'Vietnamguesser', source: projects[0] },
    { label: 'PROJECT / 02', description: 'Columbina & Aether', source: projects[1] },
    { label: 'PRACTICE / 01', description: 'Java development', source: practices[0] },
    { label: 'PRACTICE / 02', description: 'Algorithms & data structures', source: practices[1] }
  ];

  function cleanClone(element) {
    const clone = element.cloneNode(true);
    for (const node of [clone, ...clone.querySelectorAll('*')]) {
      node.classList?.remove('dim-line');
      node.removeAttribute('tabindex');
      node.removeAttribute('data-dim-layer');
      node.removeAttribute('data-dimension-section');
      node.style?.removeProperty('--layer-index');
      node.style?.removeProperty('--section-index');
    }
    return clone;
  }

  const layerNodes = [];
  layers.forEach(({label, description, source}, i) => {
    if (!source) return;
    const layer = document.createElement('section');
    layer.className = 'drawing-layer';
    layer.style.setProperty('--depth', String(i));
    layer.style.setProperty('--delay', `${Math.min(i * 125, 875)}ms`);
    layer.setAttribute('aria-label', `Layer ${i}: ${description}`);
    layer.tabIndex = 0;
    layer.innerHTML = `<div class="drawing-layer-label"><span class="layer-index">L${String(i).padStart(2,'0')}</span><span>${label}</span><small>SECTION / ${String(i + 1).padStart(2,'0')}</small></div><div class="drawing-layer-body"></div><span aria-hidden="true" class="drawing-layer-crosshair">+</span>`;
    const body = layer.querySelector('.drawing-layer-body');
    if (i === 4 || i === 5) {
      const title = document.createElement('h2');
      title.className = 'drawing-group-name';
      title.textContent = 'SELECTED PROJECTS';
      body.append(title);
    } else if (i === 6 || i === 7) {
      const title = document.createElement('h2');
      title.className = 'drawing-group-name';
      title.textContent = 'ADDITIONAL TECHNICAL PRACTICE';
      body.append(title);
    }
    body.append(cleanClone(source));
    stack.append(layer);
    layerNodes.push(layer);

    const listItem = document.createElement('li');
    listItem.innerHTML = `<span>L${String(i).padStart(2,'0')}</span><strong>${description}</strong>`;
    legend.append(listItem);
  });

  let exploded = true;
  let selected = -1;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setSelected(next) {
    selected = next;
    layerNodes.forEach((layer, i) => layer.classList.toggle('is-inspected', i === selected));
    if (state) state.textContent = selected < 0 ? 'EXPLODED' : `LAYER L${String(selected).padStart(2,'0')}`;
  }
  layerNodes.forEach((layer, i) => {
    layer.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      setSelected(selected === i ? -1 : i);
    });
    layer.addEventListener('keydown', event => {
      if (event.target !== layer) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setSelected(selected === i ? -1 : i);
      } else if (event.key === 'Escape') setSelected(-1);
    });
  });

  function setMode(next, {animate = false} = {}) {
    exploded = Boolean(next);
    paper.hidden = exploded;
    drawing.hidden = !exploded;
    paper.setAttribute('aria-hidden', String(exploded));
    drawing.setAttribute('aria-hidden', String(!exploded));
    control.setAttribute('aria-pressed', String(exploded));
    control.textContent = exploded ? 'Flat view ↓' : 'Exploded view ↗';
    control.setAttribute('aria-label', exploded ? 'Switch to flat view' : 'Switch to exploded view');
    if (exploded && animate && !prefersReducedMotion.matches) {
      drawing.classList.remove('is-animating');
      void drawing.offsetWidth; // restart the frame-by-frame lifting sequence
      drawing.classList.add('is-animating');
      if (state) state.textContent = 'ASSEMBLING';
      window.setTimeout(() => {
        drawing.classList.remove('is-animating');
        setSelected(selected);
      }, 2200);
    } else {
      drawing.classList.remove('is-animating');
      setSelected(selected);
    }
  }

  control.addEventListener('click', () => setMode(!exploded, {animate: true}));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && selected >= 0) setSelected(-1);
  });

  // Actual resume text remains a single source in #flat-cv. Printing is always flat.
  window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
    drawing.hidden = true;
    paper.hidden = false;
  });
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
    setMode(exploded);
  });

  setMode(true, {animate: true});
})();
