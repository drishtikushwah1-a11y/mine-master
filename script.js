// All practice content lives here so cards, search, and challenges stay in sync.
const modes = [
  {name:'PvP',difficulty:'Hard',icon:'<path d="m5 19 14-14M12 5l7 7M5 14l5 5M15 4l5 5M4 15l5 5"/>',description:'Practice combat rhythm, combos, evasive movement, and confident fighting skills.',challenges:['Win 3 fights without losing.','Land a 5-hit combo in three rounds.','Win a duel using movement to avoid five hits.','Practice critical hits for two minutes.','Complete three fights without backing into a wall.']},
  {name:'Parkour',difficulty:'Insane',icon:'<path d="M4 18h5v-4h5v-4h6M5 7h4l2 3M7 4v3"/>',description:'Refine difficult jumps, momentum, timing, and movement precision across technical routes.',challenges:['Complete a difficult jump sequence.','Clear ten jumps without stopping.','Finish a route without sprint resets.','Land three edge jumps in a row.','Beat your last parkour time.']},
  {name:'Clutch',difficulty:'Hard',icon:'<path d="M12 3v5M9 5l3 3 3-3M5 12c0 4 3 8 7 8s7-4 7-8c-3 2-5 2-7 0-2 2-4 2-7 0Z"/>',description:'Train water-bucket saves, rapid reactions, and other essential clutch techniques.',challenges:['Complete 5 successful clutch attempts.','Land three water clutches in a row.','Clutch from three different heights.','Recover after a surprise drop.','Complete ten attempts at 70% accuracy.']},
  {name:'Bridging',difficulty:'Medium',icon:'<path d="M3 15h6v5H3zM9 10h6v5H9zM15 5h6v5h-6z"/>',description:'Build consistency in block placement and master multiple bridging techniques.',challenges:['Complete a bridging challenge without falling.','Place 30 blocks at a steady rhythm.','Bridge to a platform under a time limit.','Practice two bridging styles back to back.','Complete three clean bridge runs.']},
  {name:'Aim',difficulty:'Medium',icon:'<circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',description:'Improve crosshair placement, projectile accuracy, tracking, and combat aim.',challenges:['Hit a target challenge consistently.','Land ten projectile hits in a row.','Track a moving target for 30 seconds.','Alternate between five targets without missing.','Reach 80% accuracy over 20 shots.']},
  {name:'Movement',difficulty:'Easy',icon:'<path d="M5 19 19 5M10 5h9v9M4 10v10h10"/>',description:'Sharpen strafing, sprinting, jumping, and total control of your movement.',challenges:['Complete a movement course without stopping.','Strafe around a course without collisions.','Chain ten sprint jumps cleanly.','Finish a route without losing momentum.','Complete a movement lap in under one minute.']}
];

const grid=document.querySelector('#mode-grid'), search=document.querySelector('#mode-search'), empty=document.querySelector('#empty-state');
let activeFilter='all';
function difficultyBars(level){const count={Easy:1,Medium:2,Hard:3,Insane:4}[level];return `${'<i class="on"></i>'.repeat(count)}${'<i></i>'.repeat(4-count)}`}
function renderModes(){
  const term=search.value.trim().toLowerCase();
  const visible=modes.filter(mode=>(activeFilter==='all'||mode.difficulty.toLowerCase()===activeFilter)&&(mode.name.toLowerCase().includes(term)||mode.description.toLowerCase().includes(term)));
  grid.innerHTML=visible.map((mode)=>{const number=String(modes.indexOf(mode)+1).padStart(2,'0');return `<article class="mode-card" data-index="${number}" data-mode="${mode.name}"><div class="mode-icon"><svg viewBox="0 0 24 24" aria-hidden="true">${mode.icon}</svg></div><h3>${mode.name}</h3><p>${mode.description}</p><div class="mode-bottom"><div class="difficulty">Difficulty<span>${difficultyBars(mode.difficulty)} ${mode.difficulty}</span></div><button class="practice-btn" type="button">Practice →</button></div></article>`}).join('');
  empty.hidden=visible.length>0;
}
renderModes();
search.addEventListener('input',renderModes);
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filter.active').classList.remove('active');button.classList.add('active');activeFilter=button.dataset.filter;renderModes()}));

// Challenge controls can generate globally or for a selected practice card.
const panel=document.querySelector('#challenge-panel'), challengeMode=document.querySelector('#challenge-mode'), challengeText=document.querySelector('#challenge-text');
function showChallenge(mode){const challenge=mode.challenges[Math.floor(Math.random()*mode.challenges.length)];challengeMode.textContent=`${mode.name.toUpperCase()} // ${mode.difficulty.toUpperCase()}`;challengeText.textContent=challenge;panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'nearest'});toast(`${mode.name} challenge generated`)}
document.querySelector('#random-challenge').addEventListener('click',()=>showChallenge(modes[Math.floor(Math.random()*modes.length)]));
document.querySelector('#challenge-close').addEventListener('click',()=>panel.hidden=true);
grid.addEventListener('click',event=>{const button=event.target.closest('.practice-btn');if(!button)return;showChallenge(modes.find(mode=>mode.name===button.closest('.mode-card').dataset.mode))});

// Timer uses elapsed timestamps for accuracy even when the browser tab is inactive.
let elapsed=0,startTime=0,timerId=null;
const display=document.querySelector('#timer-display'),status=document.querySelector('#timer-status'),startButton=document.querySelector('#timer-start'),pauseButton=document.querySelector('#timer-pause');
function formatTime(ms){const total=Math.floor(ms/100),tenths=total%10,seconds=Math.floor(total/10)%60,minutes=Math.floor(total/600);return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${tenths}`}
function paintTimer(){const current=timerId?elapsed+(performance.now()-startTime):elapsed;display.textContent=formatTime(current)}
startButton.addEventListener('click',()=>{if(timerId)return;startTime=performance.now();timerId=setInterval(paintTimer,100);status.textContent='RUNNING';startButton.disabled=true;pauseButton.disabled=false;toast('Practice timer started')});
pauseButton.addEventListener('click',()=>{if(!timerId)return;elapsed+=performance.now()-startTime;clearInterval(timerId);timerId=null;paintTimer();status.textContent='PAUSED';startButton.disabled=false;pauseButton.disabled=true;toast('Timer paused')});
document.querySelector('#timer-reset').addEventListener('click',()=>{clearInterval(timerId);timerId=null;elapsed=0;paintTimer();status.textContent='READY';startButton.disabled=false;pauseButton.disabled=true;toast('Timer reset')});
const best=document.querySelector('#personal-best');
function loadBest(){const stored=Number(localStorage.getItem('mineMasterPersonalBest'));best.textContent=stored?formatTime(stored):'—'}
document.querySelector('#save-best').addEventListener('click',()=>{const current=timerId?elapsed+(performance.now()-startTime):elapsed;if(current<100){toast('Run the timer before saving');return}const previous=Number(localStorage.getItem('mineMasterPersonalBest'));if(!previous||current<previous){localStorage.setItem('mineMasterPersonalBest',String(current));loadBest();toast('New personal best saved')}else toast('Keep training — your best is faster')});loadBest();

// Theme choice and navigation state persist across visits.
const root=document.documentElement,themeButton=document.querySelector('.theme-toggle');
function setTheme(theme){root.dataset.theme=theme;localStorage.setItem('mineMasterTheme',theme);themeButton.querySelector('.theme-icon').textContent=theme==='dark'?'☼':'◐';themeButton.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} theme`)}
setTheme(localStorage.getItem('mineMasterTheme')||'dark');themeButton.addEventListener('click',()=>{setTheme(root.dataset.theme==='dark'?'light':'dark');toast(`${root.dataset.theme==='dark'?'Dark':'Light'} theme active`)});
const menuButton=document.querySelector('.menu-toggle'),navLinks=document.querySelector('.nav-links');
menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Close menu':'Open menu')});
navLinks.addEventListener('click',event=>{if(event.target.matches('a')){navLinks.classList.remove('open');menuButton.setAttribute('aria-expanded','false')}});

// Highlight the current section while scrolling and reveal content once.
const sections=document.querySelectorAll('main section[id]');
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.nav-links a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`))}}),{rootMargin:'-35% 0px -55%'});sections.forEach(section=>sectionObserver.observe(section));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(item=>revealObserver.observe(item));
let toastTimeout;function toast(message){const element=document.querySelector('#toast');element.textContent=message;element.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>element.classList.remove('show'),2400)}
document.querySelectorAll('.download-placeholder').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();toast('World download link is coming soon')}));
document.querySelectorAll('[data-coming]').forEach(button=>button.addEventListener('click',()=>toast(`${button.dataset.coming} link is coming soon`)));
document.querySelector('#year').textContent=new Date().getFullYear();
