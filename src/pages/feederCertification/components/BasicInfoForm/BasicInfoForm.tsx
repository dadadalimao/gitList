import {
  View, Input, Image, Form, Text,
  Button,
  Picker,
} from '@tarojs/components';
import {
  FC, useContext, useEffect, useState,
} from 'react';
import './BasicInfoForm.scss';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import dayjs from 'dayjs';
import FormItem from '@/components/FormItem';
import { toast } from '@/utils/utils';
import AlertPage from '@/components/AlertPage';
import { dispatch, myContext } from '@/store';

import womanImg from '@/images/feederCertification/woman.png';
import manImg from '@/images/feederCertification/man.png';
import UploadImg from '@/components/UploadImg';
import radioSelImg from '@/images/radioSel.svg';
import { getImgKey, getUrl, uploadImages } from '@/utils/oss';
import request from '@/api/apiRequest';
import { addressInfo, getConstantInfo } from '@/api';
import { getInfo } from '@/api/member';

interface FormData {
  name?: string;
  gender?: string;
  age: string;
  contactNumber?: string;
  address?: any;
}

interface FormErrors {
  [key: string]: string;
}

interface BasicInfoFormProps {
  onSubmit: (data: FormData) => void;
}

const BasicInfoForm: FC<BasicInfoFormProps> = ({ onSubmit }) => {
  const { state } = useContext(myContext);
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    address: undefined,
    contactNumber: '',
    age: '',
  });
  // 定义错误状态和设置错误的函数
  const [errors, setErrors] = useState<FormErrors>({});
  // 定义是否显示性别提醒和控制显示状态的函数
  const [showGenderAlert, setShowGenderAlert] = useState(false);
  // 定义性别状态和设置性别的函数
  const [gender, setGender] = useState('');
  // 定义图片列表状态和设置图片列表的函数
  const [imgList, setImgList] = useState<string[]>([]);
  // 定义宠物类型状态和设置宠物类型的函数
  const [petTypes, setPetTypes] = useState<any[]>([]);
  // 定义宠物类型列表和初始数据
  const [petTypeList, setPetTypeList] = useState<any[]>([]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((pre) => ({
      ...pre,
      [field]: value,
    }));
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors((pre) => ({
        ...pre,
        [field]: '',
      }));
    }
  };

  /** 验证表单的函数 */
  const validateForm = async (params: any): boolean => {
    const newErrors: FormErrors = {};

    if (!params.name || !params.name.trim()) {
      newErrors.name = '请输入姓名';
    }

    if (!params.gender) {
      newErrors.gender = '请选择性别';
    }

    if (!params.age) {
      newErrors.age = '请输入生日';
    }

    if (!params.contactNumber) {
      newErrors.contactNumber = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(params.contactNumber)) {
      newErrors.contactNumber = '请输入正确的手机号码';
    }

    if (!params.address) {
      newErrors.address = '请选择地址';
    }
    if (!params.petTypes.length) {
      newErrors.petTypes = '请选择服务的宠物类型';
    }
    const { data: banType } = await getConstantInfo('VOIP_BAN_SINGLE');
    if (params.petTypes.length === 1 && banType.split(',').includes(params.petTypes[0])) {
      newErrors.petTypes = '请再选一种宠物类型';
    }
    if (params.imgList.length !== 3) {
      newErrors.imgList = '请上传三张与个人所养宠物的合照';
    }

    // setErrors(newErrors);
    if (newErrors[Object.keys(newErrors)[0]]) {
      toast(newErrors[Object.keys(newErrors)[0]]);
    }

    return Object.keys(newErrors).length === 0;
    // return true;
  };

  /** 提交表单的处理函数 */
  const handleSubmit = async (e) => {
    const params = {
      ...formData,
      ...e.detail.value,
      petTypes,
      imgList,
    };
    console.log('🚀 ~ handleSubmit ~ params:', params, e.detail.value);
    if (await validateForm(params)) {
      const petPicList = await uploadImages(imgList);
      const feederData = {
        contactNumber: params.contactNumber, // 手机号
        typeOfServiceList: petTypes, // 服务类型（宠物类型）
        petPicList, // 宠物合照
        addressId: formData.address?.id,
      };
      const memberData = {
        realName: params.name,
        sex: formData.gender === '男生' ? 'MEMBER_GENDER_MALE' : 'MEMBER_GENDER_FEMALE',
        age: params.age,
      };
      let data;
      if (state.loginMember.feeder) {
        data = {
          ...state.loginMember.feeder,
          ...feederData,
          member: {
            ...state.loginMember.feeder.member,
            ...memberData,
          },
        };
      } else {
        data = {
          ...feederData,
          member: memberData,
        };
      }
      request({
        url: state.loginMember.feeder ? '/fd/feeder/modify' : '/fd/feeder/save',
        method: 'POST',
        data,
        // loading: '提交中...',
        // failToast: true,
      }).then((res) => {
        console.log('🚀 ~ handleSubmit ~ res:', res);
        // getInfo('', true);
        onSubmit(params);
      });
      // onSubmit(params);
    }
  };
  const setInfo = async () => {
    console.log(222222222222222);
    if (state.loginMember) {
      console.log('🚀 ~ useLoad ~ state.loginMember:', state.loginMember);
      if (state.loginMember.feeder) {
        const { data: address } = state.loginMember.feeder.addressId
          ? await addressInfo({ id: state.loginMember.feeder.addressId })
          : { data: undefined };
        const {
          realName, sex, age, feeder,
        } = state.loginMember;
        setFormData((pre) => ({
          ...pre,
          name: realName,
          gender: sex === 'MEMBER_GENDER_MALE' ? '男生' : '女生',
          age,
          contactNumber: feeder.contactNumber || state.loginMember.phoneNum,
          address,
        }));
        setPetTypes(feeder.typeOfServiceList || []);
        setImgList((feeder.petPicList || []).map((item) => getUrl(item)));
      } else {
        setFormData((pre) => ({
          ...pre,
          sex: state.loginMember.sex === 'MEMBER_GENDER_MALE' ? '男生' : '女生',
          contactNumber: state.loginMember.phoneNum,
        }));
      }
    }
  };
  useDidShow(() => {
    console.log(state.chooseAddress);
    // 处理选择地址
    if (state.chooseAddress) {
      setFormData((pre) => ({
        ...pre,
        address: state.chooseAddress,
      }));
      dispatch({
        type: 'setChooseAddress',
        payload: undefined,
      });
    }
  });
  useEffect(() => {
    /** 获取宠物类别 */
    Taro.request({
      url: '/pt/kind/allNotDel',
      method: 'GET',
    }).then((res) => {
      setPetTypeList(res.data);
    });
    setInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View className="basic-info-form fz14">
      <Form onSubmit={handleSubmit}>
        <View className="form-title">基本资料（必填）</View>
        <FormItem label="姓名" labelJustify className="basic-info-form-item">
          <Input
            className="basic-info-form-input"
            value={formData.name}
            name="name"
            maxlength={10}
            placeholder="请输入您的真实姓名"
            placeholder-class="basic-info-form-placeholder"
            onInput={(e) => {
              handleInputChange('name', e.detail.value);
            }}
          />
        </FormItem>

        <FormItem
          label="性别"
          labelJustify
          className="basic-info-form-item"
          showArrow
          onValueClick={() => setShowGenderAlert(true)}
        >
          <View className={formData.gender ? '' : 'basic-info-form-placeholder'}>{formData.gender || '请选择性别'}</View>
        </FormItem>

        <FormItem label="生日" labelJustify className="basic-info-form-item">

          <Picker
            className="wh100"
            mode="date"
            value={formData.age}
            end={dayjs().format('YYYY-MM-DD')}
            onChange={(e) => {
              handleInputChange('age', e.detail.value);
            }}
          >
            <View className={`picker wh100 ${formData.age ? '' : 'basic-info-form-placeholder'}`}>
              {formData.age || '请选择生日'}
            </View>
          </Picker>
        </FormItem>

        <FormItem label="联系方式" labelJustify className="basic-info-form-item">
          {/* <Input
            type="number"
            name="contactNumber"
            maxlength={11}
            placeholder="请输入手机号码"
            placeholder-class="basic-info-form-placeholder"
            value={formData.contactNumber}
            onInput={(e) => {
              handleInputChange('contactNumber', e.detail.value);
            }}
          /> */}
          <Button
            className="resetBtn fz14"
            openType="getPhoneNumber"
            onGetPhoneNumber={(e) => {
              // 获取手机号
              if (e.detail.code) {
                request({
                  url: '/mem/member/getNumber',
                  method: 'POST',
                  data: {
                    account: e.detail.code,
                  },
                }).then((res) => {
                  console.log('🚀 ~ e.detail.code ~ res:', res);
                  handleInputChange('contactNumber', res.data);
                });
              }
            }}
          >
            {formData.contactNumber}
          </Button>
        </FormItem>

        <FormItem
          label="收货地址"
          labelJustify
          showArrow
          className="basic-info-form-item"
          onValueClick={() => {
            Taro.navigateTo({ url: `/pages/myAddress/index?type=choose&chooseId=${formData.address?.id || ''}` });
          }}
        >
          <View className={`basic-info-form-address ${formData.address ? '' : 'basic-info-form-placeholder'}`}>{formData.address ? `${formData.address.addressName}（${formData.address.address}）${formData.address.info}` : '请选择地址'}</View>
        </FormItem>

        <View className="form-title mt20">添加宠物类型</View>

        <View className="pet-type-list">
          {petTypeList.map((item) => (
            <View
              className={`pet-type ${petTypes.includes(item.id) ? 'pet-type-selected' : ''}`}
              onClick={() => {
                setPetTypes((pre) => {
                  if (pre.includes(item.id)) {
                    return pre.filter((type) => type !== item.id);
                  }
                  return [...pre, item.id];
                });
              }}
            >
              <View className="fz14">{item.name}</View>
              {petTypes.includes(item.id) ? <Image className="pet-type-radio" src={radioSelImg} /> : <View className="pet-type-radio" />}
              <Image className="pet-type-img" src={getUrl(item.authIcon)} mode="aspectFill" />
            </View>
          ))}

        </View>
        <View className="form-title mt28 flex_csb mb4">
          <View>与爱宠合照</View>
          <View className="fz12 c_c3 fw500">
            <Text className="c_main">*</Text>
            请上传三张与个人所养宠物的合照
          </View>
        </View>
        <UploadImg
          imgUrl={imgList}
          setImgUrl={setImgList}
        />
        <Button className="resetBtn btn_main submit-btn" formType="submit">
          下一步
        </Button>
      </Form>

      {/* 性别选择弹窗 */}
      <AlertPage show={showGenderAlert} mask tapMaskHide>
        <View className="gender-select">
          <View className="gender-select-title">选择性别</View>
          <View
            className={`gender-option ${gender === '男生' ? 'gender-option-selected' : ''}`}
            onClick={() => setGender('男生')}
          >
            男生
            <Image className="gender-option-img" src={manImg} />
          </View>
          <View
            className={`gender-option ${gender === '女生' ? 'gender-option-selected' : ''}`}
            onClick={() => setGender('女生')}
          >
            女生
            <Image className="gender-option-img" src={womanImg} />
          </View>

          <View className="gender-select-btn flex_csb">
            <View className="gender-select-btn-cancel btn_plain" onClick={() => setShowGenderAlert(false)}>取消</View>
            <View
              className="gender-select-btn-confirm btn_main"
              onClick={() => {
                setShowGenderAlert(false);
                handleInputChange('gender', gender);
              }}
            >
              确认
            </View>
          </View>
        </View>
      </AlertPage>
    </View>
  );
};

export default BasicInfoForm;
