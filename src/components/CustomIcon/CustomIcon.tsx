import { View, Image } from '@tarojs/components';
import './CustomIcon.scss';
import radioSelImg from '@/images/radioSel.svg';

interface CustomIconProps {
  type: 'delete' | 'add' | 'radioNor' | 'radioSel'; // 后续可以继续添加其他图标类型
  className?: string;
  onClick?: () => void;
  disabled?: boolean; // 添加禁用参数
  size?: number; // 添加size参数控制图标大小
}

const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  className = '',
  onClick,
  disabled = false, // 默认不禁用
  size = 16, // 默认大小24
}) => {
  const barStyle = {
    width: size / 2,
    height: size / 8,
    borderRadius: `${size / 8}px`,
  };
  const renderIcon = () => {
    switch (type) {
      case 'delete':
        return (
          <View className="key-del flex_cc" style={{ width: size, height: size }}>
            <View className="key-del-in" style={barStyle} />
          </View>
        );
      case 'add':
        return (
          <View className="key-add flex_cc" style={{ width: size, height: size }}>
            <View className="key-add-in flex_cc wh100">
              <View className="key-add-in-in" style={barStyle} />
            </View>
            <View className="key-add-in flex_cc wh100">
              <View className="key-add-in-in" style={barStyle} />
            </View>
          </View>
        );
      case 'radioNor':
        return (
          <View className="radioNor" style={{ width: size, height: size }} />
        );
      case 'radioSel':
        return (
          <Image src={radioSelImg} style={{ width: size, height: size, display: 'block' }} />
        );
      default:
        return null;
    }
  };

  return (
    <View
      className={`custom-icon ${className} ${disabled ? 'disabled' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled && onClick) {
          onClick();
        }
      }}
    >
      {renderIcon()}
    </View>
  );
};

export default CustomIcon;
