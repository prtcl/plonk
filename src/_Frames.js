
import animationFrame from './_animationFrame';
import Timer from './Timer';

// just modifies Timer to use requestAnimtionFrame instead of setTimeout

export default class Frames extends Timer {

  constructor (time, callback) {
    super(time, callback);

    this._tickHandler = animationFrame;
    this._timeOffset = -5;
  }

}
