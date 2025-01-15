import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import people from '@/images/nameVerify/people.svg';
import national from '@/images/nameVerify/national.png';
import iconDel from '@/images/close_fff_8.png';
import './index.scss';

interface Porps {
  max?: number;
  title: string;
  type: 'people' | 'national';
  imgUrl: string[];
  setImgUrl: Dispatch<SetStateAction<string[]>>;
}
const UploadImg = ({
  max = 1, title, type, imgUrl, setImgUrl,
}: Porps) => {
  const chooseImage = () => {
    Taro.chooseImage({
      count: Math.min(9, max - imgUrl.length),
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const { tempFilePaths } = res;
        setImgUrl((prev) => [...prev, ...tempFilePaths]);
      },
    });
  };

  return (
    <View className="upload-img">
      <View className="upload-img-item">
        {imgUrl.length > 0 ? (
          <View className="upload-img-item-have upload-item ">
            <Image src={imgUrl[0]} className="upload-have-img" />
            <View
              className="upload-del"
              onClick={() => {
                setImgUrl([]);
              }}
            >
              <Image src={iconDel} />
            </View>
          </View>
        ) : (
          <View className="upload-img-item-none upload-item">
            <View className="upload-people">
              <Image src={type === 'national' ? national : people} className="upload-people-img" />
              <View className="add">
                <View onClick={chooseImage}>＋</View>
                <View>{title}</View>
              </View>
            </View>
            <View className="top-left upload-s" />
            <View className="top-right upload-s" />
            <View className="bottom-left upload-s" />
            <View className="bottom-right upload-s" />
          </View>
        )}
      </View>
    </View>
  );
};

export default UploadImg;
