import {
  View, Text, Image,
} from '@tarojs/components';
import { useContext, useState } from 'react';
import '@nutui/nutui-react-taro/dist/esm/popover/style/css.js';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import orderLocationImg from '@/images/ownerOrder/orderLocation.png';
import backImg from '@/images/back.png';
import { navTo } from '@/utils/utils';
import { dispatch, myContext } from '@/store';
import ServiceNotice from '../components/ServiceNotice';
import ServicePets from '../components/ServicePets';
import ServiceRules from '../components/ServiceRules';
import OrderType from '../components/OrderType';
import './index.scss';

export default function PetServicesOrderCreate() {
  const { state } = useContext(myContext);
  // 宠物列表
  const petList = state.orderPetList;
  // 备注文字计数
  const [remarkCount, setRemarkCount] = useState(0);
  // 地址
  const [address, setAddress] = useState<any>();
  // 钥匙交接方式
  const [keyType, setKeyType] = useState<string>('');
  // 期望上门时间
  const [doorTime, setDoorTime] = useState<(string | number)[]>([]);
  // 下单方式
  const [orderType, setOrderType] = useState<'ASSIGN' | 'PLATFORM'>('ASSIGN');

  useLoad((options) => {
    if (options.data) {
      // options.data;
    } else {
      dispatch({
        type: 'setOrderPetList',
        payload: [],
      });
    }
  });
  useDidShow(() => {
    if (state.chooseAddress) {
      setAddress(state.chooseAddress);
      dispatch({
        type: 'setChooseAddress',
        payload: undefined,
      });
    }
    if (state.orderPetList && state.orderPetList.length > 0) {
      console.log('🚀 ~ useDidShow ~ state.orderPetList:', state.orderPetList);
      // setPetList(state.orderPetList);
    }
  });
  return (
    <View className="pet-services-order-create">
      <CustomNavigationBar title="宠物服务下单" theme="owner-claw" showBack>
        <View className="container xsafe_16">
          {/* 下单方式 */}
          <OrderType type={orderType} />

          {/* 我的地址 */}
          <View className="section address-section">
            <View className="section-title">
              <Image src={orderLocationImg} className="icon location" />
              <Text>我的地址</Text>
            </View>
            <View
              className="select-item select-address flex_csb"
              onClick={() => {
                navTo(`/pages/myAddress/index?type=choose&chooseId=${address?.id || ''}`);
              }}
            >
              {address ? (
                <View className="address-info fz14">
                  <View className="flex_ic">
                    <View className="mr8">{address.name}</View>
                    <View>{address.phone}</View>
                  </View>
                  <View className="fz12 mt4 break-all">{`${address.addressName}（${address.address}）${address.info}`}</View>
                </View>
              ) : <Text className="select-text">选择我的地址</Text>}
              <Image className="arrow icon24" src={backImg} />
            </View>
          </View>

          {/* 服务宠物 */}
          <ServicePets petList={petList} />

          {/* 服务细则 */}
          <ServiceRules
            keyType={keyType}
            setKeyType={setKeyType}
            doorTime={doorTime}
            setDoorTime={setDoorTime}
            remarkCount={remarkCount}
            onRemarkChange={setRemarkCount}
          />

          {/* 服务须知 */}
          <ServiceNotice />

          {/* 底部按钮 */}
          <View
            className="bottom-button btn_main"
            onClick={() => {
              Taro.preload({
                step2: JSON.stringify({
                  orderType,
                  address,
                  petList,
                  keyType,
                  doorTime,
                  remarkCount,
                }),
              });
              navTo('/pages/petServicesOrderCreate/step2/index');
            }}
          >
            下一步
          </View>
        </View>
      </CustomNavigationBar>
    </View>
  );
}
