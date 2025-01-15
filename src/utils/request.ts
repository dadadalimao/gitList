/**
 * http请求的方法
 * Created at 2021-07-09 11:32
 *
 * @author Wheeler https://github.com/WheelerLee
 * @copyright 2021 Activatortube, INC.
 *
 */
import Taro from '@tarojs/taro';
import { dispatch, getState } from '@/store';
import { language } from '@/locales';
import { logout } from '@/api/member';

interface CustomError extends Error {
  code?: number | string;
}

// const request = Taro.request;

const interceptor = function (chain) {
  console.log(Taro.getEnv());
  const { requestParams } = chain;

  if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
    Taro.showNavigationBarLoading();
  }
  if (
    !requestParams.url.startsWith('http://')
    && !requestParams.url.startsWith('https://')
  ) {
    requestParams.url = process.env.BASE_URL + requestParams.url;
  }
  const member = getState()?.loginMember || Taro.getStorageSync('loginMember');
  // const member = Taro.getApp().loginMember;
  const header: any = {
    'accept-language': language,
  };
  if (member) {
    // eslint-disable-next-line no-underscore-dangle
    // header.id = member.id;
    // // eslint-disable-next-line no-underscore-dangle
    // header.token = member.token;
    header.Authorization = member.token;
  }
  requestParams.header = header;
  return chain.proceed(requestParams).then((res) => {
    console.log('🚗 ~ request', res.data, requestParams);
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      Taro.hideNavigationBarLoading();
    }
    if (res.statusCode === 200) {
      if (res.data.code === 0) {
        return res.data;
      }
      const notLoggedInCb = () => {
        logout();
        const hasLoginPages = ['pages/petServices/index', 'pages/mine/index'];

        const pages = Taro.getCurrentPages();
        const { route } = pages[pages.length - 1];
        if (route && hasLoginPages.includes(route)) return;
        dispatch({ type: 'member.isLogin', payload: true });
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/petServices/index',
          });
        }, 1000);
      };

      if (res.data.code === 401) {
        Taro.showToast({
          icon: 'none',
          title: res?.data?.msg || '登录信息过期，请重新登录',
          complete: () => {
            notLoggedInCb();
          },
        });
      }
      if (res.data.code === 403) {
        notLoggedInCb();
      }
    }
    const err: CustomError = new Error();

    err.code = res.data.code;
    err.message = res.data.msg;
    // console.log('🚀 ~ returnchain.proceed ~ err:', err);
    return Promise.reject(err);
  });
};

Taro.addInterceptor(interceptor);

// export default request;
