/**
 * PokeVault — Home Animations
 * GSAP-powered: hero reveal, product filter FLIP, 3D card hover,
 * floating Japanese cloud background, scroll parallax.
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
    initFloatingClouds();
    initProductFilter();
    initCardHover();
    initScrollAnimations();
  }

  // ── Hero reveal ───────────────────────────────────────────────────────────
  function heroReveal() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Split title into words for stagger
    const title = document.querySelector('.hero__title');
    if (title) {
      const words = title.innerHTML.split(/(<br\s*\/?>|\n)/gi);
      const wrapped = words.map(w =>
        /^<br/i.test(w) ? '<br>' :
        w.trim() ? `<span class="hw" style="display:inline-block;overflow:hidden"><span class="hwi" style="display:inline-block">${w}</span></span>` : w
      ).join('');
      title.innerHTML = wrapped;
    }

    tl.from('.hero__badge',    { opacity: 0, y: -20, duration: 0.6, delay: 0.1 })
      .from('.hwi',            { y: '105%', duration: 0.7, stagger: 0.08 }, '-=0.3')
      .from('.hero__sub',      { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
      .from('.hero__ctas > *', { opacity: 0, y: 12, stagger: 0.1, duration: 0.5 }, '-=0.4')
      .from('.hero__stats',    { opacity: 0, duration: 0.5 }, '-=0.3');

    // Count-up stats
    setTimeout(() => {
      document.querySelectorAll('.hero__stat-num[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        gsap.fromTo({ n: 0 }, { n: target }, {
          duration: 2, ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].n) + suffix;
          }
        });
      });
    }, 800);
  }

  // ── Floating Japanese clouds ───────────────────────────────────────────────
  function initFloatingClouds() {
    const container = document.getElementById('irezumiClouds');
    if (!container) return;

    // 5 clouds at different sizes/positions/speeds
    const defs = [
      { x: '8%',  top: '15%', size: 180, dur: 22, delay: 0   },
      { x: '72%', top: '8%',  size: 140, dur: 28, delay: 4   },
      { x: '50%', top: '55%', size: 220, dur: 18, delay: 8   },
      { x: '15%', top: '70%', size: 120, dur: 32, delay: 2   },
      { x: '80%', top: '72%', size: 160, dur: 24, delay: 12  },
    ];

    defs.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'irezumi-cloud';
      el.style.cssText = `position:absolute;left:${d.x};top:${d.top};width:${d.size}px;opacity:0;pointer-events:none;`;
      el.innerHTML = irezumiSVG(d.size, i);
      container.appendChild(el);

      // Float animation
      gsap.to(el, {
        opacity: 0.06 + (i % 3) * 0.02,
        duration: 1.2,
        delay: d.delay * 0.2,
      });
      gsap.to(el, {
        y: `${-30 - i * 8}`,
        x: `${(i % 2 === 0 ? 1 : -1) * (15 + i * 5)}`,
        duration: d.dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: d.delay * 0.3,
      });
      // Slow rotation
      gsap.to(el, {
        rotation: (i % 2 === 0 ? 4 : -4),
        duration: d.dur * 1.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: d.delay * 0.2,
      });
    });
  }

  // Irezumi-style Japanese cloud SVG (traditional curly cloud)
  function irezumiSVG(size, variant) {
    const v = variant % 3;
    const w = size, h = size * 0.7;
    // Different cloud shapes
    const paths = [
      // Cloud 1: classic 3-bump with curls
      `M${w*.1},${h*.7} C${w*.05},${h*.5} ${w*.08},${h*.25} ${w*.2},${h*.2}
       C${w*.18},${h*.05} ${w*.32},${h*.0} ${w*.42},${h*.1}
       C${w*.45},${h*.0} ${w*.58},${h*.0} ${w*.62},${h*.1}
       C${w*.72},${h*.02} ${w*.85},${h*.1} ${w*.88},${h*.25}
       C${w*.97},${h*.28} ${w*.98},${h*.5} ${w*.9},${h*.65}
       C${w*.85},${h*.82} ${w*.15},${h*.85} ${w*.1},${h*.7}Z
       M${w*.2},${h*.2} C${w*.22},${h*.35} ${w*.18},${h*.45} ${w*.12},${h*.5}
       M${w*.42},${h*.1} C${w*.44},${h*.28} ${w*.4},${h*.4} ${w*.35},${h*.5}
       M${w*.62},${h*.1} C${w*.64},${h*.28} ${w*.66},${h*.42} ${w*.6},${h*.55}`,

      // Cloud 2: tall curling cloud with spiral
      `M${w*.15},${h*.75} C${w*.05},${h*.6} ${w*.06},${h*.35} ${w*.18},${h*.28}
       C${w*.12},${h*.12} ${w*.28},${h*.05} ${w*.38},${h*.15}
       C${w*.4},${h*.05} ${w*.55},${h*.02} ${w*.6},${h*.15}
       C${w*.68},${h*.05} ${w*.82},${h*.1} ${w*.85},${h*.28}
       C${w*.96},${h*.32} ${w*.97},${h*.55} ${w*.88},${h*.7}
       C${w*.75},${h*.9} ${w*.25},${h*.9} ${w*.15},${h*.75}Z
       M${w*.38},${h*.15} Q${w*.45},${h*.3} ${w*.4},${h*.45}
       M${w*.6},${h*.15} Q${w*.65},${h*.32} ${w*.62},${h*.5}
       M${w*.18},${h*.28} Q${w*.24},${h*.42} ${w*.2},${h*.55}`,

      // Cloud 3: wide flat cloud
      `M${w*.05},${h*.72} C${w*.0},${h*.55} ${w*.04},${h*.38} ${w*.14},${h*.32}
       C${w*.1},${h*.18} ${w*.22},${h*.1} ${w*.32},${h*.18}
       C${w*.35},${h*.08} ${w*.48},${h*.05} ${w*.55},${h*.15}
       C${w*.6},${h*.06} ${w*.73},${h*.05} ${w*.78},${h*.18}
       C${w*.88},${h*.12} ${w*.98},${h*.25} ${w*.96},${h*.42}
       C${w*.98},${h*.58} ${w*.92},${h*.72} ${w*.82},${h*.78}
       C${w*.7},${h*.9} ${w*.18},${h*.9} ${w*.05},${h*.72}Z
       M${w*.32},${h*.18} Q${w*.36},${h*.35} ${w*.3},${h*.48}
       M${w*.55},${h*.15} Q${w*.58},${h*.33} ${w*.55},${h*.5}
       M${w*.78},${h*.18} Q${w*.8},${h*.35} ${w*.76},${h*.5}`,
    ][v];

    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg${variant}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#93c5fd"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <path d="${paths}" fill="url(#cg${variant})" stroke="#1e3a5f" stroke-width="${w*.025}" stroke-linejoin="round" fill-rule="evenodd"/>
    </svg>`;
  }

  // ── Product filter (client-side, no page reload) ──────────────────────────
  function initProductFilter() {
    const grid = document.getElementById('productGrid');
    const tabs = document.querySelectorAll('.filter-tab[data-cat]');
    if (!grid || !tabs.length) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));

    // Initial stagger in
    gsap.fromTo(cards,
      { opacity: 0, y: 40, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.3 }
    );

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = tab.dataset.cat;

        // Update active tab
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter cards
        const show = cat === 'all' ? cards : cards.filter(c => {
          const t = (c.dataset.type || '').toLowerCase();
          const tags = (c.dataset.tags || '').toLowerCase();
          return t.includes(cat) || tags.includes(cat);
        });
        const hide = cards.filter(c => !show.includes(c));

        // GSAP FLIP-style: hide old, show new with stagger
        if (hide.length) {
          gsap.to(hide, { opacity: 0, scale: 0.88, y: -20, duration: 0.25, ease: 'power2.in',
            onComplete: () => hide.forEach(c => { c.style.display = 'none'; })
          });
        }

        setTimeout(() => {
          show.forEach(c => {
            c.style.display = '';
            c.style.opacity = '0';
            c.style.transform = 'translateY(24px) scale(0.93)';
          });
          gsap.to(show, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.45, stagger: 0.05, ease: 'power3.out',
            clearProps: 'all'
          });
        }, hide.length ? 220 : 0);
      });
    });
  }

  // ── 3D card hover ─────────────────────────────────────────────────────────
  function initCardHover() {
    document.querySelectorAll('.product-card').forEach(card => {
      const img = card.querySelector('.product-card__image');
      const MAX = 12;

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        gsap.to(card, {
          rotateY: x * MAX,
          rotateX: -y * MAX,
          transformPerspective: 800,
          duration: 0.3, ease: 'power1.out'
        });
        if (img) {
          gsap.to(img, {
            x: x * 8, y: y * 8,
            duration: 0.3, ease: 'power1.out'
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1,0.6)' });
        if (img) gsap.to(img, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.6)' });
      });

      card.addEventListener('mouseenter', () => {
        gsap.to(card, { z: 20, duration: 0.3 });
      });
    });
  }

  // ── Scroll animations ─────────────────────────────────────────────────────
  function initScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Banner
    gsap.from('.promo-banner', {
      scrollTrigger: { trigger: '.promo-banner', start: 'top 90%' },
      opacity: 0, x: -30, duration: 0.6, ease: 'power2.out'
    });

    // Section header
    gsap.from('.catalog-header', {
      scrollTrigger: { trigger: '.catalog-header', start: 'top 88%' },
      opacity: 0, y: 20, duration: 0.5
    });
  }

  // ── Cloud transition only for checkout/login ──────────────────────────────
  function initNavigation() {
    // Intercept only payment/account links for cloud transition
    const cloudLinks = ['/checkout', '/cart', '/account/login', '/account/register', '/account'];

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href === window.location.pathname) return;

      const needsTransition = cloudLinks.some(l => href.startsWith(l));
      if (needsTransition && typeof cloudNavigate === 'function') {
        e.preventDefault();
        cloudNavigate(href);
      }
    });

    // Filter tabs and internal nav: NO transition (they're same-page now)
    document.querySelectorAll('.site-nav a').forEach(link => {
      link.addEventListener('click', (e) => {
        // Only transition for external pages, not filter tabs
        const href = link.getAttribute('href');
        if (href && !cloudLinks.some(l => href.startsWith(l))) {
          // Allow normal navigation (no cloud) for collection changes IF we're SPA
          // Otherwise just let it navigate naturally
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    init();
    initNavigation();
  });

})();
