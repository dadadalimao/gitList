import Taro, { useDidShow } from '@tarojs/taro';
import { useContext, useState } from 'react';
import { guestAccessiblePages, NotYetOpen } from '@/utils/utils';
import { myContext } from '@/store';
import OrderCard from './OrderCard';
import PetCard from './PetCard';
import ToolCard from './ToolCard';
import DepositCard from './DepositCard';

export default function MineCard({ myPets, setLoginVisible }) {
  const [kindOpts, setKindOpts] = useState<any>({});
  const [sexOpts, setSexOpts] = useState<any>({});
  const [msg, setMsg] = useState({
    Unpaid: 0,
    WaitingForAcceptance: 0,
    WaitingForArrival: 0,
    InProgress: 0,
    WaitingForApproval: 0,
  });

  const { state } = useContext(myContext);
  // const state = { identity: 'feeder' };

  const navTo = (url) => {
    if (state?.loginMember && !guestAccessiblePages.includes(url)) {
      Taro.navigateTo({ url });
    } else {
      setLoginVisible(true);
    }
  };

  useDidShow(() => {
    Taro.request({
      url: '/pt/kind/allNotDel',
      method: 'GET',
    }).then((res) => {
      const result: any = {};
      res.data.forEach((item: any) => {
        result[item.id] = item.name;
      });
      setKindOpts(result);
    });

    Taro.request({
      url: '/base/dict/getList?code=PET_SEX',
      method: 'GET',
    }).then((res) => {
      const result: any = {};
      res.data.forEach((item: any) => {
        result[item.code] = item.vals;
      });
      setSexOpts(result);
    });
  });

  return (
    <>
      {state?.identity === 'feeder' ? (
        <DepositCard amount={state?.loginMember?.deposit || 0} navTo={navTo} />
      ) : (
        <OrderCard msg={msg} navTo={navTo} />
      )}
      <PetCard myPets={myPets} kindOpts={kindOpts} sexOpts={sexOpts} navTo={navTo} />
      <ToolCard navTo={navTo} setLoginVisible={setLoginVisible} loginMember={state?.loginMember} />
    </>
  );
}
