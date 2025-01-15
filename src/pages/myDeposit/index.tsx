import { View, Text, Image } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import dayjs from 'dayjs';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import './index.scss';
import catImg from '@/images/feeder/cat.png';
import btnUpImg from '@/images/feeder/btnUp.png';
import depositImg from '@/images/myDeposit/myDeposit.svg';
import request from '@/api/apiRequest';
import { getState } from '@/store';

interface DepositRecord {
  type: string;
  amount: number;
  date: string;
  time: string;
  id: number;
}

export default function MyDeposit() {
  /** 保证金 */
  const [deposit, setDeposit] = useState<any>();
  /** 押金记录 */
  const [depositRecords, setDepositRecords] = useState<any>([]);
  /** 是保证金页面还是收益页面，true为保证金页面 */
  const [isDeposit, setIsDeposit] = useState<boolean>(true);

  useLoad(() => {
    /** 获取喂养员押金 */
    request({
      url: `/fd/feeder/info?id=${getState()?.loginMember.id}`,
      method: 'GET',
    }).then((res) => {
      setDeposit(res?.data?.deposit);
    });
    /** 获取喂养员押金记录 */
    request({
      url: `/fd/feeder/feederDepositRecords?id=${getState()?.loginMember.id}`,
      method: 'GET',
    }).then((res) => {
      setDepositRecords(res.data);
    });
  });

  const handleRecharge = () => {
    Taro.navigateTo({
      url: '/pages/rechargeDeposit/index',
    });
  };

  return (
    <View className="my-deposit">
      <CustomNavigationBar title={isDeposit ? '我的保证金' : '我的收益'} theme="feeder" showBack>
        <View className="header">
          <View className="flex_csb">
            <View className="amount-section">
              <View className="label">
                {isDeposit ? '保证金余额' : '我的收益'}
                <Image
                  src={depositImg}
                  className="label-img"
                  onClick={() => {
                    setIsDeposit((prev) => !prev);
                  }}
                />
              </View>
              <Text className="amount">{deposit}</Text>
            </View>
            <Image className="catImg" src={catImg} mode="aspectFill" />
          </View>
        </View>
        <View className="recharge-section">
          <View>
            <View className="tip">确保拥有足够的保证金</View>
            <Text className="sub-tip">保证金低于￥100，则不可接单</Text>
          </View>
          <View>
            <View className="recharge-btn flex_cc" onClick={handleRecharge}>
              充值
              <Image className="recharge-btn-up" src={btnUpImg} mode="aspectFill" />
            </View>
          </View>
        </View>

        <View className="records">
          <View className="title">{isDeposit ? '保证金明细' : '我的收益明细'}</View>
          {depositRecords.map((record) => (
            <View key={record.id} className="record-item">
              <View className="left">
                <Text className="type">{record.note}</Text>
                <Text className="date">
                  {dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </View>
              <Text className={`amount ${record.depositAmount > 0 ? 'positive' : 'negative'}`}>
                {record.depositAmount > 0 ? '+' : ''}
                {record.depositAmount}
              </Text>
            </View>
          ))}
        </View>
      </CustomNavigationBar>
    </View>
  );
}
