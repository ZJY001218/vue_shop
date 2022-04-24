/**
 * 项目业务请求接口
 */

 import request from './request'

 //封装登录接口
 export function LoginApi(data) {
   return request({
     url: '/login',
     method: 'POST',
     data
   })
 }