import { describe, expect, it } from 'vitest';
import { detectCueKind, exportVtt, formatTime, parseTimestamp, parseVtt, VttParseError } from '../src/model';

describe('WebVTT parsing', () => {
  it('parses identifiers, markup, cue settings, and multiline text', () => {
    const result = parseVtt(`WEBVTT Example

intro
00:00:01.200 --> 00:00:03.400 align:start
<v Teacher>Hello &amp; welcome.</v>
Take a seat.

00:04.000 --> 00:06.000
[CHAIRS SCRAPE]
`);
    expect(result.cues).toHaveLength(2);
    expect(result.cues[0]).toMatchObject({ start: 1.2, end: 3.4, text: 'Hello & welcome.\nTake a seat.', detectedKind: 'dialogue' });
    expect(result.cues[1].detectedKind).toBe('effect');
  });

  it('keeps valid cues while warning about malformed sections', () => {
    const result = parseVtt(`WEBVTT

not a cue

00:01.000 --> 00:02.000
Still here.
`);
    expect(result.cues).toHaveLength(1);
    expect(result.warnings).toHaveLength(1);
  });

  it('rejects non-WebVTT and empty tracks with useful errors', () => {
    expect(() => parseVtt('00:00 --> 00:01\nHello')).toThrow(VttParseError);
    expect(() => parseVtt('WEBVTT\n\nNOTE no cues')).toThrow('No usable timed cues');
  });

  it('exports parseable WebVTT while preserving cue timing and source text', () => {
    const parsed = parseVtt('WEBVTT\n\n00:01.200 --> 00:03.450\n<v Jo>Hello &amp; welcome.</v>\n\n00:04.000 --> 00:05.000\n[MUSIC]\n');
    const exported = exportVtt(parsed.cues);
    expect(exported).toContain('00:00:01.200 --> 00:00:03.450');
    expect(exported).toContain('<v Jo>Hello &amp; welcome.</v>');
    expect(parseVtt(exported).cues).toMatchObject([
      { start: 1.2, end: 3.45, text: 'Hello & welcome.' },
      { start: 4, end: 5, text: '[MUSIC]' },
    ]);
  });
});

describe('classification and time helpers', () => {
  it.each([
    ['[MUSIC]', 'effect'],
    ['♪ orchestra ♪', 'effect'],
    ['(door closes)', 'effect'],
    ['JO: Is anyone there?', 'dialogue'],
    ['Please close the door.', 'dialogue'],
  ] as const)('classifies %s as %s', (text, kind) => expect(detectCueKind(text)).toBe(kind));

  it('formats and validates timestamps', () => {
    expect(parseTimestamp('01:02:03.500')).toBe(3723.5);
    expect(parseTimestamp('02:03.250')).toBe(123.25);
    expect(parseTimestamp('00:99.000')).toBeNull();
    expect(formatTime(3723)).toBe('1:02:03');
  });
});
