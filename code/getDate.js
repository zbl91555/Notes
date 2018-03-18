Object.defineProperty(Date.prototype, 'ago', {
    enumerable: false,
    configurable: false,
    get() {
        let diff = (Date.now() - this.getTime()) / 1000
        let day_diff = diff / 86400 | 0
        return day_diff === 0 && (diff < 60 && '刚刚'
            || diff < 120 && '一分钟前'
            || diff < 3600 && (diff / 60 | 0) + '分钟前'
            || diff < 86400 && (diff / 3600 | 0) + '小时前')
            || day_diff === 1 && '昨天'
            || day_diff < 7 && day_diff + '天前'
            || day_diff < 30 && (day_diff / 7 | 0) + '周前'
            || day_diff < 365 && (day_diff / 30 | 0) + '月前'
            || (day_diff / 365 | 0) + '年前'
    }
})

console.log(new Date('2018-2-26').ago)