import { View, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useContext, useState } from 'react';
import './index.scss';
import dayjs from 'dayjs';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import radioSelImg from '@/images/radioSel.svg';
import { getAvatar } from '@/utils/oss';
import Calendar from '@/components/Calendar/Calendar';
import request from '@/api/apiRequest';
import { handelAge, navTo } from '@/utils/utils';
import AlertPage from '@/components/AlertPage';
import { dispatch, myContext } from '@/store';

export default function Index() {
  const { state } = useContext(myContext);
  // 宠物列表
  const petList = state.orderPetList;
  // 是否显示日历
  const [calendarVisible, setCalendarVisible] = useState(false);
  // 当前选中的宠物
  const [currentIndex, setCurrentIndex] = useState(0);
  // 宠物列表
  const [pets, setPets] = useState<any[]>([]);
  useDidShow(() => {
    request({
      url: '/pt/pet/myPet',
      method: 'GET',
    }).then((res) => {
      console.log(res);
      // 合并相同宠物
      const newPets = [...res.data];
      petList.forEach((item) => {
        const index = newPets.findIndex((n) => n.id === item.id);
        if (index !== -1) {
          newPets[index] = { ...item };
        }
      });

      setPets(newPets);
    });
  });

  return (
    <View className="myPet-page">
      <CustomNavigationBar title="我的宠物" theme="owner-claw" showBack>
        <View className="myPet-content">
          {pets.map((item, index) => (
            <View
              className="myPet-item"
              onClick={() => {
                const selected = pets.find((n) => n.selected);
                // 没选中，且没有其他宠物选中
                if (!item.selected && !selected) {
                  setCurrentIndex(index);
                  setCalendarVisible(true);
                  return;
                }
                // 没选中，但有其他宠物选中
                if (!item.selected && selected) {
                  setPets((prev) => {
                    const newPets = [...prev];
                    newPets[index].selected = true;
                    newPets[index].dates = selected.dates;
                    return newPets;
                  });
                  return;
                }
                // 选中
                if (item.selected) {
                  setPets((prev) => {
                    const newPets = [...prev];
                    newPets[index].selected = false;
                    newPets[index].dates = [];
                    return newPets;
                  });
                }
              }}
            >
              <View className="myPet-item-content">
                <Image src={getAvatar(item.headshots)} className="myPet-item-img" />
                <View className="myPet-item-info fz14">
                  <View className="myPet-item-name fz16">{item.name}</View>
                  <View className="myPet-item-type mt8 c_9">
                    {`${item.varietyName || ''}(${item.kindName})`}
                  </View>
                  <View className="myPet-item-age mt6 c_9">{handelAge(item.birthday)}</View>
                </View>
                <View className="myPet-item-radio flex_ic">
                  {item.selected ? <Image src={radioSelImg} className="myPet-item-radio-img icon18" /> : <View className="myPet-item-radio-empty" />}
                </View>
              </View>
              <View
                className="myPet-item-footer"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setCalendarVisible(true);
                }}
              >
                {pets[index]?.dates?.length > 0 ? (
                  <View className="fz12 c_9">
                    {pets[index]?.dates?.map((n) => dayjs(n).format('MM-DD'))
                      .join('、')}
                  </View>
                ) : (
                  <View className="myPet-item-footer-selDates">选择服务日期</View>
                )}
              </View>
            </View>
          ))}
        </View>
      </CustomNavigationBar>

      <AlertPage>
        <View className="footer flex_csb">
          <View
            className="footer-btn footer-btn-add"
            onClick={() => {
              navTo('/pages/createPet/index');
            }}
          >
            新增爱宠
          </View>
          <View
            className="footer-btn btn_main"
            onClick={() => {
              dispatch({
                type: 'setOrderPetList',
                payload: pets.filter((n) => n.selected),
              });
              Taro.navigateBack();
            }}
          >
            确定
          </View>
        </View>
      </AlertPage>
      <Calendar
        visible={calendarVisible}
        defaultValue={pets[currentIndex]?.dates || []}
        setVisible={setCalendarVisible}
        handleConfirm={(date) => {
          if (date.length === 0) return;
          setPets((prev) => {
            const newPets = [...prev];
            newPets[currentIndex].dates = date.map((n) => n[3]);
            newPets[currentIndex].selected = true;
            return newPets;
          });
        }}
      />
    </View>
  );
}
