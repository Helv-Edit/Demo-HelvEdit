/* ═══════════════════════════════════════════════════════════════
   POKEVAULT — Home JS
   Constellation · Three.js GLB · Pokéball · Cart API Shopify · GSAP
   ═══════════════════════════════════════════════════════════════ */

const COLORS = ['#34e2c4','#ffd166','#5b8cff','#c77dff','#ff6b6b'];
let isAnimating = false;
const FREE_SHIP = 8000;

function formatMoney(cents) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €';
}

/* ── CART SHOPIFY API ── */
async function fetchCart() {
  const r = await fetch('/cart.js');
  return r.json();
}
async function addToCartAPI(variantId, qty = 1) {
  const r = await fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: qty })
  });
  return r.json();
}
async function changeQtyAPI(key, qty) {
  const r = await fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: key, quantity: qty })
  });
  return r.json();
}

/* ── CART DRAWER ── */
const overlays = new Set();
function lockScroll(id)   { overlays.add(id);    document.body.style.overflow = 'hidden'; }
function unlockScroll(id) { overlays.delete(id); if (!overlays.size) document.body.style.overflow = ''; }

const cartDrawer  = document.getElementById('cart-drawer');
const cartToggle  = document.getElementById('cart-toggle');
const cartClose   = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');

function openCart()  { if (cartDrawer) { cartDrawer.classList.add('active');    lockScroll('cart');   refreshCartDrawer(); } }
function closeCart() { if (cartDrawer) { cartDrawer.classList.remove('active'); unlockScroll('cart'); } }

if (cartToggle)  cartToggle.addEventListener('click', openCart);
if (cartClose)   cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

async function refreshCartDrawer() {
  const cart  = await fetchCart();
  const count = cart.item_count;
  const badge = document.getElementById('cart-badge');
  if (badge) { badge.textContent = count; badge.classList.toggle('visible', count > 0); }

  const hCount = document.getElementById('cart-header-count');
  if (hCount) hCount.textContent = count > 0 ? `${count} article${count > 1 ? 's' : ''}` : '';

  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl    = document.getElementById('cart-total');
  if (subtotalEl) subtotalEl.textContent = count > 0 ? formatMoney(cart.total_price) : '—';
  if (totalEl)    totalEl.textContent    = count > 0 ? formatMoney(cart.total_price) : '—';

  const remaining  = Math.max(0, FREE_SHIP - cart.total_price);
  const pct        = Math.min(100, (cart.total_price / FREE_SHIP) * 100);
  const upsellText = document.getElementById('upsell-text');
  const shipFill   = document.getElementById('ship-fill');
  const shipNote   = document.getElementById('cart-ship-note');
  if (upsellText) upsellText.textContent = remaining > 0
    ? ` — il vous manque ${formatMoney(remaining)} pour en profiter`
    : ' — félicitations, livraison offerte !';
  if (shipFill) shipFill.style.width = pct + '%';
  if (shipNote) shipNote.style.display = cart.total_price >= FREE_SHIP ? 'flex' : 'none';

  const itemsEl = document.getElementById('cart-items');
  if (!itemsEl) return;
  if (!cart.items.length) {
    itemsEl.innerHTML = `<div class="cart-empty"><svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg><p>Votre panier est vide</p></div>`;
    return;
  }
  itemsEl.innerHTML = cart.items.map(item => `
    <div class="cart-line" data-key="${item.key}">
      <div class="cart-line-img">${item.image ? `<img src="${item.image}" alt="${item.product_title}" loading="lazy">` : ''}</div>
      <div class="cart-line-info">
        <div class="cart-line-title">${item.product_title}${item.variant_title && item.variant_title !== 'Default Title' ? ` — ${item.variant_title}` : ''}</div>
        <div class="cart-line-footer">
          <div class="cart-line-price">${formatMoney(item.line_price)}</div>
          <div class="cart-line-qty">
            <button class="qty-btn" data-key="${item.key}" data-delta="-1">−</button>
            <span class="qty-num">${item.quantity}</span>
            <button class="qty-btn" data-key="${item.key}" data-delta="1">+</button>
          </div>
        </div>
      </div>
    </div>`).join('');

  itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const line   = btn.closest('.cart-line');
      const curQty = parseInt(line.querySelector('.qty-num').textContent);
      const newQty = Math.max(0, curQty + parseInt(btn.dataset.delta));
      await changeQtyAPI(btn.dataset.key, newQty);
      refreshCartDrawer();
    });
  });
}

/* Écoute clics "Ajouter au panier" depuis Liquid */
document.addEventListener('click', async e => {
  const btn = e.target.closest('[data-add-to-cart]');
  if (!btn) return;
  e.preventDefault();
  const variantId = btn.dataset.variantId || btn.dataset.addToCart;
  if (!variantId) return;
  await addToCartAPI(variantId);
  refreshCartDrawer();
  openCart();
});

/* ── ANNOUNCEMENT ROTATION ── */
(function() {
  const items = document.querySelectorAll('.ann-item');
  if (!items.length) return;
  let idx = 0;
  setInterval(() => {
    items[idx].classList.remove('active');
    idx = (idx + 1) % items.length;
    items[idx].classList.add('active');
  }, 5000);
})();

function setLang(lang, btn) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

const burgerBtn = document.getElementById('burger-btn');
const mobileNav = document.getElementById('mobile-nav');
if (burgerBtn && mobileNav) {
  burgerBtn.addEventListener('click', () => {
    const open = burgerBtn.classList.toggle('open');
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

/* ── POKÉBALL ── */
const pokeball   = document.getElementById('pokeball');
const pbTop      = document.getElementById('pb-top');
const pbButton   = document.getElementById('pb-button');
const pbCore     = document.getElementById('pb-core');
const lightFlash = document.getElementById('light-flash');
const cartIcon   = document.getElementById('cart-toggle');

function createSparkles(x, y, n = 12) {
  for (let i = 0; i < n; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle';
    const sz = 4 + Math.random() * 6;
    el.style.cssText = `left:${x}px;top:${y}px;background:${COLORS[i%COLORS.length]};width:${sz}px;height:${sz}px;`;
    document.body.appendChild(el);
    const angle = (i/n)*Math.PI*2, dist = 50 + Math.random()*70;
    if (window.gsap) {
      gsap.to(el, { x: Math.cos(angle)*dist, y: Math.sin(angle)*dist, scale:0, opacity:0, duration:.65+Math.random()*.3, ease:'power2.out', onComplete:()=>el.remove() });
    } else setTimeout(()=>el.remove(), 1000);
  }
}

function catchAnimation(imgEl, variantId, btn) {
  if (isAnimating || !pokeball) return;
  isAnimating = true; if (btn) btn.disabled = true;
  const iR = imgEl.getBoundingClientRect();
  const cR = cartIcon ? cartIcon.getBoundingClientRect() : {left:window.innerWidth-50,top:30,width:36,height:36};
  const pbX = iR.left+iR.width/2, pbY = iR.top+iR.height/2;
  const cartX = cR.left+cR.width/2, cartY = cR.top+cR.height/2;
  if (!window.gsap) {
    addToCartAPI(variantId).then(()=>{ refreshCartDrawer(); openCart(); });
    isAnimating=false; if(btn) btn.disabled=false; return;
  }
  gsap.set(pokeball,{left:pbX,top:pbY,scale:0,opacity:0,rotation:0});
  gsap.set(pbTop,{y:0}); gsap.set(pbButton,{background:'white'}); gsap.set(pbCore,{opacity:0,scale:.4});
  const tl = gsap.timeline({onComplete:()=>{isAnimating=false;if(btn)btn.disabled=false;}});
  tl.to(pokeball,{scale:1.1,opacity:1,duration:.22,ease:'back.out(3)'});
  tl.to(pokeball,{scale:1,duration:.08});
  tl.to(pbTop,{y:-32,duration:.2,ease:'power2.out'});
  tl.to(imgEl,{scale:.75,opacity:0,duration:.2,ease:'power2.in'},'<');
  tl.to(pbCore,{opacity:1,scale:1,duration:.2,ease:'power2.out'},'<');
  tl.to(lightFlash,{opacity:.5,duration:.05});
  tl.to(lightFlash,{opacity:0,duration:.1});
  tl.to(pbTop,{y:0,duration:.22,ease:'bounce.out'},'-=.05');
  tl.to(pbCore,{opacity:0,scale:.4,duration:.15},'<');
  tl.to(pbButton,{background:'#FFCB05',duration:.1},'<');
  tl.to(pokeball,{keyframes:[{rotation:-18,duration:.13},{rotation:18,duration:.13},{rotation:-12,duration:.11},{rotation:12,duration:.11},{rotation:0,duration:.09}]});
  tl.add(()=>createSparkles(pbX,pbY,12));
  tl.to(pbButton,{background:'white',duration:.15});
  tl.to(pokeball,{left:cartX,top:cartY,scale:.22,duration:.55,ease:'power3.in',delay:.1});
  tl.to(pokeball,{opacity:0,scale:0,duration:.15});
  tl.add(async ()=>{
    gsap.to(imgEl,{scale:1,opacity:1,duration:.3,ease:'back.out'});
    await addToCartAPI(variantId);
    refreshCartDrawer();
    const badge=document.getElementById('cart-badge');
    if(badge&&window.gsap){
      gsap.fromTo(badge,{scale:2.2},{scale:1,duration:.4,ease:'elastic.out(1.2,.5)'});
      gsap.fromTo(cartIcon,{scale:1.3},{scale:1,duration:.35,ease:'back.out'});
    }
  },'-=.05');
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.card-quick-add');
  if (!btn) return;
  e.stopPropagation();
  const card = btn.closest('.product-card');
  const imgEl = card ? card.querySelector('.card-image') : btn;
  const variantId = btn.dataset.variantId;
  if (variantId) catchAnimation(imgEl, variantId, btn);
});

/* ── GSAP SCROLL ── */
window.addEventListener('load', async () => {
  initHeroBg();
  if (window.MeshoptDecoder) await MeshoptDecoder.ready;
  initThreeJS();
  refreshCartDrawer();
  if (!window.gsap) return;
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });
    gsap.from('.trust-item',{scrollTrigger:{trigger:'.trust-bar',start:'top 90%'},opacity:0,y:20,duration:.45,stagger:.07,ease:'power3.out'});
    gsap.from('.brand-tag',{scrollTrigger:{trigger:'.brands-strip',start:'top 90%'},opacity:0,y:10,duration:.4,stagger:.08,ease:'power2.out'});
    gsap.from('.upsell-banner',{scrollTrigger:{trigger:'.upsell-banner',start:'top 90%'},opacity:0,x:-30,duration:.6,ease:'power2.out'});
    gsap.set('.product-card',{opacity:0,y:40,scale:.95});
    ScrollTrigger.batch('.product-card',{
      onEnter:     b=>gsap.to(b,{opacity:1,y:0,scale:1,duration:.65,stagger:.09,ease:'power3.out',overwrite:true}),
      onLeave:     b=>gsap.to(b,{opacity:0,y:-30,scale:.95,duration:.35,stagger:.05,ease:'power2.in',overwrite:true}),
      onEnterBack: b=>gsap.to(b,{opacity:1,y:0,scale:1,duration:.5,stagger:.09,ease:'power3.out',overwrite:true}),
      onLeaveBack: b=>gsap.to(b,{opacity:0,y:40,scale:.95,duration:.35,stagger:.05,ease:'power2.in',overwrite:true}),
      start:'top 92%',end:'bottom 8%'
    });
    gsap.from('.step',{scrollTrigger:{trigger:'.how-it-works',start:'top 80%'},opacity:0,y:50,duration:.7,stagger:.2,ease:'power3.out'});
    gsap.from('.reassurance-item',{scrollTrigger:{trigger:'.reassurance-band',start:'top 85%'},opacity:0,y:30,duration:.6,stagger:.12,ease:'power3.out'});
    gsap.from('.review-card',{scrollTrigger:{trigger:'.reviews-section',start:'top 85%'},opacity:0,y:25,scale:.97,duration:.55,stagger:.15,ease:'power3.out'});
    gsap.from('.footer-grid > div',{scrollTrigger:{trigger:'.site-footer',start:'top 90%'},opacity:0,y:20,duration:.5,stagger:.1,ease:'power2.out'});
  }
  gsap.from('.section-3d__label,.section-3d__title,.section-3d__desc,.section-3d__stats,.btn-3d-cta',{opacity:0,y:30,duration:.8,stagger:.1,ease:'power3.out',delay:.15});
  gsap.from('.section-3d__canvas-wrap',{opacity:0,x:40,duration:1,ease:'power3.out',delay:.3});
});

/* ── CONSTELLATION ── */
function initHeroBg() {
  const canvas = document.getElementById('hero-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts;
  function resize() { W=canvas.width=window.innerWidth; H=canvas.height=document.documentElement.scrollHeight; canvas.style.height=H+'px'; }
  let mxD=0,myD=0,lmx=0,lmy=0;
  window.addEventListener('mousemove',e=>{mxD=e.clientX-lmx;myD=e.clientY-lmy;lmx=e.clientX;lmy=e.clientY;},{passive:true});
  function spawn(){pts=Array.from({length:130},()=>{const d=.15+Math.random()*.85;return{x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,r:d*2.2,d};});}
  let lastSY=window.scrollY,scrollV=0;
  window.addEventListener('scroll',()=>{scrollV=window.scrollY-lastSY;lastSY=window.scrollY;},{passive:true});
  function frame(){
    requestAnimationFrame(frame);
    ctx.clearRect(0,0,W,H);
    const boost=scrollV*.04;scrollV*=.82;mxD*=.88;myD*=.88;
    pts.forEach(p=>{p.vx+=(-mxD*.004)*p.d;p.vy+=(-myD*.004)*p.d+boost*p.d;p.vx*=.94;p.vy*=.94;p.x+=p.vx;p.y+=p.vy;if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<0)p.y=H;if(p.y>H)p.y=0;});
    const MAX=150;
    for(let i=0;i<pts.length;i++){if(pts[i].d<.4)continue;for(let j=i+1;j<pts.length;j++){if(pts[j].d<.4)continue;const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<MAX){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);const depth=(pts[i].d+pts[j].d)/2;ctx.strokeStyle=`rgba(52,226,196,${(1-dist/MAX)*.22*depth})`;ctx.lineWidth=depth*.8;ctx.stroke();}}}
    pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(52,226,196,${.25+p.d*.5})`;ctx.fill();});
  }
  resize();spawn();frame();
  window.addEventListener('resize',resize);
}

/* ── THREE.JS ── */
function initThreeJS() {
  const canvas = document.getElementById('canvas-3d');
  if (!canvas||!window.THREE) return;
  if (!THREE.GLTFLoader||!THREE.OrbitControls){setTimeout(initThreeJS,100);return;}
  const wrap=canvas.parentElement;
  let W=wrap.clientWidth||600,H=wrap.clientHeight||450;
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,W/H,.1,100);
  camera.position.set(0,.3,5.5);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});
  renderer.setSize(W,H);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.4;
  scene.add(new THREE.AmbientLight(0xffffff,.7));
  const key=new THREE.DirectionalLight(0xffffff,3.5);key.position.set(4,8,6);scene.add(key);
  const fill=new THREE.DirectionalLight(0x99e0ff,1.2);fill.position.set(-5,2,-3);scene.add(fill);
  const rim=new THREE.PointLight(0x34e2c4,5,20);rim.position.set(3,1,3);scene.add(rim);
  const back=new THREE.PointLight(0xc77dff,2.5,16);back.position.set(-2,3,-4);scene.add(back);
  const ctrl=new THREE.OrbitControls(camera,renderer.domElement);
  ctrl.enableDamping=true;ctrl.dampingFactor=.06;ctrl.autoRotate=true;ctrl.autoRotateSpeed=1.8;ctrl.enableZoom=false;ctrl.enablePan=false;
  const pPos=new Float32Array(100*3);for(let i=0;i<pPos.length;i++)pPos[i]=(Math.random()-.5)*14;
  const pGeo=new THREE.BufferGeometry();pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  scene.add(new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x34e2c4,size:.025,transparent:true,opacity:.35})));
  const glbUrl=(window.pvAssets&&window.pvAssets.glb)?window.pvAssets.glb:'eevee-crown.glb';
  const loader=new THREE.GLTFLoader();
  if(window.MeshoptDecoder)loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(glbUrl,gltf=>{
    const m=gltf.scene;
    const box=new THREE.Box3().setFromObject(m);
    m.position.sub(box.getCenter(new THREE.Vector3()));
    const sz=box.getSize(new THREE.Vector3());
    const ts=4.2/Math.max(sz.x,sz.y,sz.z);
    m.scale.setScalar(.001);scene.add(m);
    if(window.gsap){gsap.to(m.scale,{x:ts,y:ts,z:ts,duration:1.2,ease:'elastic.out(1,.5)'});}else{m.scale.setScalar(ts);}
  },undefined,err=>console.error('GLB:',err));
  const clk=new THREE.Clock();
  (function loop(){requestAnimationFrame(loop);const t=clk.getElapsedTime();rim.position.x=Math.sin(t*.5)*4.5;rim.position.z=Math.cos(t*.5)*4.5;back.position.x=Math.cos(t*.35)*3.5;back.position.y=Math.sin(t*.25)*2+2;ctrl.update();renderer.render(scene,camera);})();
  new ResizeObserver(()=>{W=wrap.clientWidth;H=wrap.clientHeight;if(!W||!H)return;camera.aspect=W/H;camera.updateProjectionMatrix();renderer.setSize(W,H);}).observe(wrap);
}
