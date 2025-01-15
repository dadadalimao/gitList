import { View, Image } from '@tarojs/components';
import emptyImg from '@/images/empty.jpg';

interface Props {
  text?: string
  top?: string
}
export default function Index({ text = '暂无内容~', top = '50%' }: Props) {
  return (
    <View className="index wh100 flex_ccc" style={{ marginTop: top }}>
      <Image
        src={emptyImg}
        style={{
          width: 165,
          height: 137,
          display: 'block',
        }}
      />
      <View className="mt12 c_75 ">{text}</View>
    </View>
  );
}
