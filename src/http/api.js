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



// 左侧菜单接口
export function getMenusApi() {
  return request({
    url: '/menus',
    method: 'GET'
  })
}



// 获取用户列表的接口
export function getUserListApi(params) {
  return request({
    url: '/users',
    method: 'GET',
    params
  })
}
// 添加用户列表的接口
export function addUserApi(data) {
  return request({
    url: '/users',
    method: 'POST',
    data
  })
}
// 修改用户列表的接口
export function editUserApi(userid, data) {
  return request({
    url: `users/${userid}`,
    method: 'PUT',
    data
  })
}
// 删除用户列表的接口
export function delUserApi(userid) {
  return request({
    url: `users/${userid}`,
    method: 'DELETE',
  })
}
// 修改权限用户列表的接口
export function changeUserApi(userid, status) {
  return request({
    url: `users/${userid}/state/${status}`,
    method: 'PUT',
  })
}
// 获取用户角色列表的接口
export function setUserApi() {
  return request({
    url: '/roles',
    method: 'GET',
  })
}
// 修改用户角色列表的接口
export function setUsertoRloesApi(userId, rid) {
  return request({
    url: `users/${userId}/role`,
    method: 'PUT',
    data: { rid }
  })
}



// 获取角色列表的接口
export function getRloesListApi() {
  return request({
    url: '/roles',
    method: 'GET'
  })
}
// 添加角色列表的接口
export function addRolesListApi(data) {
  return request({
    url: '/roles',
    method: 'POST',
    data
  })
}
// 修改角色列表的接口
export function editRolesListApi(rolesid, data) {
  return request({
    url: `roles/${rolesid}`,
    method: 'PUT',
    data
  })
}
// 删除角色列表的接口
export function delRolesListApi(rolesid) {
  return request({
    url: `roles/${rolesid}`,
    method: 'DELETE',
  })
}
// 权限列表的接口
export function getRightsListApi(type) {
  return request({
    url: `rights/${type}`,
    method: 'GET',
  })
}
// 角色授权的接口
export function setRightApi(roleid, rids) {
  return request({
    url: `roles/${roleid}/rights`,
    method: 'POST',
    data: { rids }
  })
}
// 角色标签删除接口
export function delTagApi(roleid, rightid) {
  return request({
    url: `roles/${roleid}/rights/${rightid}`,
    method: 'delete'
  })
}






// 获取商品列表的接口
export function getGoodsListApi(params) {
  return request({
    url: '/goods',
    method: 'GET',
    params
  })
}
// 删除商品列表的接口
export function delGoodsApi(goodsid) {
  return request({
    url: `/goods/${goodsid}`,
    method: 'DELETE',
  })
}
// 获取商品分类的接口
export function getGoodsCateListApi(params) {
  return request({
    url: '/categories',
    method: 'GET',
    params
  })
}
// 获取商品参数的接口
export function getGoodsParamsApi(cateId, sel = 'many') {
  return request({
    url: `/categories/${cateId}/attributes`,
    method: 'GET',
    params: { sel }
  })
}
// 添加商品的接口
export function addGoodsApi(data) {
  return request({
    url: '/goods',
    method: 'POST',
    data
  })
}
// 添加商品分类的接口
export function addGoodsCateApi(data) {
  return request({
    url: '/categories',
    method: 'POST',
    data
  })
}
// 编辑商品分类的接口
export function editGoodsCateApi(cateid,cat_name) {
  return request({
    url: `categories/${cateid}/`,
    method: 'PUT',
    data:{cat_name}
  })
}
// 删除角色列表的接口
export function delCateListApi(cateid) {
  return request({
    url: `categories/${cateid}`,
    method: 'DELETE',
  })
}
