import { describe, expect, it } from 'vitest';

import { getFirstInvalidField } from './focus-dom-model';
import { willReactOverwriteManualDom } from './imperative-dom-model';
import { summarizeArea } from './measure-model';
import { simulateMutableRefFlow } from './mutable-ref-model';
import { createDemoConsole, formatPixels, lessonCards } from './ref-domain';
import { describeScrollOptions } from './scroll-model';
import { formatElapsed } from './timer-object-model';

describe('useRef and DOM lesson models', () => {
  it('simulates mutable ref snapshot drift', () => {
    expect(simulateMutableRefFlow(3, 0)).toEqual({
      actualRef: 3,
      visibleSnapshot: 0,
    });
  });

  it('finds first invalid focus field', () => {
    expect(
      getFirstInvalidField({ name: '', email: 'person@example.com', track: 'dom' }),
    ).toBe('name');
    expect(
      getFirstInvalidField({ name: 'Ada', email: 'ada.example.com', track: 'dom' }),
    ).toBe('email');
  });

  it('formats scroll and measurement metadata', () => {
    expect(describeScrollOptions('smooth', 'center')).toBe('smooth / center');
    expect(summarizeArea(320, 180)).toContain('320.0 px');
    expect(formatPixels(24)).toBe('24.0 px');
  });

  it('formats stopwatch values', () => {
    expect(formatElapsed(125000)).toBe('2:05');
  });

  it('creates reusable external console objects', () => {
    const consoleInstance = createDemoConsole();

    expect(consoleInstance.ping()).toBe(1);
    expect(consoleInstance.status).toBe('running');
    consoleInstance.stop();
    expect(consoleInstance.status).toBe('stopped');
  });

  it('describes declarative conflict correctly', () => {
    expect(willReactOverwriteManualDom(true)).toBe(true);
    expect(lessonCards).toHaveLength(6);
  });
});
