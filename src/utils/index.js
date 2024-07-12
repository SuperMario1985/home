
export const parseQuery = () => {
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

export const sessionStorage = {
    setItem(key, value) {
        window.sessionStorage.setItem(key, value)
    },
    getItem(key) {
        return window.sessionStorage.getItem(key)
    },
    removeItem(key) {
        window.sessionStorage.removeItem(key)
    }
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

export function getFileUrl(objectName, backendUrlPrefix = import.meta.env.VITE_VUE_APP_BACKEND_URL || '/backend', backendUrlSuffix = '/oss-service/downloadFile') {
    return `${backendUrlPrefix}${backendUrlSuffix}?objectName=${objectName}`
}

export default {
    parseQuery,
    sessionStorage,
    loadScript
}
