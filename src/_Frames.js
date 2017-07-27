
import animationFrame from './_animationFrame';
import noop from './_noop';
import Timer from './_Timer';

// just modifies Timer to use requestAnimtionFrame instead of setTimeout

export default class Frames extends Timer {

  constructor (time, callback = noop) {
    super(time, callback);
    this._tickHandler = animationFrame;
    this._timeOffset = -5;
  }

}
