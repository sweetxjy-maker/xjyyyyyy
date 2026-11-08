const aboutPhotos={
  daily:{src:"assets/about-daily.jpg",alt:"邢甲一的日常照片",label:"Daily 照片"},
  model:{src:"assets/about-model.jpg",alt:"邢甲一的模特照片",label:"Model 照片"},
  game:{src:"assets/about-game.jpg",alt:"邢甲一玩游戏的照片",label:"Game 照片"}
};
const aboutTabs=[...document.querySelectorAll(".about-tab")];
const aboutPortrait=document.querySelector("#about-portrait .portrait");
const aboutPortraitFrame=document.querySelector("#about-portrait");
Object.values(aboutPhotos).forEach(photo=>{const image=new Image();image.src=photo.src});
function selectAboutPhoto(tab){
  aboutTabs.forEach(item=>{const active=item===tab;item.classList.toggle("active",active);item.setAttribute("aria-selected",String(active));item.tabIndex=active?0:-1});
  const photo=aboutPhotos[tab.dataset.photo];
  aboutPortrait.src=photo.src;
  aboutPortrait.alt=photo.alt;
  aboutPortraitFrame.setAttribute("aria-label",photo.label);
}
aboutTabs.forEach((tab,index)=>{
  tab.addEventListener("click",()=>selectAboutPhoto(tab));
  tab.addEventListener("keydown",event=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    const next=event.key==="Home"?0:event.key==="End"?aboutTabs.length-1:(index+(event.key==="ArrowRight"?1:-1)+aboutTabs.length)%aboutTabs.length;
    selectAboutPhoto(aboutTabs[next]);aboutTabs[next].focus();
  });
});
aboutTabs.forEach((tab,index)=>{tab.tabIndex=index===0?0:-1});

const toast=document.querySelector(".toast");
let toastTimer;
document.querySelectorAll("[data-copy]").forEach(button=>button.addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText(button.dataset.copy);toast.textContent="微信号已复制"}
  catch{toast.textContent=button.dataset.copy}
  toast.classList.add("show");window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>toast.classList.remove("show"),1800);
}));

const menuButton=document.querySelector(".menu-toggle");
const nav=document.querySelector(".main-nav");
menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open))});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false")}));

const sections=[...document.querySelectorAll("main section[id]")];
const links=[...document.querySelectorAll(".main-nav a")];
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  links.forEach(link=>link.classList.toggle("active",link.hash===`#${entry.target.id}`));
}),{rootMargin:"-35% 0px -58% 0px"});
sections.forEach(section=>observer.observe(section));

document.querySelectorAll(".hero-pixels,.contact-pixels").forEach(pixelCanvas=>{
  const surface=pixelCanvas.closest(".hero,.contact");
  const context=pixelCanvas.getContext("2d");
  const motionAllowed=window.matchMedia("(min-width: 1001px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  const colors=["#6199ED","#49B9F3","#5DEB78","#1CCA64","#B68AFA","#ED932F"];
  const pixels=[];
  let previous=null;
  let animationFrame=0;
  let canvasWidth=0;
  let canvasHeight=0;

  function resizePixels(){
    const bounds=pixelCanvas.getBoundingClientRect();
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvasWidth=bounds.width;
    canvasHeight=bounds.height;
    pixelCanvas.width=Math.round(canvasWidth*ratio);
    pixelCanvas.height=Math.round(canvasHeight*ratio);
    context.setTransform(ratio,0,0,ratio,0,0);
    pixels.length=0;
    previous=null;
  }
  function addPixel(x,y,time){
    const size=Math.random()<.22?9:15;
    const grid=18;
    pixels.push({
      x:Math.round((x+(Math.random()-.5)*9)/grid)*grid,
      y:Math.round((y+(Math.random()-.5)*9)/grid)*grid,
      size,
      color:colors[Math.floor(Math.random()*colors.length)],
      born:time,
      life:1000+Math.random()*450
    });
    if(pixels.length>170)pixels.splice(0,pixels.length-170);
  }
  function drawPixels(time){
    context.clearRect(0,0,canvasWidth,canvasHeight);
    for(let i=pixels.length-1;i>=0;i--){
      const pixel=pixels[i];
      const progress=(time-pixel.born)/pixel.life;
      if(progress>=1){pixels.splice(i,1);continue}
      const visibility=Math.min(1,.48+pixel.x/canvasWidth*.65);
      context.globalAlpha=Math.pow(1-progress,1.5)*.92*visibility;
      context.fillStyle=pixel.color;
      context.fillRect(pixel.x,pixel.y,pixel.size,pixel.size);
    }
    context.globalAlpha=1;
    animationFrame=pixels.length?requestAnimationFrame(drawPixels):0;
  }
  function onSurfaceMove(event){
    if(!motionAllowed.matches||event.pointerType!=="mouse")return;
    const bounds=pixelCanvas.getBoundingClientRect();
    const x=event.clientX-bounds.left;
    const y=event.clientY-bounds.top;
    if(x<0||y<0||x>canvasWidth||y>canvasHeight){previous=null;return}
    const time=performance.now();
    if(previous){
      const distance=Math.hypot(x-previous.x,y-previous.y);
      const steps=Math.min(Math.floor(distance/12),24);
      for(let step=1;step<=steps;step++){
        const fraction=step/(steps+1);
        addPixel(previous.x+(x-previous.x)*fraction,previous.y+(y-previous.y)*fraction,time);
      }
    }
    addPixel(x,y,time);
    if(Math.random()<.45)addPixel(x+17,y-17,time);
    previous={x,y};
    if(!animationFrame)animationFrame=requestAnimationFrame(drawPixels);
  }
  const resizeObserver=new ResizeObserver(resizePixels);
  resizeObserver.observe(pixelCanvas);
  surface.addEventListener("pointermove",onSurfaceMove,{passive:true});
  surface.addEventListener("pointerleave",()=>{previous=null});
  motionAllowed.addEventListener("change",()=>{previous=null;resizePixels()});
});


(() => {
  const section = document.querySelector('.keywords-section');
  const lanesHost = document.getElementById('keyword-lanes');
  const finale = document.getElementById('keywords-finale');
  const replay = document.getElementById('keywords-replay');
  const canvas = document.getElementById('keywords-fireworks');
  if (!section || !lanesHost || !finale || !replay || !canvas) return;

  const lanes = [
    ['UI Design', 'UX Design', 'Interaction Design', 'Visual Design', 'Motion Design', 'Design System', 'AI Experience', 'Multimodal Interaction', 'Voice Interaction', 'Human–AI Interaction', 'Robot Experience'],
    ['HMI Design', 'Automotive HMI', 'Emotional Design', 'User Research', 'Information Architecture', 'Prototyping', 'Usability Testing', 'Curiosity', 'Empathy', 'Attention to Detail', 'Explore & Learn']
  ];
  const tones = ['tone-blue-light', 'tone-mint', 'tone-lemon', 'tone-peach', 'tone-pink', 'tone-lilac', 'tone-blue', 'tone-sky', 'tone-white'];
  const iconShapes = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
    path: '<path d="M4 18c2-5 5-2 7-8s5-7 9-4"/><path d="m16 4 4 2-1 4"/><circle cx="4" cy="18" r="1.5"/>',
    sparkle: '<path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z"/>',
    wave: '<path d="M2 8c3-4 5 4 8 0s5 4 8 0 4 0 4 0M2 16c3-4 5 4 8 0s5 4 8 0 4 0 4 0"/>',
    nodes: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7 7 4 9M17 7l-4 9M7 6h10"/>',
    voice: '<path d="M12 3v11m-4-7v4m8-5v6M5 10c0 5 3 8 7 8s7-3 7-8M12 18v3m-4 0h8"/>',
    heart: '<path d="M20.5 8.5c0 5-8.5 11-8.5 11s-8.5-6-8.5-11a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2Z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    cursor: '<path d="M4 3 20 12l-7 1-3 7-6-17Z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
    arrow: '<path d="M3 12h17m-6-6 6 6-6 6"/>'
  };
  const iconTypes = ['grid','target','path','sparkle','wave','grid','sparkle','nodes','voice','nodes','heart','grid','path','heart','search','nodes','cursor','check','sparkle','heart','target','arrow'];
  const total = lanes.flat().length;
  const collected = new Set();
  const pending = new Set();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let fireworkFrame = 0;
  let fireworkTimer = 0;
  let resizeTimer = 0;

  function makeChip(word, index, duplicate) {
    const chip = document.createElement(duplicate ? 'span' : 'button');
    if (!duplicate) chip.type = 'button';
    chip.className = `keyword-chip ${tones[index % tones.length]}`;
    const label = document.createElement('span');
    label.className = 'keyword-label';
    label.textContent = word;
    const icon = document.createElement('span');
    icon.className = 'keyword-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${iconShapes[iconTypes[index]]}</svg>`;
    chip.append(label, icon);
    chip.dataset.key = word;
    if (duplicate) chip.setAttribute('aria-hidden', 'true');
    else chip.setAttribute('aria-label', `收集关键词 ${word}`);
    return chip;
  }

  function appendWords(set, words, duplicate) {
    words.forEach(word => {
      const index = lanes.flat().indexOf(word);
      set.append(makeChip(word, index, duplicate));
    });
  }

  function buildLane(lane, laneIndex) {
    const el = lanesHost.children[laneIndex];
    const track = el.querySelector('.keyword-track');
    const remaining = lane.filter(word => !collected.has(word));
    track.replaceChildren();
    if (!remaining.length) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    const first = document.createElement('div');
    first.className = 'keyword-set';
    appendWords(first, remaining, false);
    track.append(first);
    const distance = first.getBoundingClientRect().width;
    track.style.setProperty('--loop-distance', `${distance}px`);
    const repeats = reduced.matches ? 0 : Math.max(2, Math.ceil(el.clientWidth / Math.max(distance, 1)) + 2);
    for (let n = 0; n < repeats; n++) {
      const copy = document.createElement('div');
      copy.className = 'keyword-set is-duplicate';
      copy.setAttribute('aria-hidden', 'true');
      appendWords(copy, remaining, true);
      track.append(copy);
    }
  }

  function buildAll() {
    lanesHost.replaceChildren();
    lanes.forEach((lane, index) => {
      const viewport = document.createElement('div');
      viewport.className = 'keyword-lane';
      viewport.style.setProperty('--lane-duration', `${[48, 54][index]}s`);
      viewport.innerHTML = '<div class="keyword-track"></div>';
      lanesHost.append(viewport);
      buildLane(lane, index);
    });
  }

  function stopFireworks() {
    cancelAnimationFrame(fireworkFrame);
    clearTimeout(fireworkTimer);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function showFinale() {
    section.classList.add('is-complete');
    finale.hidden = false;
    replay.hidden = true;
    if (reduced.matches) {
      replay.hidden = false;
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      replay.hidden = false;
      return;
    }
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * ratio);
    canvas.height = Math.round(bounds.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const colors = ['#6199ed', '#9c79ef', '#f6ae6b', '#f5a6d4', '#9eeac6', '#e6e96d'];
    const centerX = bounds.width / 2;
    const centerY = Math.min(bounds.height * .58, 230);
    const particles = Array.from({length: 72}, (_, i) => {
      const angle = i * 2.39996;
      const speed = 1.7 + (i % 7) * .37;
      return {x:centerX + ((i % 3) - 1) * 54, y:centerY, vx:Math.cos(angle) * speed, vy:Math.sin(angle) * speed - 1.1, color:colors[i % colors.length], size:2.5 + i % 3};
    });
    const start = performance.now();
    function draw(now) {
      const elapsed = now - start;
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.globalAlpha = Math.max(0, 1 - elapsed / 1300);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += .055;
        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, p.size, p.size);
      });
      if (elapsed < 1300) fireworkFrame = requestAnimationFrame(draw);
      else context.clearRect(0, 0, bounds.width, bounds.height);
    }
    fireworkFrame = requestAnimationFrame(draw);
    fireworkTimer = setTimeout(() => { replay.hidden = false; }, 1350);
  }

  lanesHost.addEventListener('click', event => {
    const chip = event.target.closest('.keyword-chip');
    if (!chip || !lanesHost.contains(chip)) return;
    const word = chip.dataset.key;
    if (collected.has(word) || pending.has(word)) return;
    pending.add(word);
    lanesHost.querySelectorAll('.keyword-chip').forEach(item => {
      if (item.dataset.key === word) item.classList.add('is-vanishing');
    });
    const remove = () => {
      collected.add(word);
      pending.delete(word);
      if (collected.size === total) showFinale();
      else buildLane(lanes.find(group => group.includes(word)), lanes.findIndex(group => group.includes(word)));
    };
    if (reduced.matches) remove();
    else setTimeout(remove, 380);
  });

  replay.addEventListener('click', () => {
    stopFireworks();
    collected.clear();
    pending.clear();
    finale.hidden = true;
    replay.hidden = true;
    section.classList.remove('is-complete');
    buildAll();
  });

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (!section.classList.contains('is-complete')) lanes.forEach(buildLane);
    }, 180);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      if (section.classList.contains('is-complete')) { stopFireworks(); replay.hidden = false; }
    }
    if (!section.classList.contains('is-complete')) lanes.forEach(buildLane);
  });

  buildAll();
})();
