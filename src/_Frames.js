
import animationFrame from './_animationFrame';
import Timer from './Timer';

// just modifies Timer to use requestAnimtionFrame instead of setTimeout

export default class Frames extends Timer {

  constructor (...args) {
    super(...args);

    this._tickHandler = animationFrame;
    this._timeOffset = -5;
  }

}
