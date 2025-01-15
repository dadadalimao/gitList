/* eslint-disable react/style-prop-object */
import {
  View, Image, Swiper, SwiperItem, Button, Radio, Text, Checkbox,
} from '@tarojs/components';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import TabBar from '@/components/TabBar';
import headerBg from '@/images/petServices/header.svg';
import navAdoptImg from '@/images/petServices/navAdopt.png';
import navMapImg from '@/images/petServices/navMap.png';
import homeBg from '@/images/petServices/homeBg.svg';
import ServiceCard from './ServiceCard';
import feederBgImg from '@/images/petServices/feederBg.png';
import feederTextImg from '@/images/petServices/feederText.png';
import AlertPage from '@/components/AlertPage';
import { dispatch, getState } from '@/store';
import LoginAlert from '@/components/LoginAlert';
import { NotYetOpen, toast } from '@/utils/utils';
import { getInfo } from '@/api/member';
import Calendar from '@/components/Calendar/Calendar';

const statusBarHeigh = Taro.getSystemInfoSync().statusBarHeight;
const BannerNav = ['/pages/petAdopt/index'];
export default function CustomTabbar() {
  const { t } = useTranslation();
  const [loginVisible, setLoginVisible] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  /** 是否显示日历 */
  const [calendarVisible, setCalendarVisible] = useState(false);
  /** 选择的时间 */
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  const navTo = (url) => {
    if (getState()?.loginMember) {
      Taro.navigateTo({ url });
    } else {
      setLoginVisible(true);
    }
  };
  const handleCustomEvent = (e) => {
    if (e) {
      setLoginVisible(true);
    }
  };
  useLoad(() => {
    // Taro.request({
    //   url: '/ban/banner/list',
    //   method: 'GET',
    // }).then((res) => {
    //   if (res.data) setBanners(res.data);
    // });
  });
  useDidShow(() => {
    if (getState()?.isLogin) {
      dispatch({ type: 'member.isLogin', payload: false });
      setLoginVisible(true);
    }
    Taro.request({
      url: '/ban/banner/list',
      method: 'GET',
    }).then((res) => {
      if (res.data) setBanners(res.data);
    });
    getInfo('', true);
  });

  return (
    <View className="tabbar-page-container">
      <Image className="petServices-homeBg" src={homeBg} />
      <View className="petServices-container">
        <View className="petServices-header bg_main_sec" style={{ paddingTop: statusBarHeigh }}>
          <Image src={headerBg} className="petServices-header-bg" />
          <View className="petServices-header-content">
            <View className="petServices-header-title">Woffie</View>
            <View>中国养宠人最信赖的宠物品牌 </View>
          </View>
        </View>

        <Swiper className="banner">
          {banners.map((item) => (
            <SwiperItem
              className="wh100"
              key={item.id}
              onClick={() => {
                if (BannerNav.includes(item.link)) {
                  navTo(item.link);
                }
                if (item.link.includes('https://')) {
                  navTo(`/pages/webView/index?url=${encodeURIComponent(item.link)}`);
                }
              }}
            >
              <Image
                src={process.env.STATIC + item.pic}
                className="wh100 block"
              />
            </SwiperItem>
          ))}
        </Swiper>

        <View className="nav flex_csb">
          <View className="nav-item nav-item-adopt" onClick={() => navTo('/pages/petAdopt/index')}>
            <View className="nav-item-title">宠物领养</View>
            <View className="nav-item-info mt4 c_main">领养代替购买</View>
            <Image className="nav-item-img" src={navAdoptImg} />
          </View>
          <View
            className="nav-item nav-item-map"
            onClick={() => navTo('/pages/petFriendlyMap/index')}
          >
            <View className="nav-item-title">宠物地图</View>
            <View className="nav-item-info mt4 c_sec">让爱宠自由奔跑</View>
            <Image className="nav-item-img" src={navMapImg} />
          </View>
        </View>
        {/* 预约上门服务 */}
        <ServiceCard
          onOpenCalendar={() => setCalendarVisible(true)}
          selectedDate={selectedDate}
        />

        <View className="feeder">
          <Image className="feeder-bg" src={feederBgImg} />
          <View className="wh100 flex_csb feeder-content">
            <Image className="feeder-text" src={feederTextImg} />
            <View
              className="feeder-btn bg_sec fz12 c_f flex_cc"
              onClick={() => {
                if (NotYetOpen(2)) return;
                if (getState()?.loginMember?.feeder?.testPassed) {
                  toast('您已通过喂养员认证');
                  return;
                }
                if (getState()?.loginMember?.feeder?.process === 'FEEDER_CERTIFY_FINAL') {
                  toast('您已提交申请，请耐心等待审核');
                  return;
                }
                navTo('/pages/feederCertification/index');
              }}
            >
              立即申请
            </View>
          </View>
        </View>
      </View>
      <Calendar
        visible={calendarVisible}
        defaultValue={selectedDate}
        setVisible={setCalendarVisible}
        handleConfirm={(dates) => {
          setSelectedDate(dates.map((n) => n[3]));
        }}

      />

      <TabBar activeIndex={0} />
      <LoginAlert
        visible={loginVisible}
        setVisible={setLoginVisible}
        onSuccess={(res) => getInfo(res?.id)}
      />
    </View>
  );
}
