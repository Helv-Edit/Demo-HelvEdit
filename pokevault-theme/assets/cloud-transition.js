/**
 * PokeVault — Cloud Curtain Transition (Two-Phase)
 *
 * Phase 1 (old page): clouds sweep IN → fully cover screen → navigate
 * Phase 2 (new page): clouds start already covering → disperse to reveal
 *
 * sessionStorage key "pvCloudResume" triggers phase 2 on next page load.
 */
(function () {
  'use strict';

  const T_IN_END   = 0.70;
  const T_HOLD_END = 1.05;
  const T_OUT_END  = 1.80;
  const T_TOTAL    = 2.00;
  const T_IMPACT   = 0.70;
  const T_IN_START = 0.00;
  const OFFSCREEN  = 1600;

  // ── Easing ────────────────────────────────────────────────────────────────
  const easeOutExpo  = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  const easeInExpo   = t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInQuad   = t => t * t;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  // ── Cloud shapes ─────────────────────────────────────────────────────────
  const SHAPES = {
    wideFlat:  [{cx:30,cy:70,r:26},{cx:70,cy:50,r:38},{cx:115,cy:38,r:44},{cx:165,cy:42,r:40},{cx:210,cy:50,r:36},{cx:250,cy:60,r:30},{cx:285,cy:72,r:22},{cx:90,cy:82,r:26},{cx:145,cy:88,r:28},{cx:200,cy:84,r:26},{cx:245,cy:80,r:22}],
    hugeWide:  [{cx:40,cy:80,r:32},{cx:90,cy:60,r:42},{cx:140,cy:45,r:48},{cx:195,cy:38,r:50},{cx:250,cy:42,r:46},{cx:300,cy:52,r:42},{cx:345,cy:65,r:36},{cx:385,cy:78,r:28},{cx:115,cy:95,r:32},{cx:170,cy:102,r:34},{cx:230,cy:100,r:34},{cx:290,cy:92,r:30},{cx:340,cy:85,r:26}],
    puffy:     [{cx:50,cy:70,r:32},{cx:100,cy:50,r:42},{cx:155,cy:55,r:38},{cx:200,cy:75,r:30},{cx:130,cy:90,r:34},{cx:80,cy:95,r:26}],
    chunky:    [{cx:60,cy:70,r:38},{cx:115,cy:50,r:48},{cx:175,cy:60,r:42},{cx:220,cy:80,r:34},{cx:150,cy:95,r:38},{cx:95,cy:100,r:32}],
    kintoun:   [{cx:50,cy:90,r:40},{cx:95,cy:60,r:48},{cx:150,cy:50,r:52},{cx:210,cy:58,r:46},{cx:255,cy:78,r:40},{cx:95,cy:118,r:34},{cx:155,cy:125,r:36},{cx:215,cy:118,r:34},{cx:290,cy:92,r:32},{cx:318,cy:86,r:28},{cx:344,cy:79,r:25},{cx:368,cy:72,r:22},{cx:390,cy:65,r:19},{cx:409,cy:58,r:16},{cx:425,cy:51,r:14},{cx:438,cy:45,r:12},{cx:449,cy:40,r:10},{cx:458,cy:36,r:8},{cx:465,cy:33,r:7}],
    curly:     [{cx:28,cy:50,r:16},{cx:48,cy:38,r:22},{cx:78,cy:32,r:30},{cx:120,cy:45,r:42},{cx:170,cy:38,r:48},{cx:225,cy:50,r:42},{cx:270,cy:65,r:36},{cx:310,cy:48,r:24},{cx:340,cy:36,r:17},{cx:360,cy:28,r:11},{cx:95,cy:80,r:32},{cx:150,cy:90,r:36},{cx:210,cy:88,r:34},{cx:260,cy:95,r:28}],
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

  // ── SVG cloud ────────────────────────────────────────────────────────────
  function buildCloudSVG(shapeName, size, flip) {
    const cs = SHAPES[shapeName] || SHAPES.puffy;
    let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity;
    cs.forEach(c => { x0=Math.min(x0,c.cx-c.r); y0=Math.min(y0,c.cy-c.r); x1=Math.max(x1,c.cx+c.r); y1=Math.max(y1,c.cy+c.r); });
    const pad=4, vw=x1-x0+pad*2, vh=y1-y0+pad*2;
    const h = size * (vh/vw);
    const avgR = cs.reduce((s,c)=>s+c.r,0)/cs.length;
    const dy = avgR * 0.18;
    const id = 'cv' + Math.random().toString(36).slice(2,8);
    const circ = (arr,fill) => arr.map(c=>`<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${fill}"/>`).join('');
    return `<svg width="${size}" height="${h}" viewBox="${x0-pad} ${y0-pad} ${vw} ${vh}"
      style="display:block;overflow:visible;${flip?'transform:scaleX(-1)':''}">
      <defs><mask id="${id}">
        <rect x="${x0-pad}" y="${y0-pad}" width="${vw}" height="${vh}" fill="black"/>
        ${circ(cs,'white')}
      </mask></defs>
      <g>${cs.map(c=>`<circle cx="${c.cx}" cy="${c.cy}" r="${c.r+6}" fill="#3a2812"/>`).join('')}</g>
      <g>${circ(cs,'#FFE96A')}</g>
      <g mask="url(#${id})"><g transform="translate(${dy*.6} ${dy*1.4})">${circ(cs,'#D9B83A')}</g></g>
      <g mask="url(#${id})"><g transform="translate(${-dy*.5} ${-dy*.9})">${cs.map(c=>`<circle cx="${c.cx}" cy="${c.cy}" r="${c.r*.78}" fill="#FFF5B0"/>`).join('')}</g></g>
    </svg>`;
  }

  // ── Progress ──────────────────────────────────────────────────────────────
  function cloudProg(t, delay) {
    const inS = T_IN_START + delay, outS = T_HOLD_END + delay * 0.4;
    if (t <= inS) return 0;
    if (t < T_IN_END) return easeOutExpo((t-inS)/(T_IN_END-inS));
    if (t <= outS) return 1;
    if (t < T_OUT_END) return 1 - easeInExpo((t-outS)/(T_OUT_END-outS));
    return 0;
  }

  const seedRand = (i,s) => { const v=Math.sin(i*12.9898+s*78.233)*43758.5453; return v-Math.floor(v); };

  // ── DOM state ─────────────────────────────────────────────────────────────
  let overlay=null, cloudEls=[], wispSVG=null, burstSVG=null;
  let raf=null, startT=null, active=false;
  let VW=window.innerWidth, VH=window.innerHeight;

  function buildOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;overflow:hidden;display:none;';
    document.body.appendChild(overlay);

    wispSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
    wispSVG.setAttribute('width',VW); wispSVG.setAttribute('height',VH);
    wispSVG.setAttribute('viewBox',`0 0 ${VW} ${VH}`);
    wispSVG.style.cssText='position:absolute;inset:0;overflow:visible;';
    overlay.appendChild(wispSVG);

    const sc = VW/1920;
    cloudEls = CLOUDS.map(c => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:absolute;will-change:transform;display:none;';
      wrap.innerHTML = buildCloudSVG(c.shape, c.size*sc, c.flip);
      overlay.appendChild(wrap);
      return { el: wrap, cfg: c };
    });

    burstSVG = document.createElementNS('http://www.w3.org/2000/svg','svg');
    burstSVG.setAttribute('width',VW); burstSVG.setAttribute('height',VH);
    burstSVG.setAttribute('viewBox',`0 0 ${VW} ${VH}`);
    burstSVG.style.cssText='position:absolute;inset:0;';
    overlay.appendChild(burstSVG);
  }

  function renderClouds(t) {
    const sc = VW/1920;
    cloudEls.forEach(({el, cfg:c}) => {
      const p = cloudProg(t, c.delay);
      if (p <= 0.001) { el.style.display='none'; return; }
      el.style.display = '';
      const fx=c.cx*VW, fy=c.cy*VH;
      const sx2=fx+c.from[0]*OFFSCREEN*sc, sy2=fy+c.from[1]*OFFSCREEN*sc;
      const x=sx2+(fx-sx2)*p, y=sy2+(fy-sy2)*p;
      let scale = 0.78+0.22*p;
      if (p>=0.999) { const hl=clamp((t-T_IN_END)/(T_HOLD_END-T_IN_END),0,1); scale=1+Math.sin(hl*Math.PI)*0.04; }
      const bx = p>0&&p<0.98 ? -c.from[0]*(1-p)*0.18 : 0;
      const rot = c.rot*(0.6+0.4*p);
      el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${scale*(1+Math.abs(bx))},${scale*(1-Math.abs(bx)*.25)}) rotate(${rot}deg)`;
    });
  }

  function renderWisps(t) {
    let alpha=0;
    if (t<T_IN_END) { const p=clamp(t/T_IN_END,0,1); alpha=easeOutCubic(p)*(1-easeInQuad(Math.max(0,(t-T_IN_END*.6)/(T_IN_END*.4)))); }
    else if (t>T_HOLD_END&&t<T_OUT_END) { const p=clamp((t-T_HOLD_END)/(T_OUT_END-T_HOLD_END),0,1); alpha=easeOutCubic(Math.min(1,p*2))*(1-easeInQuad(Math.max(0,(p-.6)/.4))); }
    if (alpha<=0.001) { wispSVG.innerHTML=''; return; }
    let p2='';
    for (let i=0;i<18;i++) {
      const y=seedRand(i,1)*VH, len=180+seedRand(i,2)*360, th=2+seedRand(i,3)*7;
      const dir=seedRand(i,4)>.5?1:-1, cy2=(seedRand(i,5)-.5)*140;
      const ph=t<T_IN_END?t/T_IN_END:(t-T_HOLD_END)/(T_OUT_END-T_HOLD_END);
      const x=( dir>0?-len:VW )+dir*(VW+len*2)*(ph+seedRand(i,6)*.3);
      p2+=`<path d="M ${x} ${y} Q ${x+dir*len*.5} ${y+cy2} ${x+dir*len} ${y+cy2*.3}" stroke="white" stroke-width="${th}" stroke-linecap="round" fill="none" opacity="${alpha*(0.35+seedRand(i,7)*.5)}"/>`;
    }
    wispSVG.innerHTML=p2;
  }

  function renderBurst(t) {
    const wn=0.30, local=(t-T_IMPACT+wn*.3)/wn;
    if (local<0||local>1) { burstSVG.innerHTML=''; return; }
    const grow=easeOutExpo(clamp(local*1.4,0,1)), fade=1-easeInQuad(clamp(local,0,1));
    const N=24, cx=VW/2, cy=VH/2;
    const ir=60+(1-grow)*400, or2=150+grow*1200;
    let rays='';
    for (let i=0;i<N;i++) {
      const a=(i/N)*Math.PI*2+seedRand(i,9)*.06, wa=0.012+seedRand(i,10)*.018;
      const r1=ir+seedRand(i,11)*80, r2=or2+seedRand(i,12)*150;
      const p1=[cx+Math.cos(a-wa)*r1,cy+Math.sin(a-wa)*r1],p2=[cx+Math.cos(a+wa)*r1,cy+Math.sin(a+wa)*r1];
      const p3=[cx+Math.cos(a+wa*.3)*r2,cy+Math.sin(a+wa*.3)*r2],p4=[cx+Math.cos(a-wa*.3)*r2,cy+Math.sin(a-wa*.3)*r2];
      rays+=`<polygon points="${p1} ${p2} ${p3} ${p4}" fill="#3a2812" opacity="${.85*fade}"/>`;
    }
    burstSVG.innerHTML=rays;
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  let phaseOffset = 0; // start time within [0, T_TOTAL]
  let navCallback = null;
  let navFired = false;

  function frame(ts) {
    if (!startT) startT = ts;
    const t = Math.min(phaseOffset + (ts - startT) / 1000, T_TOTAL);

    // Phase 1: navigate when fully covered
    if (!navFired && navCallback && t >= T_HOLD_END) {
      navFired = true;
      const cb = navCallback;
      navCallback = null;
      cb(); // Navigate — browser will load new page
      return; // stop rendering (page is navigating)
    }

    renderClouds(t);
    renderWisps(t);
    renderBurst(t);

    if (t < T_TOTAL) {
      raf = requestAnimationFrame(frame);
    } else {
      hide();
    }
  }

  function hide() {
    if (overlay) overlay.style.display = 'none';
    if (raf) cancelAnimationFrame(raf);
    active = false; startT = null; navFired = false; navCallback = null;
  }

  // ── Phase 1: sweep in, then navigate ─────────────────────────────────────
  function triggerIn(href) {
    if (active) { window.location.href = href; return; }
    buildOverlay();
    active = true;
    phaseOffset = 0;
    startT = null;
    navFired = false;
    navCallback = () => {
      try { sessionStorage.setItem('pvCloudResume','1'); } catch(e){}
      window.location.href = href;
    };
    overlay.style.display = 'block';
    raf = requestAnimationFrame(frame);
  }

  // ── Phase 2: start dispersal (called on new page load) ───────────────────
  function triggerOut() {
    buildOverlay();
    active = true;
    phaseOffset = T_HOLD_END; // start mid-animation (dispersal)
    startT = null;
    navFired = true;
    navCallback = null;
    overlay.style.display = 'block';
    // Force all clouds to "fully covered" position first
    renderClouds(T_HOLD_END);
    raf = requestAnimationFrame(frame);
  }

  // ── Public API ────────────────────────────────────────────────────────────
  // Navigate with cloud transition
  window.cloudNavigate = triggerIn;

  // Simple callback-style (for non-navigation uses)
  window.cloudTransition = (callback) => {
    if (active) { if(callback) callback(); return; }
    buildOverlay();
    active = true;
    phaseOffset = 0;
    startT = null;
    navFired = false;
    navCallback = null;
    overlay.style.display = 'block';
    // Use the swap callback via a different mechanism
    let swapFired = false;
    const origFrame = frame;
    raf = requestAnimationFrame(function tick(ts) {
      if (!startT) startT = ts;
      const t = Math.min((ts - startT) / 1000, T_TOTAL);
      if (!swapFired && t >= T_HOLD_END) { swapFired=true; if(callback) callback(); }
      renderClouds(t); renderWisps(t); renderBurst(t);
      if (t < T_TOTAL) raf = requestAnimationFrame(tick);
      else hide();
    });
  };

  // ── Auto-resume phase 2 on page load ─────────────────────────────────────
  function onLoad() {
    try {
      if (sessionStorage.getItem('pvCloudResume')) {
        sessionStorage.removeItem('pvCloudResume');
        // Small delay to let the page render first
        setTimeout(triggerOut, 30);
      }
    } catch(e){}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onLoad);
  } else {
    onLoad();
  }

})();
