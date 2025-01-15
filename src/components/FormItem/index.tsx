import { View, Text, Image } from '@tarojs/components';
import { ReactNode } from 'react';
import rightImg from '@/images/right.png';
import './index.scss';

interface FormItemProps {
  label: string;
  required?: boolean;
  children?: ReactNode;
  labelJustify?: boolean;
  showArrow?: boolean;
  className?: string;
  onValueClick?: () => void;
}

export default function FormItem({
  label,
  required,
  children,
  labelJustify = false,
  showArrow = false,
  className = '',
  onValueClick,
}: FormItemProps) {
  const renderLabel = () => {
    if (labelJustify) {
      return (
        <View className="label-justify">
          {
            label.split('').map((char, index) => (
              <View key={`${index + 1}`}>{char}</View>
            ))
          }
        </View>
      );
    }
    return <Text>{label}</Text>;
  };

  return (
    <View className={`form-item ${className}`}>
      <View className="form-item-left">
        <View className="form-item-label">
          {required && <Text className="c_main">*</Text>}
          {renderLabel()}
        </View>
        <View className="form-item-line" />
      </View>
      <View
        className="form-item-value"
        onClick={onValueClick}
      >
        <View className="form-item-value-content">
          {children}
        </View>
        {showArrow && <Image className="icon18 form-item-arrow" src={rightImg} />}
      </View>
    </View>
  );
}
