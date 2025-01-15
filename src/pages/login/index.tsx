import { View, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
    // request示例
    Taro.request({
      url: '/oss/getSignature',
      method: 'GET',
    }).then(res => {
      console.log(res);
    });
  });

  return (
    <View className="index">
      <Text>LOGIN</Text>
    </View>
  );
}
