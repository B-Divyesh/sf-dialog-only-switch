import './styles.css';
import {
  formatTime,
  parseVtt,
  type CaptionCue,
  type CaptionMode,
  type CueKind,
  type SavedSession,
  VttParseError,
} from './model';
import { clearSession, loadSession, saveSession } from './storage';

const SAMPLE_VTT = `WEBVTT

00:00.000 --> 00:03.500
[WAVES BREAKING]

00:03.700 --> 00:07.200
Could you say that once more, please?

00:07.500 --> 00:09.500
Of course. Take your time.

00:09.700 --> 00:12.500
♪ SOFT MUSIC ♪
`;

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App root not found.');

app.innerHTML = `
  <div class="app-shell">
    <header class="site-header">
      <a class="brand" href="/" aria-label="Dialog Only Switch home">
        <img src="/icon-192.png" alt="" width="38" height="38" />
        <span>Dialog Only Switch</span>
      </a>
      <div class="header-actions">
        <span class="connection-status" id="connection-status"><span aria-hidden="true"></span> Online</span>
        <button class="quiet-button install-button" id="install-button" type="button" hidden>Install app</button>
      </div>
    </header>

    <main id="main">
      <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow">Local video · editable WebVTT · offline</p>
        <h1 id="page-title">Hear the line.<br /><em>Lower the noise.</em></h1>
        <p class="intro-copy">Watch a video you own with a reversible dialogue-only caption track. Nothing is uploaded, and every cue decision stays in your hands.</p>

        <div class="load-panel" id="drop-zone">
          <div class="load-heading">
            <span class="step-number" aria-hidden="true">01</span>
            <div><h2>Open your files</h2><p>Choose a local video and its <strong>.vtt</strong> captions. They never leave this browser.</p></div>
          </div>
          <div class="file-actions">
            <label class="file-button primary-file">
              <span class="button-icon" aria-hidden="true">▶</span>
              <span><strong>Choose video</strong><small id="video-file-name">MP4, WebM, or browser-supported video</small></span>
              <input id="video-input" type="file" accept="video/*,.mkv" />
            </label>
            <label class="file-button">
              <span class="button-icon cue-icon" aria-hidden="true">CC</span>
              <span><strong>Choose captions</strong><small id="caption-file-name">WebVTT up to 5 MB</small></span>
              <input id="caption-input" type="file" accept=".vtt,text/vtt" />
            </label>
          </div>
          <div class="load-foot">
            <span>or drop both files here</span>
            <button class="text-button" id="sample-button" type="button">Try sample captions</button>
          </div>
        </div>
        <p class="status-message" id="status-message" role="status" aria-live="polite">Ready when you are.</p>
      </section>

      <section class="workspace" aria-labelledby="viewer-title">
        <div class="workspace-heading">
          <div><p class="eyebrow">Projection desk</p><h2 id="viewer-title">Your private viewer</h2></div>
          <div class="cue-summary" id="cue-summary">No captions loaded</div>
        </div>

        <div class="viewer-grid">
          <div class="viewer-column">
            <div class="video-frame" id="video-frame">
              <picture class="empty-art" id="empty-art">
                <source type="image/webp" media="(max-width: 720px)" srcset="/assets/hero-720.webp" />
                <source type="image/webp" srcset="/assets/hero-1200.webp" />
                <source media="(max-width: 720px)" srcset="/assets/hero-720.jpg" />
                <img src="/assets/hero-1200.jpg" alt="" width="1200" height="800" fetchpriority="high" decoding="async" />
              </picture>
              <div class="empty-player-copy" id="empty-player-copy"><span aria-hidden="true">◒</span><strong>Your screening room is ready</strong><small>Open a local video above. Captions can be explored without one.</small></div>
              <video id="video" controls playsinline preload="metadata" hidden aria-label="Local video player"></video>
              <div class="caption-layer" id="caption-layer" aria-live="off" hidden></div>
              <div class="local-badge"><span aria-hidden="true">●</span> Local only</div>
            </div>

            <div class="mode-desk">
              <div class="mode-copy">
                <span class="mode-label">Caption mix</span>
                <strong id="mode-state">All cues are visible</strong>
              </div>
              <fieldset class="segmented-control" aria-label="Caption mix">
                <label><input type="radio" name="caption-mode" value="all" checked /><span>All cues</span></label>
                <label><input type="radio" name="caption-mode" value="dialogue" /><span>Dialogue only</span></label>
              </fieldset>
              <button class="reveal-button" id="reveal-button" type="button" aria-describedby="reveal-help" disabled>
                <kbd>R</kbd><span><strong>Hold to reveal</strong><small id="reveal-help">Show suppressed cues temporarily</small></span>
              </button>
            </div>

            <section class="practice-panel" id="practice-panel" aria-labelledby="practice-title" hidden>
              <div><p class="eyebrow">Line practice</p><h3 id="practice-title">Selected dialogue</h3><blockquote id="practice-text"></blockquote></div>
              <div class="practice-actions">
                <button class="solid-button" id="replay-button" type="button">Replay line</button>
                <button class="quiet-button" id="complete-button" type="button">Mark complete</button>
                <button class="icon-button" id="close-practice" type="button" aria-label="Close line practice">×</button>
              </div>
            </section>
          </div>

          <aside class="transcript-panel" aria-labelledby="transcript-title">
            <div class="transcript-heading">
              <div><p class="eyebrow">Always in view</p><h2 id="transcript-title">Transcript</h2></div>
              <span class="transcript-count" id="transcript-count">0 cues</span>
            </div>
            <p class="transcript-note" id="transcript-note">Load a WebVTT file to seek, review, and practice each timed line.</p>
            <ol class="transcript-list" id="transcript-list">
              <li class="transcript-empty"><span aria-hidden="true">CC</span><strong>No captions yet</strong><small>Your editable timed transcript will appear here.</small></li>
            </ol>
          </aside>
        </div>
      </section>

      <section class="session-tools" aria-labelledby="session-title">
        <div><p class="eyebrow">Keep control</p><h2 id="session-title">Your session, your copy</h2><p>Caption text and your corrections can stay on this device. Video files are never saved.</p></div>
        <div class="tool-actions">
          <button class="quiet-button" id="export-button" type="button" disabled>Export session</button>
          <label class="quiet-button import-button">Import session<input id="import-input" type="file" accept="application/json,.json" /></label>
          <button class="danger-button" id="clear-button" type="button" disabled>Clear saved session</button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div><strong>Dialog Only Switch</strong><p>Free, local-first caption control for learners and classrooms.</p></div>
      <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="https://github.com/B-Divyesh/sf-dialog-only-switch">Source</a></nav>
      <p class="art-credit">Environmental artwork generated for this product · no media is included.</p>
    </footer>
  </div>
  <div class="drop-overlay" id="drop-overlay" hidden><strong>Drop video + WebVTT</strong><span>Files stay on this device</span></div>
  <div class="update-toast" id="update-toast" hidden role="status"><span>A fresher projection desk is ready.</span><button type="button" id="refresh-button">Refresh</button></div>
`;

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing #${id}`);
  return element as T;
}

const videoInput = byId<HTMLInputElement>('video-input');
const captionInput = byId<HTMLInputElement>('caption-input');
const importInput = byId<HTMLInputElement>('import-input');
const video = byId<HTMLVideoElement>('video');
const emptyArt = byId<HTMLElement>('empty-art');
const emptyPlayerCopy = byId<HTMLElement>('empty-player-copy');
const captionLayer = byId<HTMLDivElement>('caption-layer');
const transcriptList = byId<HTMLOListElement>('transcript-list');
const transcriptNote = byId<HTMLParagraphElement>('transcript-note');
const transcriptCount = byId<HTMLSpanElement>('transcript-count');
const cueSummary = byId<HTMLDivElement>('cue-summary');
const statusMessage = byId<HTMLParagraphElement>('status-message');
const revealButton = byId<HTMLButtonElement>('reveal-button');
const modeState = byId<HTMLElement>('mode-state');
const practicePanel = byId<HTMLElement>('practice-panel');
const practiceText = byId<HTMLElement>('practice-text');
const completeButton = byId<HTMLButtonElement>('complete-button');
const exportButton = byId<HTMLButtonElement>('export-button');
const clearButton = byId<HTMLButtonElement>('clear-button');
const connectionStatus = byId<HTMLElement>('connection-status');
const dropOverlay = byId<HTMLElement>('drop-overlay');

let cues: CaptionCue[] = [];
let vttText = '';
let vttName = '';
let mode: CaptionMode = 'all';
let overrides: Record<string, CueKind> = {};
let completedCueIds = new Set<string>();
let revealSuppressed = false;
let selectedPracticeCue: CaptionCue | null = null;
let practiceStopAt: number | null = null;
let videoUrl: string | null = null;
let lastActiveKey = '';
let saveTimer: number | undefined;

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function announce(message: string, tone: 'neutral' | 'success' | 'error' = 'neutral'): void {
  statusMessage.textContent = message;
  statusMessage.dataset.tone = tone;
}

function kindFor(cue: CaptionCue): CueKind {
  return overrides[cue.id] ?? cue.detectedKind;
}

function isVisible(cue: CaptionCue): boolean {
  return mode === 'all' || revealSuppressed || kindFor(cue) === 'dialogue';
}

function sessionSnapshot(): SavedSession {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    vttName,
    vttText,
    mode,
    overrides,
    completedCueIds: [...completedCueIds],
  };
}

function queueSave(): void {
  if (!vttText) return;
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    void saveSession(sessionSnapshot()).catch(() => announce('Your changes work now, but browser storage could not save them.', 'error'));
  }, 250);
}

function updateSummary(): void {
  const dialogue = cues.filter((cue) => kindFor(cue) === 'dialogue').length;
  const effects = cues.length - dialogue;
  transcriptCount.textContent = `${cues.length} cue${cues.length === 1 ? '' : 's'}`;
  cueSummary.innerHTML = cues.length
    ? `<span><b>${dialogue}</b> dialogue</span><span><b>${effects}</b> environmental</span>`
    : 'No captions loaded';
  transcriptNote.textContent = cues.length
    ? 'Choose a time to seek. Classification changes are reversible and never rewrite your VTT file.'
    : 'Load a WebVTT file to seek, review, and practice each timed line.';
  exportButton.disabled = !cues.length;
  clearButton.disabled = !cues.length;
}

function renderTranscript(): void {
  updateSummary();
  if (!cues.length) {
    transcriptList.innerHTML = '<li class="transcript-empty"><span aria-hidden="true">CC</span><strong>No captions yet</strong><small>Your editable timed transcript will appear here.</small></li>';
    return;
  }

  transcriptList.innerHTML = cues.map((cue, index) => {
    const kind = kindFor(cue);
    const suppressed = !isVisible(cue);
    const complete = completedCueIds.has(cue.id);
    const visibleText = suppressed
      ? '<span class="suppressed-copy">Environmental cue hidden <small>Hold R to reveal</small></span>'
      : `<span class="cue-copy">${escapeHtml(cue.text).replace(/\n/g, '<br>')}</span>`;
    return `<li class="transcript-row ${kind === 'effect' ? 'effect-row' : 'dialogue-row'} ${suppressed ? 'is-suppressed' : ''} ${complete ? 'is-complete' : ''}" data-cue-id="${cue.id}" data-index="${index}">
      <button class="seek-cue" type="button" data-action="seek" aria-label="Seek to ${formatTime(cue.start)}: ${escapeHtml(cue.text)}">
        <time datetime="PT${cue.start}S">${formatTime(cue.start)}</time>${visibleText}
      </button>
      <div class="cue-actions">
        <span class="kind-badge"><span aria-hidden="true">${kind === 'dialogue' ? '“' : '◌'}</span>${kind === 'dialogue' ? 'Dialogue' : 'Environment'}</span>
        <button class="mini-button" type="button" data-action="toggle-kind" aria-label="Mark cue as ${kind === 'dialogue' ? 'environmental' : 'dialogue'}">Mark as ${kind === 'dialogue' ? 'environment' : 'dialogue'}</button>
        ${kind === 'dialogue' ? `<button class="mini-button practice-cue" type="button" data-action="practice">${complete ? 'Practiced ✓' : 'Practice line'}</button>` : ''}
      </div>
    </li>`;
  }).join('');
  updateCurrentCue(true);
}

function updateCurrentCue(keepPosition = false): void {
  const currentTime = video.currentTime || 0;
  const active = cues.filter((cue) => currentTime >= cue.start && currentTime < cue.end);
  const visible = active.filter(isVisible);
  const activeKey = active.map((cue) => cue.id).join('|');
  captionLayer.textContent = visible.map((cue) => cue.text).join('\n');
  captionLayer.hidden = !visible.length || video.hidden;

  if (activeKey !== lastActiveKey) {
    transcriptList.querySelectorAll('.is-active').forEach((row) => row.classList.remove('is-active'));
    active.forEach((cue) => transcriptList.querySelector(`[data-cue-id="${cue.id}"]`)?.classList.add('is-active'));
    if (!keepPosition && active.length && !video.paused) {
      transcriptList.querySelector(`[data-cue-id="${active[0].id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    lastActiveKey = activeKey;
  }

  if (practiceStopAt !== null && currentTime >= practiceStopAt) {
    video.pause();
    practiceStopAt = null;
    announce('Practice line finished. Replay it or mark it complete.', 'success');
  }
}

function setMode(nextMode: CaptionMode): void {
  mode = nextMode;
  if (mode === 'all') revealSuppressed = false;
  document.querySelectorAll<HTMLInputElement>('input[name="caption-mode"]').forEach((input) => { input.checked = input.value === mode; });
  modeState.textContent = mode === 'dialogue' ? 'Environmental cues are suppressed' : 'All cues are visible';
  revealButton.disabled = mode !== 'dialogue' || !cues.some((cue) => kindFor(cue) === 'effect');
  revealButton.setAttribute('aria-pressed', String(revealSuppressed));
  renderTranscript();
  queueSave();
}

function setReveal(active: boolean): void {
  if (mode !== 'dialogue' || revealButton.disabled || revealSuppressed === active) return;
  revealSuppressed = active;
  revealButton.classList.toggle('is-revealing', active);
  revealButton.setAttribute('aria-pressed', String(active));
  modeState.textContent = active ? 'Suppressed cues are temporarily revealed' : 'Environmental cues are suppressed';
  renderTranscript();
}

function openPractice(cue: CaptionCue): void {
  selectedPracticeCue = cue;
  practiceText.textContent = cue.text;
  practicePanel.hidden = false;
  completeButton.textContent = completedCueIds.has(cue.id) ? 'Practiced ✓' : 'Mark complete';
  practicePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  announce(`Selected the line at ${formatTime(cue.start)} for practice.`);
}

function loadCaptionText(source: string, name: string, imported?: Partial<SavedSession>): void {
  const parsed = parseVtt(source);
  cues = parsed.cues;
  vttText = source;
  vttName = name || 'captions.vtt';
  overrides = imported?.overrides && typeof imported.overrides === 'object' ? imported.overrides : {};
  completedCueIds = new Set(imported?.completedCueIds ?? []);
  byId('caption-file-name').textContent = vttName;
  selectedPracticeCue = null;
  practicePanel.hidden = true;
  setMode(imported?.mode === 'dialogue' ? 'dialogue' : 'all');
  const warning = parsed.warnings.length ? ` ${parsed.warnings.length} malformed section${parsed.warnings.length === 1 ? ' was' : 's were'} skipped.` : '';
  announce(`Loaded ${cues.length} timed cue${cues.length === 1 ? '' : 's'} from ${vttName}.${warning}`, parsed.warnings.length ? 'neutral' : 'success');
  queueSave();
}

async function handleCaptionFile(file: File): Promise<void> {
  if (file.size > 5 * 1024 * 1024) throw new Error('That caption file is over 5 MB. Choose a smaller WebVTT file.');
  if (!file.name.toLowerCase().endsWith('.vtt') && file.type !== 'text/vtt') throw new Error('Choose a .vtt WebVTT caption file.');
  loadCaptionText(await file.text(), file.name);
}

function handleVideoFile(file: File): void {
  const looksLikeVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogv|mov|m4v|mkv)$/i.test(file.name);
  if (!looksLikeVideo) throw new Error('Choose a video file supported by your browser, such as MP4 or WebM.');
  if (videoUrl) URL.revokeObjectURL(videoUrl);
  videoUrl = URL.createObjectURL(file);
  video.src = videoUrl;
  video.hidden = false;
  emptyArt.hidden = true;
  emptyPlayerCopy.hidden = true;
  byId('video-file-name').textContent = file.name;
  announce(`Opening ${file.name}…`);
  video.load();
}

function handleError(error: unknown): void {
  const message = error instanceof Error ? error.message : 'Something went wrong. Try the file again.';
  announce(message, 'error');
}

videoInput.addEventListener('change', () => {
  const file = videoInput.files?.[0];
  if (!file) return;
  try { handleVideoFile(file); } catch (error) { handleError(error); }
});

captionInput.addEventListener('change', () => {
  const file = captionInput.files?.[0];
  if (!file) return;
  void handleCaptionFile(file).catch(handleError);
});

video.addEventListener('loadedmetadata', () => {
  const duration = Number.isFinite(video.duration) ? ` — ${formatTime(video.duration)} long` : '';
  announce(`Video ready${duration}. Add captions or press play.`, 'success');
});
video.addEventListener('error', () => announce('This browser could not play that video. Try an MP4 (H.264) or WebM file.', 'error'));
video.addEventListener('timeupdate', () => updateCurrentCue());
video.addEventListener('seeked', () => updateCurrentCue());

document.querySelectorAll<HTMLInputElement>('input[name="caption-mode"]').forEach((input) => {
  input.addEventListener('change', () => setMode(input.value as CaptionMode));
});

revealButton.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'mouse') revealButton.setPointerCapture(event.pointerId);
  setReveal(true);
});
['pointerup', 'pointercancel', 'lostpointercapture', 'pointerleave'].forEach((name) => revealButton.addEventListener(name, () => setReveal(false)));

document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement;
  const isTextEntry = target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || (target instanceof HTMLInputElement && !['radio', 'checkbox', 'button'].includes(target.type));
  if (event.key.toLowerCase() !== 'r' || event.repeat || isTextEntry) return;
  event.preventDefault();
  setReveal(true);
});
document.addEventListener('keyup', (event) => {
  if (event.key.toLowerCase() === 'r') setReveal(false);
});
window.addEventListener('blur', () => setReveal(false));

transcriptList.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
  const row = button?.closest<HTMLLIElement>('[data-index]');
  if (!button || !row) return;
  const cue = cues[Number(row.dataset.index)];
  if (!cue) return;

  if (button.dataset.action === 'seek') {
    if (video.hidden) {
      announce(`This cue begins at ${formatTime(cue.start)}. Open a video to seek to it.`);
    } else {
      video.currentTime = cue.start;
      video.focus();
      updateCurrentCue();
    }
  } else if (button.dataset.action === 'toggle-kind') {
    overrides[cue.id] = kindFor(cue) === 'dialogue' ? 'effect' : 'dialogue';
    renderTranscript();
    setMode(mode);
    announce(`Marked the cue at ${formatTime(cue.start)} as ${kindFor(cue) === 'dialogue' ? 'dialogue' : 'environmental'}.`, 'success');
  } else if (button.dataset.action === 'practice') {
    openPractice(cue);
  }
});

byId('replay-button').addEventListener('click', () => {
  if (!selectedPracticeCue) return;
  if (video.hidden) {
    announce('Open a video before replaying this timed line.', 'error');
    return;
  }
  video.currentTime = Math.max(0, selectedPracticeCue.start - 0.15);
  practiceStopAt = selectedPracticeCue.end + 0.1;
  void video.play().catch(() => announce('Playback could not start. Press play in the video, then try again.', 'error'));
});

completeButton.addEventListener('click', () => {
  if (!selectedPracticeCue) return;
  completedCueIds.add(selectedPracticeCue.id);
  completeButton.textContent = 'Practiced ✓';
  renderTranscript();
  queueSave();
  announce('Practice complete. Your progress is saved on this device.', 'success');
});

byId('close-practice').addEventListener('click', () => {
  practiceStopAt = null;
  selectedPracticeCue = null;
  practicePanel.hidden = true;
});

byId('sample-button').addEventListener('click', () => loadCaptionText(SAMPLE_VTT, 'sample-coast.vtt'));

exportButton.addEventListener('click', () => {
  if (!cues.length) return;
  const blob = new Blob([JSON.stringify(sessionSnapshot(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${vttName.replace(/\.vtt$/i, '') || 'dialog-session'}.dialog-switch.json`;
  link.click();
  URL.revokeObjectURL(url);
  announce('Session exported. The original VTT text and your separate cue decisions are in the download.', 'success');
});

importInput.addEventListener('change', () => {
  const file = importInput.files?.[0];
  if (!file) return;
  void file.text().then((text) => {
    const imported = JSON.parse(text) as Partial<SavedSession>;
    if (imported.version !== 1 || typeof imported.vttText !== 'string') throw new Error('This is not a Dialog Only Switch session file.');
    loadCaptionText(imported.vttText, imported.vttName || 'imported.vtt', imported);
    announce(`Imported ${file.name}. Your video still needs to be selected locally.`, 'success');
  }).catch(handleError).finally(() => { importInput.value = ''; });
});

clearButton.addEventListener('click', () => {
  if (!window.confirm(`Clear the saved caption session “${vttName}” and all cue corrections from this browser? Your original file will not be changed.`)) return;
  void clearSession().then(() => {
    cues = [];
    vttText = '';
    vttName = '';
    overrides = {};
    completedCueIds.clear();
    selectedPracticeCue = null;
    practicePanel.hidden = true;
    byId('caption-file-name').textContent = 'WebVTT up to 5 MB';
    setMode('all');
    renderTranscript();
    announce('Saved captions and cue corrections were cleared from this browser.', 'success');
  }).catch(handleError);
});

let dragDepth = 0;
window.addEventListener('dragenter', (event) => { event.preventDefault(); dragDepth += 1; dropOverlay.hidden = false; });
window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('dragleave', (event) => { event.preventDefault(); dragDepth -= 1; if (dragDepth <= 0) dropOverlay.hidden = true; });
window.addEventListener('drop', (event) => {
  event.preventDefault();
  dragDepth = 0;
  dropOverlay.hidden = true;
  const files = [...(event.dataTransfer?.files ?? [])];
  const caption = files.find((file) => file.name.toLowerCase().endsWith('.vtt'));
  const media = files.find((file) => file.type.startsWith('video/') || /\.(mp4|webm|ogv|mov|m4v|mkv)$/i.test(file.name));
  if (!caption && !media) {
    announce('No video or .vtt caption file was found in that drop.', 'error');
    return;
  }
  if (media) { try { handleVideoFile(media); } catch (error) { handleError(error); } }
  if (caption) void handleCaptionFile(caption).catch(handleError);
});

function updateConnection(): void {
  const online = navigator.onLine;
  connectionStatus.innerHTML = `<span aria-hidden="true"></span> ${online ? 'Online' : 'Offline-ready'}`;
  connectionStatus.classList.toggle('is-offline', !online);
  if (!online) announce('You are offline. The viewer and saved captions still work here.', 'success');
}
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
updateConnection();

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
let installPrompt: InstallPromptEvent | null = null;
const installButton = byId<HTMLButtonElement>('install-button');
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  installPrompt = event as InstallPromptEvent;
  installButton.hidden = false;
});
installButton.addEventListener('click', () => {
  if (!installPrompt) return;
  void installPrompt.prompt().then(() => installPrompt?.userChoice).then((choice) => {
    if (choice?.outcome === 'accepted') installButton.hidden = true;
    installPrompt = null;
  });
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) byId('update-toast').hidden = false;
        });
      });
    }).catch(() => announce('Offline installation is unavailable in this browser, but local files still stay private.', 'error'));
  });
}
byId('refresh-button').addEventListener('click', () => window.location.reload());

void loadSession().then((saved) => {
  if (!saved?.vttText) return;
  try {
    loadCaptionText(saved.vttText, saved.vttName, saved);
    announce(`Restored ${saved.vttName}. Select the local video again to continue.`, 'success');
  } catch (error) {
    handleError(error instanceof VttParseError ? error : new Error('The saved caption session could not be restored.'));
  }
}).catch(() => announce('Browser storage is unavailable. Files still work for this tab.', 'error'));

window.addEventListener('beforeunload', () => { if (videoUrl) URL.revokeObjectURL(videoUrl); });
