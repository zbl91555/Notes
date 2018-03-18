import Dep from "./dep";
export class Observe {
  constructor(value) {
    this.dep = new Dep();
    this.walk(value);
  }
  walk(obj) {
    const keys = Object.keys(obj);
    keys.forEach(key => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

export function defineReactive(obj, key, val) {
  let dep = new Dep();
  // 对obj的值进行observe
  let childOb = observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    set: function reactiveSetter(newVal) {
      if (val === newVal && (val !== val || newVal !== newVal)) return;
      //   触发dep.notify
      val = newVal;
      dep.notify();
    },
    get: function reactiveGetter() {
      // 收集Dep
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
      }
      return val;
    }
  });
}

function observe(value) {
  if (typeof value !== "object" || !value) return;
  return new Observe(value);
}
