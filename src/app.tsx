import Taro, { useLaunch } from '@tarojs/taro';
import { I18nextProvider } from 'react-i18next';
import { ContextProvider } from '@/store';
import i18n, { getLanguage } from '@/locales';
import './utils/request';
// import 'taro-ui/dist/style/index.scss';
// import '@nutui/nutui-react-taro/dist/style.css';
import './app.scss';
import { autoLogin } from './api/member';

type Props = {
  children: React.ReactNode;
};

function Child(props: Props) {
  // useLaunch((options) => {
  //   console.log('App launched options:', options);
  //   i18n.changeLanguage(getLanguage());
  // });
  useLaunch((options) => {
    if (process.env.BASE_URL === 'https://api-test.woffie.cn') {
      console.log('☝🏻🤓 api-test.woffie.cn 测试服');
    }
    console.log('App launched options:', options);
    i18n.changeLanguage(getLanguage());
    autoLogin();

    const updateManager = Taro.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate();
    });

    updateManager.onUpdateFailed(() => {
      // 新版本下载失败
    });
  });

  return <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>;
}
function App(props: Props) {
  return (
    <ContextProvider>
      <Child>{props.children}</Child>
    </ContextProvider>
  );
}

export default App;
