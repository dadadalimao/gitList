import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';
import backIcon from '@/images/back.png';
import clawIcon from '@/images/svg/claw.svg';
import clawBg from '@/images/svg/clawBg.svg';

interface Props {
  title?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  theme?: 'default' | 'feeder' | 'feeder-mine' | 'owner' | 'owner-fff' | 'owner-claw';
  showBack?: boolean;
}
const { statusBarHeight } = Taro.getSystemInfoSync();

const CustomNavigationBar: React.FC<Props> = ({
  title,
  children,
  className = '',
  style = {},
  containerClassName = '',
  containerStyle = {},
  theme = 'default',
  showBack = false,
}) => {
  return (
    <>
      <View
        className={`custom-nav-header-bg ${className} custom-nav-header-bg--${theme}`}
        style={{ paddingTop: statusBarHeight, ...style }}
      >
        <Image src={clawBg} className="custom-nav-claw-bg" />
      </View>
      <View
        className={`custom-nav-title-view custom-nav-title-view--${theme}`}
        style={{ paddingTop: statusBarHeight }}
      >
        <View className="custom-nav-claw-view">
          <Image src={clawIcon} className="custom-nav-claw1 icon12" />
          <Image src={clawIcon} className="custom-nav-claw2 icon12" />
          <Image src={clawIcon} className="custom-nav-claw3 icon20" />
          <Image src={clawIcon} className="custom-nav-claw4 icon20" />
          <Image src={clawIcon} className="custom-nav-claw5 icon20" />
        </View>
        <View className="custom-nav-title flex_cc">
          {showBack && (
            <Image
              src={backIcon}
              className="icon24 custom-nav-back"
              onClick={() => Taro.navigateBack({
                fail: () => {
                  Taro.switchTab({ url: '/pages/mine/index' });
                },
              })}
            />
          )}
          {title}
        </View>
      </View>
      <View
        className={`custom-nav-container ${containerClassName}`}
        style={{
          paddingTop: (statusBarHeight || 0) + 44,
          ...containerStyle,
        }}
      >
        {children}
      </View>
    </>
  );
};

export default CustomNavigationBar;
