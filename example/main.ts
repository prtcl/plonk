import * as p from '@prtcl/plonk';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

let mx = 0;
let my = 0;

const sx = new p.Scale({
  from: { min: 0, max: 1 },
  to: { min: 0, max: canvas.width },
});

const sy = new p.Scale({
  from: { min: 0, max: 1 },
  to: { min: 0, max: canvas.height },
});

const g = 1.618;

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  mx = Math.max((canvas.width - canvas.width / (g * g)) / 2, 0);
  my = window.innerHeight / 6;

  sx.setRanges({ to: { min: mx, max: canvas.width - mx } });
  sy.setRanges({ to: { min: my, max: canvas.height - my } });
};
resize();

window.addEventListener('resize', resize);

type Bug = {
  id: number;
  meta: { duration: number; pulse: number; flash: number };
  tick: (state: p.TimerState) => void;
};

const makeBug = (id: number, updateInterval: number): Bug => {
  let lastInterval = 0;
  const duration = Math.round(p.rand({ min: 500, max: 5000 }));

  const px = new p.Slew({ duration, value: 0 });
  const py = new p.Slew({ duration, value: 0 });

  const dx = new p.Drunk({ min: 0, max: 1, step: 0.002 });
  const dy = new p.Drunk({ min: 0, max: 1, step: 0.002 });
  const rx = new p.Rand({ min: -0.25, max: 0.25 });
  const ry = new p.Rand({ min: -0.25, max: 0.25 });

  const size = Math.round(p.rand({ min: 5, max: 50 }));

  const rf = new p.Fold({ min: size / 4, max: size });
  const oo = new p.Fold({ min: 1, max: 10 });

  const flash = Math.round(p.rand({ min: 1, max: 2 }));
  const pulse = Math.round(p.rand({ min: 1, max: 10 }));

  const tick = (state: p.TimerState) => {
    if (state.totalElapsed - lastInterval > updateInterval) {
      lastInterval = state.totalElapsed;

      px.setValue(rx.next());
      py.setValue(ry.next());
      px.setDuration(Math.random() * 3000);
      py.setDuration(Math.random() * 3000);
    }

    const x = sx.scale(dx.next() + p.tanh(px.next(), 2) * 0.75);
    const y = sy.scale(dy.next() + p.tanh(py.next(), 2) * 0.75);
    const r = rf.fold(state.iterations * flash);
    const o = oo.fold(state.iterations / pulse) / 10;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${o * 0.96})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r / (Math.E * 3), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,0,0,${o})`;
    ctx.fill();
  };

  return {
    id,
    meta: { duration, pulse, flash },
    tick,
  };
};

const makeWiggler = () => {
  const fade = new p.Env({ duration: p.ms('.5s'), curve: Math.E * 2 });
  const ff = new p.Integrator({ factor: 0.01 });
  const acc = new p.Integrator();
  const fs = new p.Scale({ from: { min: -1, max: 1 }, to: { min: 0.01, max: 0.2 } });

  const gen = new p.Sine({ duration: p.rand({ min: p.ms('0.11hz'), max: p.ms('0.33hz') }) });
  const lnz = new p.Lorenz({ damping: 0.25 });
  const nx = new p.Noise({ balance: 0.25 });

  const isx = new p.Scale({ from: { min: -1, max: 1 }, to: { min: 0, max: canvas.width } });
  const isy = new p.Scale({ from: { min: -1, max: 1 }, to: { min: 0, max: canvas.height } });

  const r = Math.round(p.rand({ min: 5, max: 7 }));

  fade.start();

  const tick = () => {
    const value = lnz.next();
    lnz.setRate(fs.scale(ff.next(value.z + nx.next() - 0.12)));

    const x = isx.scale(value.x + gen.next() * 0.15);
    const y = isy.scale(value.y);
    const o = fade.next();

    ctx.beginPath();
    ctx.arc(x, y, r * 12 * acc.next(Math.abs(value.x)), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,0,0,${o * 0.1})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r * 2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,0,0,${o * 0.15})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,0,0,${o})`;
    ctx.fill();
  };

  return { tick };
};

const makeDyn = () => {
  const ina = new p.Integrator({ factor: 0.005 });
  const gen = new p.Sine({ duration: p.ms('0.33hz') });
  const df = new p.Drunk({ min: 0.03, max: 0.07, step: 0.05 });
  const rs = new p.Scale({ from: { min: -1, max: 1 }, to: { min: 0, max: 33 } });

  const tick = () => {
    const no = ina.next(df.next());
    const nr = ina.next(rs.scale(p.tanh(gen.next(), 2)));

    ctx.fillStyle = `rgba(${nr},13,1,${no * 0.25})`;
    ctx.fillRect(mx, my, canvas.width - mx * 2, canvas.height - my * 2);
  };

  return { tick };
};

const ova = {
  tick: () => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
};

const br = new p.Drunk({ min: 50, max: 1000 });
const bugs = Array.from({ length: 7 }, (_, k) => makeBug(k, Math.round(br.next())));
const wigglers = Array.from({ length: 3 }, () => makeWiggler());
const dyn = makeDyn();

const { run } = p.frames(
  ({ state }) => {
    dyn.tick();
    for (const bug of bugs) {
      bug.tick(state);
    }
    for (const wiggler of wigglers) {
      wiggler.tick();
    }

    ova.tick();
  },
  { fps: 60 }
);

run();
