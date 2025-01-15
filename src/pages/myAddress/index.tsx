import {
  View, Text, Checkbox, Button, Image,
} from '@tarojs/components';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import radioSelImg from '@/images/radioSel.png';
import addressDelImg from '@/images/addressDel.png';
import addressEditImg from '@/images/addressEdit.png';
import addressChooseEditImg from '@/images/addressChooseEdit.png';
import AlertPage from '@/components/AlertPage';
import request from '@/api/apiRequest';
import { addressDeleted, addressListApi, addressModify } from '@/api';
import Empty from '@/components/Empty';
import { dispatch } from '@/store';

export default function Index() {
  const [list, setList] = useState<any[]>([

  ]);
  const [showChooseAlert, setShowChooseAlert] = useState(false);
  const [chooseId, setChooseId] = useState();

  const handleEdit = (id?) => {
    // 这里可以添加编辑地址的逻辑
    Taro.navigateTo({
      url: `/pages/myAddressAdd/index?id=${id}`,
    });
  };

  const handleDelete = (id) => {
    // 这里可以添加删除地址的逻辑
    if (!id) return;
    Taro.showModal({
      content: '确定删除该地址？',
      success(result) {
        if (result.confirm) {
          addressDeleted({
            id,
          }).then(() => {
            Taro.showToast({
              title: '地址已删除',
            });
            getData();
          });
        }
      },
    });
  };

  const handleChoose = (id, item) => {
    if (showChooseAlert) {
      setChooseId(id);
      dispatch({
        type: 'setChooseAddress',
        payload: item,
      });
      Taro.navigateBack();
    }
  };
  const getData = () => {
    addressListApi().then((res) => {
      setList(res.data);
      if (chooseId) {
        const n = res.data.find((item) => item.id === chooseId);
        console.log('🚀 ~ addressListApi ~ n:', n);
        dispatch({
          type: 'setChooseAddress',
          payload: n,
        });
      }
    });
  };

  const handleSetDefault = (index, item) => {
    addressModify({
      id: item.id,
      isPrimary: !item.isPrimary,
    }).then((res) => {
      getData();
    });
  };

  useLoad((options) => {
    Taro.setNavigationBarTitle({
      title: '我的地址',
    });
    if (options.type === 'choose') {
      setShowChooseAlert(true);
    }
    if (options.chooseId) {
      setChooseId(options.chooseId);
    }
  });
  useDidShow(() => {
    getData();
  });

  return (
    <View className={`myAddress-container ${showChooseAlert ? 'myAddress-container-choose' : ''}`}>
      <View className="list">
        {list.map((item, index) => (
          <View className="item fz12" key={item.id} onClick={() => handleChoose(item.id, item)}>
            <View className={`item-radio flex_cc ${chooseId === item.id ? 'item-radio-checked' : ''}`}>
              <View className="item-radio-checked-in" />
            </View>
            <View className="item-content">
              <View className="fz14 item-address">
                {`${item.addressName}（${item.address}）${item.info}`}
              </View>
              <View className="flex_csb item-content-bottom">
                <View className="flex_ic mt6 lh22">
                  <View className="mr14 item-name">{item.name}</View>
                  <View className="item-line mr14 mt2" />
                  <View className="c_75">{item.phone}</View>
                  {item.isPrimary && <View className="item-choose-default">默认</View>}
                </View>
              </View>
              <View className="footer flex_csb lh22 mt12">
                <View
                  className="flex_ic"
                  onClick={() => handleSetDefault(index, item)}
                >
                  {item.isPrimary
                    ? <Image src={radioSelImg} className="icon18 mr8" />
                    : <View className="radio-nor mr8" />}
                  设为默认地址
                </View>
                <View className="flex_ic c_75">
                  <View className="flex_ic mr24 " onClick={() => handleEdit(item.id)}>
                    <Image className="icon14 mr4" src={addressEditImg} />
                    编辑
                  </View>
                  <View className="flex_ic" onClick={() => handleDelete(item.id)}>
                    <Image className="icon14 mr4" src={addressDelImg} />
                    删除
                  </View>
                </View>
              </View>
            </View>
            <Image
              className="icon20 item-choose-edit"
              src={addressChooseEditImg}
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item.id);
              }}
            />
          </View>
        ))}
        {list.length === 0 && <Empty />}
      </View>
      <AlertPage>
        <Button
          className="resetBtn btn_main"
          onClick={() => {
            handleEdit();
          }}
        >
          添加我的地址
        </Button>
      </AlertPage>
    </View>
  );
}
