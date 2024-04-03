import Scale from '../Scale';

describe('Scale', () => {
  it('scales an incoming value from a given range to an output range', () => {
    const s = new Scale({
      from: {
        min: 0,
        max: 1,
      },
      to: {
        min: -1,
        max: 1,
      },
    });

    expect(s.value()).toEqual(undefined);

    let val = s.scale(0);

    expect(val).toEqual(-1);
    expect(s.value()).toEqual(-1);

    val = s.scale(0.5);

    expect(val).toEqual(0);
    expect(s.value()).toEqual(0);

    val = s.scale(3);

    expect(val).toEqual(1);
    expect(s.value()).toEqual(1);
  });

  it('supports scaling down and inversions', () => {
    const s = new Scale({
      from: {
        min: 0,
        max: 1000,
      },
      to: {
        min: -1,
        max: 0,
      },
    });

    expect(s.value()).toEqual(undefined);

    let val = s.scale(0);

    expect(val).toEqual(-1);
    expect(s.value()).toEqual(-1);

    val = s.scale(500);

    expect(val).toEqual(-0.5);
    expect(s.value()).toEqual(-0.5);
  });

  it('allows resetting state and updating ranges', () => {
    const s = new Scale({
      from: {
        min: 0,
        max: 1,
      },
      to: {
        min: -1,
        max: 1,
      },
    });

    expect(s.value()).toEqual(undefined);

    let val = s.scale(0);

    expect(val).toEqual(-1);
    expect(s.value()).toEqual(-1);

    s.setRanges({
      to: {
        min: 0,
        max: 5000,
      },
    });

    expect(s.value()).toEqual(0);

    val = s.scale(0.5);

    expect(val).toEqual(2500);
    expect(s.value()).toEqual(2500);

    s.reset({
      from: {
        min: -1,
        max: 1,
      },
    });

    expect(s.value()).toEqual(undefined);

    val = s.scale(-1);

    expect(val).toEqual(0);
    expect(s.value()).toEqual(0);

    val = s.scale(0.5);

    expect(val).toEqual(0.75);
    expect(s.value()).toEqual(0.75);
  });

  it('has a static method which returns the results of scale()', () => {
    const val = Scale.scale(0.5, { to: { min: 0, max: 255 } });

    expect(val).toEqual(127.5);
  });
});
