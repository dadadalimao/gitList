import { View } from '@tarojs/components';
import './index.scss';

interface CardProps {
  children: React.ReactNode;
  title: string;
  expand?: React.ReactNode;
}

export default function Card({
  children, title, expand,
}: CardProps) {
  return (
    <View className="mine-card">
      <View className="mine-card-container">
        <View className="mine-card-header">
          <View className="mine-card-title">{title}</View>
          {expand && <View className="mine-card-expand">{expand}</View>}
        </View>
        <View className="mine-card-content">{children}</View>
      </View>
    </View>
  );
}
