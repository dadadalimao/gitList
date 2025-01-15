/* eslint-disable @typescript-eslint/quotes */
import {
  View, Image, Button, Text, Form, Input, Picker, Label,
} from '@tarojs/components';
import Taro, { useLoad, setNavigationBarTitle, useDidShow } from '@tarojs/taro';
import './index.scss';
import { ReactNode, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Avatar from '@/components/Avatar';
import rightImg from '@/images/right.png';
import { dispatch, getState } from '@/store';
import UploadImg from '@/components/UploadImg';
import { getPetInfo } from '@/api';
import { getUrl, ossUpload } from '@/utils/oss';
import request from '@/api/apiRequest';

type RadioField = {
  key: string;
  label: string;
  options: {
    icon: any;
    value: any;
    label: any;
  }[];
  valueType: 'radio';
  required: boolean;
  unit?: string;
  placeholder?: string;
};

type NonSelectField = {
  key: string;
  label: string;
  placeholder?: string;
  unit?: string;
  render?: ReactNode;
  valueType: Exclude<string, 'radio'>;
  required: boolean;
  url?: string;
  max?: number;
};

type FieldConfig = RadioField | NonSelectField;
const columns: FieldConfig[] = [
  {
    key: 'name',
    label: '昵称',
    placeholder: '请输入爱宠的昵称吧',
    valueType: 'text',
    required: true,
    max: 16,
  },
  {
    key: 'kindId',
    label: '类别',
    valueType: '',
    required: true,
  },
  {
    key: 'variety',
    label: '品种',
    placeholder: '请选择品种',
    valueType: 'nav',
    url: '/pages/varietySelection/index',
    required: true,
  },
  {
    key: 'gender',
    label: '性别',
    valueType: 'radio',
    required: true,
  },
  {
    key: 'weight',
    label: '体重',
    placeholder: '请填写体重',
    valueType: 'digit',
    unit: 'kg',
    required: true,
    max: 6,
  },
  {
    key: 'height',
    label: '身高',
    placeholder: '请填写身高',
    valueType: 'digit',
    unit: 'cm',
    required: false,
    max: 6,
  },
  {
    key: 'birthday',
    label: '出生日期',
    placeholder: '请选择日期',
    valueType: 'datePiker',
    required: false,
  },
  {
    key: 'nature',
    label: '性格',
    placeholder: '描述您的爱宠性格',
    valueType: 'text',
    required: false,
    max: 15,
  },
  {
    key: 'vaccination',
    label: '疫苗',
    placeholder: '请选择爱宠疫苗接种情况',
    valueType: 'radio',
    required: false,
  },
];
export default function Index() {
  const [formData, setFormData] = useState<any>({});
  /** 头像临时地址 */
  const [avatar, setAvatar] = useState();
  /** 宠物主id */
  const [ownerId, setOwnerId] = useState();
  /** 宠物类别 */
  const [kindOpts, setKindOpts] = useState<any>([]);
  /** 当前选择宠物类别id */
  const [nowKindId, setNowKindId] = useState<any>();
  /** 品种类别 */
  const [varietyOpts, setVarietyOpts] = useState<any>([]);
  /** 品种id */
  const [varietyId, setVarietyId] = useState<any>();
  /** 性别 */
  const [sexOpts, setSexOpts] = useState<any>([]);
  /** 性别code */
  const [sexCode, setSexCode] = useState<any>();
  /** 疫苗 */
  const [canOpts, setCanOpts] = useState<any>([]);
  /** 疫苗名称 */
  const [canName, setCanName] = useState<any>();
  /** 宠物照片 */
  const [imgUrl, setImgUrl] = useState<string[]>([]);

  useLoad((o) => {
    if (o.id) {
      getPetInfo(o.id).then((res) => {
        setFormData({
          ...res.data,
          variety: res.data.varietyName,
          birthday: res.data.birthday ? dayjs(res.data.birthday).format('YYYY-MM-DD') : '',
        });
        setImgUrl((res.data.picUrlList || []).map((item) => getUrl(item)));
        setVarietyId(res.data.variety);
        setNowKindId(res.data.kindId);
        setSexCode(res.data.gender);
      });
      setNavigationBarTitle({ title: '编辑爱宠档案' });
    } else {
      setNavigationBarTitle({ title: '创建爱宠档案' });
    }
    setOwnerId(getState()?.loginMember.id);
    /** 获取类别 */
    Taro.request({
      url: '/pt/kind/allNotDel',
      method: 'GET',
    }).then((res) => {
      setKindOpts(res.data);
      if (!o.id) setNowKindId(res.data[0].id ?? undefined);
      Taro.request({
        url: `/pt/kind/getSubclass?id=${res.data[0].id}`,
        method: 'GET',
      }).then((res2) => {
        setVarietyOpts(res2.data);
      });
    });
    /** 获取性别选项 */
    Taro.request({
      url: '/base/dict/getList?code=PET_SEX',
      method: 'GET',
    }).then((res) => {
      const result: any = [];
      res.data.forEach((item) => {
        result.push({ ...item, vals: item.vals.split(',')[0] });
      });
      setSexOpts(result);
      if (!o.id) setSexCode(res.data[0].code ?? undefined);
    });
    /** 获取疫苗选项 */
    Taro.request({
      url: '/base/dict/getList?code=PET_VACCINE',
      method: 'GET',
    }).then((res) => {
      setCanOpts(res.data);
      // setCanCode(res.data[0].code ?? undefined);
    });
  });
  const handleFromChange = (key, value) => {
    /** 选择类别 */
    if (key === 'kindId') {
      setVarietyId(undefined);
      formData.variety = undefined;
      setNowKindId(value);
      // Taro.request({
      //   url: `/pt/kind/getSubclass?id=${value}`,
      //   method: 'GET',
      // }).then((res) => {
      //   setVarietyOpts(res.data);
      // });
    } else if (key === 'gender') {
      setSexCode(value);
    }
    setFormData({
      ...formData,
      [key]: value,
    });
  };
  // onShow处理选择品种
  useDidShow(() => {
    const variety = getState()?.variety;
    if (variety) {
      handleFromChange('variety', variety.name);
      setVarietyId(variety.id);
      dispatch({ type: 'setVariety', payload: undefined });
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('formData', formData);
    if (!formData.name) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    if (!varietyId) {
      Taro.showToast({ title: '请选择品种', icon: 'none' });
      return;
    }
    if (!formData.weight) {
      Taro.showToast({ title: '请填写体重', icon: 'none' });
      return;
    }
    formData.ptOwnerId = ownerId;
    formData.kindId = nowKindId;
    formData.variety = varietyId;
    formData.gender = sexCode;
    formData.weight = Number(formData.weight);
    formData.height = Number(formData.height);
    formData.birthday = new Date(formData.birthday).getTime();
    if (avatar) {
      formData.headshots = await ossUpload(avatar);
      setAvatar(undefined);
    }
    if (imgUrl.length) {
      const STATIC_URL = process.env.STATIC ?? '';
      const picUrlListPromises = imgUrl.map(async (item) => {
        if (item.includes(STATIC_URL)) {
          return item.replace(STATIC_URL, '');
        }
        return ossUpload(item);
      });

      const picUrlList = await Promise.all(picUrlListPromises);
      formData.picUrlList = picUrlList;
    }
    // 可以在这里进行表单验证、提交到服务器
    console.log('formData', formData);
    request({
      url: '/pt/pet/modify',
      method: 'POST',
      data: formData,
      loading: '正在保存',
    })
      .then((res) => {
        Taro.showToast({ title: '保存成功', icon: 'success' });
        // Taro.switchTab({ url: '/pages/mine/index' });
        Taro.navigateBack();
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  useEffect(() => {
    if (canOpts.length && formData.vaccination) {
      console.log("🚀 ~ useEffect ~ canOpts:", canOpts);
      setCanName(canOpts.find((item) => item.code === formData.vaccination).nameZhcn);
    }
  }, [canOpts, formData.vaccination]);
  return (
    <View className="createPet-container xsafe_16">
      <View className="top">
        <Avatar
          src={formData.headshots ? getUrl(formData.headshots) : undefined}
          id={undefined}
          onChange={(e) => {
            setAvatar(e);
          }}
        />
      </View>
      <Form onSubmit={handleSubmit}>
        <View className="list">
          <View className="title">基本资料</View>

          <View className="form-content">
            {columns.map((item) => (
              <View key={item.key} className="list-item flex_ic">
                <View className="flex_csb">
                  <View className="list-item-label">
                    {item.required && <Text className="c_main">*</Text>}
                    <Text>{item.label}</Text>
                  </View>
                  <View className="list-item-line" />
                </View>
                <View
                  className={`list-item-value `}
                  style={
                    item.key === 'birthdate' || item.key === 'vaccination'
                      ? { padding: '0 10px' }
                      : {}
                  }
                >
                  {(item.valueType === 'text' || item.valueType === 'digit') && (
                    <Input
                      className="list-item-value-input"
                      type={item.valueType}
                      maxlength={item.max}
                      placeholder={item.placeholder}
                      placeholderClass="list-item-placeholder"
                      value={formData[item.key] || ''}
                      onInput={(e) => handleFromChange(item.key, e.detail.value)}
                    />
                  )}
                  {item.unit && <Text className={`list-item-value-unit `}>{item.unit}</Text>}
                  {item.key === 'kindId' && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }} className="list-item-radio">
                      {kindOpts.map((option) => (
                        <Label key={option.id}>
                          <View
                            onClick={() => handleFromChange(item.key, option.id)}
                            className="list-item-radio-item"
                          >
                            <View
                              className={
                                `flex_cc ${nowKindId === option.id ? 'list-item-selected' : 'list-item-select'}`
                              }
                            >
                              <Image
                                className="list-item-select-img"
                                src={`${process.env.STATIC}${option.icon}`}
                              />
                            </View>
                            <View>
                              {option.name}
                            </View>
                          </View>
                        </Label>
                      ))}
                    </View>
                  )}
                  {item.key === 'gender' && (
                    <View style={{ flexDirection: 'row' }} className="list-item-radio">
                      {sexOpts.map((option) => (
                        <Label key={option.code}>
                          <View
                            onClick={() => handleFromChange(item.key, option.code)}
                            className="list-item-radio-item"
                          >
                            <View
                              className={
                                `flex_cc ${sexCode === option.code ? 'list-item-selected' : 'list-item-select'}`
                              }
                            >
                              <Image
                                className="list-item-select-img2"
                                src={`${process.env.STATIC}${option.vals}`}
                              />
                            </View>
                            <View>
                              {option.nameZhcn}
                            </View>
                          </View>
                        </Label>
                      ))}
                    </View>
                  )}
                  {/* 疫苗 */}
                  {item.key === 'vaccination' && (
                    <View
                      className="flex_ic list-item-value-input"
                      onClick={() => {
                        const re: string[] = [];
                        canOpts.forEach((item2: any) => {
                          re.push(item2.nameZhcn);
                        });
                        Taro.showActionSheet({
                          itemList: re,
                          success(result) {
                            // setCanName(canOpts[result.tapIndex].nameZhcn);
                            setFormData((pre) => ({
                              ...pre,
                              vaccination: canOpts[result.tapIndex].code,
                            }));
                          },
                        });
                      }}
                    >
                      <View className="list-item-value-input flex_csb">
                        {canName ? (
                          <View className="max188 flex_ic">{canName}</View>
                        ) : (
                          <View className="max188 flex_ic c_c3">{item.placeholder}</View>
                        )}
                        <Image className="icon18" src={rightImg} />
                      </View>

                    </View>
                  )}
                  {item.valueType === 'datePiker' && (
                    <Picker
                      className="wh100 flex_ic"
                      mode="date"
                      value={formData[item.key] || ''}
                      onChange={(e) => handleFromChange(item.key, e.detail.value)}
                      end={dayjs().format('YYYY-MM-DD')}
                    >
                      <View className="list-item-value-input flex_csb">
                        {formData[item.key] ? (
                          <View className="max166">{formData[item.key]}</View>
                        ) : (
                          <View className="c_c3 max166">
                            {item.placeholder}
                          </View>
                        )}
                        <Image className="icon18" src={rightImg} />
                      </View>
                    </Picker>
                  )}
                  {item.valueType === 'nav' && (
                    <View
                      className="flex_ic wh100"
                      onClick={() => {
                        if (nowKindId) {
                          Taro.navigateTo({
                            url: `${item.url}?kindId=${nowKindId}`,
                          });
                        }
                      }}
                    >
                      <View className="list-item-value-input flex_csb">
                        {formData[item.key] ? (
                          <View className="max188">{formData[item.key]}</View>
                        ) : (
                          <View className="c_c3 max188">
                            {item.placeholder}
                          </View>
                        )}
                        <Image className="icon18" src={rightImg} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
          <View className="pic">宠物照片</View>
          <View className="UploadImg">
            <UploadImg imgUrl={imgUrl} setImgUrl={setImgUrl} max={9} />
          </View>
        </View>
        <Button className="resetBtn btn_main mt16" formType="submit">
          保存
        </Button>
        {formData.id && (
          <Button
            className="resetBtn btn_plain btn_max mt18"
            onClick={() => {
              Taro.showModal({
                content: '确定删除该宠物档案？',
                success(result) {
                  if (result.confirm) {
                    request({
                      url: `/pt/pet/deleted?id=${formData.id}`,
                      loading: "正在删除",
                    }).then((res) => {
                      console.log("🚀 ~ success ~ res:", res);
                      Taro.showToast({
                        title: '删除成功',
                      });
                      setTimeout(() => {
                        Taro.navigateBack();
                      }, 1500);
                    });
                  }
                },
              });
            }}
          >
            删除
          </Button>
        )}
      </Form>
      <View className="pb16 mt12" />
    </View>
  );
}
