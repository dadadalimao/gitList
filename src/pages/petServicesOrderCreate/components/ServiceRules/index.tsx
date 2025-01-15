import {
  View, Text, Image, Textarea,
} from '@tarojs/components';
import Taro from '@tarojs/taro';
import Picker from '@/components/Picker/Picker';
import CustomIcon from '@/components/CustomIcon/CustomIcon';
import orderServiceImg from '@/images/ownerOrder/orderService.png';
import backImg from '@/images/back.png';
import './index.scss';

interface ServiceRulesProps {
  keyType: string;
  setKeyType: (type: string) => void;
  doorTime: (string | number)[];
  setDoorTime: (time: (string | number)[]) => void;
  remarkCount: number;
  onRemarkChange: (count: number) => void;
}

export default function ServiceRules({
  keyType,
  setKeyType,
  doorTime,
  setDoorTime,
  remarkCount,
  onRemarkChange,
}: ServiceRulesProps) {
  return (
    <View className="section service-rules">
      <View className="section-title">
        <Image src={orderServiceImg} className="icon rules" />
        <Text>服务细则</Text>
      </View>
      <View className="select-item-list">
        <View
          className="select-item"
          onClick={() => {
            const list = ['密码锁', '存放快递柜', '家中有人', '其他'];
            Taro.showActionSheet({
              itemList: list,
              success: (res) => {
                setKeyType(list[res.tapIndex]);
              },
            });
          }}
        >
          <View className="item-title">
            <Text>
              <Text className="c_main">*</Text>
              钥匙交接方式
            </Text>
            {keyType ? (
              <View className="flex_ic">
                <View className="mr8">{keyType}</View>
                <CustomIcon
                  type="delete"
                  onClick={() => setKeyType('')}
                />
              </View>
            ) : <Image className="arrow ico24" src={backImg} />}
          </View>
          <View className="item-desc mt4">钥匙细节请与喂养员单独沟通</View>
        </View>

        <Picker onConfirm={(value) => setDoorTime(value)}>
          <View className="select-item">
            <View className="item-title">
              <Text>
                <Text className="c_main">*</Text>
                期望上门时间
              </Text>
              {doorTime.length === 2 ? (
                <View className="flex_ic">{doorTime.join('~')}</View>
              ) : <Image className="arrow ico24" src={backImg} />}
            </View>
            <View className="item-desc mt4">选择较近时间可能影响接单时效</View>
          </View>
        </Picker>
      </View>

      {/* 备注信息 */}
      <View className="remark-section">
        <Textarea
          className="remark-input"
          placeholder="请输入服务叮嘱"
          placeholderClass="c_75"
          autoHeight
          maxlength={150}
          onInput={(e) => onRemarkChange(Math.min(e.detail.value.length, 150))}
        />
        <View className="count">
          {remarkCount}
          /150
        </View>
        <View className="tip">如有特殊需求、注意事项请在服务叮嘱中写明哟~~</View>
      </View>
    </View>
  );
}
