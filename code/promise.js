function Promise1(exec) {
    var _this = this
    // promise 有三种状态 PENDING RESOLVED REJECTED
    this._status = 'PENDING'
    this._value = undefined // 保存成功回调的值
    this._reason = undefined // 保存失败回调的值
    this._onResolvedCallbacks = [] // 存放then成功的回调
    this._onRejectedCallbacks = [] // 存放then失败的回调
    function resolve(value) {
        // status 状态变更为 RESOLVED
        if (_this._status === 'PENDING') {
            _this._status = 'RESOLVED'
            _this._value = value

            _this._onResolvedCallbacks.forEach(callback => {
                callback()
            })
        }
    }

    function reject(reason) {
        // status 状态变更为 REJECTED
        if (_this._status === 'PENDING') {
            _this._status = 'REJECTED'
            _this._reason = reason
            _this._onRejectedCallbacks.forEach(callback => {
                callback()
            })
        }
    }

    try {
        exec(resolve, reject)
    } catch (e) {
        reject(e)
    }

}


Promise1.prototype.then = function(onFulfilled, onRejected) {
    var _this = this
    if (this._status === 'PENDING') {
        this._onResolvedCallbacks.push(function() {
            onFulfilled(_this._value)
        })
        this._onRejectedCallbacks.push(function() {
            onFulfilled(_this._reason)
        })
    }
    if (this._status === 'RESOLVED') {
        _this._onResolvedCallbacks.forEach(callback => {
            callback()
        })
    }
    if (this._status === 'REJECTED') {
        _this._onRejectedCallbacks.forEach(callback => {
            callback()
        })
    }
}



// test

new Promise1((resolve, reject) => {
    setTimeout(() => {
        reject(21221)
    }, 1000)
}).then((a) => {
    console.log(a)
}, (b) => {
    console.log(b)
})