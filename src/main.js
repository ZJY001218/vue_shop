import 'normalize.css'
import "@/assets/css/app.css"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 引入时间戳
import moment from 'moment'
// 引入富文本
import VueQuillEditor from 'vue-quill-editor'


// 引入全部api
import * as api from '@/http/api'

Vue.prototype.$api = api

Vue.config.productionTip = false

Vue.use(VueQuillEditor)

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


// 时间过滤器
Vue.filter('dateTime',function(v){
  console.log('时间:',v)
  return moment(v*1000).format('YYYY年MM月DD日 hh:mm:ss')
})

// 定义过滤器
// Vue.filter('rank', function (v) {
//   let result
//   switch (v) {
//     case '0': result = '一级' break
//     case '1': result = '二级' break
//     case '2': result = '三级' break
//   }
// })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
