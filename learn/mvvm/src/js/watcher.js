import Dep from "./dep";
export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.expOrFn = expOrFn.trim();
    this.cb = cb;
    this.depIds = new Set();
    if (typeof expOrFn === "function") {
      this.getter = expOrFn;
    } else {
      this.getter = this.parseGetter(expOrFn);
    }
    this.value = this.get();
  }
  update() {
    // 更新视图
    this.run();
  }
  run() {
    let newVal = this.get();
    let oldVal = this.value;
    if (newVal === oldVal) return;
    this.value = newVal;
    // 执行watch的回调
    this.cb.call(this.vm, newVal, oldVal);
  }
  get() {
    // 将订阅者指向自身
    Dep.target = this;
    // 将自身添加到dep中
    let value = this.getter.call(this.vm, this.vm);
    Dep.target = null;
    return value;
  }
  addDep(dep) {
    const id = dep.id;
    // 将watcher添加到subs中
    if (!this.depIds.has(id)) {
      dep.addSub(this);
      this.depIds.add(id);
    }
  }
  parseGetter(exp) {
    // 不为变量的合法字符
    if (/[^\w.$]/.test(exp)) return;
    let exps = exp.split(".");

    return function(obj) {
      for (let i = 0; i < exps.length; i++) {
        if (!obj) return;
        obj = obj[exps[i]];
      }
      return obj;
    };
  }
}
