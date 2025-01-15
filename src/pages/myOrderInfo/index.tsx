/* eslint-disable @typescript-eslint/quotes */
import { View, Button, Image, Text } from '@tarojs/components';
import { useLoad, setNavigationBarTitle } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import defaultAvatar from '@/images/defaultAvatar.png';
import dogImg from '@/images/myOrder/dog.png';
import copyImg from '@/images/myOrder/copy.svg';
import addressImg from '@/images/myOrder/address.svg';
import addressImgf from '@/images/myOrder/addressf.svg';
import timeImg from '@/images/myOrder/time.svg';
import timeImgf from '@/images/myOrder/timef.svg';
import openImg from '@/images/myOrder/open.svg';
import noopenImg from '@/images/myOrder/noopen.svg';
import CustomNavigationBar from '@/components/CustomNavigationBar';

export default function Index() {
  /** 喂养员订单详情还是宠物主 */
  const [type, setType] = useState<string>();

  const [pets, setPets] = useState<any>([
    {
      id: '111',
    },
    {
      id: '222',
    },
  ]);
  const [list, setList] = useState<any>([
    {
      id: '111',
    },
    {
      id: '222',
    },
  ]);
  const moneyList = [
    {
      name: '基础服务费',
      cost: 130,
    },
    {
      name: '时间附加费',
      cost: 10,
    },
    {
      name: '服务次数',
      cost: 60,
      num: 5,
    },
    {
      name: '喂药',
      cost: 20,
    },
    {
      name: '陪玩',
      cost: 10,
    },
  ];
  useLoad((opt) => {
    console.log('opt', opt);
    setType(opt.type);
    /** 添加控制展开的字段 */
    setList((prev) => {
      return prev.map((item) => ({
        ...item,
        isOpen: false,
      }));
    });
  });

  return (
    <CustomNavigationBar title="订单详情" theme={type === 'feeder' ? 'feeder' : 'owner'} showBack>
      <View className="myOrderDetail-container">
        <View className="main">
          <View className="title">
            <View>
              <View className="title-order">订单已完成</View>
              <View className="title-code">
                <View>订单编号202412250001</View>
                <View className="title-copy">
                  <Image src={copyImg} />
                </View>
              </View>
            </View>
            <View className="dogImg">
              <Image src={dogImg} />
            </View>
          </View>
          {/* 服务宠物 */}
          <View className="pets">
            <View className="c-title">服务宠物</View>
            <View className="pet">
              {pets?.map((item) => (
                <View className="pet-item" key={item.id}>
                  <View className="pet-item-img">
                    <Image src={defaultAvatar} />
                  </View>
                  <View className="pet-item-text">
                    <View>旺财</View>
                    <View>
                      <View>
                        <Image
                          src={type === 'feeder' ? addressImgf : addressImg}
                          className="pet-item-icon"
                        />
                        <Text className="ellipsis">
                          上海市 浦东新区 陆家花园一期1栋哈哈哈哈哈哈哈哈哈哈哈哈哈
                        </Text>
                      </View>
                      <View className="pet-item-days">共8天</View>
                    </View>
                    <View>
                      <Image
                        src={type === 'feeder' ? timeImgf : timeImg}
                        className="pet-item-icon"
                      />
                      <Text className="ellipsis">
                        12-5、12-5、12-5、12-5、12-5、12-5、12-5、12-5、 12-5、 12-5、 12-5、
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          {/* 服务信息以及费用 */}
          <View className="cost">
            <View className="cost-title">
              <View>服务信息及费用</View>
              <View>共3天，2只猫咪</View>
            </View>
            <View className="cost-body borderB">
              {list.map((item) => (
                <View className="cost-b" key={item.id}>
                  <View className="cost-b-title">
                    <View>
                      2024-12-5 <Text>遛狗服务、附加服务</Text>
                      上门一次
                    </View>
                    <View>
                      <Text>￥130</Text>
                      <Image
                        src={item.isOpen ? openImg : noopenImg}
                        className="cost-b-title-img"
                        onClick={() => {
                          setList((prev) => {
                            return prev.map((i) => {
                              if (i.id === item.id) {
                                return { ...i, isOpen: !i.isOpen };
                              }
                              return i;
                            });
                          });
                        }}
                      />
                    </View>
                  </View>
                  {item.isOpen && (
                    <View className="cost-b-list">
                      <View className="cost-b-item">
                        <View className="cost-b-item-cost">
                          <View>
                            <Image src={defaultAvatar} className="cost-b-item-img" />
                            富贵
                          </View>
                          <View>
                            {moneyList.map((item2) => (
                              <View className="cost-b-item-money" key={item2.name}>
                                <View>
                                  {item2.name}
                                  {item2.num && ` (×${item2.num})`}
                                </View>
                                <View>￥{item2.cost}</View>
                              </View>
                            ))}
                          </View>
                        </View>
                        <View className="cost-b-num">
                          <View>一天多次</View> <View>￥50</View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
            <View>
              <View className="cost-count flexB">
                <View>费用总计</View>
                <View>￥230</View>
              </View>
              <View className="cost-count flexB">
                <View>平台优惠</View>
                <View>￥23</View>
              </View>
              <View className="cost-count flexB">
                <View>应付费用</View>
                <View className="red16">￥230</View>
              </View>
            </View>
          </View>
          {/* 服务细则 */}
          <View className="details">
            <View className="c-title">服务细则</View>
            <View className="details-body">
              <View className="details-item borderB">
                <View className="flexB">
                  <View>钥匙交接方式</View>
                  <View>密码锁</View>
                </View>
                <View className="tips">钥匙细节请与喂养员单独沟通</View>
              </View>
              <View className="details-item borderB">
                <View className="flexB">
                  <View>期望上门时间</View>
                  <View>12:00~12:30</View>
                </View>
                <View className="tips">选择较近时间可能影响接单时效</View>
              </View>
              <View className="flexB other">
                <View>服务叮嘱</View>
                <View className="tips">
                  如有特殊需求 (清洗猫砂盆、喂药喂奶等) 请在服务叮嘱中写明哟~
                </View>
              </View>
            </View>
          </View>
          <View className="btn">
            <Button className="resetBtn btn_main" openType="getPhoneNumber">
              评价
            </Button>
          </View>
        </View>
      </View>
    </CustomNavigationBar>
  );
}
