
(function () {
    // 授权码
    // let authCode = 'csc_auth_code'
    // let authCode = 'wxee4c15650f2ab0db_1000138_7658bd4a'
    let authCode = 'ww3f643cad7cd6785c_100052_b7e6f442'
    
    // 企微id
    // let corpId = 'csc_corp_id'
    let corpId = 'wxee4c15650f2ab0db'
    
    // 初始化SDK
    initSdk()
    function initSdk() {
        const userAgent = window.navigator.userAgent
        // 企微环境
        const isWeCom =/wxwork/i.test(userAgent) && /MicroMessenger/i.test(userAgent)
        // 微信环境
        const isWeChat = !isWeCom && /MicroMessenger/i.test(userAgent)
        // const scriptTagList = window.document.getElementsByTagName('script')
        // if(isWeChat){
        //     var bo = confirm("确定要关闭吗？")
        //     if(bo){
        //         window.close();
        //     }else{
        //     window.location.reload()
        //     }
        // }
        // 获取corpId和authCode
        // for (let i = 0; i < scriptTagList.length; i++) {
        //     const item = scriptTagList[i];
        //     if (item.attributes && item.attributes.csc_weixin_auth_code && item.attributes.csc_weixin_courp_id) {
        //         authCode = item.attributes.csc_weixin_auth_code
        //         corpId = item.attributes.csc_weixin_courp_id
        //         break
        //     }
        // }
        if (!authCode || !corpId) {
            return
        }
        // 获取授权信息 
            // 未授权 TODO
        // 加载微信 sdk
        loadScript('https://wwcdn.weixin.qq.com/node/open/js/wecom-jssdk-1.3.1.js').then(() => {
            // 微信授权
            ww.register({
                corpId,
                jsApiList: ['hideAllNonBaseMenuItem', 'hideOptionMenu'],
                getConfigSignature,
                onConfigSuccess(res) {
                    console.log("onConfigSuccess:", res, '授权成功')
                },
                onConfigFail(res) {
                    console.log("onConfigFail:", res, '授权失败')
                },
            })
            // 隐藏按钮
            ww.hideAllNonBaseMenuItem()
            ww.hideOptionMenu()
        }).catch((error) => {
            console.log(error)
        })
    }
    // 获取签名
    async function getConfigSignature(url) {
        const res = await myAjax({
            url: 'https://proxy-dev.dustess360.com/backend/csc-istp-customer-scrm/customer/scrm/openApi/agent/authorization',
            method: 'post',
            data: {
                jsAuthCode: authCode,
                authUrl: url
            }
        }).then(response => {
            if (response && response.code === '200' && response.success) {
                const signatureInfo = {
                    nonceStr:response.data.nonceStr,
                    signature:response.data.signature,
                    timestamp:response.data.timestamp
                }
                return signatureInfo
            }
        }).catch(error => {
            return error
        })
        return res
    }
    // 1. 定义myAjax函数，返回Promise对象
    function myAjax(config) {
        return new Promise((resolve, reject) => {
            // 2. 发起XHR请求，默认请求方法为GET
            const xhr = new XMLHttpRequest()
            xhr.open(config.method || 'GET', config.url)
            xhr.setRequestHeader('Content-Type', 'application/json')
            // xhr.setRequestHeader('Cookie', 'access_token=eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2OTk5MjIzMjIsInN1YiI6IntcImNvcnBJZFwiOlwid3czZjY0M2NhZDdjZDY3ODVjXCIsXCJwb3NpdGlvblByb3BlcnR5XCI6XCIxXCIsXCJxd1VzZXJJZFwiOlwiYmZfYWRtaW5cIixcInJvbGVJZExpc3RcIjpbMV0sXCJ1c2VySWRcIjpcIjFcIixcInVzZXJOYW1lXCI6XCJiZl9hZG1pblwiLFwidXNlclNvdXJjZVwiOlwiMVwifSJ9.0pEGw-TykuyC46zRm8aQvzRRk1nSqlM3ZfPfr7J5veHgeDfwoSbjOPIdPLFmq_5tjPY0r2adR8sHOOjAQ5nZkg')
            xhr.addEventListener('loadend', () => {
                // 3. 调用成功/失败的处理程序
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.response))
                } else {
                    reject(new Error(xhr.response))
                }
            })
            const data = JSON.stringify(config.data || {})
            xhr.send(data)
        })
    }
    // 加载js
    function loadScript(src) {
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
    window.csc_wxwork_sdk = {
        //开放能力 按需申请TODO
        // 拍照、定位等
    }
})();
