/* Genuine resource-gated progress; no simulated percentage. */
(() => {
  'use strict';
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const progress = document.getElementById('sakuga-loader');
  const fallbackFill = document.getElementById('loader-fallback-fill');
  const fallbackNumber = document.getElementById('loader-fallback-number');
  const stage = document.getElementById('loader-stage');
  const hasSakuga = !!customElements.get('sakuga-progress');
  if (hasSakuga) loader.classList.add('sakuga-loaded');

  const images = Array.from(document.images).filter(img => !img.closest('#page-loader'));
  const tasks = [
    ['Document', () => new Promise(resolve => {
      if (document.readyState !== 'loading') resolve();
      else document.addEventListener('DOMContentLoaded', resolve, {once:true});
    })],
    ['Stylesheets', () => Promise.all(Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => {
      if (link.sheet) return Promise.resolve();
      return new Promise(resolve => {
        link.addEventListener('load', resolve, {once:true});
        link.addEventListener('error', resolve, {once:true});
      });
    }))],
    ['Fonts', () => document.fonts?.ready || Promise.resolve()],
    ...images.map((img, index) => [`Image ${index+1}/${images.length}`, () => {
      if (img.complete) return img.decode?.().catch(()=>{}) || Promise.resolve();
      return new Promise(resolve => {
        img.addEventListener('load', resolve, {once:true});
        img.addEventListener('error', resolve, {once:true});
      }).then(() => img.decode?.().catch(()=>{}));
    }]),
    ['Browser resources', () => new Promise(resolve => {
      if (document.readyState === 'complete') resolve();
      else window.addEventListener('load', resolve, {once:true});
    })]
  ];

  let finished = 0;
  function update(value) {
    const percent = Math.min(100, Math.max(0, Math.floor(value * 100)));
    if (fallbackFill) fallbackFill.style.width = `${percent}%`;
    if (fallbackNumber) fallbackNumber.textContent = `${percent}%`;
    if (progress && typeof progress.set === 'function') progress.set(value);
    loader.setAttribute('aria-label', `Loading website: ${percent}%`);
  }
  update(0);
  // Every completed unit represents an actual completed document or resource.
  Promise.all(tasks.map(async ([name, run]) => {
    try { await run(); }
    catch (error) { console.warn('Optional resource did not load:',name,error); }
    finally {
      finished += 1;
      if (stage) stage.textContent = finished < tasks.length ? `Prepared ${finished} of ${tasks.length} resources` : 'Ready to explore';
      update(finished / tasks.length);
    }
  })).then(() => {
    // Allow the real Sakuga progress component to draw its finishing impact.
    const animationFinished = new Promise(resolve => {
      if (!hasSakuga || !progress) return resolve();
      if (progress.done) return resolve();
      progress.addEventListener('sakuga:done', resolve, {once:true});
      setTimeout(resolve, 1350); // Animation safeguard, not a fake loading percentage.
    });
    return animationFinished;
  }).then(() => {
    loader.classList.add('is-finished');
    document.body.classList.remove('is-preloading');
    window.setTimeout(() => { loader.hidden = true; }, 730);
  });
})();
