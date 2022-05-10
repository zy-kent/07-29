const date = {};

/**
 * 格式化日期
 * @param {String} date [时间戳：e.g. 1430370000000]
 * @param {String} fmt [日期格式：默认yyyy-MM-dd hh:mm:ss]
 * @usage
 * formatDate(nS,Ft)
 */
date.formatDate = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
    if (typeof date === 'number') {
        date = new Date(date)
    }
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    }
    if (/(y{1,4})/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
        )
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
            )
        }
    }
    return fmt
}

/**
 * 获取当前月
 */
date.getCurrentMonth = () => {
    const currentDate = new Date()
    return date.formatDate(currentDate.setMonth(currentDate.getMonth(), 1), 'yyyy-MM')
}

export default date;
