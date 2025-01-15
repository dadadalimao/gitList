import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { useEffect, useState } from 'react';
import defaultAvatar from '@/images/defaultAvatar.png';
import cameraImg from '@/images/myInfo/camera.png';
import copyImg from '@/images/myInfo/copy.png';
import './index.scss';

const Avatar = ({ src, id, onChange }) => {
  const [img, setImg] = useState(defaultAvatar);
  useEffect(() => {
    if (src) setImg(src);
  }, [src]);
  return (
    <View className="avatar-container">
      <View
        className="avatar"
        onClick={() => {
          Taro.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
              Taro.cropImage({
                cropScale: '1:1',
                src: res.tempFilePaths[0], // 图片路径
                success: (result) => {
                  setImg(result.tempFilePath);
                  onChange(result.tempFilePath);
                },
              });
            },
          });
        }}
      >
        <Image className="avatar-img" src={img} mode="aspectFill" />
        <View className="camera flex_cc bg_main">
          <Image className="icon16" src={cameraImg} />
        </View>
      </View>
      {id && (
        <View
          className="flex_ic"
          onClick={() => {
            Taro.setClipboardData({
              data: id,
              success: () => {
                Taro.showToast({ title: '复制成功', icon: 'success' });
              },
              fail: (err) => {
                console.error('复制失败', err);
                Taro.showToast({ title: '复制失败', icon: 'none' });
              },
            });
          }}
        >
          <View className="userId mr6 fz16">{`ID: ${id}`}</View>
          <Image className="copyIcon" src={copyImg} />
        </View>
      )}
    </View>
  );
};
export default Avatar;
