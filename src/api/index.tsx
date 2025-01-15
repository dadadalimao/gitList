import Taro from '@tarojs/taro';
import request from './apiRequest';

const loading = '加载中...';
/** 宠物友好地图获取范围地图列表 */
export const getMapList = (data) => {
  return Taro.request({
    url: '/fr/map/findRecentAll',
    method: 'POST',
    data,
    // loading,
  });
};

/** 宠物友好地图获取地点信息 */
export const getMapInfo = (data) => {
  return request({
    url: '/fr/map/info',
    method: 'GET',
    data,
    loading: '获取信息...',
  });
};
/** 添加地图申请标注
 */
export const friendlyMapAdd = (data) => {
  return request({
    url: '/fr/map/add',
    method: 'POST',
    data,
    loading: '提交中...',
  });
};

/** 获取我的申请 */
export const getMapMyApply = () => {
  return request({
    url: '/fr/map/myApply',
    method: 'GET',

    loading,
  });
};

/** 获取字典列表 */
export const getBaseDictList = (code) => {
  return request({
    url: '/base/dict/getList',
    method: 'GET',
    data: { code },
  });
};

/** 获取字典详情 */
export const getBaseDictInfo = (code) => {
  return request({
    url: '/base/dict/getInfo',
    method: 'GET',
    data: { code },
  });
};

/** 获取常量详情 */
export const getConstantInfo = (code) => {
  return request({
    url: '/base/constant/info',
    method: 'GET',
    data: { code },
  });
};
/** 获取所有未删除的宠物种类信息 */
export const getAllNotDeletedKinds = () => {
  return request({
    url: '/pt/kind/allNotDel',
    method: 'GET',
  });
};
/** 获取领养列表信息 */
export const getAdoptList = (data) => {
  return request({
    url: '/pt/adopt/list',
    method: 'POST',
    data,
    loading,
  });
};
/** 宠物详情 */
export const getPetInfo = (id) => {
  return request({
    url: '/pt/pet/info',
    method: 'GET',
    data: { id },
    loading: '获取宠物信息',
  });
};

/** 获取地址列表 */
export const addressListApi = () => {
  return request({
    url: '/mem/address/list',
    method: 'GET',
    loading,
  });
};

/** 删除地址 */
export const addressDeleted = (data) => {
  return request({
    url: '/mem/address/deleted',
    method: 'GET',
    data,
    loading: '删除中...',
  });
};

/** 修改地址信息 */
export const addressModify = (data) => {
  return request({
    url: '/mem/address/modify',
    method: 'POST',
    data,
    loading: '正在保存',
  });
};

/** 获取地址详情 */
export const addressInfo = (data) => {
  return request({
    url: '/mem/address/info',
    method: 'GET',
    data,
    loading,
  });
};
