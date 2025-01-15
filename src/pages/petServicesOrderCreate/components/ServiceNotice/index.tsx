import { View, Text } from '@tarojs/components';
import './index.scss';

export default function ServiceNotice() {
  return (
    <View className="service-notice">
      <Text className="notice-title">服务须知</Text>
      <View className="notice-item">1、请确保提供的联系方式准确无误</View>
      <View className="notice-item">2、建议提前与喂养员沟通具体服务细节</View>
      <View className="notice-item">3、如有特殊情况请在服务叮嘱中说明</View>
    </View>
  );
}
