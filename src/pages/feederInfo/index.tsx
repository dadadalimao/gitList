import { View, SwiperItem, Image, Button, Textarea } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { useContext, useState } from 'react';
import backIcon from '@/images/back.png';
import starIcon from '@/images/feeder/star.svg';
import { myContext } from '@/store';
import defaultAvatar from '@/images/defaultAvatar.png';
import rightImg from '@/images/right.png';

import request from '@/api/apiRequest';
import { getFeederSexIcon } from '@/utils/utils';
import { MenuItem } from '@nutui/nutui-react-taro';

const statusBarHeigh = Taro.getSystemInfoSync().statusBarHeight;

export default function Index() {
  const { state } = useContext(myContext);
  /** 详情 */
  const [details, setDetails] = useState<any>({});
  /** 类别 */
  const [types, setTypes] = useState<any>({});
  /** 专业技能 */
  const [skills, setSkills] = useState<any>({});

  useLoad((o) => {
    // o.id = '1869619569715449858';
    /** 获取类别 */
    request({
      url: '/pt/kind/allNotDel',
      method: 'GET',
    }).then((res) => {
      const result: any = {};
      res.data.forEach((item) => {
        result[item.id] = item.name;
      });
      setTypes(result);
    });
    /** 获取专业技能 */
    request({
      url: '/base/dict/getList?code=FEEDER_SKILL',
      method: 'GET',
    }).then((res) => {
      const result: any = {};
      res.data.forEach((item) => {
        result[item.code] = item.nameZhcn;
      });
      setSkills(result);
    });
    request({
      url: `/fd/feeder/info?id=${o.id}`,
      method: 'GET',
      Loading: '加载中',
    }).then((res) => {
      setDetails(res.data);
    });
  });

  const handleAge = (birthDateString?: any) => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  };
  return (
    <View className="tabbar-page-container" style={{ background: '#fefefe', minHeight: '100vh' }}>
      <View className="petServices-container">
        <View
          className="petServices-header"
          style={{ paddingTop: statusBarHeigh, height: '240px' }}
        >
          <Image
            src={details?.avatar ?? defaultAvatar}
            className="petServices-header-bg"
            style={{ width: '100%', filter: 'blur(7px)' }}
          />
          <View className="custom-nav-title flex_cc">
            <Image
              src={backIcon}
              className="icon24 custom-nav-back"
              onClick={() =>
                Taro.navigateBack({
                  fail: () => {
                    Taro.switchTab({ url: '/pages/mine/index' });
                  },
                })
              }
            />
            喂养员主页
          </View>
        </View>
        <View className="f">
          <View className="f-avatar">
            <Image src={details?.avatar ?? defaultAvatar} />
          </View>
          <View className="f-star">
            {[1, 2, 3, 4, 5].map((item) => (
              <Image src={starIcon} key={item} />
            ))}
          </View>
          <View className="f-name">
            <View>{details?.member?.realName}</View>
            <View className="gender-icon-box flex_cc">
              <Image className="icon20 gender" src={getFeederSexIcon(details?.member?.sex)} />
            </View>
            <View className="f-type">
              {details?.typeOfServiceList?.map((item) => (
                <>
                  {item === '1866291171861598209' && (
                    <View className="type-bg1">{types[item]}</View>
                  )}
                  {item === '1866058624737087489' && (
                    <View className="type-bg2">{types[item]}</View>
                  )}
                  {item === '1866055431948996609' && (
                    <View className="type-bg3">{types[item]}</View>
                  )}
                </>
              ))}
            </View>
          </View>
          <View className="f-age">
            <View className="f-age-left">
              <View>认证2年</View>
              <View>服务过130+次</View>
              <View>{`${handleAge(details?.member?.age)}岁`}</View>
            </View>
            <View>距离1km</View>
          </View>
          {details?.profile && <View className="f-intro">{details?.profile}</View>}
          <View className="f-title">专业技能</View>
          <View className="skill">
            {details?.fdSpecialList?.map((item) => (
              <>
                {item === 'FEEDER_SKILL_FEED' && <View className="skill-bg1">{skills[item]}</View>}
                {item === 'FEEDER_SKILL_GROOM' && <View className="skill-bg2">{skills[item]}</View>}
                {item === 'FEEDER_SKILL_TRAIN' && <View className="skill-bg3">{skills[item]}</View>}
                {item === 'FEEDER_SKILL_CARE' && <View className="skill-bg4">{skills[item]}</View>}
              </>
            ))}
          </View>
          <View className="f-title">
            用户评价
            <View
              className="more"
              onClick={() => {
                Taro.navigateTo({ url: '/pages/feederComment/index' });
              }}
            >
              更多评价
              <Image src={rightImg} />
            </View>
          </View>
        </View>
        <View className="f-comment">
          <View className="f-comment-item">
            <View className="f-comment-title">
              <View className="f-comment-title-left">
                <View className="f-comment-title-img">
                  <Image src={defaultAvatar} />
                </View>
                <View>
                  <View>111</View>
                  <View className="f-star" style={{ marginBottom: '0' }}>
                    {[1, 2, 3, 4, 5].map((item2) => (
                      <Image src={starIcon} key={item2} />
                    ))}
                  </View>
                </View>
              </View>
              <View>2024-10-08</View>
            </View>
            <View className="f-comment-content">
              好评好评好评好评好评好评好评好评好评好评好评好评 好评好评好评 好评好评好评
              好评好评好评 好评好评好评 好评好评好评 好评好评好评 好评好评好评
            </View>
          </View>
        </View>
        <View className="btn">
          <Button className="resetBtn btn_main">预约服务</Button>
        </View>
      </View>
    </View>
  );
}
