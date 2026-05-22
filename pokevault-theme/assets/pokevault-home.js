/**
 * PokeVault — Arcade Legend × Pokémon Animations
 * GSAP-powered: hero reveal, electric transitions, product filter, scroll animations
 */
(function () {
  'use strict';

  // ── Wait for GSAP ────────────────────────────────────────────────────────
  function init() {
    if (typeof gsap === 'undefined') {
      setTimeout(init, 50);
      return;
    }
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    heroReveal();
    initProductFilter();
    initCardHover();
    initScrollAnimations();
  }

  // ── Hero Reveal — Arcade Legend Style ────────────────────────────────────
  function heroReveal() {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Split title for word reveal
    const title = document.querySelector('.hero__title');
    if (title) {
      const words = title.innerHTML.split(/(<br\s*\/?>|\n)/gi);
      const wrapped = words.map(w =>
        /^<br/i.test(w) ? '<br>' :
        w.trim() ? `<span class="word-wrap" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${w}</span></span>` : w
      ).join('');
      title.innerHTML = wrapped;
    }

    // Staggered reveal
    tl.from('.hero__badge',    { opacity: 0, y: -15, duration: 0.5 })
      .from('.word-wrap',      { opacity: 0, y: 20, duration: 0.5, stagger: 0.08 }, '-=0.3')
      .from('.hero__sub',      { opacity: 0, y: 12, duration: 0.5 }, '-=0.3')
      .from('.hero__ctas > *', { opacity: 0, scale: 0.95, stagger: 0.1, duration: 0.4 }, '-=0.3')
      .from('.hero__stats',    { opacity: 0, y: 12, duration: 0.5 }, '-=0.3');

    // Count-up stats with electric effect
    setTimeout(() => {
      document.querySelectorAll('.hero__stat-num[data-count]').forEach((el, idx) => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        gsap.fromTo({ n: 0 }, { n: target }, {
          duration: 1.8,
          ease: 'power2.out',
          delay: idx * 0.1,
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].n) + suffix;
          }
        });
      });
    }, 600);
  }

  // ── Product Filter — Modern Grid Layout ──────────────────────────────────
  function initProductFilter() {
    const grid = document.getElementById('productGrid');
    const tabs = document.querySelectorAll('.filter-tab[data-cat]');
    if (!grid || !tabs.length) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    let currentCat = 'all';
    let animating = false;

    // Detect category
    function detectCat(card) {
      const dc = (card.dataset.cat || '').trim();
      if (dc && dc !== 'other') return dc;
      const title = (card.querySelector('.product-card__title')?.textContent || '').toLowerCase();
      if (title.includes('booster')) return 'booster';
      if (title.includes('sleeve') || title.includes('manche')) return 'sleeve';
      if (title.includes('protection') || title.includes('etb') || title.includes('display')) return 'protection';
      if (title.includes('toploader') || title.includes('top loader')) return 'toploader';
      return 'other';
    }

    const cardCats = cards.map(detectCat);

    // Initial reveal
    gsap.set(cards, { opacity: 0, y: 20 });
    gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: 0.2 });

    // Tab click
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = tab.dataset.cat;
        if (cat === currentCat || animating) return;
        currentCat = cat;
        animating = true;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const show = cat === 'all' ? cards : cards.filter((_, i) => cardCats[i] === cat);
        const hide = cat === 'all' ? [] : cards.filter((_, i) => cardCats[i] !== cat);

        // Fade out hidden
        hide.forEach(c => {
          c.style.opacity = '0';
          c.style.pointerEvents = 'none';
          c.style.position = 'absolute';
          c.style.visibility = 'hidden';
        });

        // Show and animate in
        show.forEach(c => {
          c.style.position = '';
          c.style.visibility = '';
          c.style.pointerEvents = '';
        });

        gsap.fromTo(show,
          { opacity: 0, y: 15, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.4, stagger: 0.04, ease: 'power2.out',
            clearProps: 'all',
            onComplete: () => { animating = false; }
          }
        );

        // Update count
        const count = show.length;
        const countEl = document.getElementById('catalogCount');
        if (countEl) {
          countEl.textContent = count + ' produit' + (count > 1 ? 's' : '');
          gsap.fromTo(countEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' });
        }
        const titleEl = document.querySelector('.catalog-title');
        if (titleEl) {
          const labels = { all:'Tous les produits', booster:'Boosters', sleeve:'Sleeves', protection:'Protections', toploader:'Toploaders' };
          titleEl.textContent = labels[cat] || 'Produits';
        }
      });
    });
  }

  // ── Card Hover — Flat Design with Lightning Effect ────────────────────────
  function initCardHover() {
    document.querySelectorAll('.product-card').forEach(card => {
      const img = card.querySelector('.product-card__image img');

      card.addEventListener('mouseenter', () => {
        if (img) {
          gsap.to(img, { scale: 1.04, duration: 0.3, ease: 'power2.out' });
        }
      });

      card.addEventListener('mouseleave', () => {
        if (img) {
          gsap.to(img, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
      });
    });
  }

  // ── Scroll Animations ────────────────────────────────────────────────────
  function initScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Promo banner
    gsap.from('.promo-banner', {
      scrollTrigger: { trigger: '.promo-banner', start: 'top 90%' },
      opacity: 0, x: -30, duration: 0.6, ease: 'power2.out'
    });

    // Catalog header
    gsap.from('.catalog-header', {
      scrollTrigger: { trigger: '.catalog-header', start: 'top 88%' },
      opacity: 0, y: 15, duration: 0.5
    });

    // Product cards stagger on scroll (if visible)
    document.querySelectorAll('.product-card').forEach((card, idx) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 95%',
          once: true
        },
        opacity: 0,
        y: 20,
        scale: 0.98,
        duration: 0.4,
        delay: (idx % 3) * 0.05,
        ease: 'power2.out'
      });
    });
  }

  // ── Draw Lightning Line Animation ────────────────────────────────────────
  function drawLightning(svgElement, duration = 0.6) {
    if (!svgElement) return;
    const lines = svgElement.querySelectorAll('.lightning-line');
    lines.forEach(line => {
      const length = line.getTotalLength();
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: duration,
        ease: 'power2.inOut'
      });
    });
  }

  // ── Halftone Pulse Effect ────────────────────────────────────────────────
  function pulsHalftone(element) {
    gsap.fromTo(element,
      { opacity: 0 },
      { opacity: 0.15, duration: 0.3, ease: 'power1.inOut' }
    );
  }

  // ── Init ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  // Export for external use if needed
  window.pokevaultAnimations = { drawLightning, pulsHalftone };
})();
