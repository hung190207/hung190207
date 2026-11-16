(() => {
  'use strict';

  const root = document.documentElement;
  const getStored = (key, fallback) => {
    try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
  };
  const setStored = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Optional storage */ }
  };

  const uiText = {
    copied: 'Portfolio link copied!',
    copyFailed: 'Unable to copy automatically. Link: https://hung192.dev'
  };
  const focusText = {
    web: {
      title: 'Web Experiences',
      description: 'Designing intuitive, interactive, and usable web interfaces.'
    },
    creative: {
      title: 'Creative Coding',
      description: 'Exploring the intersection of art, motion, and programming.'
    },
    logic: {
      title: 'Problem Solving',
      description: 'Building algorithmic thinking and strong technical foundations.'
    }
  };
  const focusLabel = document.getElementById('focus-label');
  const focusDescription = document.getElementById('focus-description');
  let focus = 'web';

  function updateFocus() {
    if (!focusLabel || !focusDescription) return;
    focusLabel.textContent = focusText[focus].title;
    focusDescription.textContent = focusText[focus].description;
  }
  document.querySelectorAll('[data-focus]').forEach(button => button.addEventListener('click', () => {
    focus = button.dataset.focus;
    document.querySelectorAll('[data-focus]').forEach(chip => {
      const active = chip === button;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
    updateFocus();
  }));

  let theme = getStored('portfolio-theme', document.body.classList.contains('cv-page') ? 'light' : 'dark');
  function applyTheme() {
    root.dataset.theme = theme;
    const button = document.getElementById('theme-toggle');
    if (button) {
      button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      button.innerHTML = theme === 'dark'
        ? '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 15.4A8.5 8.5 0 0 1 8.6 4 8.5 8.5 0 1 0 20 15.4Z"/></svg>'
        : '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
    }
  }
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    setStored('portfolio-theme', theme);
    applyTheme();
  });
  applyTheme();

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-category]').forEach(project => {
      project.hidden = filter !== 'all' && project.dataset.category !== filter;
    });
  }));

  document.getElementById('copy-portfolio')?.addEventListener('click', async () => {
    const message = document.getElementById('copy-feedback');
    try {
      await navigator.clipboard.writeText('https://hung192.dev');
      if (message) message.textContent = uiText.copied;
    } catch {
      if (message) message.textContent = uiText.copyFailed;
    }
  });

  document.getElementById('print-cv')?.addEventListener('click', () => window.print());
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
  const progress = document.getElementById('reading-progress');
  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? Math.min(100, window.scrollY / scrollable * 100) : 0}%`;
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress);
  updateProgress();

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), {threshold:0.08, rootMargin:'0px 0px -30px 0px'});
    reveal.forEach(item => observer.observe(item));
  } else reveal.forEach(item => item.classList.add('is-visible'));

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
    }), {rootMargin:'-20% 0px -67% 0px'});
    document.querySelectorAll('main section[id]').forEach(section => navObserver.observe(section));
  }
  const spotlight = document.getElementById('spotlight');
  if (spotlight && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.addEventListener('pointermove', event => {
      spotlight.style.left = `${event.clientX}px`;
      spotlight.style.top = `${event.clientY}px`;
    }, {passive:true});
  } else if (spotlight) spotlight.hidden = true;
})();
