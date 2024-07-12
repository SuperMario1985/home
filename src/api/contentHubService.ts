import { httpServe } from './baseService'
// oauth2地址
export const WXOAUTHURL = 'https://open.weixin.qq.com/connect/oauth2/authorize'
// scope定义，获取个人信息范围
export const USERINFO_SCOPE = 'snsapi_userinfo'
// state定义，用于企微回调连接上判断回调状态
export const STATE = 'redirect'
const sdkUrl = 'https://res.wx.qq.com/wwopen/js/jsapi/jweixin-1.0.0.js'
let JSAPILIST = [
  'agentConfig',
  'sendChatMessage',
  'getContext',
  'getCurExternalContact',
]
const basePath = '/api-sidebar'

export interface ResponseInfo {
  data: any
  msg: any
  success: Boolean
}
// 素材列表
export const contentList = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/list`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      resultInfo.msg = response.data.msg
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 素材详情
export const contentDetail = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/detail`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      resultInfo.msg = response.data.msg
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 获取今日上新个数接口
export const newContentCount = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/new-today`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 清除今日上新个数
export const clearNewToday = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/clear-new-today`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 查看自己的未读通知
export const notificationsList = async (
  postInfo: any
): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `/api-notification-center/notifications/list`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 未读通知设置为已读
export const notificationsRead = async (
  postInfo: any
): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `/api-notification-center/notifications/read`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 获取营销日历
export const promotionsCalendar = async (
  postInfo: any
): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/promotions`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      resultInfo.data = error?.response.data
      return resultInfo
    })
  return res
}

// 获取标签树
export const tagsTree = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/tags/tree`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 浏览历史
export const browseHistory = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/browse-history`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 上报浏览事件
export const browseReport = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/browse-report`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 根据素材id获取mediaId
export const getMediaIdByUrl = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/media-task/invoke`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 根据素材id获取mediaId结果
export const mediaIdResult = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/media-task/results`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 分享前适当性判断
export const sharePermission = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/share-permission`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 分享后的回调
export const shareCallback = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/share-callback`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 获取素材大分类列表
export const categories = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/categories`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      resultInfo.data = error?.response.data
      return resultInfo
    })
  return res
}
// 获取素材子分类列表
export const subTags = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/tags/sub-tags`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
// 产品列表
export const productsList = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/products`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 5.2.17.过滤素材适当性（多素材 vs 单客户）
export const suitabilityList = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/suitability/filter/contents`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 5.2.17.过滤素材适当性（多素材 vs 单客户）
export const statistics = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `${basePath}/content/statistics`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 下载文件
export const downloadFile = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'get',
    url: `${postInfo.fileUrl}`,
    data: postInfo,
    responseType: 'blob',
  })
    .then(function (response) {
      // debugger
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}

// 上传文件
export const uploadFile = async (postInfo: any): Promise<ResponseInfo> => {
  let resultInfo: ResponseInfo = {
    data: {},
    msg: undefined,
    success: false,
  }
  const res = await httpServe({
    method: 'post',
    url: `/oss-service/uploadFile`,
    data: postInfo,
  })
    .then(function (response) {
      resultInfo.success = response.data.success
      resultInfo.data = response.data.data
      return resultInfo
    })
    .catch(function (error) {
      resultInfo.msg = error?.msg
      return resultInfo
    })
  return res
}
