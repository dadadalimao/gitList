import Taro from '@tarojs/taro';
import { dispatch, getState } from '../store';
import request from './apiRequest';

/**
 * 自动登录，获取已经保存的登录信息
 * @returns 用户信息
 */
const autoLogin = () => Taro.getStorage({
  key: 'loginMember',
}).then((res) => {
  if (res.data) {
    dispatch({ type: 'member.update', payload: res.data });
  }
  return res.data;
}).catch(() => { });

/**
 * 登录
 */
const login = (params: { account: string, code: string }) => request({
  url: '/mem/member/login',
  method: 'POST',
  data: params,
  loading: '正在登录',
}).then(({ data }) => {
  console.log('data', data);
  Taro.setStorage({
    key: 'loginMember',
    data,
  });
  dispatch({
    type: 'member.update',
    payload: data,
  });
  return data;
});

/**
 * 获取当前登录用户的信息
 *@param needFeederInfo 是否需要获取饲养员信息
 */
const getInfo = (id?: string, needFeederInfo?: boolean) => {
  // 获取会员基本信息
  const getMemberInfo = () => Taro.request({
    url: '/mem/member/info',
    method: 'GET',
  });

  // 获取饲养员信息
  const getFeederInfo = () => Taro.request({
    url: `/fd/feeder/info?id=${id || getState()?.loginMember?.id}`,
    method: 'GET',
  });

  if (needFeederInfo) {
    // 同时请求会员信息和饲养员信息
    return Promise.all([getMemberInfo(), getFeederInfo()])
      .then(([memberRes, feederRes]) => {
        const loginMember = {
          ...memberRes.data,
          feeder: feederRes.data,
          token: getState()?.loginMember?.token,
        };

        Taro.setStorage({
          key: 'loginMember',
          data: loginMember,
        });

        dispatch({
          type: 'member.update',
          payload: loginMember,
        });

        return loginMember;
      });
  }

  // 只请求会员信息
  return getMemberInfo().then(({ data }) => {
    const loginMember = {
      ...data,
      token: getState()?.loginMember?.token,
    };

    Taro.setStorage({
      key: 'loginMember',
      data: loginMember,
    });

    dispatch({
      type: 'member.update',
      payload: loginMember,
    });

    return loginMember;
  });
};
/**
 * 登出
 */
const logout = () => {
  Taro.removeStorage({
    key: 'loginMember',
  });
  dispatch({
    type: 'member.update',
    payload: undefined,
  });
  dispatch({
    type: 'setIdentity',
    payload: 'owner',
  });
};

export {
  autoLogin, login, getInfo, logout,
};
