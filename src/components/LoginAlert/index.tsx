import { View, Image, Button } from '@tarojs/components';
import { useContext, useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import AlertPage from '@/components/AlertPage';
import phoneImg from '@/images/login/phone.svg';
import logoImg from '@/images/login/logo.svg';
import woffieImg from '@/images/login/woffie.svg';
import chinaImg from '@/images/login/china.svg';
import radioSelImg from '@/images/radioSel.svg';
import './index.scss';
import { login } from '@/api/member';
import Agreement from '../Agreement/Agreement';
import request from '@/api/apiRequest';
import { dispatch, myContext } from '@/store';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onSuccess?: (res) => void;
}
export default function LoginAlert({ visible, setVisible, onSuccess }: Props) {
  // 用于存储是否勾选了"已阅读并同意协议"
  const [checked, setChecked] = useState(false);
  const { state } = useContext(myContext);
  const onGetPhoneNumber = (e) => {
    console.log('e', e);
    if (e.detail.code) {
      Taro.login({
        success(result) {
          console.log('🚀 ~ success ~ result:', result);
          login({
            account: e.detail.code,
            code: result.code,
          })
            .then((res) => {
              console.log('🚀 ~ success ~ res:', res);
              setVisible(false);
              Taro.showToast({
                title: '登录成功',
              });
              dispatch({
                type: 'setQuickLoginInfo',
                payload: undefined,
              });
              if (onSuccess) onSuccess(res);
            })
            .catch((err) => {
              console.log('🚀 ~ success ~ err:', err.code, err.message);
              Taro.showModal({
                content: err.message,
                showCancel: false,
              });
            });
        },
      });
    }
  };
  useEffect(() => {
    // 弹出登录框且没有登录信息 尝试直接登录
    console.log('state', state?.quickLoginInfo);
    if (visible && !state?.quickLoginInfo) {
      Taro.login({
        success(result) {
          console.log('🚀 ~ success ~ result:', result);
          request({
            url: '/mem/member/obtainLogin',
            method: 'POST',
            data: {
              code: result.code,
            },
            loading: '登录初始化',
          })
            .then((res) => {
              console.log('🚀 ~ success ~ res:', res);
              dispatch({
                type: 'setQuickLoginInfo',
                payload: res.data || {},
              });
            });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  return (
    <AlertPage show={visible} onClose={() => setVisible(false)} topLine tapMaskHide mask>
      <View className="login-container">
        <View className="logo">
          <Image src={logoImg} />
        </View>
        <View className="woffie">
          <Image src={woffieImg} />
        </View>
        <View className="china">
          <Image src={chinaImg} />
        </View>
        {/* checked && !state?.quickLoginInfo?.token */}
        {checked && !state?.quickLoginInfo?.token ? (
          <Button
            className="resetBtn btn_main"
            openType="getPhoneNumber"
            onGetPhoneNumber={onGetPhoneNumber}
          >
            <Image className="icon20 mr8" src={phoneImg} />
            授权手机号登录
          </Button>
        ) : (
          // 快速登录和未同意协议
          <Button
            className="resetBtn btn_main"
            onClick={() => {
              if (!checked) {
                Taro.showToast({
                  title: '请勾选同意协议',
                  icon: 'none',
                });
                return;
              }
              if (state?.quickLoginInfo) {
                // 同意协议 保存登录信息
                const loginMember = { ...(state?.quickLoginInfo || {}) };
                Taro.setStorage({
                  key: 'loginMember',
                  data: loginMember,
                });
                dispatch({
                  type: 'member.update',
                  payload: loginMember,
                });
                dispatch({
                  type: 'setQuickLoginInfo',
                  payload: undefined,
                });

                Taro.showLoading({ title: '登录中' });
                if (onSuccess) onSuccess(loginMember);
                setTimeout(() => {
                  Taro.hideLoading();
                  setVisible(false);
                }, 200);
              }
            }}
          >
            <Image className="icon20 mr8" src={phoneImg} />
            授权手机号登录
          </Button>
        )}

        <View className="read" onClick={() => setChecked(!checked)}>
          {checked ? (
            <Image className="icon14 mr4" src={radioSelImg} />
          ) : (
            <View className="radio_nor mr4" />
          )}
          <View className="flex">
            我已阅读并同意神奇宠物
            <Agreement className="agreement c_main" type="platform">
              《平台协议》
            </Agreement>
            和
            <Agreement className="agreement c_main" type="privacy">
              《隐私政策》
            </Agreement>
          </View>
        </View>
      </View>
    </AlertPage>
  );
}
