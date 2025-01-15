/* eslint-disable @typescript-eslint/quotes */
import { View, Button, Input, Textarea, Image, Text } from '@tarojs/components';
import Taro, { useLoad, setNavigationBarTitle } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import { AtListItem, AtSwipeAction } from 'taro-ui';
import 'taro-ui/dist/style/components/swipe-action.scss';
import { orderCard } from '@/utils/data';
import defaultAvatar from '@/images/defaultAvatar.png';
import copyImg from '@/images/myOrder/copy.svg';

export default function Index() {
  const [memberId, setMemberId] = useState();
  const [orderTab, setOrderTab] = useState<any>([
    {
      title: '全部',
      key: 'all',
      url: '',
      icon: '',
    },
  ]);
  const [nowTab, setNowTab] = useState<string>('all');
  const [msg, setMsg] = useState({
    Unpaid: 1,
    WaitingForAcceptance: 1,
    WaitingForArrival: 2,
    InProgress: 3,
    WaitingForApproval: 4,
  });

  useLoad((opt) => {
    setNavigationBarTitle({ title: '我的订单' });
    setOrderTab((pre) => [...pre, ...orderCard]);
    console.log('opt', opt);
    if (opt.nowKey) {
      setNowTab(opt.nowKey);
    }
  });

  return (
    <View className="myOrder-container">
      <View className="myOrder-main">
        {/* 订单状态 */}
        <View className="tabs">
          {orderTab.map((item) => (
            <View
              key={item.key}
              className={nowTab === item.key ? 'active' : ''}
              onClick={() => {
                setNowTab(item.key);
              }}
            >
              {item.title}
              {!msg[item.key] || msg[item.key] <= 0 ? null : (
                <View className="orderCard-item-num">{msg[item.key]}</View>
              )}
            </View>
          ))}
        </View>
        {/* 订单 */}
        <View className="orders">
          <AtSwipeAction
            options={[
              {
                text: '删除',
                style: {
                  backgroundColor: '#DC362E',
                },
              },
            ]}
          >
            <View
              className="order"
              onClick={() => {
                Taro.navigateTo({ url: `/pages/myOrderInfo/index?type=owner&id=333` });
              }}
            >
              <View className="title">
                <View>
                  <View className="title-logo">指派订单</View>
                  <View className="title-code">
                    <View>订单编号202412250001</View>
                    <View className="title-copy">
                      <Image src={copyImg} />
                    </View>
                  </View>
                </View>
                <View>
                  <View className="title-pay h18">待付款</View>
                  <View className="title-time h18">19:20:30</View>
                </View>
              </View>
              <View className="content">
                <View className="address h18 ellipsis">上海市 浦东新区 陆家花园一期1栋</View>
                <View className="petImgs">
                  <View className="imgs">
                    <View className="img">
                      <Image src={defaultAvatar} />
                      <View>旺财</View>
                    </View>
                    <View className="img">
                      <Image src={defaultAvatar} />
                      <View>旺财</View>
                    </View>
                    <View className="img">
                      <Image src={defaultAvatar} />
                      <View>旺财</View>
                    </View>
                  </View>
                  <View className="num">
                    <View className="h18">￥40</View>
                    <View className="h18">共3只</View>
                  </View>
                </View>
                <View className="days ellipsis h18">
                  共8天: 12-5、12-5、12-5、12-5、12-5、12-5、12-5、12-5、 12-5、 12-5、 12-5、
                  12-5、 12-5、 12-5、 12-5、 12-5、 12-5、
                </View>
                <View className="btn">
                  <View className="myOrder-btn bg_none">取消订单</View>
                  <View className="myOrder-btn bg_main">去付款</View>
                </View>
              </View>
            </View>
          </AtSwipeAction>
        </View>
      </View>
    </View>
  );
}
