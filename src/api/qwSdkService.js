import { httpServe } from './baseService'
import { loadScript, parseQuery } from '../utils'

// 企微算签接口
let JSAPILIST = ['agentConfig', 'sendChatMessage', 'getContext', 'getCurExternalContact','shareToExternalMoments','hideOptionMenu','hideAllNonBaseMenuItem']
const sdkUrl = window.location.origin + '/backend/oss-service/downloadFile?objectName=front-files/wxsdk.js'

// 算签返回的 config 配置
const getSign = async (agentId, corpId, signUrl, ticketType) => {
    console.log('getSign', agentId, corpId, signUrl, ticketType)
    let resultInfo = {
        success: false,
        data: null,
        msg: ''
    }
    return new Promise((resolve, reject) => {
        httpServe({
            method: "post",
            url: "/microservice-wxwork/client/js_sdk_sign_post",
            data: {
                agentId,
                corpId,
                signUrl,
                ticketType,
            }
        }).then(function (response) {
            if (response.status === 200 &&
                response.data &&
                response.data.code === '500200') {
                resultInfo.success = true;
                resultInfo.data = response.data.data;
                resultInfo.msg = response.data.msg;
            } else {
                resultInfo.msg = response.data.msg;
            }
            resolve(resultInfo)
        }).catch(function (res) {
            resultInfo.msg = res.msg;
            reject(resultInfo)
        })
    })
}

const initAgentConfig = async ({ appId, agentId, jsApiList, debug, resolve, reject }) => {
    const signUrl = location.href.split('#')[0]

    getSign(agentId, appId, signUrl, 'agent_config').then((res) => {
        const data = res.data
        window.wx.agentConfig({
            debug: debug,
            corpid: appId, // 企业微信 corpid
            agentid: agentId, // 企业微信 应用id
            timestamp: data.timestamp, // 签名的时间戳
            nonceStr: data.nonceStr, // 签名的随机串
            signature: data.signature, // 签名
            jsApiList: JSAPILIST.concat(jsApiList), // 需要使用的jsapi列表
            success: function (res) {
                console.log('wx.agentConfig success', res)
                if(window.wx && window.wx.hideOptionMenu){
                    window.wx.hideOptionMenu()
                    window.wx.hideAllNonBaseMenuItem()
                }
                resolve(res)
            },
            fail: function (res) {
                console.log('wx.agentConfig fail', res)
                reject(res)
            },
        })
    }).catch((error) => {
        console.log(error)
        reject(error)
    })
}

// wx.agentConfig 注入应用的身份与权限，当前使用这个方式
export const InitSdkAgentConfig = async ({ debug = false, jsApiList = [] }) => {
    return new Promise((resolve, reject) => {
        const query = parseQuery()
        let curAppId = ''
        let curAgentId = ''
        if (query.appid && query.agentid) {
            sessionStorage.setItem('curAppId', query.appid)
            sessionStorage.setItem('curAgentId', query.agentid)
        } else {
            curAppId = sessionStorage.getItem('curAppId') || ''
            curAgentId = sessionStorage.getItem('curAgentId') || ''
        }
        console.log('curAppId&curAgentId:query', query.appid, query.agentid)
        console.log('curAppId&curAgentId:storage', curAppId, curAgentId)
        if (window.wx && window.wx.agentConfig) {
            initAgentConfig({
                appId: query.appid || curAppId,
                agentId: query.agentid || curAgentId,
                jsApiList,
                debug,
                resolve,
                reject
            })
        } else {
            // loadScript('https://res.wx.qq.com/wwopen/js/jsapi/jweixin-1.0.0.js').then(() => {
            loadScript(sdkUrl).then(() => {
                initAgentConfig({
                    appId: query.appid || curAppId,
                    agentId: query.agentid || curAgentId,
                    jsApiList,
                    debug,
                    resolve,
                    reject
                })
            }).catch((error) => {
                console.log(error)
                reject(error)
            })

        }
    })
}

// 调用企微sdk发送聊天消息
export const QwSendChatMessage = (msgObj) => {
    window.wx.invoke('sendChatMessage', msgObj, (res) => {
        if (res.err_msg === 'sendChatMessage:ok') {
            console.log('QwSendChatMessage 消息发送成功')
        } else {
            console.log('QwSendChatMessage 消息发送失败')
        }
    })
}

export default { InitSdkAgentConfig, QwSendChatMessage }