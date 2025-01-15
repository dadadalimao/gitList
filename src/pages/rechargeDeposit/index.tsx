import { View, Text, Input } from '@tarojs/components';
import { useState } from 'react';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import './index.scss';
import AlertPage from '@/components/AlertPage';
import { useLoad } from '@tarojs/taro';
import request from '@/api/apiRequest';
import { getState } from '@/store';
import Taro from '@tarojs/taro';

export default function RechargeDeposit() {
  const [amount, setAmount] = useState('50');

  const handleConfirm = () => {
    /** 点击支付 */
    request({
      url: `/fd/deposit/recharge?memberId=${getState()?.loginMember.id}`,
      method: 'POST',
      data: {
        depositAmount: Number(amount),
        note: '充值保证金',
      },
    }).then((res1) => {
      /** 微信支付 */
      Taro.requestPayment({
        ...res1.data,
        package: res1.data.packageVal,
        success() {
          /** 支付成功 */
          Taro.navigateTo({ url: '/pages/paySuccess/index?type=feeder' });
        },
        fail() {
          /** 支付失败 */
          Taro.showToast({
            title: '支付失败',
            icon: 'none',
          });
        },
      });
    });
  };
  useLoad(() => {
    request({
      url: `/sys/weChatPay/JSAPIPlaceAnOrder?memberId=${getState()?.loginMember.id}`,
      // url: '/fd/feeder/feederDepositRecords?id=1870016983890792449',
      method: 'GET',
    }).then((res) => {
      console.log('res', res);
    });
  });
  return (
    <View className="recharge-deposit">
      <CustomNavigationBar title="充值保证金" theme="feeder" showBack>
        <View className="content">
          <View className="input-section">
            <Text className="label">请输入充值金额</Text>
            <View className="amount-input">
              <Text className="currency">¥</Text>
              <Input
                type="number"
                value={amount}
                onInput={(e) => setAmount(e.detail.value)}
                className="input"
              />
            </View>
          </View>

          <Text className="tip">保证金低于¥100，则不可接单</Text>

          <AlertPage>
            <View className="btn_feeder" onClick={handleConfirm}>
              确认支付
            </View>
          </AlertPage>
        </View>
      </CustomNavigationBar>
    </View>
  );
}
