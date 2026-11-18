// Interaction effects for buttons and links. Adds visual feedback on click events, including a punch animation and particle effects.

(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  const fxLayer = document.createElement('div');
  fxLayer.className = 'fx-particle-stage';
  fxLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(fxLayer);

  const trigger = (target, x, y) => {
    if (!target || target.closest('#page-loader')) return;
    target.classList.remove('fx-punch');
    void target.offsetWidth;
    target.classList.add('fx-punch');
    window.setTimeout(() => target.classList.remove('fx-punch'), 510);
    const ring = document.createElement('i');
    ring.className = 'fx-ring';
    ring.style.setProperty('--fx-x', `${x}px`);
    ring.style.setProperty('--fx-y', `${y}px`);
    fxLayer.append(ring);
    ring.addEventListener('animationend', () => ring.remove(), {once:true});
    for (let j=0; j<11; j++) {
      const angle = j * Math.PI * 2/11 + 0.13;
      const radius = 29 + (j % 3) * 11;
      const part = document.createElement('i');
      part.className='fx-ink';
      const set=(name,val)=>part.style.setProperty(name,val);
      set('--fx-x', `${x}px`); set('--fx-y', `${y}px`);
      set('--fx-w', `${3 + j%3}px`); set('--fx-h',`${11+(j%4)*3}px`);
      set('--fx-dx', `${Math.cos(angle)*radius}px`); set('--fx-dy', `${Math.sin(angle)*radius}px`);
      set('--fx-rotation', `${Math.round(angle*180/Math.PI+40)}deg`);
      set('--fx-color', j%4===0?'#ff5fa8':j%2===0?'#6a5cea':'#1d1a4a');
      set('--fx-bg',j%3===0?'#e5dcff':'white');
      set('--fx-delay',`${(j%3)*16}ms`);
      fxLayer.append(part);
      part.addEventListener('animationend',()=>part.remove(),{once:true});
    }
  };

  document.addEventListener('click', event => {
    const el=event.target.closest('a, button, sakuga-button');
    if (!el || el.matches('[disabled], [aria-disabled="true"]')) return;
    if (el.localName === 'sakuga-button' && customElements.get('sakuga-button')) return;
    const bounds=el.getBoundingClientRect();
    const x = event.clientX || (bounds.left + bounds.width/2);
    const y = event.clientY || (bounds.top + bounds.height/2);
    trigger(el,x,y);
  });
})();
