import { View, Image } from '@tarojs/components';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import { useCallback, useContext, useEffect, useState } from 'react';
import TabBar from '@/components/TabBar';
import defaultAvatarImg from '@/images/defaultAvatar.png';
import avatarDecorateImg from '@/images/mine/avatarDecorate.png';
import avatarDecorateImgFeeder from '@/images/mine/avatarDecorateFeeder.png';
import changeImg from '@/images/svg/random.svg';
import editImg from '@/images/mine/edit.png';
import homeBg from '@/images/petServices/homeBg.svg';
import homeBgFeeder from '@/images/petServices/homeBgFeeder.svg';
import './index.scss';
import MineCard from './MineCard/MineCard';
import { getState, myContext } from '@/store';
import { NotYetOpen, toast } from '@/utils/utils';
import LoginAlert from '@/components/LoginAlert';
import { getInfo } from '@/api/member';
import { getAvatar, getUrl } from '@/utils/oss';
import CustomNavigationBar from '@/components/CustomNavigationBar';

export default function Index() {
  const [loginVisible, setLoginVisible] = useState(false);
  /** 我的宠物 */
  const [myPets, setMyPets] = useState<any[]>([]);
  const { state, dispatch } = useContext(myContext);

  const navTo = (url) => {
    if (getState()?.loginMember) {
      Taro.navigateTo({ url });
    } else {
      setLoginVisible(true);
    }
  };
  const getPetList = useCallback(() => {
    Taro.request({
      url: '/pt/pet/myPet',
      method: 'GET',
    }).then((res2) => {
      setMyPets(res2.data);
    });
  }, [setMyPets]);

  useDidShow(() => {
    getInfo('', true);
    if (state.loginMember.id) {
      getPetList();
    }
  });
  useLoad(() => {
    if (!state.loginMember) setLoginVisible(true);
  });
  useEffect(() => {
    if (state.loginMember?.id) {
      getPetList();
    } else if (myPets.length) {
      setMyPets([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loginMember?.id]);

  /** 切换用户身份的处理 */
  const switchIdentity = (e) => {
    e.stopPropagation(); // 阻止事件冒泡

    if (NotYetOpen(2)) return;

    if (!getState()?.loginMember) {
      setLoginVisible(true);
      return;
    }

    if (!getState()?.loginMember?.feeder || !getState()?.loginMember?.feeder.testPassed) {
      toast('您还未通过喂养员认证');
      return;
    }
    // 切换身份：如果当前是宠物主则切换为喂养员，反之亦然
    const newIdentity = state.identity === 'owner' ? 'feeder' : 'owner';

    // 发送更新身份的 action
    dispatch({ type: 'setIdentity', payload: newIdentity });
  };

  return (
    <View className="tabbar-page-container">
      <Image
        className="petServices-homeBg"
        src={state.identity === 'feeder' ? homeBgFeeder : homeBg}
      />
      <CustomNavigationBar
        title="我的"
        containerClassName="mine-container"
        theme={state.identity === 'owner' ? 'owner' : 'feeder-mine'}
      >
        <View
          className={`mine-header ${state.identity === 'feeder' ? 'mine-header-feeder' : 'mine-header-owner'}`}
        >
          <View className="mine-header-avatar" onClick={() => navTo('/pages/myInfo/index')}>
            <Image
              className="mine-header-avatar-decorate-left"
              src={state.identity === 'feeder' ? avatarDecorateImgFeeder : avatarDecorateImg}
            />
            <Image
              className="mine-header-avatar-decorate-right"
              src={state.identity === 'feeder' ? avatarDecorateImgFeeder : avatarDecorateImg}
            />
            <Image
              className="mine-header-avatar-img"
              src={getAvatar(state.loginMember?.pic)}
              mode="aspectFill"
            />
            <View className="mine-header-identity-view flex_cc">
              <View className="mine-header-identity fz12 flex_ic" onClick={switchIdentity}>
                <View className="flex_cc mr4 mine-header-identity-icon">
                  <Image className="icon12" src={changeImg} />
                </View>
                {state.identity === 'owner' ? '宠物主' : '喂养员'}
              </View>
            </View>
          </View>
          <View
            className="mine-header-userName mt8 flex_cc"
            onClick={() => navTo('/pages/myInfo/index')}
          >
            <View className="mr6 fz18 mine-header-userName-text ellipsis">
              {state.loginMember ? state.loginMember.nickName : '未登录'}
            </View>
            <Image className="icon14" src={editImg} />
          </View>
        </View>

        <MineCard myPets={myPets} setLoginVisible={setLoginVisible} />
      </CustomNavigationBar>
      <TabBar activeIndex={1} />
      <LoginAlert visible={loginVisible} setVisible={setLoginVisible} />
    </View>
  );
}
