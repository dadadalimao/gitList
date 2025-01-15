import { View, Image, Button, Text, Textarea } from '@tarojs/components';
import './index.scss';
import { AtModal } from 'taro-ui';
import 'taro-ui/dist/style/components/modal.scss';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  placeholder: string;
  val?: string;
  setVal: (val: string) => void;
  onSuccess: () => void;
}
export default function ModalAlert({
  visible,
  setVisible,
  title,
  placeholder,
  val,
  setVal,
  onSuccess,
}: Props) {
  return (
    <AtModal isOpened={visible}>
      <View className="m">
        <View className="m-title">{title}</View>
        <View className="m-body">
          <Text>*</Text>
          <Textarea
            name="value"
            placeholder={placeholder}
            value={val}
            onInput={(e) => {
              setVal(e.detail.value);
            }}
          />
        </View>
      </View>
      <View className="m-footer">
        <View
          className="m-cancel"
          onClick={() => {
            setVisible(false);
            setVal('');
          }}
        >
          取消
        </View>
        <View
          className="m-ok"
          onClick={() => {
            onSuccess();
          }}
        >
          确定
        </View>
      </View>
    </AtModal>
  );
}
