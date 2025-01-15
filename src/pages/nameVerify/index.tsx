/* eslint-disable @typescript-eslint/quotes */
import { View, Button, Input, Image } from '@tarojs/components';
import Taro, { useLoad, setNavigationBarTitle } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import { getState } from '@/store';
import request from '@/api/apiRequest';
import UploadImg from './idCardPic/index';
import trueImg from '@/images/nameVerify/true.svg';

const columns: any[] = [
  {
    key: 'realName',
    label: '真实姓名',
    placeholder: '请输入',
    valueType: 'text',
    max: 16,
  },
  {
    key: 'idCard',
    label: '证件号码',
    placeholder: '请输入',
    valueType: 'text',
    max: 18,
  },
];
export default function Index() {
  const [formData, setFormData] = useState<any>({});
  /** 认证状态 */
  const [result, setResult] = useState<any>();
  /** 身份证正面 */
  const [imgUrl1, setImgUrl1] = useState<string[]>([]);
  /** 身份证反面 */
  const [imgUrl2, setImgUrl2] = useState<string[]>([]);
  /** 详情 */
  const [details, setDetails] = useState<any>();

  useLoad(() => {
    setNavigationBarTitle({ title: '实名认证' });
    /** 获取喂养员详情 */
    request({
      url: `/fd/authen/infoByUserId?memberId=${getState()?.loginMember.id}`,
      method: 'GET',
    }).then((res) => {
      if (!res.data) {
        setResult('FEEDER_SGS_NOT');
        return;
      }
      setResult(res?.data?.result);
      setDetails(res.data);
    });
  });

  const handleFromChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.realName) {
      Taro.showToast({ title: '请输入真实姓名', icon: 'none' });
      return;
    }
    if (!formData.idCard) {
      Taro.showToast({ title: '请输入证件号码', icon: 'none' });
      return;
    }
    if (!imgUrl1.length || !imgUrl2.length) {
      Taro.showToast({ title: '请上传身份证正反面', icon: 'none' });
      return;
    }
    formData.idCardPicList = [...imgUrl1, ...imgUrl2];
    /** 状态改为认证中 */
    formData.result = 'FEEDER_SGS_WAIT';
    // 可以在这里进行表单验证、提交到服务器
    console.log('formData', formData);
    request({
      url: `/fd/authen/certified?memberId=${getState()?.loginMember.id}`,
      method: 'POST',
      data: formData,
      loading: '正在保存',
    })
      .then((res) => {
        Taro.showToast({ title: '保存成功', icon: 'success' });
        Taro.switchTab({ url: '/pages/mine/index' });
      })
      .catch((e) => {
        console.log('e', e);
      });
  };

  return (
    <View className="nameVerify-container">
      {result === 'FEEDER_SGS_NOT' ? (
        <View className="forms">
          {columns.map((item) => (
            <View className="forms-item" key={item.key}>
              <View className="forms-item-label">{item.label}</View>
              <View>
                <Input
                  className="forms-item-input"
                  type={item.valueType}
                  maxlength={item.max}
                  placeholder={item.placeholder}
                  placeholderClass="list-item-placeholder"
                  value={formData[item.key] || ''}
                  onInput={(e) => handleFromChange(item.key, e.detail.value)}
                />
              </View>
            </View>
          ))}
          <View className="forms-pic">
            <View>请上传身份证正反面</View>
            <UploadImg
              title="点击上传人像面"
              imgUrl={imgUrl1}
              setImgUrl={setImgUrl1}
              max={1}
              type="people"
            />
            <UploadImg
              title="点击上传国徽面"
              imgUrl={imgUrl2}
              setImgUrl={setImgUrl2}
              max={1}
              type="national"
            />
          </View>
        </View>
      ) : (
        <View className="nameVerify-box">
          {result === 'FEEDER_SGS_CERTIFIED' && (
            <View className="box-img">
              <Image src={trueImg} />
            </View>
          )}
          <View className="box-text">
            {result === 'FEEDER_SGS_CERTIFIED' && '已实名认证'}
            {result === 'FEEDER_SGS_WAIT' && '认证中'}
            {result === 'FEEDER_SGS_FAILED' && '认证失败'}
          </View>
          {result === 'FEEDER_SGS_FAILED' && (
            <View className="box-note box-note-failed">{details?.feedBack}</View>
          )}
          <View className="box-note">实名认证成功后不可修改</View>
          <View className="nameVerify-box-info">
            {columns.map((item) => (
              <View key={item.key}>
                {item.label}:&nbsp;{details !== undefined ? details[item.key] : ''}
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="nameVerify-btn">
        <Button
          className="resetBtn btn_feeder mt16"
          formType="submit"
          onClick={(e) => {
            if (result === 'FEEDER_SGS_CERTIFIED' || result === 'FEEDER_SGS_WAIT') {
              Taro.switchTab({ url: '/pages/mine/index' });
              return;
            }
            setResult('FEEDER_SGS_NOT');
            handleSubmit(e);
          }}
          // style={{ opacity: '.5' }}
        >
          {(result === 'FEEDER_SGS_CERTIFIED' || result === 'FEEDER_SGS_WAIT') && '我知道了'}
          {result === 'FEEDER_SGS_NOT' && '提交'}
          {result === 'FEEDER_SGS_FAILED' && '重新认证'}
        </Button>
      </View>
    </View>
  );
}
