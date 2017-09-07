// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}
// 全角转换为半角函数
export function ToCDB(str) {
  let tmp = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i))
    }
  }
  return tmp
}
