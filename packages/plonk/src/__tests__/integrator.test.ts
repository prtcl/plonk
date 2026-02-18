import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Integrator, integrator } from '../integrator';

describe('Integrator', () => {
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
    const i = new Integrator({ value: 5 });
    expect(i.value()).toEqual(5);
  });

  it('smoothly approaches the target value', () => {
    const i = new Integrator({ factor: 0.5, value: 0 });

    advance(16.667);
    const first = i.next(100);

    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(100);

    advance(16.667);
    const second = i.next(100);

    expect(second).toBeGreaterThan(first);
    expect(second).toBeLessThan(100);
  });

  it('uses the last target when next() is called without arguments', () => {
    const i = new Integrator({ factor: 0.5, value: 0 });

    advance(16.667);
    i.next(100);

    advance(16.667);
    const val = i.next();

    expect(val).toBeGreaterThan(0);
    expect(val).toBeLessThan(100);
  });

  it('responds to changing targets mid-stream', () => {
    const i = new Integrator({ factor: 0.5, value: 0 });

    advance(16.667);
    const toward100 = i.next(100);

    advance(16.667);
    const towardNeg = i.next(-100);

    expect(towardNeg).toBeLessThan(toward100);
  });

  it('higher factor means faster response', () => {
    const slow = new Integrator({ factor: 0.05, value: 0 });
    const fast = new Integrator({ factor: 0.9, value: 0 });

    advance(16.667);
    const slowVal = slow.next(100);
    const fastVal = fast.next(100);

    expect(fastVal).toBeGreaterThan(slowVal);
  });

  it('compensates for variable tick rates', () => {
    const i = new Integrator({ factor: 0.5, value: 0 });

    // Short tick — small movement
    advance(8);
    const short = i.next(100);

    // Reset
    const j = new Integrator({ factor: 0.5, value: 0 });

    // Long tick — larger movement
    advance(32);
    const long = j.next(100);

    expect(long).toBeGreaterThan(short);
  });
});

describe('integrator', () => {
  it('is exported and returns an Integrator instance', () => {
    expect(integrator()).toBeInstanceOf(Integrator);
  });
});
