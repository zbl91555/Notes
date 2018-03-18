import { Observe } from "./js/observe";
import Compile from "./js/compile";
class Mvvm {
  constructor(options) {
    // debugger;
    this.$options = options;
    this._data = options.data;
    this._proxyData(this._data);
    new Observe(this._data);
    new Compile(options.el || document.body, this);
  }
  _proxyData(data) {
    const keys = Object.keys(data);
    keys.forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return this._data[key];
        },
        set(newValue) {
          this._data[key] = newValue;
        }
      });
    });
  }
}

window.Mvvm = Mvvm;
