import { httpServe } from './baseService'
// oauth2地址
export const WXOAUTHURL = 'https://open.weixin.qq.com/connect/oauth2/authorize'
// scope定义，获取个人信息范围
export const USERINFO_SCOPE = 'snsapi_userinfo'
// state定义，用于企微回调连接上判断回调状态
export const STATE = 'redirect'
const sdkUrl = 'https://res.wx.qq.com/wwopen/js/jsapi/jweixin-1.0.0.js'
let JSAPILIST = ['agentConfig', 'sendChatMessage', 'getContext', 'getCurExternalContact']

export function login(info, successFun) {
    let resultInfo = {
        success: false,
        data: null,
        msg: ''
    }
    httpServe({
        method: "post",
        url: "/api-sso/login/toLogin",
        data: {
            password: '82B1ED4CA72D23BB86B343D4B3FE4552',
            uid: 'bf_admin',
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
        if (successFun) {
            successFun(resultInfo);
        }
    }).catch(function (res) {
        if (successFun) {
            successFun(resultInfo);
        }
    })
}
// 本地使用测试登录
export const fakeLogin = (info, successFun) => {
    let resultInfo = {
        success: false,
        data: null,
        msg: ''
    }
    const res = httpServe({
        method: "get",
        url: "/api-sso/scrm/login/getTestEmployeeInfo",
        params: {
            qwUserId: info.qwUserId,
            corpId: info.corpId
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
        return resultInfo
    }).catch(function (res) {
        return resultInfo
    })
    return res
}

// 微信授权 wxworkCode为微信授权成功后返回的code值
export const wxworkLogin = async () => {
    console.log('子应用单独加载','微信授权服务开始')
    const query = parseQuery()
    const sessionCode = sessionStorage.getItem('wxworkCode')
    let curAppId = ''
    let curAgentId = ''
    if (query.appid && query.agentid) {
        sessionStorage.setItem('curAppId', query.appid)
        sessionStorage.setItem('curAgentId', query.agentid)
    } else {
        curAppId = sessionStorage.getItem('curAppId') || ''
        curAgentId = sessionStorage.getItem('curAgentId') || ''
    }
    if (query.code && query.state === 'redirect' && query.code !== sessionCode) {
        console.log('子应用单独加载','获取员工信息')
        sessionStorage.setItem('wxworkCode', query.code)
        const appId = query.appid || curAppId
        const agentId = query.agentid || curAgentId
        let resultInfo = {
            data: {},
            msg: undefined,
            success: false,
        };
        const res = await httpServe({
            method: "get",
            url: "/api-sso/scrm/login/getLoginEmployeeInfo",
            params: {
                code:query.code,
                corpId:appId,
                agentId:agentId
            }
        }).then(function (response) {
            console.log('子应用单独加载','获取员工信息-成功')
            resultInfo.success = response.data.success;
            resultInfo.data = response.data.data;
            resultInfo.msg = response.data.msg;
            return resultInfo
        }).catch(function (error) {
            console.log('子应用单独加载','获取员工信息-失败')
            resultInfo.msg = error?.msg;
            return resultInfo
        })
        return res
    } else {
        console.log('子应用单独加载','去微信页面授权')
        window.location.replace(`${WXOAUTHURL}?appid=${query.appid || curAppId}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&USERINFO_SCOPE=${USERINFO_SCOPE}&state=${STATE}#wechat_redirect`)
    }
    // return new Promise((resolve, reject) => {
    //     if (query.code && query.state === 'redirect' && query.code !== sessionCode) {
    //         sessionStorage.setItem('wxworkCode', query.code)
    //         const appId = query.appid || curAppId
    //         const agentId = query.agentid || curAgentId
    //         getLoginEmployeeInfo(query.code, appId, agentId).then(res => {
    //             if (res.success) {
    //                 resolve(res.data)
    //             } else {
    //                 reject(res.message)
    //             }
    //         }).catch(err => {
    //             reject(err)
    //         })
    //     } else {
    //         window.location.replace(`${WXOAUTHURL}?appid=${query.appid || curAppId}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&USERINFO_SCOPE=${USERINFO_SCOPE}&state=${STATE}#wechat_redirect`)
    //     }
    // })
}

// export const wxworkLogin = async (postInfo) => {
//     const query = parseQuery()
//     const sessionCode = sessionStorage.getItem('wxworkCode')
//     let curAppId = ''
//     let curAgentId = ''
//     if (query.appid && query.agentid) {
//         sessionStorage.setItem('curAppId', query.appid)
//         sessionStorage.setItem('curAgentId', query.agentid)
//     } else {
//         curAppId = sessionStorage.getItem('curAppId') || ''
//         curAgentId = sessionStorage.getItem('curAgentId') || ''
//     }
//     const res = await httpServe({
//         method: "post",
//         url: `${basePath}/content/list`,
//         data: postInfo
//     }).then(function (response) {
//         resultInfo.success = response.data.success;
//         resultInfo.data = response.data.data;
//         resultInfo.msg = response.data.msg;
//         return resultInfo
//     }).catch(function (error) {
//         resultInfo.msg = error?.msg;
//         return resultInfo
//     })
//     return res
// }

// 本地使用测试登录
export const getmMenuActionList = () => {
    let resultInfo = {
        success: false,
        data: null,
        msg: ''
    }
    const res = httpServe({
        method: "get",
        url: "/support-permission/menu/getMenuAction",
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
        return resultInfo
    }).catch(function (res) {
        return resultInfo
    })
    return res
}
// 根据企微code换取用户信息
const getLoginEmployeeInfo = async (code, corpId, agentId) => {
    let resultInfo = {
        success: false,
        data: null,
        msg: ''
    }
    return new Promise((resolve, reject) => {
        httpServe({
            method: "get",
            url: "/api-sso/scrm/login/getLoginEmployeeInfo",
            params: {
                code,
                corpId,
                agentId
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
            reject(resultInfo)
        })
    })
}

// 算签返回的 config 配置
const getSign = async (agentId, corpId, signUrl, ticketType) => {
    console.log('getSign', agentId, corpId, signUrl, ticketType)
    let resultInfo = {
        success: false,
        data: null,
        msg: ''
    }
    const res = await httpServe({
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
        return resultInfo
    }).catch(function (res) {
        return resultInfo
    })
    return res
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
                appId: query.appid || curAppId || process.env.VUE_APP_CORPID,
                agentId: query.agentid || curAgentId || process.env.VUE_APP_AGENTID,
                jsApiList,
                debug,
                resolve,
                reject
            })
        } else {
            // loadScript('https://res.wx.qq.com/wwopen/js/jsapi/jweixin-1.0.0.js').then(() => {
            loadScript('https://res.wx.qq.com/wwopen/js/jsapi/jweixin-1.0.0.js').then(() => {
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

export const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = src
        script.async = true
        let r = false
        document.getElementsByTagName('head')[0].appendChild(script)
        script.onload = script.onreadystatechange = () => {
            if (!r) {
                r = true;
                resolve('onload')
            }
        }
    })
}

function parseQuery() {
    const herf = window.location.href
    const query = herf.split('?')[1]
    const queryArr = query && query.split('&') || []
    const queryObj = {}
    queryArr.forEach(item => {
        const key = item.split('=')[0].toLowerCase()
        queryObj[key] = item.split('=')[1]
    })
    return queryObj
}