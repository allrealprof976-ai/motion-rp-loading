// Motion RP V10 - animated loading screen with visible YouTube player, auto-next, and real FiveM progress.
const TRACKS = [
  { id: '0ftgAyfFUMc', title: 'TRACK 01' }, { id: 'vyxSJr_CC60', title: 'TRACK 02' }, { id: 'kQnDpRtRrEc', title: 'TRACK 03' },
  { id: 'NweMRU8uNko', title: 'TRACK 04' }, { id: 'tgA-wVkuZGo', title: 'TRACK 05' }, { id: 'Ty-CHgmCeKw', title: 'TRACK 06' },
  { id: 'CnT6NRiTz9M', title: 'TRACK 07' }, { id: 'OFlilpsRuMg', title: 'TRACK 08' }, { id: 'g0v7Ow6Epog', title: 'TRACK 09' },
  { id: 'YpxzPXaYyM4', title: 'TRACK 10' }, { id: 'vMxOz_6gWOE', title: 'TRACK 11' }, { id: 'tBKYI3-3lMg', title: 'TRACK 12' },
  { id: '5IqLJA8unvA', title: 'TRACK 13' }, { id: 'CFmikQCo_h4', title: 'TRACK 14' }, { id: 'Us9BEYzqbXU', title: 'TRACK 15' },
  { id: 'LSik3Jdnhkw', title: 'TRACK 16' }, { id: 'lbWLy08udII', title: 'TRACK 17' }, { id: 'k-UABoxsk5w', title: 'TRACK 18' },
  { id: 'QinT9kMh4Sc', title: 'TRACK 19' }, { id: 'cExgrHIfHUA', title: 'TRACK 20' }, { id: '117XLL2S-Mk', title: 'TRACK 21' },
  { id: '85d_mgHjt58', title: 'TRACK 22' }, { id: 'D49adOjVNcs', title: 'TRACK 23' }, { id: 'oro2A3UwlmA', title: 'TRACK 24' },
  { id: 'YYEETzzqFiM', title: 'TRACK 25' }, { id: 'b0Zm3DOoJn8', title: 'TRACK 26' }, { id: 'lehtwEA9IU4', title: 'TRACK 27' }
];
const YT_ORIGIN = 'https://allrealprof976-ai.github.io';
let currentIndex = 0, player = null, playerReady = false, playing = false, muted = true, fallbackProgress = 0, lastFiveMProgress = 0;
const $ = id => document.getElementById(id);
const playBtn = $('playBtn'), muteBtn = $('muteBtn'), prevBtn = $('prevBtn'), nextBtn = $('nextBtn'), volume = $('volume'), volText = $('volText');
const trackTitle = $('trackTitle'), trackCount = $('trackCount'), status = $('status'), bar = $('barFill'), percent = $('percent');
const steps = [$('s1'), $('s2'), $('s3'), $('s4')];

function setProgress(v) {
  v = Math.max(0, Math.min(100, Math.round(v)));
  lastFiveMProgress = v;
  bar.style.width = `${v}%`;
  percent.textContent = `${v}%`;
  const marks = [0,25,55,80];
  const labels = ['INITIALIZING','LOADING ASSETS','STARTING SCRIPTS','ENTERING MOTION CITY'];
  steps.forEach((s, i) => {
    s.classList.remove('active','done');
    if (v >= marks[i] + 25 && i < 3) { s.classList.add('done'); s.textContent = `✓ ${labels[i]}`; }
    else if (v >= marks[i]) { s.classList.add('active'); s.textContent = `◉ ${labels[i]}`; }
    else { s.textContent = `○ ${labels[i]}`; }
  });
}

function updateTrackUI() {
  const t = TRACKS[currentIndex];
  trackTitle.textContent = t.title;
  trackCount.textContent = `${String(currentIndex+1).padStart(2,'0')} / ${String(TRACKS.length).padStart(2,'0')}`;
  status.textContent = `MOTION CITY • ${t.title}`;
}

function setButtons() {
  playBtn.textContent = playing ? 'Ⅱ' : '▶';
  muteBtn.textContent = muted ? '🔇' : '🔊';
}

function playSelected() {
  if (!playerReady || !player) return;
  try {
    player.mute();
    muted = true;
    player.setVolume(Number(volume.value));
    player.playVideo();
    playing = true;
    setButtons();
  } catch (_) {}
}

function loadTrack(index, autoplay=true) {
  currentIndex = (index + TRACKS.length) % TRACKS.length;
  updateTrackUI();
  if (!playerReady || !player) return;
  try {
    player.loadVideoById({ videoId: TRACKS[currentIndex].id, startSeconds: 0 });
    if (autoplay) playSelected();
  } catch (_) {}
}

window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player('youtubePlayer', {
    width: '100%', height: '100%', videoId: TRACKS[0].id,
    playerVars: {
      autoplay: 1, controls: 1, playsinline: 1, rel: 0, modestbranding: 1,
      iv_load_policy: 3, origin: YT_ORIGIN, enablejsapi: 1, fs: 1,
      vq: 'hd1080'
    },
    events: {
      onReady: e => {
        playerReady = true;
        e.target.mute();
        muted = true;
        e.target.setVolume(Number(volume.value));
        e.target.playVideo();
        playing = true;
        updateTrackUI();
        setButtons();
      },
      onStateChange: e => {
        if (e.data === YT.PlayerState.PLAYING) playing = true;
        else if (e.data === YT.PlayerState.PAUSED) playing = false;
        else if (e.data === YT.PlayerState.ENDED) loadTrack(currentIndex + 1, true);
        setButtons();
      },
      onError: () => {
        status.textContent = 'VIDEO UNAVAILABLE • SKIPPING';
        setTimeout(() => loadTrack(currentIndex + 1, true), 650);
      }
    }
  });
};

playBtn.addEventListener('click', () => {
  if (!playerReady || !player) return;
  if (playing) player.pauseVideo(); else playSelected();
});
muteBtn.addEventListener('click', () => {
  if (!playerReady || !player) return;
  if (muted) { player.unMute(); player.setVolume(Number(volume.value)); muted = false; }
  else { player.mute(); muted = true; }
  setButtons();
});
volume.addEventListener('input', () => {
  const v = Number(volume.value); volText.textContent = `${v}%`;
  if (playerReady && player) {
    player.setVolume(v);
    if (v === 0) { player.mute(); muted = true; }
  }
  setButtons();
});
prevBtn.addEventListener('click', () => loadTrack(currentIndex - 1, true));
nextBtn.addEventListener('click', () => loadTrack(currentIndex + 1, true));

window.addEventListener('message', e => {
  if (e.data?.eventName === 'loadProgress') {
    const v = (Number(e.data.loadFraction) || 0) * 100;
    fallbackProgress = Math.max(fallbackProgress, v);
    setProgress(v);
  }
});

// Keep a visible, moving progress indicator during hosted loading; real FiveM loadProgress takes precedence.
setInterval(() => {
  if (lastFiveMProgress >= 100) return;
  fallbackProgress = Math.min(97, Math.max(fallbackProgress, lastFiveMProgress) + 0.55 + Math.random()*1.65);
  setProgress(fallbackProgress);
}, 420);

// Animated atmospheric particles. No canvas or external assets required.
const field = $('particles');
for (let i=0;i<42;i++) {
  const p = document.createElement('span');
  p.style.left = `${Math.random()*100}%`;
  p.style.animationDelay = `${-Math.random()*12}s`;
  p.style.animationDuration = `${9 + Math.random()*12}s`;
  p.style.opacity = `${0.15 + Math.random()*0.65}`;
  const size = 1 + Math.random()*2;
  p.style.width = `${size}px`; p.style.height = `${size}px`;
  field.appendChild(p);
}

updateTrackUI();
setButtons();
const api = document.createElement('script');
api.src = 'https://www.youtube.com/iframe_api';
document.head.appendChild(api);
