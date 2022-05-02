/**
 * axios二次封装
 */

import Axios from 'axios'
import encConfig from './env'
import { Message } from 'element-ui'
import router  from '@/router'
import NProgress from 'nprogress'

//创建axios实例
const service = Axios.create({
  //设置基地址
  baseURL: encConfig.prod.baseURL,
  timeout: 5000
})

//创建请求拦截器
service.interceptors.request.use(
  (config) => {
    NProgress.start()
    if (config.url !== '/login') {
      const token = sessionStorage.getItem('token')
      token && (config.headers.Authorization = token)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//创建响应拦截器
service.interceptors.response.use(
  (res) => {
    NProgress.done()
    console.log('res:::', res)
    const {
      meta: { msg, status: code },
      data: result
    } = res.data
    const successCodeArr = [200, 201, 204]
    if (successCodeArr.includes(code)) {
      Message({
        message: msg,
        type: 'success'
      })

      if (res.config.url === '/login') {
        sessionStorage.setItem('token', result.token)
      }

      return result
    }

    Message({
      message: msg,
      type: 'error'
    })
    console.log(msg);
    if (msg === '无效token') {
      router.replace('/login')
    }
    return Promise.reject(msg)
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default service