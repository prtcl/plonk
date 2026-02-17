import * as p from '@prtcl/plonk';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const mx = screen.width / 6;
const my = screen.height / 6;

const sx = new p.Scale({
  from: { min: 0, max: 1 },
  to: { min: mx, max: canvas.width - mx },
});

const sy = new p.Scale({
  from: { min: 0, max: 1 },
  to: { min: my, max: canvas.height - my },
});

const resize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

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

  const r = new p.Fold({ min: size / 4, max: size });
  const o = new p.Fold({ min: 1, max: 10 });

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

    ctx.beginPath();
    ctx.arc(x, y, r.fold(state.iterations * flash), 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fillStyle = `rgba(0,0,0,${o.fold(state.iterations / pulse) / 10})`;
    ctx.fill();
  };

  return {
    id,
    meta: { duration, pulse, flash },
    tick,
  };
};

const br = new p.Drunk({ min: 50, max: 1000 });
const bugs = Array.from({ length: 7 }, (_, k) => makeBug(k, Math.round(br.next())));

const { run } = p.frames(
  (timer) => {
    ctx.fillStyle = 'rgba(0,255,50, 0.05)';
    ctx.fillRect(mx, my, canvas.width - mx * 2, canvas.height - my * 2);

    for (const bug of bugs) {
      bug.tick(timer.state);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  { fps: 60 }
);

run();
