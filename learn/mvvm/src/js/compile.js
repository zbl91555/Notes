import Watcher from "./watcher";
export default class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = this.nodeFragment(this.$el);
      this.compileElement(this.$fragment);
      this.$el.appendChild(this.$fragment);
    }
  }
  compileElement(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach(node => {
      let text = node.textContent;
      let reg = /\{\{((?:.|\n)+?)\}\}/;

      if (this.isElementNode(node)) {
        this.compile(node);
      } else if (this.isTextNode(node) && reg.test(text)) {
        // 文本节点

        this.compileText(node, RegExp.$1.trim());
      }
      // 解析子节点包含的指令
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    });
  }
  compile(node) {
    // 处理属性节点
    let nodeAttrs = node.attributes;
    // 指令的解析
    Array.from(nodeAttrs).forEach(attr => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        let exp = attr.value;
        // 去除v-
        let dir = attrName.substring(2);
        // 判断是否是事件指令
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir);
        } else {
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp);
        }
        // 删除这个节点
        node.removeAttribute(attrName);
      }
    });
  }
  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  }
  nodeFragment(el) {
    let fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild)) {
      fragment.appendChild(child);
    }
    return fragment;
  }
  isElementNode(node) {
    return node.nodeType === 1;
  }
  isTextNode(node) {
    return node.nodeType === 3;
  }
  isDirective(attr) {
    return attr.indexOf("v-") === 0;
  }
  isEventDirective(dir) {
    return dir.indexOf("on") === 0;
  }
}

// 定义$elm，缓存当前执行input事件的input dom对象
let $elm;
let timer = null;

// 处理指令集合
const compileUtil = {
  html(node, vm, exp) {
    this.bind(node, vm, exp, "html");
  },
  text(node, vm, exp) {
    this.bind(node, vm, exp, "text");
  },
  class(node, vm, exp) {
    this.bind(node, vm, exp, "class");
  },
  model(node, vm, exp) {
    this.bind(node, vm, exp, "model");

    let val = this._getVmVal(vm, exp);
    // 监听表单的input事件
    node.addEventListener("input", e => {
      let newVal = e.target.value;
      $elm = e.target;
      if (newVal === val) return;

      clearTimeout(timer);
      //设置定时器
      timer = setTimeout(() => {
        this._setVmVal(vm, exp, newVal);
        val = newVal;
      });
    });
  },
  bind(node, vm, exp, dir) {
    let updaterFn = updater[dir + "Updater"];
    // TODO：这步
    updaterFn && updaterFn(node, this._getVmVal(vm, exp));
    new Watcher(vm, exp, (value, oldValue) => {
      updaterFn && updaterFn(node, value, oldValue);
    });
  },
  eventHandler(node, vm, exp, dir) {
    let eventType = dir.split(":")[1];
    let fn = vm.$options.methods && vm.$options.methods[exp];
    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false);
    }
  },
  _getVmVal(vm, exp) {
    // 获取vm实例上的value值
    let val = vm;
    let exps = exp.split(".");
    exps.forEach(key => {
      key = key.trim();
      // 读取key值，深度去读取
      val = val[key];
    });
    return val;
  },
  _setVmVal(vm, exp, value) {
    // 挂载vm实例上的值
    let val = vm;
    let exps = exp.split(".");
    exps.forEach((key, index) => {
      key = key.trim();
      // 最后一层开始赋值
      if (index < exps.length - 1) {
        val = val[key];
      } else {
        val[key] = value;
      }
    });
  }
};

const updater = {
  htmlUpdater(node, value) {
    node.innerHTML = typeof value === "undefined" ? "" : value;
  },
  textUpdater(node, value) {
    node.textContent = typeof value === "undefined" ? "" : value;
  },
  classUpdater() {},
  modelUpdater(node, value, oldValue) {
    // 不对当前操作input进行渲染操作
    if ($elm === node) {
      return false;
    }
    $elm = undefined;
    node.value = typeof value === "undefined" ? "" : value;
  }
};
