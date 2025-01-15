import { View, Image, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import { AtSwipeAction } from 'taro-ui';
import headerBg from '@/images/petServices/header.svg';
import homeBg from '@/images/feeder/homeBg.png';
import TabBar from '@/components/TabBar';
import LoginAlert from '@/components/LoginAlert';
import './index.scss';
import { feederOrderCard } from '@/utils/data';
import defaultAvatar from '@/images/defaultAvatar.png';
import copyImg from '@/images/myOrder/copy.svg';
import workImg from '@/images/feeder/work.svg';
import noWorkImg from '@/images/feeder/noWork.svg';
import beerImg from '@/images/feeder/beer.svg';
import RejectModal from '@/components/OrderModal';

const statusBarHeigh = Taro.getSystemInfoSync().statusBarHeight;
export default function Index() {
  const [loginVisible, setLoginVisible] = useState(false);
  /** 是否营业 */
  const [isWork, setIsWork] = useState(true);
  const [nowTab, setNowTab] = useState<string>('all');
  const [orderTab, setOrderTab] = useState<any>([
    {
      title: '全部',
      key: 'all',
      url: '',
      icon: '',
    },
  ]);
  const [msg, setMsg] = useState({
    Unpaid: 1,
    WaitingForAcceptance: 1,
    WaitingForArrival: 2,
    InProgress: 3,
    WaitingForApproval: 4,
  });
  /** 拒绝接单弹窗 */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  /** 拒绝理由 */
  const [rejectVal, setRejectVal] = useState<string>();

  useLoad(() => {
    setOrderTab((pre) => [...pre, ...feederOrderCard]);
  });
  const navTo = (url) => {
    // if (state?.loginMember && !guestAccessiblePages.includes(url)) {
    Taro.navigateTo({ url });
    // } else {
    //   setLoginVisible(true);
    // }
  };
  return (
    <View className="tabbar-page-container">
      <Image className="petServices-homeBg" src={homeBg} />
      <View className="petServices-container">
        <View
          className={`petServices-header ${isWork ? 'bg_header' : 'bg_header_noWork'}`}
          style={{ paddingTop: statusBarHeigh }}
        >
          {isWork && <Image src={headerBg} className="petServices-header-bg" />}
          <View className="custom-nav-title flex_cc">
            <Image
              src={isWork ? workImg : noWorkImg}
              className="w75 custom-nav-back"
              onClick={() => {
                setIsWork((prev) => !prev);
              }}
            />
          </View>
        </View>
        <View className="f">
          <View className="f-title">
            {orderTab.map((item) => {
              return (
                <View
                  className={`orderCard-item ${nowTab === item.key ? 'active' : ''}`}
                  key={item.title}
                  onClick={() => {
                    setNowTab(item.key);
                  }}
                >
                  {item.title}
                  {!msg[item.key] || msg[item.key] <= 0 ? null : (
                    <View className="orderCard-item-num">{msg[item.key]}</View>
                  )}
                </View>
              );
            })}
          </View>
          {/* 打样 */}
          {!isWork && (
            <View className="noWork">
              <View>
                <Image src={beerImg} className="noWork-img" />
              </View>
              <View>已停止接单</View>
            </View>
          )}
          {/* 订单 */}
          <View className="f-body">
            <View className="orders">
              <View
                className="order"
                onClick={() => {
                  Taro.navigateTo({ url: `/pages/myOrderInfo/index?type=feeder&id=111` });
                }}
              >
                <View className="title">
                  <View>
                    <View className="title-logo">指派订单</View>
                    <View className="title-code">
                      <View>订单编号:&nbsp;202412250001</View>
                      <View className="title-copy">
                        <Image src={copyImg} />
                      </View>
                    </View>
                  </View>
                  <View className="title-pay h18">待审核</View>
                </View>
                <View className="content">
                  <View className="petImgs">
                    <View className="img">
                      <Image src={defaultAvatar} />
                    </View>
                    <View className="text">
                      <View className="text-name">多乐</View>
                      <View className="text-address ellipsis">
                        服务地址:&nbsp;上海市浦东区张扬路500号好好好爱奥啊哈哈啊哈啊哈哈哈哈哈哈哈
                      </View>
                      <View className="ellipsis">
                        服务项目:&nbsp;上门喂养、遛狗山山水水那失手随你随你酸牛奶说你是
                      </View>
                    </View>
                  </View>
                  <View className="time ellipsis">
                    <Text>服务时间:&nbsp;</Text>2024-12-12 14:00~15:00
                  </View>
                  <View className="btn">
                    <View className="">
                      佣金:&nbsp;<Text>￥40</Text>
                    </View>
                    <View>
                      {nowTab === 'WaitingForApproval' && (
                        <View
                          className="myOrder-btn bg_sec w102"
                          onClick={(e) => {
                            e.stopPropagation();
                            Taro.navigateTo({ url: `/pages/feederOrderUpload/index?id=1111` });
                          }}
                        >
                          重新上传材料
                        </View>
                      )}
                      {nowTab === 'InProgress' && (
                        <View
                          className="myOrder-btn bg_sec"
                          onClick={(e) => {
                            e.stopPropagation();
                            Taro.navigateTo({ url: `/pages/feederOrderUpload/index?id=1111` });
                          }}
                        >
                          上传材料
                        </View>
                      )}
                      {nowTab === 'WaitingForArrival' && (
                        <View className="myOrder-btn bg_sec">开始服务</View>
                      )}
                      {nowTab === 'WaitingForAcceptance' && (
                        <>
                          <View
                            className="myOrder-btn bg_sec_none"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsOpen(true);
                            }}
                          >
                            拒绝
                          </View>
                          <View className="myOrder-btn bg_sec">接单</View>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <TabBar activeIndex={0} />
      <LoginAlert visible={loginVisible} setVisible={setLoginVisible} />
      <RejectModal
        title="是否拒绝该订单？"
        placeholder="请说明拒绝理由"
        visible={isOpen}
        setVisible={setIsOpen}
        setVal={setRejectVal}
        val={rejectVal}
        onSuccess={() => {
          if (!rejectVal || rejectVal === '') {
            Taro.showToast({
              title: '请说明拒绝理由',
              icon: 'none',
            });
            return;
          }
          setIsOpen(false);
          /** 拒绝接单 */
        }}
      />
    </View>
  );
}
