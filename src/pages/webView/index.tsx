import { WebView } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';

export default function Index() {
  const [src, setSrc] = useState('');
  useLoad((options) => {
    if (options.url) {
      setSrc(decodeURIComponent(options.url));
    } else {
      Taro.showModal({
        content: '地址错误',
        success() {
          Taro.navigateBack();
        },
      });
    }
    // 页面加载完成
  });
  return (<WebView src={src} />);
}
