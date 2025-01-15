import { View, Image } from '@tarojs/components';
import defaultAvatar from '@/images/defaultAvatar.png';
import addImg from '@/images/mine/add.png';
import addPetImg from '@/images/mine/addPet.png';
import { getSexIcon, handelAge } from '@/utils/utils';
import { getUrl } from '@/utils/oss';
import Card from './Card';

interface PetCardProps {
  myPets: any[];
  kindOpts: Record<string, string>;
  sexOpts: Record<string, string>;
  navTo: (url: string) => void;
}

const PetCard = ({
  myPets, kindOpts, sexOpts, navTo,
}: PetCardProps) => {
  return (
    <View className="myPetCard-view">
      <Card
        title="我的宠物"
        expand={(
          <View
            className="myPetCard-expand border_sec fz14 flex_cc c_sec"
            onClick={() => navTo('/pages/createPet/index')}
          >
            <Image className="icon8 mr8 " src={addImg} />
            <View className="lh1">添加宠物</View>
          </View>
        )}
      >
        <View className="myPetCard mt10">
          {myPets.length === 0 && (
            <View
              className="myPetCard-empty flex_cc"
              onClick={() => navTo('/pages/createPet/index')}
            >
              <Image className="myPetCard-empty-img mr12" src={addPetImg} />
              添加宠物
            </View>
          )}
          {myPets.length > 0 && (
            <View className="myPetCard-list-view">
              <View className="myPetCard-list">
                {myPets.map((item) => (
                  <View
                    key={item.id}
                    className="myPetCard-item flex_ccc"
                    onClick={() => navTo(
                      `/pages/createPet/index?id=${item.id}&k=${JSON.stringify(kindOpts)}&s=${JSON.stringify(sexOpts)}`,
                    )}
                  >
                    <View className="myPetCard-item-avatar">
                      <Image
                        className="myPetCard-item-avatar-img wh100"
                        src={item.headshots ? getUrl(item.headshots) : defaultAvatar}
                        mode="aspectFill"
                      />
                      <View className="myPetCard-item-avatar-text flex_cc">
                        {kindOpts[item.kindId] || ''}
                      </View>
                    </View>
                    <View className="myPetCard-item-name mt12 flex_ic">
                      <View className="mr2 fz14 myPetCard-item-name-text ellipsis">{item.name}</View>
                      <Image className="icon12" src={getSexIcon(item.gender)} />
                    </View>
                    <View className="myPetCard-item-age mt4 bg_sec c_f flex_cc">
                      {handelAge(item.birthday)}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Card>
    </View>
  );
};

export default PetCard;
