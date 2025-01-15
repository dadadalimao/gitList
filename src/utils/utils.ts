import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import sexFemaleIcon from '@/images/svg/sexFemale.svg';
import sexMaleIcon from '@/images/svg/sexMale.svg';
import sexIndeterminacyIcon from '@/images/svg/sexIndeterminacy.svg';

const version = 2;
// 宠物性别图标
export const getSexIcon = (gender) => {
  if (gender === 'PET_SEX_MALE') return sexMaleIcon;
  if (gender === 'PET_SEX_FEMINA') return sexFemaleIcon;
  return sexIndeterminacyIcon;
};
// 喂养员性别图标
export const getFeederSexIcon = (gender) => {
  if (gender === 'MEMBER_GENDER_MALE') return sexMaleIcon;
  if (gender === 'MEMBER_GENDER_FEMINA') return sexFemaleIcon;
  return '';
};
/** 游客可查看的页面 */
export const guestAccessiblePages = ['/pages/webView/index'];

/** 打开微信客服 */
export const openServiceChat = ({
  showMessageCard = false,
  sendMessageTitle = '',
  sendMessagePath = '',
  sendMessageImg = '',
}: {
  showMessageCard?: boolean;
  sendMessageTitle?: string;
  sendMessagePath?: string;
  sendMessageImg?: string;
} = {}) => {
  Taro.openCustomerServiceChat({
    extInfo: { url: 'https://work.weixin.qq.com/kfid/kfc7be9a2ff73169bd5' },
    corpId: 'wwc8b89aacbc1ce05c',
    showMessageCard, // 是否发送小程序气泡消息
    sendMessageTitle, // 气泡消息标题
    sendMessagePath, // 气泡消息小程序路径（一定要在小程序路径后面加上“.html”，如：pages/index/index.html）
    sendMessageImg, // 气泡消息图片
    success(res) {
      console.log('success', JSON.stringify(res));
    },
    fail(err) {
      console.log('fail', JSON.stringify(err));
      // eslint-disable-next-line no-undef
      return Taro.showToast({
        title: err.errMsg,
        icon: 'none',
      });
    },
  });
};
/** 轻提示 icon:'none' */
export const toast = (title, duration = 1500) => {
  Taro.showToast({
    title,
    icon: 'none',
    duration,
  });
};
export const navTo = (url) => {
  Taro.navigateTo({ url });
};
/** 是否 暂未开放 showToast
 * @param v 功能需求版本
 */
export const NotYetOpen = (v?: number) => {
  // 没有版本需求不是查询直接 未开放
  if (!v) {
    toast('敬请期待~');
    return true;
  }
  // 功能需求版本大于当前版本 未开放
  if (v && v > version) {
    toast('敬请期待~');
    return true;
  }
  return false;
};
let historyLocation: Taro.getLocation.SuccessCallbackResult = {
  latitude: 0,
  longitude: 0,
  accuracy: 0,
  altitude: 0,
  horizontalAccuracy: 0,
  speed: 0,
  verticalAccuracy: 0,
  errMsg: '',
};
let permissionAlert = false;
export const getLocation = () => {
  return new Promise<Taro.getLocation.SuccessCallbackResult>((resolve, reject) => {
    Taro.getLocation({
      type: 'gcj02',
      success(res) {
        historyLocation = res;
        console.log(res, 'getLocation');
        return resolve(res);
      },
      fail(err) {
        const systemSetting = Taro.getSystemSetting();
        if (!systemSetting.locationEnabled && !permissionAlert) {
          permissionAlert = true;
          Taro.showModal({
            title: '提示',
            content: '定位失败，请检查微信的地理位置的系统开关',
            success: (res) => {
              // permissionAlert = false
            },
          });
          return reject(err);
        }
        console.log(err, '获取位置失败');
        if (historyLocation.latitude && historyLocation.longitude) {
          return resolve(historyLocation);
        }
        return reject(err);
      },
    });
  });
};
export const responseModal = () => {
  Taro.getSetting({
    success: (res) => {
      if (
        typeof res.authSetting['scope.userLocation'] !== 'undefined'
        && !res.authSetting['scope.userLocation']
      ) {
        // 用户拒绝了授权
        Taro.showModal({
          title: '提示',
          content: '未授权地理位置信息，无法查看附近的宠物友好地点',
          confirmText: '去设置',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 跳转设置页面
              Taro.openSetting();
            }
          },
        });
      }
    },
  });
};
/* 版本比较 可用于判断接口是否可用 */
export const compareVersion = (v1: string, v2: string) => {
  const v1Parts = v1.split('.');
  const v2Parts = v2.split('.');
  const len = Math.max(v1Parts.length, v2Parts.length);

  while (v1Parts.length < len) {
    v1Parts.push('0');
  }
  while (v2Parts.length < len) {
    v2Parts.push('0');
  }

  for (let i = 0; i < len; i += 1) {
    const num1 = parseInt(v1Parts[i], 10);
    const num2 = parseInt(v2Parts[i], 10);

    if (num1 > num2) {
      return 1;
    }
    if (num1 < num2) {
      return -1;
    }
  }

  return 0;
};
/** 经纬度判断距离 单位：千米 */
export function getDistance(start, end) {
  const lat1 = start.latitude;
  const lng1 = start.longitude;
  const lat2 = end.latitude;
  const lng2 = end.longitude;
  const radLat1 = (lat1 * Math.PI) / 180.0; // 添加括号
  const radLat2 = (lat2 * Math.PI) / 180.0; // 添加括号
  const a = radLat1 - radLat2;
  const b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0; // 添加括号
  let s = 2 * Math.asin(Math.sqrt(
    Math.sin(a / 2) ** 2
    + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) ** 2,
  ));
  s *= 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s.toFixed(2);
}

/**
 * 提取地址信息
 * 该函数旨在将给定的地址字符串解析为省份、城市、地区
 *
 * @param detailedAddress 完整的地址字符串，将从中提取信息
 * @returns 返回一个对象，包含省份、城市、地区和detailedAddress
 */
export const extractAddressInfo = (detailedAddress) => {
  // 初始化字符串变量，确保地址信息是字符串格式
  let string = `${detailedAddress}`;
  // 初始化省份、城市、地区和详细地址变量
  let province = '';
  let city = '';
  let area = '';

  // 定义省份类型数组，用于识别省份
  const provinceType = ['省', '自治区', '特别行政区'];
  // 定义城市类型数组，用于识别城市
  const cityType = ['市', '自治州', '地区', '盟'];
  // 定义地区类型数组，用于识别地区
  const areaType = ['区', '县', '旗', '市辖区', '自治县', '林区'];

  /**
   * 查找并返回在指定字符串中找到的特定关键字的信息
   *
   * @param arr 包含关键字的数组
   * @param s 在该字符串中查找关键字
   * @returns 返回找到的最靠前的关键字的索引和长度，如果没有找到则返回 undefined
   */
  const findZero = (arr, s) => {
    return arr.map((i) => ({
      index: s.indexOf(i),
      len: i.length,
    }))
      .filter((i) => i.index !== -1)
      .sort((a, b) => (a.index - b.index))[0];
  };

  // 使用 findZero 函数查找省份
  const proIndex = findZero(provinceType, string);
  // 使用 findZero 函数查找城市
  let cityIndex = findZero(cityType, string);
  // 使用 findZero 函数查找地区
  let areaIndex = findZero(areaType, string);

  // 根据查找结果提取省份信息
  if (proIndex && (cityIndex ? proIndex.index < cityIndex.index : true)) {
    province = string.slice(0, proIndex.index + proIndex.len);
    string = string.replace(province, '');
    // 重新查找城市和地区的索引，因为字符串已经被修改
    cityIndex = findZero(cityType, string);
    areaIndex = findZero(areaType, string);
  }

  // 根据查找结果提取城市信息
  if (cityIndex && (areaIndex ? cityIndex.index < areaIndex.index : true)) {
    city = string.slice(0, cityIndex.index + cityIndex.len);
    string = string.replace(city, '');
    // 处理特殊情况，如果城市名称重复出现
    if (string.indexOf(city) === 0) {
      string = string.replace(city, '');
    }
    // 重新查找地区索引，因为字符串已经被修改
    areaIndex = findZero(areaType, string);
  }

  // 根据查找结果提取地区信息
  if (areaIndex) {
    area = string.slice(0, areaIndex.index + areaIndex.len);
    string = string.replace(area, '');
  }

  // 返回提取的地址信息
  return {
    province,
    city,
    area,
    detailedAddress,
  };
};

/** 生日转换成年龄 */
export const handelAge = (bir: any) => {
  if (bir) {
    // 将时间戳转换为 dayjs 对象
    const birthDate = dayjs(bir);
    // 获取当前时间的 dayjs 对象
    const currentDate = dayjs();
    // 计算月份差
    const monthsDifference = currentDate.diff(birthDate, 'month');

    if (monthsDifference < 1) {
      return '未满月';
    } if (monthsDifference >= 12) {
      const yearsDifference = Math.floor(monthsDifference / 12);
      return `${yearsDifference}岁`;
    }
    return `${monthsDifference}个月`;
  }
  return '未知';
};

/** 返回手机号 xxx **** xxxx 格式 */
export const getHideTel = (tel: string) => {
  if (!tel) return '';
  return `${tel.slice(0, 3)} **** ${tel.slice(7)}`;
};
