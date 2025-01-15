import { View } from '@tarojs/components';
import './index.scss';

interface CamelTextProps {
  texts: string[]; // 文字数组
  sizes: number[]; // 字体大小数组
  className?: string; // 可选的自定义类名
  lineHeight?: string | string[]; // 可以是单个数字或数字数组
  colors?: string | string[]; // 可以是单个颜色或颜色数组
}
/**
 * CamelText 组件
 * @param texts 文字数组
 * @param sizes 字体大小数组
 * @param className 可选的自定义类名
 * @param lineHeight 可以是单个数字或数字数组
 * @param colors 可以是单个颜色或颜色数组
 * @example
 * <CamelText texts={['¥', '100.00']} sizes={[16, 24]}/>
 */
const CamelText = ({
  texts,
  sizes,
  className = '',
  lineHeight = '1',
  colors,
}: CamelTextProps) => {
  if (texts.length !== sizes.length) {
    console.warn('CamelText: texts和sizes数组长度不匹配');
    return null;
  }

  // 如果 lineHeight 是数组且长度不匹配，发出警告
  if (Array.isArray(lineHeight) && lineHeight.length !== texts.length) {
    console.warn('CamelText: lineHeight数组长度与texts不匹配');
    return null;
  }

  // 如果 colors 是数组且长度不匹配，发出警告
  if (Array.isArray(colors) && colors.length !== texts.length) {
    console.warn('CamelText: colors数组长度与texts不匹配');
    return null;
  }

  return (
    <View className={`camel-text-wrapper ${className}`}>
      {texts.map((text, i) => (
        <View
          key={`${i + 1}-${text}`}
          className="camel-text-item"
          style={{
            fontSize: `${sizes[i]}px`,
            lineHeight: Array.isArray(lineHeight) ? lineHeight[i] : lineHeight,
            color: Array.isArray(colors) ? colors[i] : colors,
          }}
        >
          {text}
        </View>
      ))}
    </View>
  );
};

export default CamelText;
