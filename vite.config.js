import { defineConfig } from 'vite'
// 按需引入 components
import { VantResolver } from '@vant/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'

// 按需引入
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// 主要用于alias文件路径别名
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 兼容低版本浏览器
import topLevelAwait from 'vite-plugin-top-level-await'

import EnvironmentPlugin from 'vite-plugin-environment'

// 打包分析
// import { visualizer } from 'rollup-plugin-visualizer';
// ESLint

const useDevMode = true
const basePath = `/`
console.log('basePath', basePath)

// https://vitejs.dev/config/
export default defineConfig({
  base: basePath,
  plugins: [
    vue(),
    Components({
      resolvers: [
        VantResolver(), // 自动注册图标组件
        ElementPlusResolver({ importStyle: 'sass' }),
      ],
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver({ importStyle: 'sass' }), // 自动导入图标组件
      ],
    }),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: (i) => `__tla_${i}`,
    }),
    // 全局注册process.env
    EnvironmentPlugin('all', { prefix: 'VUE_APP_', defineOn: 'import.meta.env' })
    // visualizer({ open: true })
    // eslint()
  ],
  define: {
    'process.env': {}
  },
  //设置的别名
  resolve: {
    // 执行npm i @types/node --save-dev
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@common': path.resolve(__dirname, './src/common'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@components': path.resolve(__dirname, './src/components'),
      '@views': path.resolve(__dirname, './src/views'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@@': path.resolve(__dirname, '../common'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/element/index.scss" as *;`,
      },
    },
  },
  // 服务配置
  server: {
    port: 8086, // 端口号
    origin: 'http://localhost:8086',
    host: '0.0.0.0',
    open: false, // 自动在浏览器打开
    https: false, // 是否开启 https
    proxy: {
      // 代理所有 /api 的请求，该求情将被代理到 target 中
      '/api': {
        // 代理请求之后的请求地址（你的真实接口地址)
        target: 'https://csc-dev.dustess.net/backend',
        // target: 'https://scrm-test.csc.com.cn/backend',
        secure: false,
        // 跨域
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // pathRewrite: {
        //   '^/api': ''
        // },
        onProxyRes: function (proxyRes) {
          console.log('proxyRes', proxyRes)
          var cookies = proxyRes.headers['set-cookie']
          var cookieRegex = /Path=\XXX\//i
          // 修改cookie Path
          if (cookies) {
            var newCookie = cookies.map(function (cookie) {
              if (cookieRegex.test(cookie)) {
                return cookies.replace(cookieRegex, 'Path=/')
              }
              return cookie
            })
            // 修改cookie path
            delete proxyRes.headers['set-cookie']
            proxyRes.headers['set-cookie'] = newCookie
          }
        },
      },
      // 本地开始时，配置前端静态资源代理
      '/front/@vite': {
        target: 'http://localhost:8086/@vite',
        rewrite: (path) => path.replace(/^\/front\/@vite/, ''),
      },
      '/front/src': {
        target: 'http://localhost:8086/src',
        rewrite: (path) => path.replace(/^\/front\/src/, ''),
      },
    },
  },
  //  生产环境
  build: {
    //指定输出路径
    assetsDir: 'static',
    // 指定输出文件路径
    outDir: 'dist',
    // 代码压缩配置
    terserOptions: {
      // 生产环境移除console
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString()
          }
        },
      },
    },
  },
})
