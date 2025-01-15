import { View, Image } from '@tarojs/components';
import rightImg from '@/images/mine/right.png';
import CamelText from '@/components/CamelText';
import Card from './Card';
import { NotYetOpen } from '@/utils/utils';

interface DepositCardProps {
  amount: number;
  navTo: (url: string) => void;
}

const DepositCard = ({ amount, navTo }: DepositCardProps) => {
  return (
    <View className="depositCard-view mt12">
      <Card
        title="我的保证金"
        expand={
          <View
            className="c_75 fz14 flex_ic"
            onClick={() => {
              if (NotYetOpen(2)) return;
              navTo('/pages/myDeposit/index');
            }}
          >
            <View className="lh1 mr4">查看明细</View>
            <Image className="icon14" src={rightImg} />
          </View>
        }
      >
        <View className="depositCard flex_cc">
          <View className="depositCard-amount flex_ccc">
            <CamelText
              texts={['¥', amount.toFixed(2)]}
              sizes={[16, 32]}
              lineHeight={['20px', '32px']}
              className="depositCard-amount-value bold"
            />
            <View className="depositCard-amount-label mt4 c_75 fz12">金额（元）</View>
          </View>
        </View>
      </Card>
    </View>
  );
};

export default DepositCard;
