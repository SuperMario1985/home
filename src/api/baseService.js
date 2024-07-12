import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { showToast } from 'vant'
// 请求的唯一标识
let traceId = ''
if (sessionStorage.getItem('traceId')) {
  traceId = sessionStorage.getItem('traceId') || ''
} else {
  traceId = uuidv4()
  sessionStorage.setItem('traceId', traceId)
}

const defaultHeaders = {
  traceId,
  isEncrypt: false,
  Environment: 'scrm-outer',
  // withCredentials: false
}

// sourceHost:资源上传接口
let baseURL
let hostName = window.location.hostname
let rokenErrorReturnFuncInfo = {
  returnFun: null,
  isError: false,
}
if (hostName === 'localhost') {
  baseURL = '/api'
} else {
  baseURL = '/backend'
}

export let httpServe = axios.create({
  baseURL,
  withCredentials: false,
  headers: defaultHeaders,
  timeout: 30000,
})

export let specialHttpServe = axios.create({
  baseURL: '',
  withCredentials: false,
  headers: defaultHeaders,
  timeout: 30000,
})

// 添加拦截器
addInterceptors()

// code 错误
export function messageCode(returnFun) {
  rokenErrorReturnFuncInfo.returnFun = returnFun
}
// 失败
export function messageError(returnFun) {
  rokenErrorReturnFuncInfo.isError = returnFun
}
// 添加拦截器
function addInterceptors() {
  // 添加响应拦截器
  httpServe.interceptors.response.use(
    function (response) {
      var code = response.data.code
      if (code === '500200') {
        if (response.data.success) {
        } else {
          console.log('respone', response)
          showToast(response.data.msg)
        }
        return response
        // token失效的处理
      } else if (code === '-12') {
        showToast(response.data.msg)
      } else {
        // 处理非'500200'
        console.log('respone', response)
        showToast(response.data.msg)
        return response
      }
    },
    (error) => {
      const res = error.response
      if (res.status === 401 && res.data.code === '-9999') {
      }
      // 对响应错误做点什么
      return Promise.reject(error)
    }
  )
  // 添加请求拦截器
  httpServe.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      if (config.data) {
        config.data = trimData(config.data)
      }
      // console.log(config)
      return config
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    }
  )
}
// 去掉入参字段两边的空格
function trimData(obj) {
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.toString.call(obj[key]) == '[object String]') {
      obj[key] = obj[key].trim()
    }
  })
  return obj
}
