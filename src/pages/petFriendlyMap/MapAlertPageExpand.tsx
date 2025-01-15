import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';
import {
  useEffect, useImperativeHandle, forwardRef, useRef,
} from 'react';
import iconLocation from '@/images/locationCircle.png';
import iconFriendly from '@/images/friendly.png';
import iconUnfriendly from '@/images/unfriendly.png';
import iconPoisoning from '@/images/poisoning.png';
import joinGroupImg from '@/images/map/joinGroup.png';

interface Props {
  activeIndex: ActiveIndexState;
  bottom?: number;
  showTabs: boolean;
  setActiveIndex: (e: any) => void;
  handleLocation?: () => void;
}

const rightBtnList = [
  {
    icon: iconFriendly,
    text: '友好',
    key: 'MAP_TYPE_NICE',
    classNames: 'c_friendly border_friendly',
  },
  {
    icon: iconUnfriendly,
    text: '不友好',
    key: 'MAP_TYPE_GRUFF',
    classNames: 'c_unfriendly border_unfriendly',
  },
  {
    icon: iconPoisoning,
    text: '投毒',
    key: 'MAP_TYPE_POI',
    classNames: 'c_poisoning border_poisoning',
  },
];
const AlertPage = ({
  activeIndex, bottom,
  setActiveIndex,
  handleLocation,
  showTabs,
}: Props) => {
  return (
    <View className="MapAlertPageExpand" style={{ marginBottom: `${bottom}px` }}>
      <View className="expand-left">
        <Image onTap={handleLocation} src={iconLocation} className="icon32 expand-left-icon" />
      </View>
      <View className="expand-right bold">
        {showTabs && (
          <Image
            src={joinGroupImg}
            className={`JoinGroupImg ${bottom !== 28 ? 'JoinGroupImg-fixed' : ''}`}
            onClick={() => {
              Taro.navigateTo({
                url: '/pages/joinGroupChat/index',
              });
            }}
          />
        )}
        {showTabs
          && rightBtnList.map((item) => (
            <View
              key={item.key}
              className={`expand-right-item ${activeIndex[item.key] ? item.classNames : ''}`}
              onTap={() => {
                setActiveIndex((pre: ActiveIndexState) => ({ ...pre, [item.key]: !pre[item.key] }));
              }}
            >
              <Image
                src={item.icon}
                className="icon24"
              />
              {item.text}
            </View>
          ))}
      </View>
    </View>
  );
};

export default AlertPage;
