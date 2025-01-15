import { View, Text, Image } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import dayjs from 'dayjs';
import { getUrl } from '@/utils/oss';
import Empty from '@/components/Empty';

// 定义 list 中每个元素的类型
interface GroupItem {
  qrPic: string;
  name: string;
  lostTime: string;
  picList: string[];
  createdAt: string
}

export default function Index() {
  // 使用 GroupItem[] 作为 list 的类型
  const [list, setList] = useState<GroupItem[]>([]);

  useLoad(() => {
    Taro.setNavigationBarTitle({
      title: '加入群聊',
    });
    Taro.request({
      url: '/mem/chart/list',
      method: 'GET',
    }).then((res) => {
      console.log(res);
      setList((pre) => [...pre, ...(res.data as GroupItem[])]);
    });
  });

  return (
    <View
      className="joinGroupChat-container"
      style={list.length === 0 ? { background: '#fff' } : {}}
    >
      <View className="xsafe_16">
        {list.map((item) => {
          const minSrc = getUrl(item.picList?.[0] ? item.picList[0] : item.qrPic);
          const src = getUrl(item.qrPic);
          return (
            <View
              className="pet-group-item"
              onClick={() => {
                Taro.previewImage({
                  current: src, // 当前显示图片的http链接
                  urls: [src], // 需要预览的图片http链接列表
                });
              }}
            >
              <Image className="qr-code" src={minSrc} />
              <View className="text-container">
                <Text className="group-name ellipsis">{item.name}</Text>
                <Text className="valid-time">
                  {`有效时间: ${dayjs(item.createdAt).format('YYYY-MM-DD')}至${dayjs(item.lostTime).format('YYYY-MM-DD')}`}
                </Text>
              </View>
            </View>
          );
        })}
        {list.length === 0
          && <Empty />}
      </View>
    </View>
  );
}
