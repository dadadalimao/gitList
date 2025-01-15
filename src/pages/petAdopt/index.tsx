import { View, Text, Image } from '@tarojs/components';
import Taro, { usePullDownRefresh, useReachBottom, useReady } from '@tarojs/taro';
import { useEffect, useRef, useState } from 'react';
import './index.scss';

import { getAdoptList, getAllNotDeletedKinds } from '@/api';
import { getUrl } from '@/utils/oss';
import { getSexIcon, handelAge, openServiceChat } from '@/utils/utils';
import contactImg from '@/images/contact.png';
import Empty from '@/components/Empty';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import InfiniteLoading from '@/components/InfiniteLoading/InfiniteLoading';

export default function Index() {
  // 定义过滤项的数据
  const [petTypes, setPetTypes] = useState<any[]>([]);
  // 定义选中的过滤项ID
  const [selectedFilterId, setSelectedFilterId] = useState();
  const loading = useRef(false);
  /** 到底了 */
  const [inTheEnd, setInTheEnd] = useState(false);
  const [petList, setPetList] = useState<any[]>([]);
  const getTypeList = () => {
    getAllNotDeletedKinds().then((res) => {
      setPetTypes(res.data);
    });
  };

  /** 分页参数 size查询数量  id 列表加载更多时从这条往后加载 */
  const pagingParameter = useRef({
    size: 10, id: undefined, kindId: undefined, adoptStatus: 'PET_ADOPTION_STATUS_NOTADOPTED',
  });
  /**
   * 获取数据函数，根据当前分页参数获取宠物列表数据
   * @param type 可选参数，如果为'clean'，则清除当前宠物列表数据并添加新数据
   */
  const getData = (type?: 'clean', pull?: string) => {
    if (type === 'clean') {
      pagingParameter.current.id = undefined;
      setInTheEnd(false);
    }
    // 根据当前分页参数获取宠物列表数据
    return getAdoptList(pagingParameter.current).then((res) => {
      if (pull) {
        Taro.stopPullDownRefresh();
      }
      // 如果type为'clean'，清除当前宠物列表数据并添加新数据
      if (type === 'clean') {
        setPetList(res.data);
      } else {
        // 否则，将新数据追加到当前宠物列表数据中
        setPetList([...petList, ...res.data]);
      }
      // 设置加载状态为true
      loading.current = true;
      // 如果当前数据量小于分页大小，表明已加载完所有数据
      if (res.data.length < pagingParameter.current.size && pagingParameter.current.id) {
        setInTheEnd(true);
      }
    });
  };
  useReady(() => {
    Taro.setNavigationBarTitle({
      title: '宠物领养',
    });
    getTypeList();
    getData();
  });
  // 放组件里了。
  // usePullDownRefresh(() => {
  //   getData('clean', 'pull');
  // });
  // useReachBottom(() => {
  //   if (!inTheEnd) {
  //     pagingParameter.current.id = petList[petList.length - 1].id;
  //     getData();
  //   }
  // });
  return (
    <View className="petAdopt-page">
      <CustomNavigationBar title="宠物领养" theme="owner-claw" showBack>
        <View className="petAdopt-container xsafe_16">
          <Image src={contactImg} className="contactImg" onClick={() => openServiceChat()} />
          <View
            className="petType-container"
            style={{
              overflowX: petTypes.length <= 3 ? 'hidden' : 'auto',
            }}
          >
            <View className="flex">
              {petTypes.map((petType) => (
                <View
                  key={petType.id}
                  className={`petType-item c_6  ${selectedFilterId === petType.id ? 'selected bg_main' : ''}`}
                  onClick={() => {
                    let { id } = petType;
                    if (id === selectedFilterId) {
                      id = undefined;
                    }
                    pagingParameter.current.kindId = id;
                    pagingParameter.current.id = undefined;
                    setSelectedFilterId(id);
                    getData('clean');
                  }}
                >
                  <Image className="petType-icon" src={getUrl(petType.pic)} />
                  <Text className="petType-text">{petType.name}</Text>
                </View>
              ))}
            </View>
          </View>

          <InfiniteLoading
            className="pet-list-container"
            hasMore={false}
            loadMoreText={inTheEnd && pagingParameter.current.id ? '没有更多了' : ' '}
            onRefresh={() => getData('clean')}
            onLoadMore={() => {
              pagingParameter.current.id = petList[petList.length - 1].id;
              return getData();
            }}
          >
            <View className="pet-list">
              {petList.map((pet) => (
                <View
                  key={pet.id}
                  className="pet-profile"
                  onClick={() => {
                    Taro.navigateTo({
                      url: `/pages/petInfo/index?id=${pet.id}`,
                    });
                  }}
                >
                  <View className="pet-image">
                    <Image
                      className="wh100 block"
                      src={getUrl(pet.headshots)}
                      mode="aspectFill"
                    />
                    {/* <View className="pet-breed flex_ic ellipsis fz12">{pet.varietyName}</View> */}
                  </View>
                  <View className="pet-info fz12">
                    <View className="pet-details">
                      <View className="flex_csb ">
                        <View className="flex_ic pet-alias-container">
                          <View className="pet-alias fz16 bold mr4 ellipsis">
                            {pet.name}
                          </View>
                          <Image className="icon16" src={getSexIcon(pet.gender)} />
                        </View>
                        <Text className="pet-age c_c3 ">
                          {handelAge(pet.birthday)}
                        </Text>
                      </View>

                      <View className="flex_csb c_75 fz12 mt2 pet-height-weight">
                        <Text className="pet-height">
                          身高:
                          {pet.height ? `${pet.height}cm` : ' -'}

                        </Text>
                        <Text className="pet-weight">
                          体重:
                          {pet.weight}
                          kg
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              {(petList.length === 0 && loading.current) && (<Empty />
              )}
              {/* {inTheEnd && pagingParameter.current.id && (
                <View className="c_75 mt12 flex_cc fz12 w100">到底啦~</View>
              )} */}
            </View>
          </InfiniteLoading>

        </View>
      </CustomNavigationBar>
    </View>
  );
}
