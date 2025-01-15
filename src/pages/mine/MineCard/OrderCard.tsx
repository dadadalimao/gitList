import { View, Image } from '@tarojs/components';
import { orderCard } from '@/utils/data';
import rightImg from '@/images/mine/right.png';
import Card from './Card';

export default function OrderCard({ msg, navTo }) {
  return (
    <View className="orderCard-view mt12">
      <Card
        title="我的订单"
        expand={
          <View className="c_75 fz14 flex_ic" onClick={() => navTo('/pages/myOrder/index')}>
            <View className="lh1 mr4">全部订单</View>
            <Image className="icon14" src={rightImg} />
          </View>
        }
      >
        <View className="orderCard flex_csb mt10">
          {orderCard.map((item) => {
            return (
              <View
                className="flex_ccc orderCard-item"
                key={item.title}
                onClick={() => navTo(item.url)}
              >
                {msg[item.key] <= 0 ? null : (
                  <View className="orderCard-item-num">{msg[item.key]}</View>
                )}
                <Image className="icon28" src={item.icon} />
                <View className="mt4 c_75 fz12">{item.title}</View>
              </View>
            );
          })}
        </View>
      </Card>
    </View>
  );
}
