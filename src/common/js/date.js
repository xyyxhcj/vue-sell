export function formatDate(date, fmt) {
  // 替换年
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      // 长度不足时左补0
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : concatZero(str));
    }
  }
  return fmt;
}

function concatZero(str) {
  return ('00' + str).substr(str.length);
}
