import { View, Image } from '@tarojs/components';
import './index.scss';
import { useLoad, setNavigationBarTitle } from '@tarojs/taro';
import starIcon from '@/images/feeder/star.svg';
import defaultAvatar from '@/images/defaultAvatar.png';

export default function Index() {
  useLoad(() => {
    setNavigationBarTitle({ title: '更多评论' });
  });

  return (
    <View className="f-comment">
      <View className="f-comment-item">
        <View className="f-comment-title">
          <View className="f-comment-title-left">
            <View className="f-comment-title-img">
              <Image src={defaultAvatar} />
            </View>
            <View>
              <View>111</View>
              <View className="f-star" style={{ marginBottom: '0' }}>
                {[1, 2, 3, 4, 5].map((item2) => (
                  <Image src={starIcon} key={item2} />
                ))}
              </View>
            </View>
          </View>
          <View>2024-10-08</View>
        </View>
        <View className="f-comment-content">
          好评好评好评好评好评好评好评好评好评好评好评好评 好评好评好评 好评好评好评 好评好评好评
          好评好评好评 好评好评好评 好评好评好评 好评好评好评
        </View>
      </View>
    </View>
  );
}
