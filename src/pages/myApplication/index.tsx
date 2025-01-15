import {
  View, Text, Image, ScrollView,
} from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import friendlyImage from '@/images/myApplication/friendly.png';
import poisoningImage from '@/images/myApplication/poisoning.png';
import unfriendlyImage from '@/images/myApplication/unfriendly.png';
import verificationFailedImage from '@/images/myApplication/verificationFailed.png';
import verificationSucImage from '@/images/myApplication/verificationSuc.png';
import verificationWaitImage from '@/images/myApplication/verificationWait.png';
import { getMapMyApply } from '@/api';
import { baseDictMapType, convertToValueEnum } from '@/api/baseDict';
import { getSmallUrl } from '@/utils/oss';
import Empty from '@/components/Empty';

const icons = {
  MAP_TYPE_NICE: friendlyImage,
  MAP_TYPE_GRUFF: unfriendlyImage,
  MAP_TYPE_POI: poisoningImage,

};
const verificationIcons = {
  MAP_AUDIT_STAY: verificationWaitImage,
  MAP_AUDIT_PASS: verificationSucImage,
  MAP_AUDIT_NOPASS: verificationFailedImage,
};
export default function Index() {
  const [mapType, setMapType] = useState({});
  const [list, setList] = useState<any[]>([]);
  const loading = useRef(false);
  const getData = () => {
    getMapMyApply().then((res) => {
      loading.current = true;
      setList([...list, ...res.data]);
    });
  };
  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: '我的申请',
    });
    getData();
    baseDictMapType().then((res) => {
      setMapType(convertToValueEnum(res));
      console.log('🚀 ~ baseDictMapType ~ convertToValueEnum(res):', convertToValueEnum(res));
    });
  });

  return (
    <View className="myApplication">
      {list.map((item) => (
        <View className="myApplication-item">
          <View className="verification">
            <Image className="wh100 block" src={verificationIcons[item.auditStatus]} />
          </View>
          <View className={`header flex_ic fz16 bold header-${item.type}`}>
            <Image className="header-icon mr4" src={icons[item.type]} />
            <Text>
              {mapType[item.type]}
              {/* {item.type === 'friendly' && '友好'}
              {item.type === 'unfriendly' && '不友好'}
              {item.type === 'poisoning' && '投毒'} */}
              区域标注
            </Text>
          </View>
          <View className="content">
            <View className="content-item">
              <View className="content-item-label">提交日期</View>
              <View className="content-item-value">{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</View>
            </View>
            <View className="content-item mt16">
              <View className="content-item-label">申请地点</View>
              <View className="content-item-value">{`${item.addressName} (${item.adress})`}</View>
            </View>
            <View className="content-item mt16">
              <View className="content-item-label">文字描述</View>
              <View className="content-item-value">{item.descrption}</View>
            </View>
            {item.picUrlList && item.picUrlList.length > 0 && (
              <View className="content-item mt16">
                <View className="content-item-label">图片</View>
                <View className="content-images">
                  {item.picUrlList?.map((img) => (
                    <Image
                      className="content-images-img block"
                      src={process.env.STATIC + img}
                      mode="aspectFill"
                      onClick={() => {
                        Taro.previewImage({
                          current: process.env.STATIC + img,
                          urls: item.picUrlList.map((i) => process.env.STATIC + i),
                        });
                      }}
                    />
                  ))}
                </View>
              </View>
            )}
            {item.time && (
              <>
                <View className="content-line mt16" />
                <View className="content-verification mt12 flex_csb">
                  <View className="content-item-label">审核结果时间</View>
                  <View className="content-item-value">{dayjs(item.auditTime).format('YYYY-MM-DD HH:mm:ss')}</View>
                </View>
                {item.auditStatus === 'MAP_AUDIT_NOPASS' && (
                  <View className="content-verification content-verification-fail mt12 ">
                    <View className="content-item-label">审核不通过原因</View>
                    <View
                      className="content-item-value"
                      style={{ color: '#D35153', maxWidth: '200px', textAlign: 'right' }}
                    >
                      {item.feedBack || '无'}
                    </View>
                  </View>
                )}

              </>
            )}
          </View>

        </View>
      ))}
      {loading.current && list.length === 0 && <Empty />}
    </View>
  );
}
