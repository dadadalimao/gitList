import { View, Text, Image } from '@tarojs/components';
import orderImg from '@/images/ownerOrder/order.png';
import './index.scss';

interface OrderTypeProps {
  type: 'ASSIGN' | 'PLATFORM' | string; // ASSIGN: 指定喂养员, PLATFORM: 平台分配
}

const typeTextMap = {
  ASSIGN: '指定喂养员',
  PLATFORM: '系统分配',
};

export default function OrderType({ type = 'ASSIGN' }: OrderTypeProps) {
  return (
    <View className="order-type flex_ic fz12">
      <Image src={orderImg} className="icon18 mr6" />
      <Text className="label">下单方式：</Text>
      <Text className="value">{typeTextMap[type] || ''}</Text>
    </View>
  );
}
