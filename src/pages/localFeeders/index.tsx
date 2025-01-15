import { View, SwiperItem, Image, Button, Textarea } from '@tarojs/components';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import './index.scss';
import { useContext, useState } from 'react';
import backIcon from '@/images/back.png';
import starIcon from '@/images/feeder/star.svg';
import { dispatch, getState, myContext } from '@/store';
import defaultAvatar from '@/images/defaultAvatar.png';
import rightImg from '@/images/right.png';
import timeImg from '@/images/myOrder/time.svg';
import addressImg from '@/images/myOrder/address.svg';
import request from '@/api/apiRequest';
import localFeedersBg from '@/images/feeder/localFeedersBg.png';
import { navTo, NotYetOpen, getFeederSexIcon } from '@/utils/utils';
import Calendar from '@/components/Calendar/Calendar';
import dayjs from 'dayjs';
import { getUrl } from '@/utils/oss';

const statusBarHeigh = Taro.getSystemInfoSync().statusBarHeight;

const topItems = [
  {
    icon: addressImg,
    type: 'address',
  },
  {
    icon: timeImg,
    type: 'time',
  },
];
export default function Index() {
  const [address, setAddress] = useState<any>();
  /** 是否显示日历 */
  const [calendarVisible, setCalendarVisible] = useState(false);
  /** 选择的时间 */
  const [selectedDate, setSelectedDate] = useState<string[]>([]);
  /** 宠物类别 */
  const [petTypeList, setPetTypeList] = useState<any[]>([]);
  /** 当前展示的宠物类别 */
  const [petType, setPetType] = useState<any>();

  useLoad((o) => {
    // o.id = '1869619569715449858';
    /** 获取类别 */
    /** 获取宠物类别 */
    Taro.request({
      url: '/pt/kind/allNotDel',
      method: 'GET',
    }).then((res) => {
      setPetTypeList(res.data);
      setPetType(res.data[0].id);
    });
  });
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
    <View className="tabbar-page-container" style={{ background: '#f4f8fb', minHeight: '100vh' }}>
      <View className="petServices-container">
        <View
          className="petServices-header"
          style={{ paddingTop: statusBarHeigh, height: '124px', background: 'none' }}
        >
          <Image src={localFeedersBg} className="localFeeders-header-bg" />
          <View className="custom-nav-title flex_cc">
            <Image
              src={backIcon}
              className="icon24 custom-nav-back"
              onClick={() =>
                Taro.navigateBack({
                  fail: () => {
                    Taro.switchTab({ url: '/pages/mine/index' });
                  },
                })
              }
            />
            周边喂养员
          </View>
        </View>
        <View className="f">
          <View className="f-top">
            {topItems.map((item) => (
              <View className="f-top-item" key={item.icon}>
                <Image src={item.icon} className="f-top-icon" />

                {item.type === 'address' && (
                  <View className="f-top-text">
                    试试水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水水
                  </View>
                )}
                {item.type === 'time' && (
                  <View className="f-top-text">
                    {selectedDate.map(
                      (i, index) => `${index === 0 ? '' : '、'}${dayjs(i).format('YYYY-MM-DD')}`,
                    )}
                  </View>
                )}

                <Image
                  src={rightImg}
                  className="f-top-icon"
                  onClick={() => {
                    if (item.type === 'address') {
                      if (NotYetOpen(2)) return;
                      navTo(`/pages/myAddress/index?type=choose&chooseId=${address?.id || ''}`);
                      return;
                    }
                    if (NotYetOpen(2)) return;
                    setCalendarVisible(true);
                  }}
                />
              </View>
            ))}
          </View>
          <View className="f-list">
            <View className="f-tab">
              {petTypeList.map((item) => (
                <View
                  className={`pet-type ${petType === item.id ? 'pet-type-selected' : ''}`}
                  onClick={() => {
                    setPetType(item.id);
                  }}
                >
                  <Image className="pet-type-img" src={getUrl(item.authIcon)} mode="aspectFill" />
                  <View className="fz14">{item.name}</View>
                </View>
              ))}
            </View>
            <View className="f-content">
              <View className="f-item">
                <View>
                  <View className="f-item-top">
                    <Image src={defaultAvatar} />
                    <View className="f-item-text">
                      <View>
                        <View>丽丽</View>
                        <View className="gender-icon-box flex_cc">
                          <Image className="icon20 gender" src={getFeederSexIcon('11')} />
                        </View>
                      </View>
                      <View>
                        <View>1.5km</View>
                        <View className="text-star">
                          {[1, 2, 3, 4, 5].map((item) => (
                            <Image src={starIcon} key={item} />
                          ))}
                        </View>
                      </View>
                      <View>完成订单130+次</View>
                    </View>
                  </View>
                  <View>vip</View>
                </View>
                <View>个人介绍</View>
              </View>
            </View>
          </View>
        </View>
        <View className="btn">
          <Button className="resetBtn btn_main">确认选择</Button>
        </View>
      </View>
      <Calendar
        visible={calendarVisible}
        defaultValue={selectedDate}
        setVisible={setCalendarVisible}
        handleConfirm={(dates) => {
          console.log('dates', dates);
          setSelectedDate(dates.map((n) => n[3]));
        }}
      />
    </View>
  );
}
