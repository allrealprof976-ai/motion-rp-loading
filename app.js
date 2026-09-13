// Motion RP multi-video YouTube loading screen.
// These are the 27 YouTube videos supplied by the server owner.
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
  { id: 'lehtwEA9IU4', title: 'TRACK 27' },
];

const EMBED_BASE = 'https://www.youtube.com/embed/';
let currentIndex = 0;
let muted = true;
let playing = false;
let frameReady = false;

const iframe = document.getElementById('youtubeVideo');
const trackTitle = document.getElementById('trackTitle');
const trackCount = document.getElementById('trackCount');
const playlist = document.getElementById('playlist');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volume = document.getElementById('volume');
const volText = document.getElementById('volText');
const status = document.getElementById('status');
const videoLoading = document.getElementById('videoLoading');
const hint = document.getElementById('hint');

function pad(n) { return String(n + 1).padStart(2, '0'); }

function videoUrl(id) {
  return `${EMBED_BASE}${id}?autoplay=1&mute=1&controls=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&origin=https%3A%2F%2Fcfx-nui-motion_rp_v1&widget_referrer=https%3A%2F%2Fcfx-nui-motion_rp_v1`;
}

function sendCommand(func, args = []) {
  if (!iframe.contentWindow) return;
  iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
}

function renderPlaylist() {
  playlist.innerHTML = '';
  TRACKS.forEach((track, i) => {
    const b = document.createElement('button');
    b.className = 'track-btn' + (i === currentIndex ? ' active' : '');
    b.textContent = pad(i) + '  ' + track.title;
    b.addEventListener('click', () => loadTrack(i, true));
    playlist.appendChild(b);
  });
}

function updateUI() {
  const track = TRACKS[currentIndex];
  trackTitle.textContent = track.title;
  trackCount.textContent = `${pad(currentIndex)} / ${TRACKS.length}`;
  muteBtn.textContent = muted ? '🔇' : '🔊';
  playBtn.textContent = playing ? 'Ⅱ' : '▶';
  document.querySelectorAll('.track-btn').forEach((b, i) => b.classList.toggle('active', i === currentIndex));
}

function loadTrack(index, userInitiated = false) {
  currentIndex = (index + TRACKS.length) % TRACKS.length;
  const id = TRACKS[currentIndex].id;
  frameReady = false;
  playing = false;
  muted = true;
  videoLoading.style.display = 'flex';
  hint.textContent = userInitiated ? 'VIDEO CHANGED — CLICK 🔊 FOR AUDIO' : 'VIDEO AUTOPLAYS MUTED — CLICK 🔊 FOR AUDIO';
  status.textContent = `LOADING ${TRACKS[currentIndex].title}...`;
  iframe.src = videoUrl(id);
  updateUI();
}

iframe.addEventListener('load', () => {
  frameReady = true;
  videoLoading.style.display = 'none';
  // Start muted for autoplay compatibility.
  sendCommand('mute');
  sendCommand('setVolume', [Number(volume.value)]);
  sendCommand('playVideo');
  playing = true;
  muted = true;
  status.textContent = `MOTION CITY • ${TRACKS[currentIndex].title} • HD AUTO`;
  updateUI();
});

playBtn.addEventListener('click', () => {
  if (!frameReady) return;
  if (playing) {
    sendCommand('pauseVideo');
    playing = false;
    status.textContent = `MOTION CITY • ${TRACKS[currentIndex].title} PAUSED`;
  } else {
    sendCommand('playVideo');
    playing = true;
    status.textContent = `MOTION CITY • ${TRACKS[currentIndex].title} PLAYING`;
  }
  updateUI();
});

muteBtn.addEventListener('click', () => {
  if (!frameReady) return;
  if (muted) {
    sendCommand('unMute');
    sendCommand('setVolume', [Number(volume.value)]);
    muted = false;
    status.textContent = 'MOTION CITY • AUDIO ON';
    hint.textContent = 'AUDIO ON • USE THE SLIDER TO ADJUST VOLUME';
  } else {
    sendCommand('mute');
    muted = true;
    status.textContent = 'MOTION CITY • AUDIO MUTED';
    hint.textContent = 'VIDEO PLAYING MUTED';
  }
  updateUI();
});

volume.addEventListener('input', () => {
  const v = Number(volume.value);
  volText.textContent = `${v}%`;
  sendCommand('setVolume', [v]);
  if (v === 0) {
    sendCommand('mute');
    muted = true;
  } else if (!muted) {
    sendCommand('unMute');
  }
  updateUI();
});

prevBtn.addEventListener('click', () => loadTrack(currentIndex - 1, true));
nextBtn.addEventListener('click', () => loadTrack(currentIndex + 1, true));

window.addEventListener('message', (e) => {
  if (typeof e.data !== 'string') return;
  try {
    const data = JSON.parse(e.data);
    if (data.event === 'onAutoplayBlocked') {
      playing = false;
      playBtn.textContent = '▶';
      status.textContent = 'CLICK ▶ TO PLAY VIDEO';
    }
  } catch (_) {}
});

// FiveM load progress.
let fake = 0;
let fallbackTimer;
const bar = document.getElementById('barFill');
const percent = document.getElementById('percent');
const steps = [document.getElementById('s1'), document.getElementById('s2'), document.getElementById('s3'), document.getElementById('s4')];

function setProgress(v) {
  v = Math.max(0, Math.min(100, Math.round(v)));
  bar.style.width = v + '%';
  percent.textContent = v + '%';
  const labels = [[0,'CONNECTING TO MOTION CITY...'],[25,'LOADING ASSETS...'],[55,'STARTING SCRIPTS...'],[80,'FINALIZING CITY...'],[100,'WELCOME TO MOTION CITY']];
  let msg = labels[0][1];
  labels.forEach(([n,t]) => { if (v >= n) msg = t; });
  if (!status.textContent.includes('CLICK ▶')) {
    // Preserve playback notices while the loadscreen is still loading.
    if (!status.textContent.includes('AUDIO') && !status.textContent.includes('PAUSED') && !status.textContent.includes('PLAYING')) {
      status.textContent = msg;
    }
  }
  steps.forEach((s,i) => {
    s.classList.remove('active','done');
    const threshold = [0,25,55,80][i];
    const clean = s.textContent.replace(/^[✓○◉]\s*/, '');
    if (v >= threshold + 25 && i < 3) { s.classList.add('done'); s.textContent = '✓ ' + clean; }
    else if (v >= threshold) { s.classList.add('active'); s.textContent = '◉ ' + clean; }
    else s.textContent = '○ ' + clean;
  });
}

window.addEventListener('message', e => {
  if (e.data?.eventName === 'loadProgress') {
    clearInterval(fallbackTimer);
    setProgress((e.data.loadFraction || 0) * 100);
  }
});

fallbackTimer = setInterval(() => {
  if (fake < 92) { fake += Math.random() * 2.5; setProgress(fake); }
}, 400);

renderPlaylist();
loadTrack(0, false);
