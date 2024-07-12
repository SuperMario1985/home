import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { store } from './store'

// 添加调试工具
// import VConsole from 'vconsole'
// let isPc = false
// const jugeIsPc = () => {
//   const pattern =
//     /android|bb\d+|ucweb|meego|avantgo|bada\/|blackberry|transcoder|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
//   return !window.navigator.userAgent.match(pattern)
// }
// isPc = jugeIsPc()
// if (!isPc) {
//   const vConsole = new VConsole()
// }

const env = import.meta.env
console.log('vite环境变量', env)
console.log('node环境变量', process.env)

let instance = null

async function render() {
  instance = createApp(App)
  instance.use(router)
  instance.use(store)
  instance.config.globalProperties.$isHas = (code) => {
    const list = []
    return list
  }
  // 必须在挂载dom之前赋值
  instance.mount('#micro')
}

if (env.VITE_USER_NODE_ENV === 'development') {
  render()
} else {
  render()
}
