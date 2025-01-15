import { View, Text } from '@tarojs/components';
import './Tabs.scss';

interface Porps {
  list?: any[];
  itemKey?: string;
  activeIndex?: number;
  children: React.ReactNode;
  onChange?: (index: number) => void;
}

export default function Tabs({
  list = [], children, itemKey = 'name', activeIndex = 0, onChange,
}: Porps) {
  return (
    <View className="Tabs-container">
      <View className="tabs-list-header">
        <View
          className="tabs-list-body"
          style={{
            width: `calc(${list.length * 85}px - 16px)`,
          }}
        >
          <View
            className="tabs-item-bg tabs-item"
            style={{ left: `${activeIndex * 85}px` }}
          >
            <View className="tabs-item-text ellipsis" />
            <View className="tabs-item-in-bottom" />
            <View className="tabs-item-in-left" />
            <View className="tabs-item-in-right" />
          </View>
          {list.map((item, index) => (
            <View
              className={`tabs-item ${activeIndex === index ? ' tabs-item-active' : ''}`}
              onClick={() => onChange?.(index)}
            >
              <View className="tabs-item-text">
                <Text className="ellipsis">{item[itemKey]}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="tabs-list-container">{children}</View>
    </View>
  );
}
