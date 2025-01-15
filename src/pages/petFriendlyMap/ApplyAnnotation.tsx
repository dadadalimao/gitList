import {
  Textarea, View, Image, Text,
} from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import AlertPage from '@/components/AlertPage';
import UploadImg from '@/components/UploadImg';
import './index.scss';
import ShowModal from '@/components/ShowModal';
import searchImg from '@/images/map/search.png';
import addressImg from '@/images/map/address.png';
import { baseDictMapType } from '@/api/baseDict';
import { friendlyMapAdd } from '@/api';
import { extractAddressInfo, toast } from '@/utils/utils';
import { uploadImages } from '@/utils/oss';

interface AnnotationType {
  value: string;
  label: string;
}
interface FormValue {
  addressName?: string;
  detailedAddress?: string;
  addressText?: string;
  adress?: any;
  province?: any;
  city?: any;
  area?: any;
  latitude?: any;
  longitude?: any;
}
interface Props {
  info: any;
  setInfo: any;
  handleChooseLocation: (res) => void
}
const ApplyAnnotation = ({
  info, setInfo, handleChooseLocation,
}: Props) => {
  const [annotationTypes, setAnnotationTypes] = useState<AnnotationType[]>([]);
  const [annotationTypeSel, setAnnotationTypeSel] = useState('MAP_TYPE_NICE');
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [formValue, setFormValue] = useState<FormValue>({});
  const [sucVisible, setSucVisible] = useState(false);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    baseDictMapType().then((res) => {
      setAnnotationTypes(res);
    }).catch(() => { });
  }, []);

  const chooseLocation = () => {
    Taro.chooseLocation({
      success: (res) => {
        console.log('🚀 ~ Index ~ res:', res);
        if (res.name && res.address) {
          // handleChooseLocation(res);
          console.log('🚀 ~ setFormValue ~ extractAddressInfo(res.address):', extractAddressInfo(res.address));
          setFormValue((prev) => ({
            ...prev,
            addressText: `${res.name} (${res.address})`,
            addressName: res.name,
            ...extractAddressInfo(res.address),
            latitude: res.latitude,
            longitude: res.longitude,
          }));

          const map = Taro.createMapContext('petFriendlyMap', this);
          map.moveToLocation({
            latitude: res.latitude,
            longitude: res.longitude,
          });
        }
      },
    });
  };
  const handleSubmit = async () => {
    console.log(annotationTypeSel, imgUrl, formValue, msg);

    if (!formValue.addressText) {
      toast('请选择地点');
      return;
    }
    if (!msg) {
      toast('请填写文字描述');
      return;
    }
    if (!imgUrl || imgUrl.length === 0) {
      toast('请上传图片');
      return;
    }
    Taro.requestSubscribeMessage({
      tmplIds: ['FWRe_t_G1hXleNJFIkbfClqSg7wRH9Lnhy9hVlAccQw'],
      entityIds: [], // alipay的 暂时无视
      complete: async (res: any) => {
        console.log('🚀 ~ requestSubscribeMessage ~ res:', res);
        const uploadedUrls = await uploadImages(imgUrl);
        friendlyMapAdd({
          subscribed: res?.FWRe_t_G1hXleNJFIkbfClqSg7wRH9Lnhy9hVlAccQw === 'accept',
          type: annotationTypeSel,
          addressName: formValue.addressName,
          adress: formValue.detailedAddress, // 详细地址
          province: formValue.province, // 省份
          city: formValue.city, // 城市
          area: formValue.area, // 区县
          descrption: msg, // 描述
          latitude: formValue.latitude,
          longitude: formValue.longitude,
          picUrlList: uploadedUrls, // 地区图片
        }).then(() => {
          setSucVisible(true);
          setFormValue({ addressText: '' });
          setAnnotationTypeSel(annotationTypes[0]?.value);
          setImgUrl([]);
          setMsg('');
        }).catch((error) => {
          console.error('提交申请失败:', error);
          if (error !== 500) {
            toast(error.message);
          } else {
            toast('提交申请失败，请重试');
          }
        });
      },
    });
  };
  // useEffect(() => {
  //   if (!info) {

  //   }
  // }, [annotationTypes, info]);
  return (
    <>
      <AlertPage show={!!info} topLine mask onClose={() => { setInfo(null); }}>
        <View className="ApplyAnnotation-container c_3">
          <View className="title pt20 flex_ic">
            <Text className="c_main">*</Text>
            <Image src={addressImg} className="icon20 mr4" />
            申请地点
          </View>
          {formValue.addressText
            ? <View className="mt8 ApplyAnnotation-address" onClick={chooseLocation}>{formValue.addressText}</View>
            : (
              <View
                className="mt8 ApplyAnnotation-address ApplyAnnotation-address-none c_c3 flex_ic"
                onClick={chooseLocation}
              >
                <Image src={searchImg} className="icon20 mr22" />
                搜索地点
              </View>
            )}
          <View className="title mt12">
            <Text className="c_main">*</Text>
            标注类型
          </View>
          <View className="annotationType flex_csb">
            {annotationTypes.map((item) => (
              <View
                className={`annotationType-item fz14 flex_cc ${item.value === annotationTypeSel ? 'annotationType-item-active bg_main' : ''}`}
                onClick={() => setAnnotationTypeSel(item.value)}
              >
                {item.label}
              </View>
            ))}
            {new Array(3 - (annotationTypes.length % 3)).map(() => <View className="annotationType-item" />)}
          </View>

          <View className="title mt12">
            <Text className="c_main">*</Text>
            文字描述
          </View>
          <Textarea value={msg} onInput={(e) => setMsg(e.detail.value)} className="msg mt8 fz14 c_6" placeholder="注意事项(宠物是否能下地)地址亮点(有无宠物设施)等" />
          <View className="title mt12">
            <Text className="c_main">*</Text>
            上传图片
          </View>
          <View className="UploadImg">
            <UploadImg imgUrl={imgUrl} setImgUrl={setImgUrl} />
          </View>
          <View className="pt20" />
          <View
            className="btn_main"
            onClick={handleSubmit}
          >
            提交申请
          </View>
        </View>
      </AlertPage>
      <ShowModal
        visible={sucVisible}
        modal="ApplyAnnotationSuc"
        onConfirm={() => {
          setInfo(null);
          setSucVisible(false);
        }}
        onClose={() => {
          setInfo(null);
          setSucVisible(false);
        }}
      />
    </>
  );
};

export default ApplyAnnotation;
