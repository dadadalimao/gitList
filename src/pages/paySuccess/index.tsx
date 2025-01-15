import { View, Image, Text } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import paySuccess from '@/images/paySuccess.svg';
import feederSuccess from '@/images/feederSuccess.svg';
import AlertPage from '@/components/AlertPage';
import { getUrl } from '@/utils/oss';
import { getBaseDictInfo } from '@/api';

export default function PaySuccess() {
  const [type, setType] = useState('');
  const [qrCode, setQrCode] = useState('');
  useLoad((options) => {
    console.log(options);
    setType(options.type);
    if (options.type === 'feederCertification') {
      Taro.setNavigationBarTitle({
        title: '喂养员认证',
      });
      getBaseDictInfo('PIC_SERVICE_QRCODE').then((res) => {
        console.log('🚀 ~ useLoad ~ res:', res);
        setQrCode(res.data.vals);
      });
    } else {
      Taro.setNavigationBarTitle({
        title: '支付成功',
      });
    }
  });
  return (
    <View className="pay-success-container">
      {/* 支付成功图标和文字 */}
      <View className="success-section">
        <Image
          className="success-icon"
          src={type === 'feeder' ? feederSuccess : paySuccess}
          mode="aspectFill"
        />
        <Text className="success-text bold">支付成功</Text>
        <Text className="success-desc">
          {type === 'feederCertification'
            ? '提交成功，请耐心等待1-2天审核，结果将及时做信息通知~'
            : '您已完成支付，感谢您的支持~'}
        </Text>
      </View>

      {/* 二维码部分 */}
      {type === 'feederCertification' && (
        <View className="qr-section">
          <Text className="qr-title">添加客服微信</Text>
          <View className="flex_cc">
            <Image
              className="qr-code"
              src={getUrl(qrCode)}
              mode="aspectFill"
              show-menu-by-longpress
            />
            <Text className="qr-desc">
              请点击左侧二维码图片长按保存图片，添加woffie企业微信客服，如有任何需求或疑问，欢迎随时联系我们的客服哦！
            </Text>
          </View>
        </View>
      )}

      {/* 返回按钮 */}
      <AlertPage>
        <View
          className={`back-button ${type === 'feeder' ? 'btn_feeder' : 'btn_main'}`}
          onClick={() => {
            Taro.navigateBack({
              fail: () => {
                Taro.switchTab({
                  url: '/pages/petServices/index',
                });
              },
            });
          }}
        >
          返回
        </View>
      </AlertPage>
    </View>
  );
}
