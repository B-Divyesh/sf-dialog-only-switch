export type CueKind = 'dialogue' | 'effect';
export type CaptionMode = 'all' | 'dialogue';

export interface CaptionCue {
  id: string;
  start: number;
  end: number;
  text: string;
  rawText: string;
  detectedKind: CueKind;
}

export interface ParseResult {
  cues: CaptionCue[];
  warnings: string[];
}

export interface SavedSession {
  version: 1;
  savedAt: string;
  vttName: string;
  vttText: string;
  mode: CaptionMode;
  overrides: Record<string, CueKind>;
  completedCueIds: string[];
}

export class VttParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VttParseError';
  }
}

export function parseTimestamp(value: string): number | null {
  const parts = value.trim().replace(',', '.').split(':');
  if (parts.length !== 2 && parts.length !== 3) return null;
  const seconds = Number(parts.at(-1));
  const minutes = Number(parts.at(-2));
  const hours = parts.length === 3 ? Number(parts[0]) : 0;
  if (![seconds, minutes, hours].every(Number.isFinite)) return null;
  if (seconds < 0 || seconds >= 60 || minutes < 0 || minutes >= 60 || hours < 0) return null;
  return hours * 3600 + minutes * 60 + seconds;
}

export function stripVttMarkup(raw: string): string {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

export function detectCueKind(text: string): CueKind {
  const normalized = text.trim();
  if (!normalized) return 'effect';
  if (/^[♪♫♬🎵🎶]/u.test(normalized) || /[♪♫♬🎵🎶]$/u.test(normalized)) return 'effect';
  if (/^\[[\s\S]+\]$/.test(normalized) || /^\([\s\S]+\)$/.test(normalized)) return 'effect';
  if (/^(music|applause|laughter|laughing|sighs?|gasps?|groans?|door|phone|bell|silence|footsteps?|thunder|wind|rain|inaudible|speaking foreign language)\b[\s\S]*$/i.test(normalized)) return 'effect';
  const letters = normalized.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, '');
  const looksLikeSpeaker = /^[\p{L} .'-]{1,32}:\s+\S/u.test(normalized);
  if (!looksLikeSpeaker && letters.length >= 3 && letters.length <= 40 && normalized === normalized.toLocaleUpperCase() && !/[.!?…]$/.test(normalized)) return 'effect';
  return 'dialogue';
}

export function parseVtt(source: string): ParseResult {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  if (!/^WEBVTT(?:[ \t].*)?(?:\n|$)/.test(normalized)) {
    throw new VttParseError('This file does not begin with WEBVTT. Choose a valid .vtt caption file.');
  }

  const lines = normalized.split('\n');
  const cues: CaptionCue[] = [];
  const warnings: string[] = [];
  let index = 1;

  while (index < lines.length) {
    while (index < lines.length && !lines[index].trim()) index += 1;
    if (index >= lines.length) break;

    if (/^(NOTE|STYLE|REGION)(?:\s|$)/.test(lines[index].trim())) {
      while (index < lines.length && lines[index].trim()) index += 1;
      continue;
    }

    let timingIndex = index;
    if (!lines[timingIndex].includes('-->') && timingIndex + 1 < lines.length && lines[timingIndex + 1].includes('-->')) {
      timingIndex += 1;
    }

    const timing = lines[timingIndex].match(/^\s*(\S+)\s+-->\s+(\S+)(?:\s+.*)?$/);
    if (!timing) {
      warnings.push(`Skipped unrecognized content near line ${index + 1}.`);
      while (index < lines.length && lines[index].trim()) index += 1;
      continue;
    }

    const start = parseTimestamp(timing[1]);
    const end = parseTimestamp(timing[2]);
    index = timingIndex + 1;
    const textLines: string[] = [];
    while (index < lines.length && lines[index].trim()) {
      textLines.push(lines[index]);
      index += 1;
    }
    const rawText = textLines.join('\n');
    const text = stripVttMarkup(rawText);

    if (start === null || end === null || end <= start || !text) {
      warnings.push(`Skipped an invalid cue near line ${timingIndex + 1}.`);
      continue;
    }

    cues.push({
      id: `cue-${cues.length}-${Math.round(start * 1000)}-${Math.round(end * 1000)}`,
      start,
      end,
      text,
      rawText,
      detectedKind: detectCueKind(text),
    });
  }

  if (!cues.length) {
    throw new VttParseError('No usable timed cues were found. Check that each cue has a start time, an end time, and text.');
  }

  cues.sort((a, b) => a.start - b.start || a.end - b.end);
  return { cues, warnings };
}

export function formatTime(seconds: number): string {
  const safe = Math.max(0, seconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${minutes}:${String(secs).padStart(2, '0')}`;
}
