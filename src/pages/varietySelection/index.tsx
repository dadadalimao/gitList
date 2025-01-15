import { View, Image, Input } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { AtIndexes } from 'taro-ui';
import 'taro-ui/dist/style/components/indexes.scss';
import './index.scss';
import { useRef, useState } from 'react';
import iconSearch from '@/images/map/search.png';
import { dispatch } from '@/store';
import request from '@/api/apiRequest';
import Empty from '@/components/Empty';

const Search = ({
  value, placeholder, onInput, onConfirm,
}) => {
  return (
    <View className="search-content flex_ic" onClick={() => { }}>
      <View className="flex_ic search-content-left">
        <Image className="icon20" src={iconSearch} />
        <Input
          className="search-input"
          onConfirm={onConfirm}
          value={value}
          placeholder={placeholder}
          onInput={(e) => {
            onInput(e);
          }}
        />
      </View>
    </View>
  );
};
export default function Index() {
  const [list, setList] = useState<any>([]);
  const kindId = useRef();
  const loading = useRef(true);
  const getData = async (name?: string) => {
    /** 处理品种数据 */
    const { data: array } = await request({
      url: `/pt/kind/getSubclass?id=${kindId.current}${name ? `&name=${name}` : ''}`,
      method: 'GET',
      loading: '加载中',
    });
    loading.current = false;
    console.log('🚀 ~ useLoad ~ array:', array);
    // const array = JSON.parse(e.varietyOpts);
    const result: any = [];
    Object.keys(array).forEach((key) => {
      result.push({
        key: key.toUpperCase(),
        title: key.toUpperCase(),
        items: array[key].map((item) => ({ ...item, key: item.name })),
      });
    });
    setList(result);
  };
  useLoad(async (e) => {
    Taro.setNavigationBarTitle({
      title: '品种选择',
    });
    if (e.kindId) {
      kindId.current = e.kindId;
      getData();
    }
  });
  // 点击品种
  const handleClickItem = (item) => {
    dispatch({ type: 'setVariety', payload: item });
    Taro.navigateBack();
  };
  // const [scrollIntoView, setScrollIntoView] = useState<(key: string) => void>();
  const [value, setValue] = useState('');
  const scrollIntoView = useRef<any>();
  return (
    <View className="varietySelection-container">
      <AtIndexes
        list={list}
        isVibrate={false}
        isShowToast={false}
        onScrollIntoView={(fn) => {
          console.log('🚀 ~ Index ~ fn:', fn.toString());
          scrollIntoView.current = fn;
        }}
        onClick={handleClickItem}
      >
        <View className="custom-area">
          <Search
            placeholder="搜索"
            value={value}
            onInput={(e) => {
              console.log('eeee', e);
              setValue(e.target.value);
            }}
            onConfirm={() => {
              console.log(scrollIntoView.current);
              getData(value);
              // scrollIntoView.current?.(value.toUpperCase());
              // Taro.createSelectorQuery().select('.search-input')
              //   .context((res) => {
              //     console.log('🚀 ~ .context ~ res:', res);
              //     console.log(res.context);
              //   })
              //   .exec();
            }}
          />
          {(list.length === 0 && !loading.current) && <Empty />}
        </View>
      </AtIndexes>
    </View>
  );
}
