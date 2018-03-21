var Man
// 此处写代码
Man = function(opts) {
    this._data = [] //存放数据
    this._words = [] //存放语句
    Object.keys(opts).forEach((key) => {
        this._data[key] = opts[key]
    })
}

Man.prototype.attr = function(key, value) {
    if (typeof key === 'object') {
        this._limit = key.limit
        this._emojo = key.emojo
        return
    }
    if (!value) return this._data[key] || '<当前用户未输入>'
    this._data[key] = value
}

Man.prototype.word = function(word) {
    this._words.push(word)
}

Man.prototype.say = function() {
    let len = this._limit
    let words = this._words.slice(0, len)
    return words.join('')
}
//
try {
    var m = new Man({
        fullName: '小张'
    })

    console.log(m.attr('fullName') + m.attr('name'))
    // 期望输出 小张 <当前用户未输入>

    m.attr('fullName', '小刚')
    m.fullName = '小明'
    m.attr('do', '干活')

    console.log(m.attr('fullName') + m.attr('do'))
    // 期望输出 小刚干活

    m.attr({
        limit: 3,
        emojo: '微笑'
    })

    m.word('今天天气好。')
    m.word('今天心情好。')
    m.word('今天运气好。')
    m.word('希望每天都很好。')
    console.log(m.say())
    // 期望输出今天 小刚微笑说：今天天气好。今天心情好。今天运气好。

    m.attr({
        limit: 2
    })
    console.log(m.say())
    //期望输出今天 小刚微笑说：今天天气好。今天心情好。

} catch (e) {
    console.error(e)
}

function curry(fn) {
    let len = fn.length
    let args = []

    return function f1() {
        [].slice.call(arguments, 0).forEach(arg => args.push(arg))
        console.log(args)
        if (args.length >= len) {
            return fn.apply(null, args)
        } else {
            function f2() {
                [].slice.call(arguments, 0).forEach(arg => args.push(arg))
                return f1()
            }
            return f2
        }
    }
}

function f(a, b, c, d) {
    return a + b + c + d
}

// var fn = curry(f)
// console.log(fn(1)(2)(3)(4))

function plat(arr) {
    return arr.reduce((prev, item) => {
        return Array.isArray(item) ? prev.concat(plat(item)) : prev.concat(item)
    }, [])
}

// console.log(plat([1, [2, [3], 4], 5]))