/**
 * 获取url参数,需要使用decodeURIComponent解码
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&]([^?&]+)=([^?&]+)/g;
  while (reg.test(url)) {
    obj[decodeURIComponent(RegExp.$1)] = decodeURIComponent(RegExp.$2);
  }
  return obj;
}

/**
 * 将数据存储到本地
 */
export function saveToLocal(id, key, value) {
  // localStorage只能存储json字符串
  let dataList = window.localStorage.__dataList__;
  if (!dataList) {
    dataList = {};
    dataList[id] = {};
  } else {
    dataList = JSON.parse(dataList);
    if (!dataList[id]) {
      dataList[id] = {};
    }
  }
  dataList[id][key] = value;
  window.localStorage.__dataList__ = JSON.stringify(dataList);
}

/**
 * 从本地读取数据
 */
export function loadFromLocal(id, key, defaultValue = null) {
  let dataList = window.localStorage.__dataList__;
  if (!dataList) {
    return defaultValue;
  }
  dataList = JSON.parse(dataList);
  if (!dataList[id] || !dataList[id][key]) {
    return defaultValue;
  }
  return dataList[id][key];
}
