/**
 * PokeVault — Cloud Curtain Transition
 * Vanilla JS implementation of the Cloud Overlay design.
 * Drop-in replacement for the manga flash effect.
 */
(function () {
  'use strict';

  // ── Timing (seconds) ──────────────────────────────────────────────────────
  const DURATION   = 2.0;
  const T_IN_END   = 0.70;
  const T_HOLD_END = 1.05;
  const T_OUT_END  = 1.80;
  const T_SWAP     = 0.85;
  const T_IMPACT   = 0.70;
  const OFFSCREEN  = 1500;

  // ── Easing ────────────────────────────────────────────────────────────────
  const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const easeInExpo  = (t) => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInQuad   = (t) => t * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // ── Cloud shapes ─────────────────────────────────────────────────────────
  const CLOUD_SHAPES = {
    wideFlat: [
      {cx:30,cy:70,r:26},{cx:70,cy:50,r:38},{cx:115,cy:38,r:44},
      {cx:165,cy:42,r:40},{cx:210,cy:50,r:36},{cx:250,cy:60,r:30},
      {cx:285,cy:72,r:22},{cx:90,cy:82,r:26},{cx:145,cy:88,r:28},
      {cx:200,cy:84,r:26},{cx:245,cy:80,r:22},
    ],
    bigRound: [
      {cx:80,cy:80,r:44},{cx:130,cy:50,r:52},{cx:190,cy:60,r:46},
      {cx:235,cy:90,r:38},{cx:165,cy:100,r:40},{cx:100,cy:110,r:36},
      {cx:50,cy:105,r:30},
    ],
    hugeWide: [
      {cx:40,cy:80,r:32},{cx:90,cy:60,r:42},{cx:140,cy:45,r:48},
      {cx:195,cy:38,r:50},{cx:250,cy:42,r:46},{cx:300,cy:52,r:42},
      {cx:345,cy:65,r:36},{cx:385,cy:78,r:28},{cx:115,cy:95,r:32},
      {cx:170,cy:102,r:34},{cx:230,cy:100,r:34},{cx:290,cy:92,r:30},
      {cx:340,cy:85,r:26},
    ],
    puffy: [
      {cx:50,cy:70,r:32},{cx:100,cy:50,r:42},{cx:155,cy:55,r:38},
      {cx:200,cy:75,r:30},{cx:130,cy:90,r:34},{cx:80,cy:95,r:26},
    ],
    smallTuft: [
      {cx:35,cy:50,r:24},{cx:70,cy:38,r:30},{cx:110,cy:48,r:26},
      {cx:145,cy:60,r:20},{cx:80,cy:70,r:22},
    ],
    chunky: [
      {cx:60,cy:70,r:38},{cx:115,cy:50,r:48},{cx:175,cy:60,r:42},
      {cx:220,cy:80,r:34},{cx:150,cy:95,r:38},{cx:95,cy:100,r:32},
    ],
    kintoun: [
      {cx:50,cy:90,r:40},{cx:95,cy:60,r:48},{cx:150,cy:50,r:52},
      {cx:210,cy:58,r:46},{cx:255,cy:78,r:40},{cx:95,cy:118,r:34},
      {cx:155,cy:125,r:36},{cx:215,cy:118,r:34},
      {cx:290,cy:92,r:32},{cx:318,cy:86,r:28},{cx:344,cy:79,r:25},
      {cx:368,cy:72,r:22},{cx:390,cy:65,r:19},{cx:409,cy:58,r:16},
      {cx:425,cy:51,r:14},{cx:438,cy:45,r:12},{cx:449,cy:40,r:10},
      {cx:458,cy:36,r:8},{cx:465,cy:33,r:7},
    ],
    curly: [
      {cx:28,cy:50,r:16},{cx:48,cy:38,r:22},{cx:78,cy:32,r:30},
      {cx:120,cy:45,r:42},{cx:170,cy:38,r:48},{cx:225,cy:50,r:42},
      {cx:270,cy:65,r:36},{cx:310,cy:48,r:24},{cx:340,cy:36,r:17},
      {cx:360,cy:28,r:11},{cx:95,cy:80,r:32},{cx:150,cy:90,r:36},
      {cx:210,cy:88,r:34},{cx:260,cy:95,r:28},
    ],
  };

  // ── Cloud layout ──────────────────────────────────────────────────────────
  const CLOUDS = [
    {id:'a',shape:'kintoun', size:1250,cx:0.04,cy:0.06,from:[-0.7,-0.9],delay:0.00,flip:false,rot:-4},
    {id:'b',shape:'hugeWide',size:1400,cx:0.50,cy:0.00,from:[ 0.0,-1.0],delay:0.04,flip:false,rot: 2},
    {id:'c',shape:'kintoun', size:1200,cx:0.96,cy:0.08,from:[ 0.9,-0.7],delay:0.02,flip:true, rot: 3},
    {id:'d',shape:'curly',   size:1350,cx:0.12,cy:0.40,from:[-1.0, 0.0],delay:0.06,flip:true, rot:-2},
    {id:'e',shape:'chunky',  size:950, cx:0.50,cy:0.42,from:[ 0.0,-0.4],delay:0.10,flip:false,rot: 0},
    {id:'f',shape:'curly',   size:1300,cx:0.90,cy:0.45,from:[ 1.0, 0.0],delay:0.07,flip:false,rot: 4},
    {id:'g',shape:'kintoun', size:1100,cx:0.06,cy:0.78,from:[-0.9, 0.6],delay:0.09,flip:false,rot:-3},
    {id:'h',shape:'hugeWide',size:1450,cx:0.50,cy:0.82,from:[ 0.0, 1.0],delay:0.12,flip:true, rot: 1},
    {id:'i',shape:'kintoun', size:1150,cx:0.96,cy:0.82,from:[ 0.9, 0.7],delay:0.05,flip:true, rot:-5},
    {id:'j',shape:'puffy',   size:820, cx:0.25,cy:0.22,from:[-0.4,-0.9],delay:0.15,flip:false,rot:-8},
    {id:'k',shape:'puffy',   size:820, cx:0.78,cy:0.65,from:[ 0.4, 0.9],delay:0.14,flip:true, rot: 6},
    {id:'l',shape:'chunky',  size:800, cx:0.35,cy:0.60,from:[-0.2, 1.0],delay:0.16,flip:false,rot:-2},
    {id:'m',shape:'puffy',   size:800, cx:0.65,cy:0.20,from:[ 0.2,-1.0],delay:0.17,flip:true, rot: 3},
    {id:'n',shape:'curly',   size:900, cx:0.18,cy:0.95,from:[-0.5, 1.0],delay:0.11,flip:false,rot: 4},
    {id:'o',shape:'curly',   size:900, cx:0.82,cy:0.06,from:[ 0.5,-1.0],delay:0.10,flip:true, rot:-3},
    {id:'p',shape:'chunky',  size:850, cx:0.60,cy:0.58,from:[ 0.2, 0.6],delay:0.18,flip:false,rot: 5},
    {id:'q',shape:'chunky',  size:850, cx:0.40,cy:0.40,from:[-0.2,-0.6],delay:0.15,flip:true, rot:-6},
    {id:'r',shape:'chunky',  size:850, cx:0.00,cy:0.22,from:[-1.0,-0.2],delay:0.09,flip:true, rot:-4},
    {id:'s',shape:'chunky',  size:850, cx:1.00,cy:0.30,from:[ 1.0,-0.2],delay:0.08,flip:false,rot: 5},
    {id:'t',shape:'chunky',  size:850, cx:0.00,cy:0.60,from:[-1.0, 0.2],delay:0.10,flip:false,rot: 3},
    {id:'u',shape:'chunky',  size:850, cx:1.00,cy:0.65,from:[ 1.0, 0.2],delay:0.11,flip:true, rot:-3},
  ];

  // ── SVG cloud builder ─────────────────────────────────────────────────────
  function buildCloudSVG(shapeName, size, flip) {
    const circles = CLOUD_SHAPES[shapeName] || CLOUD_SHAPES.puffy;
    let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity;
    for (const c of circles) {
      if (c.cx-c.r < minX) minX = c.cx-c.r;
      if (c.cy-c.r < minY) minY = c.cy-c.r;
      if (c.cx+c.r > maxX) maxX = c.cx+c.r;
      if (c.cy+c.r > maxY) maxY = c.cy+c.r;
    }
    const pad = 4;
    const vbW = (maxX - minX) + pad*2;
    const vbH = (maxY - minY) + pad*2;
    const aspect = vbH / vbW;
    const h = size * aspect;

    const avgR = circles.reduce((s,c) => s+c.r, 0) / circles.length;
    const dy = avgR * 0.18;
    const id = 'm' + Math.random().toString(36).slice(2,7);

    const circleSVG = (arr, extra='') =>
      arr.map(c => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" ${extra}/>`).join('');

    const outlineCircles = circles.map(c =>
      `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r+6}" fill="#3a2812"/>`
    ).join('');

    const svg = `<svg width="${size}" height="${h}"
      viewBox="${minX-pad} ${minY-pad} ${vbW} ${vbH}"
      style="display:block;overflow:visible;${flip?'transform:scaleX(-1)':''}"
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <mask id="cm-${id}">
          <rect x="${minX-pad}" y="${minY-pad}" width="${vbW}" height="${vbH}" fill="black"/>
          ${circleSVG(circles, 'fill="white"')}
        </mask>
      </defs>
      <g>${outlineCircles}</g>
      <g>${circleSVG(circles, 'fill="#FFE96A"')}</g>
      <g mask="url(#cm-${id})">
        <g transform="translate(${dy*0.6} ${dy*1.4})">
          ${circleSVG(circles, 'fill="#D9B83A"')}
        </g>
      </g>
      <g mask="url(#cm-${id})">
        <g transform="translate(${-dy*0.5} ${-dy*0.9})">
          ${circles.map(c=>`<circle cx="${c.cx}" cy="${c.cy}" r="${c.r*0.78}" fill="#FFF5B0"/>`).join('')}
        </g>
      </g>
    </svg>`;

    return { svg, w: size, h };
  }

  // ── Progress function ─────────────────────────────────────────────────────
  function cloudProgress(t, delay) {
    const inStart = T_IN_START + delay;
    const inEnd   = T_IN_END;
    const outStart = T_HOLD_END + delay * 0.4;
    const outEnd   = T_OUT_END;
    if (t <= inStart) return 0;
    if (t < inEnd) return easeOutExpo((t - inStart) / (inEnd - inStart));
    if (t <= outStart) return 1;
    if (t < outEnd) return 1 - easeInExpo((t - outStart) / (outEnd - outStart));
    return 0;
  }
  const T_IN_START = 0;

  // ── Seeded random ─────────────────────────────────────────────────────────
  function seedRand(i, salt) {
    const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
    return v - Math.floor(v);
  }

  // ── Build overlay DOM ─────────────────────────────────────────────────────
  let overlay = null;
  let cloudEls = [];
  let wispSVG = null;
  let burstSVG = null;
  let raf = null;
  let startTime = null;
  let onSwapCallback = null;
  let swapFired = false;
  let active = false;

  const VW = window.innerWidth;
  const VH = window.innerHeight;

  function buildOverlay() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.id = 'cloud-curtain';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      pointer-events:none;overflow:hidden;
      display:none;
    `;
    document.body.appendChild(overlay);

    // Wispy streaks SVG
    wispSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wispSVG.setAttribute('width', VW);
    wispSVG.setAttribute('height', VH);
    wispSVG.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    wispSVG.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:visible;';
    overlay.appendChild(wispSVG);

    // Cloud elements
    cloudEls = CLOUDS.map(c => {
      const { svg, w, h } = buildCloudSVG(c.shape, c.size * (VW / 1920), c.flip);
      const wrap = document.createElement('div');
      wrap.style.cssText = `position:absolute;pointer-events:none;will-change:transform;`;
      wrap.innerHTML = svg;
      overlay.appendChild(wrap);
      return { el: wrap, cfg: c, w, h };
    });

    // Impact burst SVG
    burstSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    burstSVG.setAttribute('width', VW);
    burstSVG.setAttribute('height', VH);
    burstSVG.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    burstSVG.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    overlay.appendChild(burstSVG);
  }

  // ── Wispy streaks renderer ────────────────────────────────────────────────
  function renderWisps(t) {
    let alpha = 0;
    if (t < T_IN_END) {
      const p = clamp(t / T_IN_END, 0, 1);
      alpha = easeOutCubic(p) * (1 - easeInQuad(Math.max(0, (t - T_IN_END * 0.6) / (T_IN_END * 0.4))));
    } else if (t > T_HOLD_END && t < T_OUT_END) {
      const p = clamp((t - T_HOLD_END) / (T_OUT_END - T_HOLD_END), 0, 1);
      alpha = easeOutCubic(Math.min(1, p * 2)) * (1 - easeInQuad(Math.max(0, (p - 0.6) / 0.4)));
    }
    if (alpha <= 0.001) { wispSVG.innerHTML = ''; return; }

    const N = 20;
    let paths = '';
    for (let i = 0; i < N; i++) {
      const y = seedRand(i, 1) * VH;
      const length = 200 + seedRand(i, 2) * 400;
      const thick = 3 + seedRand(i, 3) * 8;
      const dir = seedRand(i, 4) > 0.5 ? 1 : -1;
      const curveY = (seedRand(i, 5) - 0.5) * 160;
      const phaseT = t < T_IN_END ? t / T_IN_END : (t - T_HOLD_END) / (T_OUT_END - T_HOLD_END);
      const startX = dir > 0 ? -length : VW;
      const travel = VW + length * 2;
      const x = startX + dir * travel * (phaseT + seedRand(i, 6) * 0.3);
      const x1=x, y1=y, x2=x+dir*length, y2=y+curveY*0.3;
      const cx=x+dir*length*0.5, cy=y+curveY;
      const op = alpha * (0.4 + seedRand(i, 7) * 0.5);
      paths += `<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="white" stroke-width="${thick}" stroke-linecap="round" fill="none" opacity="${op}"/>`;
    }
    wispSVG.innerHTML = paths;
  }

  // ── Impact burst renderer ─────────────────────────────────────────────────
  function renderBurst(t) {
    const window_dur = 0.30;
    const local = (t - T_IMPACT + window_dur * 0.3) / window_dur;
    if (local < 0 || local > 1) { burstSVG.innerHTML = ''; return; }

    const grow = easeOutExpo(clamp(local * 1.4, 0, 1));
    const fade = 1 - easeInQuad(clamp(local, 0, 1));

    const N = 24;
    const cx = VW / 2, cy = VH / 2;
    const innerR = 60 + (1 - grow) * 400;
    const outerR = 150 + grow * 1200;

    let rays = '';
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 + seedRand(i, 9) * 0.06;
      const wa = 0.012 + seedRand(i, 10) * 0.018;
      const r1 = innerR + seedRand(i, 11) * 80;
      const r2 = outerR + seedRand(i, 12) * 150;
      const p1 = [cx + Math.cos(angle-wa)*r1, cy + Math.sin(angle-wa)*r1];
      const p2 = [cx + Math.cos(angle+wa)*r1, cy + Math.sin(angle+wa)*r1];
      const p3 = [cx + Math.cos(angle+wa*0.3)*r2, cy + Math.sin(angle+wa*0.3)*r2];
      const p4 = [cx + Math.cos(angle-wa*0.3)*r2, cy + Math.sin(angle-wa*0.3)*r2];
      rays += `<polygon points="${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}" fill="#3a2812" opacity="${0.85*fade}"/>`;
    }
    burstSVG.innerHTML = rays;
  }

  // ── Animation frame ───────────────────────────────────────────────────────
  function frame(ts) {
    if (!startTime) startTime = ts;
    const t = Math.min((ts - startTime) / 1000, DURATION);

    // Swap callback at T_SWAP
    if (!swapFired && t >= T_SWAP) {
      swapFired = true;
      if (onSwapCallback) onSwapCallback();
    }

    // Render clouds
    cloudEls.forEach(({ el, cfg }) => {
      const p = cloudProgress(t, cfg.delay);
      const scale = VW / 1920;
      const finalX = cfg.cx * VW;
      const finalY = cfg.cy * VH;
      const startX = finalX + cfg.from[0] * OFFSCREEN * scale;
      const startY = finalY + cfg.from[1] * OFFSCREEN * scale;
      const x = startX + (finalX - startX) * p;
      const y = startY + (finalY - startY) * p;

      let sc = 0.78 + 0.22 * p;
      if (p >= 0.999) {
        const holdLocal = clamp((t - T_IN_END) / (T_HOLD_END - T_IN_END), 0, 1);
        sc = 1 + Math.sin(holdLocal * Math.PI) * 0.04;
      }
      const moving = p > 0 && p < 0.98;
      let blurX = 0;
      if (moving) blurX = -cfg.from[0] * (1 - p) * 0.18;
      const sx = sc * (1 + Math.abs(blurX));
      const sy = sc * (1 - Math.abs(blurX) * 0.25);
      const rot = cfg.rot * (0.6 + 0.4 * p);

      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${sx}, ${sy}) rotate(${rot}deg)`;
      el.style.display = p > 0.001 ? '' : 'none';
    });

    renderWisps(t);
    renderBurst(t);

    if (t < DURATION) {
      raf = requestAnimationFrame(frame);
    } else {
      hide();
    }
  }

  // ── Public API ────────────────────────────────────────────────────────────
  function hide() {
    if (overlay) overlay.style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
    active = false;
    startTime = null;
    swapFired = false;
    onSwapCallback = null;
  }

  function trigger(callback) {
    if (active) return;
    buildOverlay();
    active = true;
    onSwapCallback = callback || null;
    swapFired = false;
    startTime = null;
    overlay.style.display = 'block';
    // Reset cloud positions
    cloudEls.forEach(({ el }) => { el.style.display = 'none'; });
    raf = requestAnimationFrame(frame);
  }

  // ── Expose globally ───────────────────────────────────────────────────────
  window.cloudTransition = trigger;

})();
