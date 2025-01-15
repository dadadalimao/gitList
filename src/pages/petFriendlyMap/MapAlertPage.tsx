import Taro, { usePageScroll } from '@tarojs/taro';
import {
  View, Image, ScrollView,
  Input,
} from '@tarojs/components';
import {
  useEffect, useRef, useState,
} from 'react';
import { t } from 'i18next';
import iconPlus from '@/images/plus.png';
import locationImg from '@/images/map/location.png';
import MapAlertPageExpand from './MapAlertPageExpand';
import './index.scss';
import AlertPage from '@/components/AlertPage';
import { getDistance, getLocation, navTo } from '@/utils/utils';
import UserComments from './UserComments';
import { getState } from '@/store';
import { getUrl } from '@/utils/oss';
import defaultAvatarImg from '@/images/defaultAvatar.png';

interface Props {
  info: any;
  visible: boolean;
  close?: () => void;
  handleLocation: () => void;
  activeIndex: ActiveIndexState, setActiveIndex: any
}
const showComment = true;
const vh = Taro.getSystemInfoSync().windowHeight;
const MapAlertPage = ({
  visible, info, close, handleLocation,
  handleChooseLocation, activeIndex, setActiveIndex,
}: Props) => {
  // const [activeIndex, setActiveIndex] = useState('MAP_TYPE_NICE');
  const [active, setActive] = useState(false);
  const [userLocation, setUserLocation] = useState<any>({});
  // const [height, setHeight] = useState(0);
  const activeLock = useRef(false);
  const areaTypeInfo = {
    MAP_TYPE_NICE: { text: '宠物友好区域', className: 'c_friendly' },
    MAP_TYPE_GRUFF: { text: '宠物不友好区域', className: 'c_unfriendly' },
    MAP_TYPE_POI: { text: '投毒区域', className: 'c_poisoning' },
  };

  useEffect(() => {
    if (!visible) {
      setActive(false);
    } else {
      getLocation().then((res) => {
        setUserLocation(res);
      });
    }
  }, [visible]);
  useEffect(() => { }, []);
  usePageScroll((e) => {
    console.log('🚀 ~ usePageScroll ~ res:', e);
  });
  return (
    <AlertPage
      topLine
      show={visible}
      mask
      tapMaskHide
      maskColor="transparent"
      onClose={close}
      onHeaderClick={close}
    >
      <MapAlertPageExpand
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        handleLocation={handleLocation}
        showTabs={!active}
        bottom={28}
      />
      <ScrollView
        scrollY
        onScroll={(e) => {
          if (!activeLock.current) {
            if (!active) {
              // if (!active && e.detail.scrollTop > 30) {
              setActive(true);
              activeLock.current = true;
              setTimeout(() => {
                activeLock.current = false;
              }, 100);
            }
            // if (active && e.detail.scrollTop < 10) {
            //   setActive(false);
            //   activeLock.current = true;
            //   setTimeout(() => {
            //     activeLock.current = false;
            //   }, 100);
            // }
          }
        }}
        className="MapAlertPage-container"
        style={{
          height: active ? 'calc(75vh - 50px)' : '370px',
          overflow: 'auto',
        }}
      >

        <View className="MapAlertPage-content">

          <View className="title" style={{ paddingTop: '0' }}>
            <View className="flex">
              <View className="mr4" style={{ maxWidth: '160px' }}>
                {info?.addressName || info?.adress}
              </View>
              <View
                className="flex_ic"
                style={{ height: '24px' }}
                onClick={() => {
                  const map = Taro.createMapContext('petFriendlyMap', this);
                  console.log('🚀 ~ map:', map);
                  map.openMapApp({
                    longitude: Number(info?.longitude),
                    latitude: Number(info?.latitude),
                    destination: info?.addressName || info?.adress,
                    success: (res) => {
                      console.log('🚀 ~ res:', res);
                    },
                    fail: (res) => {
                      console.log('🚀 ~ res:', res);
                    },
                  });
                  // Taro.openLocation({
                  //   longitude: Number(info?.longitude),
                  //   latitude: Number(info?.latitude),
                  //   name: info?.addressName || info?.adress,
                  // });
                }}
              >
                <Image src={locationImg} className="icon18 mr4" />
                <View className="fz12 c_6" style={{ fontWeight: '500' }}>
                  {(userLocation?.latitude && info?.latitude) && `${getDistance(userLocation, info)}km`}
                </View>
              </View>
            </View>

            {info && (
              <View className={`areaType fz14 c_6  ${areaTypeInfo[info.type]?.className}`}>
                {areaTypeInfo[info.type]?.text}
              </View>
            )}
          </View>
          <View className="fz14 c_6 mt4">{(info?.adress || '')}</View>
          <ScrollView scrollX className="imgView ">
            <View className="flex">
              {info?.picUrlList?.map((item) => (
                <Image
                  onClick={() => {
                    Taro.previewImage({
                      current: process.env.STATIC + item,
                      urls: info?.picUrlList.map((i) => process.env.STATIC + i),
                    });
                  }}
                  src={process.env.STATIC + item}
                  className="area-img"
                  mode="aspectFill"
                />
              ))}
            </View>
          </ScrollView>
          <View className="title flex_csb">地点描述</View>
          <View className="fz14 c_6 mt4 pb16" style={{ wordWrap: 'break-word' }}>
            {info?.descrption}
          </View>
          {showComment && (
            <>
              <View className="title" style={{ paddingBottom: '2px' }}>
                用户评论
              </View>
              <UserComments messages={info?.commentList} />

              {/* <View className="title">写评论</View>
              <View className="WriteComment flex_csb">
                <View className="flex_ic">
                  <Image
                    src={(getUrl(getState()?.loginMember?.pic) || defaultAvatarImg)}
                    className="avatar40 mr8"
                  />
                  <View>
                    <View className="fz14 c_3">发表真实评论 </View>
                    <View className="fz12 c_9">分享您的真实态度，帮助宠物出行</View>
                  </View>
                </View>
                <View className="flex_cc fz12 c_6 WriteComment-btn">
                  <Image src={iconPlus} className="icon8 mr4" />
                  立即评价
                </View>
              </View> */}
            </>
          )}
        </View>

      </ScrollView>
      {active && (
        <View className="write-comment flex_ic">
          <Image
            className="user-avatar mr6 circle"
            src={getUrl(getState()?.loginMember?.pic) || defaultAvatarImg}
          />
          <View
            className="write-comment-input flex_ic fz14 c_c3"
            onClick={() => {
              // sendCommit('123');
              navTo(`/pages/writeTextarea/index?type=mapCommit&mapId=${info?.id}`);
            }}
          >
            输入评论
          </View>
        </View>
      )}
    </AlertPage>
  );
};

export default MapAlertPage;
