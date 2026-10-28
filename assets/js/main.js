// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      links.style.display = links.classList.contains('open') ? 'flex' : '';
    });
  }

  // ---- Count-up animation for stat values ----
  function parseStatValue(text) {
    const match = text.match(/-?[\d,]+\.?\d*/);
    if (!match) return null;
    const num = parseFloat(match[0].replace(/,/g, ''));
    if (isNaN(num)) return null;
    return { num, prefix: text.slice(0, match.index), suffix: text.slice(match.index + match[0].length), decimals: (match[0].split('.')[1] || '').length };
  }

  function animateCountUp(el, duration = 900) {
    if (el.dataset.counted) return;
    const original = el.textContent.trim();
    const parsed = parseStatValue(original);
    if (!parsed) return; // non-numeric value (e.g. "3 of 14") — skip, just reveal
    el.dataset.counted = 'true';
    const { num, prefix, suffix, decimals } = parsed;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = original;
    }
    requestAnimationFrame(tick);
  }

  // ---- Reveal-on-scroll + stagger for any .stat-grid ----
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const grid = entry.target;
      const boxes = grid.querySelectorAll('.stat-box');
      boxes.forEach((box, i) => {
        box.style.setProperty('--stagger', i);
        box.classList.add('in-view');
        const valueEl = box.querySelector('.stat-value');
        if (valueEl) setTimeout(() => animateCountUp(valueEl), i * 90);
      });
      revealObserver.unobserve(grid);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.stat-grid').forEach(grid => revealObserver.observe(grid));

  // Trigger reveal immediately for the initially-active dashboard panel (it's visible on load)
  const initialPanel = document.querySelector('.dash-panel.active');
  if (initialPanel) {
    const boxes = initialPanel.querySelectorAll('.stat-box');
    boxes.forEach((box, i) => {
      box.style.setProperty('--stagger', i);
      box.classList.add('in-view');
      const valueEl = box.querySelector('.stat-value');
      if (valueEl) setTimeout(() => animateCountUp(valueEl), 150 + i * 90);
    });
  }

  // Dashboard tabs (Sample Engagement section)
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.dash-panel');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      tabButtons.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      panel.classList.add('active');
      // Re-run count-up + stagger reveal each time a dashboard tab is opened
      const boxes = panel.querySelectorAll('.stat-box');
      boxes.forEach((box, i) => {
        box.classList.remove('in-view');
        box.style.setProperty('--stagger', i);
        const valueEl = box.querySelector('.stat-value');
        if (valueEl) delete valueEl.dataset.counted;
        requestAnimationFrame(() => {
          box.classList.add('in-view');
          if (valueEl) setTimeout(() => animateCountUp(valueEl), i * 90);
        });
      });
    });
  });

  // Merge/split interactive cards (every .merge-split block on the page)
  document.querySelectorAll('.merge-split').forEach(block => {
    const mergedBtn = block.querySelector('.merged-card');
    const backBtn = block.querySelector('.merge-back-btn');
    if (mergedBtn) {
      mergedBtn.addEventListener('click', () => {
        block.classList.add('is-split');
        mergedBtn.setAttribute('aria-expanded', 'true');
      });
    }
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        block.classList.remove('is-split');
        if (mergedBtn) mergedBtn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Compact split-card click -> open detail modal
  const modalOverlay = document.getElementById('card-modal-overlay');
  if (modalOverlay) {
    const modalTag = document.getElementById('card-modal-tag');
    const modalTitle = document.getElementById('card-modal-title');
    const modalText = document.getElementById('card-modal-text');
    const modalClose = document.getElementById('card-modal-close');

    function openCardModal(card) {
      modalTag.textContent = card.dataset.tag || '';
      modalTitle.textContent = card.dataset.title || '';
      modalText.innerHTML = card.dataset.text || '';
      modalOverlay.classList.add('is-open');
    }
    function closeCardModal() {
      modalOverlay.classList.remove('is-open');
    }

    document.querySelectorAll('.compact-card').forEach(card => {
      card.addEventListener('click', () => openCardModal(card));
    });
    if (modalClose) modalClose.addEventListener('click', closeCardModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCardModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCardModal();
    });
  }

  // Reclaimed hours calculator (simple demo)
  const calcForm = document.getElementById('reclaim-calc');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const schools = parseFloat(document.getElementById('calc-schools').value) || 0;
      const staffPerSchool = parseFloat(document.getElementById('calc-staff').value) || 0;
      const hoursPerWeek = parseFloat(document.getElementById('calc-hours').value) || 0;
      const totalWeekly = schools * staffPerSchool * hoursPerWeek;
      const totalAnnual = Math.round(totalWeekly * 40);
      document.getElementById('calc-result').textContent =
        `≈ ${totalAnnual.toLocaleString()} staff hours reclaimed per year`;
      document.getElementById('calc-result-wrap').style.display = 'block';
    });
  }

  // Contact form (front-end only demo submit)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('contact-success');
      msg.style.display = 'block';
      contactForm.reset();
    });
  }

  // Hero background slideshow (crossfade loop, hero section only)
  const slideshow = document.getElementById('hero-slideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.hero-slide');
    let current = 0;
    if (slides.length > 1) {
      setInterval(() => {
        slides[current].classList.remove('is-active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('is-active');
      }, 4000);
    }
  }

  // Active nav link highlight (multi-page site, by current file name)
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});
