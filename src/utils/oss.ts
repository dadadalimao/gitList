import Taro from '@tarojs/taro';
import { toast } from './utils';
import defaultAvatarImg from '@/images/defaultAvatar.png';
/**
 * 获取图片访问的路径
 * @param key 图片路径
 * @param size 大小，sm: 256, md: 512, lg: 1024
 * @returns 图片访问的完整路径
 */
const getUrl = (key: string, size?: 'sm' | 'md' | 'lg') => {
  if (!key) {
    return '';
  }
  const url = `${process.env.STATIC}${key}${size ? `/${size}` : ''}`;
  return url;
};

/** 获取图片key */
const getImgKey = (key: string) => {
  return key.replace(`${process.env.STATIC}`, '');
};

/** 获取头像 或 默认头像 */
const getAvatar = (avatar: string) => {
  if (!avatar) {
    return defaultAvatarImg;
  }
  return getUrl(avatar);
};
/**
 * 获取小缩略图访问的路径
 * @param key 图片路径
 * @returns 图片访问的完整路径
 */
const getSmallUrl = (key: string) => getUrl(key, 'sm');

/**
 * 获取中缩略图访问的路径
 * @param key 图片路径
 * @returns 图片访问的完整路径
 */
const getMiddleUrl = (key: string) => getUrl(key, 'md');

/**
 * 获取大缩略图访问的路径
 * @param key 图片路径
 * @returns 图片访问的完整路径
 */
const getLargeUrl = (key: string) => getUrl(key, 'lg');

const ossUpload = async (file: string) => {
  const x = await Taro.request({
    url: '/oss/getSignature',
    method: 'GET',
  });

  if (!x.data) {
    return null;
  }
  await Taro.uploadFile({
    url: x.data.host,
    filePath: file,
    name: 'file',
    header: {
      'x-oss-object-acl': 'public-read',
      'Cache-Control': 'public, max-age=31536000',
    },
    formData: {
      key: x.data.key,
      policy: x.data.policy,
      OSSAccessKeyId: x.data.accessId,
      signature: x.data.signature,
    },

  });

  return x.data.key;
};

/**
 * 批量上传图片
 * @param imgList 图片列表 chooseImage的tempFilePaths
 * @returns
 */
const uploadImages = async (imgList: string[]) => {
  if (imgList.length > 0) {
    try {
      Taro.showLoading({ title: '图片上传中...' });
      const uploadedUrls = await Promise.all(imgList.map(async (src) => {
        // 检查是否已经是 OSS 链接
        if (src.startsWith(process.env.STATIC || '')) {
          return getImgKey(src);
        }
        // 如果不是 OSS 链接，则上传新图片
        const img = await ossUpload(src);
        return img;
      }));
      Taro.hideLoading();
      return uploadedUrls;
    } catch (error) {
      Taro.hideLoading();
      toast('图片上传失败，请重试');
      return '图片上传失败，请重试';
    }
  } else {
    toast('请上传图片');
    return '请上传图片';
  }
};
export {
  getSmallUrl, getMiddleUrl, getLargeUrl, ossUpload, getUrl, getImgKey, getAvatar, uploadImages,
};
