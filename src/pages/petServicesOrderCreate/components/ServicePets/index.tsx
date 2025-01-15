import { View, Text, Image } from '@tarojs/components';
import dayjs from 'dayjs';
import { getAvatar } from '@/utils/oss';
import { navTo } from '@/utils/utils';
import orderPetImg from '@/images/ownerOrder/orderPet.png';
import './index.scss';

interface ServicePetsProps {
  petList: any[];
}

export default function ServicePets({ petList }: ServicePetsProps) {
  return (
    <View className="section pet-section">
      <View className="section-title flex_csb">
        <View>
          <Image src={orderPetImg} className="icon paw" />
          <Text>服务宠物</Text>
        </View>
        {petList.length > 0 && (
          <View
            className="pet-add fz12 c_9"
            onClick={() => { navTo('/pages/myPets/index'); }}
          >
            +添加
          </View>
        )}
      </View>
      <View onClick={() => navTo('/pages/myPets/index')}>
        {!petList.length && (
          <View className="add-pet">
            <Text className="add-text">+ 添加爱宠</Text>
          </View>
        )}
        {petList.map((item) => (
          <View className="pet-item" key={item.id}>
            <Image className="pet-item-avatar" src={getAvatar(item.headshots)} />
            <View className="pet-item-info">
              <View className="pet-item-name">{item.name}</View>
              <View className="pet-item-dates">
                {item.dates.map((n) => dayjs(n).format('MM-DD')).join('、')}
              </View>
            </View>
            <View className="pet-item-total flex_cc">
              共
              {item.dates.length}
              天
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
