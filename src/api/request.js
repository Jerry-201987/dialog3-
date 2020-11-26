import axios from "axios";
const request = axios.create();
request.interceptors.request.use(
  (value) => value,
  (error) => error
);
request.interceptors.response.use(
  (value) => {
    if (value.meta.status !== 200 || value.code !== "0000") {
      return Promise.reject(value?.meta?.msg || "未知错误");
    }
    return value;
  },
  (error) => error
);
export default request;
------------------------------------------------------------------------------------------------------------
import axios from 'axios'

/**
 * @description 设置cookie
 */
export const setCookie = (name, value, expiredays) => {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie =
    name + '=' + escape(value) + (expiredays === null ? '' : ';expires=' + exdate.toGMTString()) + ';path=/;'
}

/**
 * @description 获取cookie
 */
export const getCookie = name => {
  if (document.cookie.length > 0) {
    let sIndex = document.cookie.indexOf(name + '=')
    if (sIndex !== -1) {
      sIndex = sIndex + name.length + 1
      let eIndex = document.cookie.indexOf(';', sIndex)
      if (eIndex === -1) {
        eIndex = document.cookie.length
      }
      return unescape(document.cookie.substring(sIndex, eIndex))
    }
  }
  return ''
}

/**
 * @description 清空cookie
 */
export const clearCookie = name => {
  setCookie(name, '', -1)
}

// create an axios instance
const service = axios.create({
  baseURL: '/portal'
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    const csrfHeader = getCookie('csrf_header')
    const csrfToken = getCookie('csrf_token')
    if (csrfHeader && csrfToken) {
      config.headers[csrfHeader] = csrfToken
      config.headers['X-Requested-With'] = 'XMLHttpRequest'
    }
    // 解决IE接口缓存的问题
    if (config.method === 'post') {
      config.data = {
        ...config.data
        // t: Date.parse(new Date()) / 1000
      }
    } else if (config.method === 'get') {
      config.params = {
        // t: Date.parse(new Date()) / 1000
        ...config.params
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(response => {
    const {
      data: { datas, data, resultCode, totalCount },config:{handle}
    } = response
    const redirectUrl = data + location.href
    // 没有登录
    if (resultCode === '000001') {
      window.location.href = redirectUrl
    }
    const newResponse = {
      code: resultCode,
      data: datas,
      total: totalCount
    }
    return  handle? newResponse : response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
