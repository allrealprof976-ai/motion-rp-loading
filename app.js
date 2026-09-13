// Motion RP V7: clean YouTube player, no playlist box, previous/next switching, animated reactive visuals.
const TRACKS = [
  { id: '0ftgAyfFUMc', title: 'TRACK 01' },
  { id: 'vyxSJr_CC60', title: 'TRACK 02' },
  { id: 'kQnDpRtRrEc', title: 'TRACK 03' },
  { id: 'NweMRU8uNko', title: 'TRACK 04' },
  { id: 'tgA-wVkuZGo', title: 'TRACK 05' },
  { id: 'Ty-CHgmCeKw', title: 'TRACK 06' },
  { id: 'CnT6NRiTz9M', title: 'TRACK 07' },
  { id: 'OFlilpsRuMg', title: 'TRACK 08' },
  { id: 'g0v7Ow6Epog', title: 'TRACK 09' },
  { id: 'YpxzPXaYyM4', title: 'TRACK 10' },
  { id: 'vMxOz_6gWOE', title: 'TRACK 11' },
  { id: 'tBKYI3-3lMg', title: 'TRACK 12' },
  { id: '5IqLJA8unvA', title: 'TRACK 13' },
  { id: 'CFmikQCo_h4', title: 'TRACK 14' },
  { id: 'Us9BEYzqbXU', title: 'TRACK 15' },
  { id: 'LSik3Jdnhkw', title: 'TRACK 16' },
  { id: 'lbWLy08udII', title: 'TRACK 17' },
  { id: 'k-UABoxsk5w', title: 'TRACK 18' },
  { id: 'QinT9kMh4Sc', title: 'TRACK 19' },
  { id: 'cExgrHIfHUA', title: 'TRACK 20' },
  { id: '117XLL2S-Mk', title: 'TRACK 21' },
  { id: '85d_mgHjt58', title: 'TRACK 22' },
  { id: 'D49adOjVNcs', title: 'TRACK 23' },
  { id: 'oro2A3UwlmA', title: 'TRACK 24' },
  { id: 'YYEETzzqFiM', title: 'TRACK 25' },
  { id: 'b0Zm3DOoJn8', title: 'TRACK 26' },
  { id: 'lehtwEA9IU4', title: 'TRACK 27' }
];

const EMBED_BASE = 'https://www.youtube.com/embed/';
let currentIndex = 0;
let muted = true;
let playing = false;
let frameReady = false;
let lastProgress = 0;
let fallback = 0;

const iframe = document.getElementById('youtubeVideo');
const trackTitle = document.getElementById('trackTitle');
const playerTrack = document.getElementById('playerTrack');
const trackCount = document.getElementById('trackCount');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volume = document.getElementById('volume');
const volText = document.getElementById('volText');
const status = document.getElementById('status');
const videoLoading = document.getElementById('videoLoading');
const hint = document.getElementById('hint');
const reactiveStrip = document.getElementById('reactiveStrip');
const heroEq = document.getElementById('heroEq');
const videoCard = document.getElementById('videoCard');
const ambientPulse = document.getElementById('ambientPulse');
const playerLabel = document.getElementById('playerLabel');
const videoStatus = document.getElementById('videoStatus');
const bar = document.getElementById('barFill');
const percent = document.getElementById('percent');
const steps = [document.getElementById('s1'), document.getElementById('s2'), document.getElementById('s3'), document.getElementById('s4')];

for (let i=0;i<48;i++){ const s=document.createElement('span'); s.className='reactive-bar'; reactiveStrip.appendChild(s); }
for (let i=0;i<36;i++){ const s=document.createElement('i'); heroEq.appendChild(s); }
const reactiveBars=[...reactiveStrip.children], heroBars=[...heroEq.children];

function pad(n){return String(n+1).padStart(2,'0');}
function videoUrl(id){
  return `${EMBED_BASE}${id}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&origin=https%3A%2F%2Fallrealprof976-ai.github.io&widget_referrer=https%3A%2F%2Fallrealprof976-ai.github.io`;
}
function sendCommand(func,args=[]){ if(iframe.contentWindow) iframe.contentWindow.postMessage(JSON.stringify({event:'command',func,args}),'*'); }
function updateUI(){
  const t=TRACKS[currentIndex];
  trackTitle.textContent=t.title; playerTrack.textContent=t.title; trackCount.textContent=`${pad(currentIndex)} / ${TRACKS.length}`;
  muteBtn.textContent=muted?'🔇':'🔊'; playBtn.textContent=playing?'Ⅱ':'▶';
}
function loadTrack(index,user=false){
  currentIndex=(index+TRACKS.length)%TRACKS.length; frameReady=false; playing=false; muted=true;
  videoLoading.style.display='flex'; videoStatus.textContent='LOADING'; playerLabel.textContent='SWITCHING';
  hint.textContent=user?'VIDEO CHANGED — CLICK 🔊 FOR AUDIO':'VIDEO STARTS MUTED — CLICK 🔊 FOR AUDIO';
  status.textContent=`LOADING ${TRACKS[currentIndex].title}...`;
  videoCard.classList.remove('switching'); void videoCard.offsetWidth; videoCard.classList.add('switching');
  iframe.src=videoUrl(TRACKS[currentIndex].id); updateUI();
}
iframe.addEventListener('load',()=>{
  frameReady=true; videoLoading.style.display='none'; videoStatus.textContent='MOTION AUDIO'; playerLabel.textContent='PLAYING';
  sendCommand('mute'); sendCommand('setVolume',[Number(volume.value)]); sendCommand('playVideo');
  playing=true; muted=true; status.textContent=`MOTION CITY • ${TRACKS[currentIndex].title} • HD AUTO`; updateUI();
});
playBtn.addEventListener('click',()=>{ if(!frameReady)return; if(playing){sendCommand('pauseVideo');playing=false;playerLabel.textContent='PAUSED';status.textContent=`MOTION CITY • ${TRACKS[currentIndex].title} PAUSED`;}else{sendCommand('playVideo');playing=true;playerLabel.textContent='PLAYING';status.textContent=`MOTION CITY • ${TRACKS[currentIndex].title} PLAYING`;} updateUI();});
muteBtn.addEventListener('click',()=>{if(!frameReady)return;if(muted){sendCommand('unMute');sendCommand('setVolume',[Number(volume.value)]);muted=false;hint.textContent='AUDIO ON • VOLUME CONTROL ACTIVE';status.textContent='MOTION CITY • AUDIO ON';}else{sendCommand('mute');muted=true;hint.textContent='VIDEO PLAYING MUTED';status.textContent='MOTION CITY • AUDIO MUTED';}updateUI();});
volume.addEventListener('input',()=>{const v=Number(volume.value);volText.textContent=`${v}%`;sendCommand('setVolume',[v]);if(v===0){sendCommand('mute');muted=true;}else if(!muted){sendCommand('unMute');}updateUI();});
prevBtn.addEventListener('click',()=>loadTrack(currentIndex-1,true));
nextBtn.addEventListener('click',()=>loadTrack(currentIndex+1,true));

function animateReactive(now){
  const t=now/170; const boost=playing?(muted?0.72:1.0):0.28;
  reactiveBars.forEach((b,i)=>{const wave=(Math.sin(t+i*0.62)+Math.sin(t*0.61+i*0.19)+2)/4; const h=10+wave*(82-(i%7)*5)*boost; b.style.height=`${Math.max(8,Math.min(94,h))}%`;});
  heroBars.forEach((b,i)=>{const wave=(Math.sin(t*1.18+i*.34)+Math.sin(t*.57+i*.77)+2)/4; b.style.height=`${8+wave*(playing?88:32)}%`;});
  const pulse=playing?(0.18+0.12*((Math.sin(t*.95)+1)/2)):.08; ambientPulse.style.opacity=pulse.toFixed(2);
  videoCard.style.setProperty('--pulse', (0.12+0.1*((Math.sin(t*.9)+1)/2)).toFixed(3));
  requestAnimationFrame(animateReactive);
}
requestAnimationFrame(animateReactive);

function setProgress(v){
  v=Math.max(0,Math.min(100,Math.round(v))); lastProgress=v; bar.style.width=v+'%'; percent.textContent=v+'%';
  const thresholds=[0,25,55,80]; const labels=['INITIALIZING','LOADING ASSETS','STARTING SCRIPTS','ENTERING MOTION CITY'];
  steps.forEach((s,i)=>{s.classList.remove('active','done');if(v>=thresholds[i]+25&&i<3){s.classList.add('done');s.textContent='✓ '+labels[i];}else if(v>=thresholds[i]){s.classList.add('active');s.textContent='◉ '+labels[i];}else s.textContent='○ '+labels[i];});
}
window.addEventListener('message',e=>{if(e.data?.eventName==='loadProgress'){const v=(e.data.loadFraction||0)*100;fallback=v;setProgress(v);}});
setInterval(()=>{
  if(lastProgress<100){
    // Keep the line visibly moving even if FiveM does not emit progress events to the hosted page.
    fallback=Math.min(96, Math.max(fallback,lastProgress)+0.8+Math.random()*1.8);
    setProgress(fallback);
  }
},500);
render();
function render(){loadTrack(0,false);}
