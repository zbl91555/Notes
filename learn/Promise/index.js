// Promise
module.exports = class Promise {
    constructor(fn) {
        this._state = 'PENDING'
        this._value = null
        // 注册回调数组
        this._deferreds = []
        
        try {
            fn(value => {
                resolve(this, value)
            }, reason => {
                reject(this, reason)
            })
        } catch (error) {
            reject(error)
        }
    }

    static resolve(value) {
        return new Promise(resolve => resolve(value))
    }

    static reject(error) {
        return new Promise((resolve, reject) => reject(error))
    }

    then(onFulfilled, onRejected) {
        // 返回一个Promise对象
        const res = new Promise(function() {})
        const deferred = new Handler(onFulfilled, onRejected, res)

        // 当为 pending 状态将处理后的 deferred 加入 deferreds 回调数组
        if(this._state === 'PENDING') {
            this._deferreds.push(deferred)
            return res
        }
        // 当promise的状态不为 pending状态
        // 执行 onFulfilled 或 onRejected 回调
        handleResolved(this, deferred)
        return res
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }
}


// Handler 封装存储 onFulfilled, onRejected 函数和新生成 promise 对象
function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled ? onFulfilled : null
    this.onRejected = typeof onRejected ? onRejected : null
    this.promise = promise
}

function resolve(promise, value) {
    // 非pending 状态不可改变
    if(promise._state !== 'PENDING') return

    // promise 和 value 指向同一个对象
    if(promise === value) {
        return reject(promise, new TypeError('A promise cannot be resolved with itself.'))
    }

    //  如果 value 为 promise， 即使 promise 接受 value 的状态
    if (value && value instanceof Promise && value.then === promise.then) {
        const deferreds = promise._deferreds

        if(value._state === 'PENDING') {
            // 将promise._deferreds 传递 value._deferred
            value._deferreds.push(...deferreds)
        } else if(deferreds.length !== 'PENDING') {
            deferreds.forEach(deferred => handleResolved(value, deferred))
        }
        // 清空 then 注册的回调 处理数组
        value._deferreds = []
    }

    // value 是对象或者函数
    if(value && (typeof value === 'object' || typeof value === 'function')) {
        try {
            const then = value.then
        } catch(error) {
            reject(promise, error)
        }
    }

    // 如果 then 是函数
    if(typeof then === 'function') {
        try {
            then.call(value, value => {
                resolve(promise, value)
            }, reason => {
                reject(promise, reason)}
            )
        } catch(error) {
            reject(promise, error)
        }
    }

    // 👆以上都是处理不同 value 

    // 改变 promise 内部的状态
    promise._state = 'FULFILLED'
    promise._value = value

    // promise 存在 then 注册回调函数
    if(promise._deferreds.length !== 0) {
        promise._deferreds.forEach(deferred => handleResolved(promise, deferred))
    }
    // 清空 then 的回调数组
    promise._deferreds = []
}

function reject(promise, reason) {
    if(promise._state !== 'PENDING') return

    // 将 promise 的状态置为REJECTED
    promise._state = 'REJECTED'
    promise._value = reason

    if(promise._deferreds.length !== 0) {
        promise._deferreds.forEach(deferred => handleResolved(promise, deferred))
    }
    promise._deferreds = []
}

function handleResolved(promise, deferred) {
    // 异步去执行注册回调
    asyncFn(() => {
        const cb = promise._state === 'FULFILLED' ? deferred.onFulfilled : deferred.onRejected

        // 在 then 方法中注册的回调函数为空情况
        if(cb == null) {
            if(promise._state === 'FULFILLED') {
                resolve(deferred.promise, promise._value)
            } else {
                reject(deferred.promise, promise._value)
            }
            return
        }

        let res
        // 执行注册回调函数
        try {
            res = cb(promise._value)
        } catch(error) {
            reject(deferred.promise, error)
        }

        // 处理 then 注册的链式调用
        resolve(deferred.promise, res)
    })
}


const asyncFn = function () {
    if (typeof process === 'object' && process !== null && 
        typeof(process.nextTick) === 'function'
    ) {
      return process.nextTick;
    } else if (typeof(setImmediate) === 'function') {
      return setImmediate
    }
    return setTimeout
  }()
  