import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Slew, slew } from '../slew';

describe('Slew', () => {
  beforeEach(() => {
    let elapsed = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => elapsed);
    (globalThis as any).__advanceTime = (ms: number) => {
      elapsed += ms;
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as any).__advanceTime;
  });

  const advance = (ms: number) => (globalThis as any).__advanceTime(ms);

  it('starts at the initial value', () => {
    const s = new Slew({ duration: 1000, value: 0 });
    expect(s.value()).toEqual(0);
    expect(s.done()).toBe(true);
  });

  it('interpolates toward a target over the configured duration', () => {
    const s = new Slew({ duration: 1000, value: 0 });
    s.setValue(100);

    expect(s.done()).toBe(false);

    advance(500);
    const mid = s.next();
    expect(mid).toBeCloseTo(50, 0);

    advance(500);
    const end = s.next();
    expect(end).toBeCloseTo(100, 0);
    expect(s.done()).toBe(true);
  });

  it('redirects mid-transition from the current position', () => {
    const s = new Slew({ duration: 1000, value: 0 });
    s.setValue(100);

    advance(500);
    s.next(); // ~50

    s.setValue(0);

    advance(500);
    const mid = s.next();
    expect(mid).toBeCloseTo(25, 0);

    advance(500);
    const end = s.next();
    expect(end).toBeCloseTo(0, 0);
  });

  it('settles and emits constant value when done', () => {
    const s = new Slew({ duration: 100, value: 0 });
    s.setValue(1);

    advance(200);
    s.next();

    expect(s.done()).toBe(true);
    expect(s.value()).toEqual(1);

    advance(100);
    expect(s.next()).toEqual(1);
  });

  it('handles negative direction', () => {
    const s = new Slew({ duration: 1000, value: 10 });
    s.setValue(-10);

    advance(500);
    expect(s.next()).toBeCloseTo(0, 0);

    advance(500);
    expect(s.next()).toBeCloseTo(-10, 0);
  });

  it('exposes state', () => {
    const s = new Slew({ duration: 500, value: 5 });
    expect(s.state.value).toEqual(5);
    expect(s.state.duration).toEqual(500);
  });
});

describe('slew', () => {
  it('is exported and returns a Slew instance', () => {
    expect(slew()).toBeInstanceOf(Slew);
  });
});
