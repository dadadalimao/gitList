import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useContext, useEffect } from 'react';
import { myContext } from '@/store';
import styles from './index.module.scss';
import iconMine from '@/images/tabbar/iconMine.png';
import iconMineSel from '@/images/tabbar/iconMineSel.png';
import iconFeederOrder from '@/images/tabbar/iconFeederOrder.png';
import iconPetServices from '@/images/tabbar/iconPetServices.png';
import iconPetServicesSel from '@/images/tabbar/iconPetServicesSel.png';
import iconFeederOrderSel from '@/images/tabbar/iconFeederOrderSel.png';

const feeder = [
  {
    icon: iconFeederOrder,
    selectIcon: iconFeederOrderSel,
    title: 'tab.order',
    url: '/pages/feederOrder/index',
  },
  {
    icon: iconMine,
    selectIcon: iconMineSel,
    title: 'tab.mine',
    url: '/pages/mine/index',
  },
];

const owner = [
  {
    icon: iconPetServices,
    selectIcon: iconPetServicesSel,
    title: 'tab.pet.services',
    url: '/pages/petServices/index',
  },
  {
    icon: iconMine,
    selectIcon: iconMineSel,
    title: 'tab.mine',
    url: '/pages/mine/index',
  },
];

type Props = {
  activeIndex: number;
};

/**
 * 自定义TabBar组件，使用时在tabbar页面中手动引入该组件。
 *
 * 小程序写法 custom-tab-bar taro4.0.8无法正常编译 https://github.com/NervJS/taro/issues/16678
 */
function TabBar({ activeIndex }: Props) {
  const { t } = useTranslation();
  const { state } = useContext(myContext);

  const tabItems = state.identity === 'feeder' ? feeder : owner;
  // const tabItems = feeder;

  // useEffect(() => {
  //   const currentPage = Taro.getCurrentPages().pop();
  //   if (!currentPage) return;

  //   // console.log('🚀 ~ TabBar ~ state.identity:', state.identity);
  //   const currentPath = `/${currentPage.route}`;
  //   const isValidPath = tabItems.some((item) => item.url === currentPath);

  //   if (!isValidPath) {
  //     Taro.switchTab({
  //       url: tabItems[0].url,
  //     });
  //   }
  // }, [state.identity, tabItems]);

  return (
    <View className={styles.TabBar}>
      {tabItems.map((item, index) => (
        <View
          className={styles.item}
          onClick={() => {
            if (index === activeIndex) return;
            Taro.switchTab({
              url: item.url,
            });
          }}
        >
          <View className={styles.iconWrapper}>
            <Image
              src={activeIndex === index ? item.selectIcon : item.icon}
              className={classNames(
                styles.icon,
                activeIndex === index ? styles.activeIcon : undefined,
              )}
              mode="aspectFit"
            />
          </View>
          <Text
            key={item.url}
            className={classNames(
              styles.text,
              activeIndex === index ? styles.activeTitle : undefined,
            )}
          >
            {t(item.title)}
          </Text>
        </View>
      ))}
    </View>
  );
}
export default TabBar;
