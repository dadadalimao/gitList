import { Image, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import iconUploadImg from '@/images/uploadImg.png';
import iconDel from '@/images/close_fff_8.png';
import './index.scss';

interface Porps {
  max?: number;
  imgUrl: string[];
  setImgUrl: Dispatch<SetStateAction<string[]>>;
}
const UploadImg = ({ max = 3, imgUrl, setImgUrl }: Porps) => {
  // const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [imgUrlBlock, setImgUrlBlock] = useState<number[]>([]);
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

  useEffect(() => {
    if (imgUrl.length) {
      const calculateLen = (imgUrlLength: number) => {
        // 如果传入的图片 URL 数量大于等于最大数量，直接返回 0
        if (imgUrlLength >= max) {
          return 0;
        }
        const remainder = (imgUrlLength + 1) % 3;
        console.log('🚀 ~ calculateLen ~ remainder:', remainder, imgUrlLength);
        // 根据余数情况确定需要补充的长度值，若余数为 0 则补充长度为 0，否则用 3 减去余数得到补充长度
        return remainder === 0 ? 0 : 3 - remainder;
      };
      // 计算需要补充的长度值
      const len = calculateLen(imgUrl.length);
      // 根据计算出的长度值创建一个填充为 '0' 的数组，用于后续操作（具体作用根据业务场景确定）
      const newBlock = Array.from({ length: len }, () => Math.random());
      console.log('🚀 ~ useEffect ~ newBlock:', newBlock);
      setImgUrlBlock(newBlock);
    }
  }, [imgUrl.length, max]);
  return (
    <View className="upload-img">
      {imgUrl.map((item) => {
        return (
          <View key={item} className="upload-img-item">
            <View
              className="upload-img-item-del-box"
              onClick={() => {
                setImgUrl(imgUrl.filter((i) => i !== item));
              }}
            >
              <Image className="upload-img-item-del" src={iconDel} />
            </View>
            <Image className="upload-img-item-img" src={item} mode="aspectFill" />
          </View>
        );
      })}
      {max - imgUrl.length > 0 && (
        <View className="upload-img-item upload-img-item-default" onClick={chooseImage}>
          <Image className="upload-img-item-default-img" src={iconUploadImg} />
        </View>
      )}
      {imgUrlBlock.map((item) => (
        <View key={item} className="upload-img-item-none" />
      ))}
    </View>
  );
};

export default UploadImg;
