(() => {
  'use strict';

  const root = document.documentElement;
  // Use the real MIT-licensed Sakuga button when the external library loaded.
  // Standard native buttons are retained as a fully functional fallback.
  if (customElements.get('sakuga-button')) {
    document.querySelectorAll('button.focus-chip, button.filter').forEach(button => {
      const fx = document.createElement('sakuga-button');
      fx.className = button.className;
      fx.setAttribute('variant', 'secondary');
      for (const attr of button.attributes) {
        if (attr.name === 'class' || attr.name === 'type') continue;
        fx.setAttribute(attr.name, attr.value);
      }
      fx.textContent = button.textContent;
      button.replaceWith(fx);
    });
  }
  document.querySelectorAll('.button, .resume-link, .project-visit, .repo-card a').forEach(link => link.classList.add('impact-anim'));
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

  // Theme state is controlled by Sakuga VFX's real 43-frame animated toggle.
  // A native switch remains available when the external component is unavailable.
  const sakugaThemeToggle = document.getElementById('theme-toggle');
  const nativeThemeToggle = document.getElementById('theme-fallback');
  const themeText = document.getElementById('theme-current');
  let theme = getStored('portfolio-sakuga-theme', 'light') === 'dark' ? 'dark' : 'light';
  const sakugaAvailable = !!customElements.get('sakuga-toggle');

  if (sakugaThemeToggle && !sakugaAvailable) sakugaThemeToggle.hidden = true;
  if (nativeThemeToggle) nativeThemeToggle.hidden = sakugaAvailable;

  function applyTheme(syncSwitch = true) {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    if (themeText) themeText.textContent = dark ? 'Dark mode' : 'Light mode';
    if (sakugaThemeToggle && sakugaAvailable) {
      if (syncSwitch && sakugaThemeToggle.checked !== dark) sakugaThemeToggle.checked = dark;
      sakugaThemeToggle.setAttribute('label', 'Dark mode');
    }
    if (nativeThemeToggle) {
      nativeThemeToggle.setAttribute('aria-checked', String(dark));
      nativeThemeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  sakugaThemeToggle?.addEventListener('change', () => {
    theme = sakugaThemeToggle.checked ? 'dark' : 'light';
    setStored('portfolio-sakuga-theme', theme);
    applyTheme(false); // Do not restart the genuine Sakuga toggle animation.
  });
  nativeThemeToggle?.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    setStored('portfolio-sakuga-theme', theme);
    applyTheme();
  });
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-sakuga-theme') {
      theme = event.newValue === 'dark' ? 'dark' : 'light';
      applyTheme();
    }
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

  // Independently filter the public code archive.
  document.querySelectorAll('[data-repo-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.repoFilter;
    document.querySelectorAll('[data-repo-filter]').forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-repo-category]').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.repoCategory !== filter;
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
