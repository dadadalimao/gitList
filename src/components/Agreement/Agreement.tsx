import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';

interface Props {
  className?: string;
  children?: any,
  type: 'platform' | 'privacy' | 'feeder'
}

/**
 * Agreement组件，默认函数组件
 * 该组件用于展示协议内容，并提供跳转到协议页面的功能
 * @property {string} [className] - 可选的类名
 * @property {string} [text] - 可选的文本内容
 * @property {string} type - 协议类型 platform privacy feeder
 */
export default function Agreement({
  className, children, type,
}: Props) {
  // 协议链接地址对象，根据type属性选择对应的链接
  const urls = {
    platform: 'https://www.woffie.cn/platform.html',
    privacy: 'https://www.woffie.cn/privacy.html',
    feeder: 'https://www.woffie.cn/feeder.html',
  };

  // 返回一个Text组件，包含点击跳转到协议页面的功能
  return (
    <View
      className={className}
      onClick={(e) => {
        // 阻止默认事件，防止事件传播
        e.stopPropagation();
        // 根据type属性和随机数生成协议页面的链接，避免缓存
        const url = `${urls[type]}?${Math.random()}`;
        // 使用Taro的navigateTo方法跳转到webView页面，传递协议链接作为参数
        Taro.navigateTo({
          url: `/pages/webView/index?url=${encodeURIComponent(url)}`,
        });
      }}
    >
      {children}
    </View>
  );
}
