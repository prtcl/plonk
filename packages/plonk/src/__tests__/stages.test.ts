import { describe, it, expect } from 'vitest';
import { Stages, stages } from '../stages';

describe('Stages', () => {
  it('sequences through multiple stages', () => {
    const s = new Stages([
      { from: 0, to: 1, duration: 30 },
      { to: 0.5, duration: 30 },
      { to: 0, duration: 30 },
    ]);

    expect(s.value()).toEqual(0);
    expect(s.done()).toEqual(false);

    s.start();

    return new Promise<void>((done) => {
      const timerId = setInterval(() => {
        s.next();

        if (s.done()) {
          clearInterval(timerId);
          expect(s.value()).toEqual(0);
          expect(s.state.isRunning).toEqual(false);
          expect(s.state.active).toEqual(2);

          done();
        }
      }, 10);
    });
  });

  it('auto-connects from to previous stage to', () => {
    const s = new Stages([
      { from: 0, to: 100, duration: 50 },
      { to: 50, duration: 50 },
    ]);

    expect(s.at(1)!.state.from).toEqual(100);
  });

  it('allows explicit from to override auto-connect', () => {
    const s = new Stages([
      { from: 0, to: 100, duration: 50 },
      { from: 200, to: 50, duration: 50 },
    ]);

    expect(s.at(1)!.state.from).toEqual(200);
  });

  it('reports done only when last stage completes', () => {
    const s = new Stages([
      { from: 0, to: 1, duration: 20 },
      { to: 0, duration: 200 },
    ]);

    s.start();

    return new Promise<void>((done) => {
      setTimeout(() => {
        s.next();

        expect(s.state.active).toEqual(1);
        expect(s.done()).toEqual(false);
        expect(s.state.isRunning).toEqual(true);

        done();
      }, 40);
    });
  });

  it('re-triggers from the beginning via start()', () => {
    const s = new Stages([
      { from: 0, to: 1, duration: 20 },
      { to: 0, duration: 20 },
    ]);

    s.start();

    return new Promise<void>((done) => {
      const timerId = setInterval(() => {
        s.next();

        if (s.done()) {
          clearInterval(timerId);

          expect(s.state.isRunning).toEqual(false);

          s.start();

          expect(s.done()).toEqual(false);
          expect(s.state.isRunning).toEqual(true);
          expect(s.state.active).toEqual(0);
          expect(s.value()).toEqual(0);

          done();
        }
      }, 10);
    });
  });

  it('returns value without advancing when not started', () => {
    const s = new Stages([{ from: 5, to: 10, duration: 50 }]);

    expect(s.next()).toEqual(5);
    expect(s.state.isRunning).toEqual(false);
  });

  it('exposes individual stages for mutation via at()', () => {
    const s = new Stages([
      { from: 0, to: 1, duration: 100 },
      { to: 0, duration: 100 },
    ]);

    s.at(0)!.setDuration(50);
    expect(s.at(0)!.state.duration).toEqual(50);
  });

  it('returns null for out-of-bounds at()', () => {
    const s = new Stages([{ from: 0, to: 1, duration: 100 }]);

    expect(s.at(5)).toEqual(null);
    expect(s.at(-2)).toEqual(null);
  });
});

describe('stages', () => {
  it('is exported and returns a Stages instance', () => {
    expect(stages([{ from: 0, to: 1, duration: 100 }])).toBeInstanceOf(Stages);
  });
});
