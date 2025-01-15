import { View } from '@tarojs/components';
import './Loading.scss';

interface Props {
  children: React.ReactNode;
  loading: boolean;
}

export default function Loading({ children, loading }: Props) {
  return (
    <View>
      {loading ? (
        <View className="loading-container">
          <View className="loading-container-mask">
            <View className="square" />
            <View className="square" />
            <View className="square" />
            <View className="square" />
          </View>
        </View>
      ) : (children)}
    </View>
  );
}
