const number = {};

/**
 * 格式化数字
 * 100,000,000
 */
number.format = (num) => {
    return String(num).replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
}

export default number;
