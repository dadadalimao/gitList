import { View, Image } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import dayjs from 'dayjs';
import { dispatch, getState } from '@/store';
import timeImg from '@/images/time.png';
import changeImg from '@/images/change.png';
import specifyImg from '@/images/petServices/specify.png';
import randomImg from '@/images/svg/random.svg';
import './index.scss';
import { navTo, NotYetOpen } from '@/utils/utils';

interface ServiceCardProps {
  /** 打开日历 */
  onOpenCalendar: () => void;
  /** 选择的时间 */
  selectedDate: string[];
}

const ServiceCard = ({ onOpenCalendar, selectedDate }: ServiceCardProps) => {
  const [address, setAddress] = useState<any>();
  // 格式化日期
  const serviceDates = selectedDate.map((item) => dayjs(item).format('MM-DD')).join('、');
  const [serviceInfo, setServiceInfo] = useState('');
  useDidShow(() => {
    const { chooseAddress } = getState() || {};
    if (chooseAddress) {
      setAddress(chooseAddress);
      dispatch({
        type: 'setChooseAddress',
        payload: undefined,
      });
    }
  });
  return (
    <View className="services-card">
      <View className="services-title flex_csb">
        <View className="fz18">预约上门服务</View>
        <View
          className="services-location flex_ic"
          onClick={() => {
            if (NotYetOpen(2)) return;
            navTo(`/pages/myAddress/index?type=choose&chooseId=${address?.id || ''}`);
          }}
        >
          <View className="fz12">{address?.addressName || '请选择服务地址'}</View>
          <Image className="icon16" src={changeImg} />
        </View>
      </View>
      <View className="services-time flex_ic">
        <Image className="icon24 mr10" src={timeImg} />
        <View className="services-time-line mr10" />
        <View
          className="services-time-time"
          onClick={() => {
            if (NotYetOpen(2)) return;
            console.log('打开日历');
            onOpenCalendar();
          }}
        >
          <View className={`picker fz12 ${selectedDate.length ? 'c_3' : 'c_9'}`}>
            {selectedDate.length ? serviceDates : '请选择上门服务时间'}
          </View>
        </View>
      </View>

      <View className="services-btn fz14 mt26">
        <View
          className="services-btn-specify bg_main"
          onClick={() => {
            if (NotYetOpen(2)) return;
            console.log('指定喂养员');
          }}
        >
          <Image className="icon20 mr8" src={specifyImg} />
          指定喂养员
        </View>
        <View className="services-btn-block" />
        <View
          className="services-btn-random bg_sec"
          onClick={() => {
            if (NotYetOpen(2)) return;
            console.log('系统派单');
          }}
        >
          <Image className="icon20 mr8" src={randomImg} />
          系统派单
        </View>
      </View>

      {serviceInfo && (
        <View className="current-service fz14 c_3 mt14">
          <View className="title fz18">当前服务</View>
          <View className="service-info mt20 flex_ic">
            <Image
              className="services-card-avatar mr12"
              src="https://b0.bdstatic.com/99fae99f032faef58154ba51e7e9d7ca.jpg@h_1280"
            />
            <View className="name-rating ">
              <View className="lh22 ">陈美玲</View>
              <View className="rating flex_ic">
                <View className="rating-number mr8 bg_sec">4.9</View>
                <View className="c_9 fz12">专业饲养员</View>
              </View>
            </View>
          </View>
          <View className="service-details">
            <View className="detail-item flex_csb mt12 lh22">
              <View className="c_9">服务类型</View>
              <View className="detail-value">上门喂养</View>
            </View>
            <View className="detail-item flex_csb mt6 lh22">
              <View className="c_9">服务时间</View>
              <View className="detail-value">今天14:00 - 15:00</View>
            </View>
            <View className="detail-item flex_csb mt6 lh22">
              <View className="c_9">服务状态</View>
              <View className="detail-value">进行中</View>
            </View>
          </View>

        </View>
      )}

    </View>
  );
};
export default ServiceCard;
