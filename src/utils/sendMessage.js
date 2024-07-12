import { closeToast, showLoadingToast, showToast } from 'vant'
import { InitSdkAgentConfig } from '../api/qwSdkService'
import {
  getMediaIdByUrl,
  mediaIdResult,
  shareCallback,
  sharePermission,
} from '../api/contentHubService'

// 判断设备
let isPc = false
const jugeIsPc = () => {
  const pattern =
    /android|bb\d+|ucweb|meego|avantgo|bada\/|blackberry|transcoder|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
  return !window.navigator.userAgent.match(pattern)
}
isPc = jugeIsPc()

// 初始化发送消息sdk
let externalUserId = ''
export const initWxworkSdk = (returnFun) => {
  InitSdkAgentConfig({
    debug: false, // 是否开启调试
    jsApiList: ['getCurExternalContact', 'sendChatMessage', 'previewFile'], // 需要使用的jsapi列表
  })
    .then((res) => {
      try {
        window.wx.invoke('getCurExternalContact', {}, async (wxres) => {
          if (wxres.err_msg === 'getCurExternalContact:ok') {
            externalUserId = wxres.userId
            console.log('getCurExternalContact-wxres,获取联系人信息成功', wxres)
          } else {
            showToast('获取联系人信息失败，请重新进入后允许授权。')
          }
          if (returnFun) {
            console.log('returnFun', externalUserId)
            returnFun(externalUserId)
          }
        })
      } catch (e) {
        showToast('获取联系人信息失败，请重新进入。')
        if (returnFun) {
          returnFun()
        }
      }
    }) // 初始化成功
    .catch(() => {
      console.log('InitSdkAgentConfig-初始化失败')
      if (returnFun) {
        returnFun(externalUserId)
      }
    }) // 初始化失败
}

// 初始化文件预览sdk
export const initWxworkPreviewFileSdk = (returnFun) => {
  InitSdkAgentConfig({
    debug: false, // 是否开启调试
    jsApiList: ['previewFile'], // 需要使用的jsapi列表
  })
    .then((res) => {
      console.log('初始化文件预览sdk-初始化失败')
      if (returnFun) {
        returnFun()
      }
    })
    .catch(() => {
      console.log('初始化文件预览sdk-初始化失败')
      if (returnFun) {
        returnFun()
      }
    })
}
// 预览文件
export const goPreviewFile = (info) => {
  window.wx.previewFile({
    // 文件访问地址
    name: info.name,
    url: info.url,
    size: info.size,
  })
}
// 预览图片
export const goPreviewImage = (info) => {
  window.wx.previewImage({
    // 文件访问地址
    current: info.url,
    urls: [],
  })
}

// 分享
let shareIten = {}
// 分享给当前联系人
// 已处理消息条数
let finishedMessageCount = 0
let successedMessageCount = 0
// 待发送消息列表
let messageList = []
export const goToShare = async (item) => {
  finishedMessageCount = 0
  successedMessageCount = 0
  messageList = []
  const params = {
    contentId: item.id,
    sharedTo: externalUserId,
    isGroupShare: false,
  }
  const { success, data } = await sharePermission(params)
  if (success) {
    if (!data.enable) {
      item.suitable = false
      showToast(data.tips)
      return
    }
  } else {
    return
  }
  showLoadingToast({
    message: '分享中...',
    forbidClick: true,
    duration: 0,
  })
  shareIten = item
  if (shareIten.contentType !== 'text') {
    const params = {
      tasks: [],
    }
    for (let i = 0; i < shareIten.attachments.length; i++) {
      const tempItem = shareIten.attachments[i]
      if (tempItem.fileType === 'image') {
        const fileItem = {
          mediaUrl: tempItem.imageUrl,
          mediaType: 1,
        }
        params.tasks.push(fileItem)
      } else if (tempItem.fileType === 'video') {
        const fileItem = {
          mediaUrl: tempItem.videoUrl,
          mediaType: 2,
        }
        params.tasks.push(fileItem)
      } else if (tempItem.fileType === 'file') {
        const fileItem = {
          mediaUrl: tempItem.fileUrl,
          mediaType: 3,
        }
        params.tasks.push(fileItem)
      } else if (tempItem.fileType === 'audio') {
        const fileItem = {
          mediaUrl: tempItem.fileUrl,
          mediaType: 4,
        }
        params.tasks.push(fileItem)
      }
    }
    getMediaIdByUrlList(params)
  } else {
    messageList.push({
      msgtype: 'text',
      enterChat: false,
      text: {
        content: item.textContent,
      },
      returnFun: null,
    })
    if (shareIten.speech) {
      if (isPc) {
      }
      messageList.push({
        msgtype: 'text',
        enterChat: false,
        text: {
          content: isPc ? '\n\n' + shareIten.speech : shareIten.speech,
        },
        returnFun: null,
      })
    }
    // TODO
    // closeToast()
    sendMessageList()
  }
}
// 开始转换MediaId
const getMediaIdByUrlList = async (params) => {
  const { success, data } = await getMediaIdByUrl(params)
  if (success) {
    getMediaIdResult()
  }
}
// 接受转换MediaId结果
const getMediaIdResult = async () => {
  const params = {
    tasks: [],
  }
  for (let i = 0; i < shareIten.attachments.length; i++) {
    const tempitem = shareIten.attachments[i]

    if (tempitem.fileType === 'image') {
      const fileItem = {
        mediaUrl: tempitem.imageUrl,
      }
      params.tasks.push(fileItem)
    } else if (tempitem.fileType === 'video') {
      const fileItem = {
        mediaUrl: tempitem.videoUrl,
      }
      params.tasks.push(fileItem)
    } else if (tempitem.fileType === 'file') {
      const fileItem = {
        mediaUrl: tempitem.fileUrl,
      }
      params.tasks.push(fileItem)
    } else if (tempitem.fileType === 'audio') {
      const fileItem = {
        mediaUrl: tempitem.fileUrl,
      }
      params.tasks.push(fileItem)
    }
  }
  const { success, data } = await mediaIdResult(params)
  if (success) {
    if (data && data.needRetry) {
      setTimeout(() => {
        getMediaIdResult()
      }, 1000)
    } else {
      console.log('mediaResults', data.mediaResults)
      const list = data.mediaResults || []
      const msgs = []
      list.forEach((file) => {
        if (file.mediaType === 1) {
          msgs.push({
            msgtype: 'image',
            enterChat: false,
            image: {
              mediaid: file.mediaId,
            },
            returnFun: null,
          })
        }
        if (file.mediaType === 2) {
          msgs.push({
            msgtype: 'video',
            enterChat: false,
            video: {
              mediaid: file.mediaId,
            },
            returnFun: null,
          })
        }
        if (file.mediaType === 3) {
          msgs.push({
            msgtype: 'file',
            enterChat: false,
            file: {
              mediaid: file.mediaId,
            },
            returnFun: null,
          })
        }
        if (file.mediaType === 4) {
          msgs.push({
            msgtype: 'file',
            enterChat: false,
            file: {
              mediaid: file.mediaId,
            },
            returnFun: null,
          })
        }
        if (file.mediaType === 5) {
          msgs.push({
            msgtype: 'news',
            enterChat: false,
            news: {
              link: file.linkUrl, //H5消息页面url 必填
              title: file.title, //H5消息标题
              desc: file.desc, //H5消息摘要
              imgUrl: file.picUrl, //H5消息封面图片URL
            },
            returnFun: null,
          })
        }
      })
      if (shareIten.speech) {
        msgs.push({
          msgtype: 'text',
          enterChat: false,
          text: {
            content: shareIten.speech,
          },
          returnFun: null,
        })
      }
      messageList = messageList.concat(msgs)
      console.log('messageList', messageList)
      // TODO
      // closeToast()
      sendMessageList()
    }
  } else {
  }
}
// 发送消息列表
const sendMessageList = () => {
  // 多于一条待发送消息,组装回调函数，轮训发送消息，直到发送完毕
  let isLastMessage = false
  if (messageList.length - 1 > finishedMessageCount) {
    messageList[finishedMessageCount].returnFun = sendMessageList
  } else {
    isLastMessage = true
  }
  sendChatMessage(messageList[finishedMessageCount], isLastMessage)
}
//分享消息到当前会话
const sendChatMessage = (data, isLastMessage) => {
  console.log('消息体', data)
  try {
    window.wx.invoke('sendChatMessage', data, function (res) {
      console.log('sendChatMessage', res.err_msg)
      finishedMessageCount++
      if (res.err_msg == 'sendChatMessage:ok') {
        successedMessageCount++
        showToast('分享成功')
        //发送成功
        console.log('分享消息到当前会成功', data)
      } else if (res.err_msg == 'sendChatMessage:cancel') {
        showToast('已取消分享')
      } else{
        // TODO
        closeToast()
      }
      // 有回调执行回调，继续发送；
      if (data.returnFun) {
        setTimeout(() => {
          data.returnFun()
        }, 200)
      }
      // 最后一条消息，有成功发送的消息就调用计数接口
      if (isLastMessage && successedMessageCount > 0) {
        setShareCallback()
      }
    })
  } catch (error) {
    showToast("调用企微Api('sendChatMessage')失败")
  }
}
// 分享后,回调给后端
const setShareCallback = async () => {
  console.log('shareIten', shareIten)
  const params = {
    contentId: shareIten.id,
    sharedTo: externalUserId,
  }
  const { success, data } = await shareCallback(params)
}
