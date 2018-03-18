let UId = 0;
export default class Dep {
  constructor() {
    this.id = UId++;
    this.subs = [];
  }
  addSub(sub) {
    this.subs.push(sub);
  }
  removeSub(sub) {
    const index = this.subs.indexOf(sub);
    if (index > -1) {
      this.subs.splice(index, 1);
    }
  }
  notify() {
    const subs = this.subs.slice();
    subs.forEach(watcher => {
      watcher.update();
    });
  }
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
}
Dep.target = null;
