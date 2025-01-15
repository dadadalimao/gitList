import {
  View, Swiper, SwiperItem, Image, Button,
} from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { useContext, useState } from 'react';
import infoHealth from '@/images/infoHealth.png';
import infoCharacteristics from '@/images/infoCharacteristics.png';
import AlertPage from '@/components/AlertPage';

import { getSexIcon, handelAge, openServiceChat } from '@/utils/utils';
import { getUrl } from '@/utils/oss';
import { myContext } from '@/store';
import { getPetInfo } from '@/api';

export default function Index() {
  const { state } = useContext(myContext);
  /** 详情 */
  const [details, setDetails] = useState<any>([]);
  /** 宠物类别 */
  const [kindOpts, setKindOpts] = useState<any>();
  /** 性别 */
  const [sexOpts, setSexOpts] = useState<any>();
  /** 疫苗 */
  const [canOpts, setCanOpts] = useState<any>({});
  const [age, setAge] = useState<string>();
  // 定义图片数据
  const [imgInfo, setImgInfo] = useState<string[]>([]);

  useLoad((opt) => {
    if (opt.k) setKindOpts(JSON.parse(opt.k));
    if (opt.s) setSexOpts(JSON.parse(opt.s));
    Taro.setNavigationBarTitle({
      title: '宠物详情',
    });
    /** 获取疫苗选项 */
    Taro.request({
      url: '/base/dict/getList?code=PET_VACCINE',
      method: 'GET',
    }).then((res) => {
      const result: any = {};
      res.data.forEach((item: any) => {
        result[item.code] = item.nameZhcn;
      });
      setCanOpts(result);
    });
    /** 获取详情 */
    if (opt.id) {
      getPetInfo(opt.id).then((res) => {
        setDetails(res.data);
        setImgInfo(res.data.picUrlList ?? []);
        /** 生日转换成年龄 */
        if (res.data.birthday) {
          setAge(handelAge(res.data.birthday));
        }
      });
    }
  });

  // 定义当前激活的 SwiperItem 索引
  const [current, setCurrent] = useState(0);

  // 处理 Swiper 变化事件
  const handleSwiperChange = (e) => {
    setCurrent(e.detail.current);
  };

  return (
    <View className="petInfo-container">
      <View className="header">
        <Swiper
          className="swiper"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          autoplay
          current={current}
          onChange={handleSwiperChange}
        >
          {imgInfo?.map((image) => (
            <SwiperItem
              key={image}
              onClick={() => {
                Taro.previewImage({
                  urls: imgInfo.map((i) => getUrl(i)),
                  current: getUrl(image),
                });
              }}
            >
              <View className="swiper-item wh100">
                <Image className="swiper-image wh100 block" src={getUrl(image)} mode="aspectFill" />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className="dots flex_cc">
          {imgInfo?.map((item, index) => (
            <View
              key={`dot${item}`}
              className={`dots-item ${index === current ? 'bg_main dots-item-active' : ''}`}
            />
          ))}
        </View>
      </View>
      <View className="info c_3 xsafe_16">
        <View className="pet-details">
          <View className="fz20 bold flex_start">
            <View className="pet-name mr4">{details?.name}</View>
            <View className="gender-icon-box flex_cc">
              <Image
                className="icon20 gender"
                src={getSexIcon(details?.gender)}
              />
            </View>
          </View>
          <View className="info-section fz12 mt20 flex_csb">
            <View className="info-item c_main border_main_sec card_linear_main">
              <View>品种</View>
              <View className="c_75 mt8 info-item-variety">
                {/* {kindOpts !== undefined ? kindOpts[details?.kindId] : ''} */}
                {details.varietyName || details.variety}
              </View>
            </View>
            <View className="info-item c_main border_main_sec card_linear_main">
              <View>体重</View>
              <View className="c_75 mt8">{details?.weight ? `${details?.weight}kg` : ''}</View>
            </View>
            <View className="info-item c_main border_main_sec card_linear_main">
              <View>身高</View>
              <View className="c_75 mt8">{details?.height ? `${details?.height}cm` : '-'}</View>
            </View>
            <View className="info-item c_main border_main_sec card_linear_main">
              <View>年龄</View>
              {/* <View className="c_75 mt8">{age ? `${age}岁` : ''}</View> */}
              <View className="c_75 mt8">
                {age}
              </View>
            </View>
          </View>
          <View className="health-section mt20">
            <View className="section-title flex fz16 ">
              <Image className="icon20 mr8" src={infoHealth} />
              健康
            </View>
            <View className="section-content">
              {canOpts !== undefined && details?.vaccination ? (
                <>
                  <View className="section-content-dot" />
                  {canOpts[details?.vaccination]}
                </>
              ) : (
                ''
              )}

            </View>
          </View>
          {/* <View className="section-content">
            <View className="section-content-dot" />
          </View> */}

          <View className="characteristics-section mt20">
            <View className="section-title flex fz16">
              <Image className="icon20 mr8" src={infoCharacteristics} />
              特征
            </View>

            {details?.nature && (
              <View className="section-content">
                <View className="section-content-dot" />
                {details?.nature}
              </View>
            )}
            {/* <View className="section-content">
              <View className="section-content-dot" />
              黏人乖巧
            </View> */}
          </View>
        </View>
      </View>
      <AlertPage contentStyle={{ background: 'transparent' }}>
        <View className="">
          {!details.ptOwnerId && (
            <Button
              className="resetBtn btn_main"
              onClick={() => {
                openServiceChat({
                  showMessageCard: true,
                  sendMessageTitle: '领养宠物',
                  sendMessagePath: `/pages/petInfo/index.html?id=${details.id}`,
                  sendMessageImg: getUrl(details.picUrlList[0]),
                });
              }}
            >
              领养我吧
            </Button>
          )}
          {details.ptOwnerId === state.loginMember?.id && (
            <Button
              className="resetBtn btn_main"
              onClick={() => {
                openServiceChat();
              }}
            >
              修改宠物档案
            </Button>
          )}
        </View>
      </AlertPage>
    </View>
  );
}
