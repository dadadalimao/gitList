import React, { useState } from 'react';
import { Picker as NutPicker } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/esm/picker/style/css.js';
import { View } from '@tarojs/components';

interface PickerOption {
  text: string | number
  value: string | number
  disabled?: boolean
  children?: PickerOption[]
  className?: string | number
}
interface Porps {
  children: React.ReactNode;
  onConfirm: (value: (string | number)[]) => void;
}
const Picker = ({ children, onConfirm }: Porps) => {
  const [isVisible2, setIsVisible2] = useState(false);
  const [value, setValue] = useState([24, '~', 28]);
  // 时间列表 HH:mm 每半个小时 从 00:00 到 23:30
  const timeList = Array.from({ length: 24 * 2 }, (_, index) => {
    const hour = Math.floor(index / 2);
    const minute = index % 2 === 0 ? '00' : '30';
    return { text: `${hour}:${minute}`, value: index };
  });
  // 时间列表 HH:mm 每半个小时 从 00:30 到 24:00
  const timeList2 = Array.from({ length: 24 * 2 }, (_, index) => {
    const hour = Math.floor(index / 2) + (index % 2);
    const minute = index % 2 === 0 ? '30' : '00';
    return { text: `${hour}:${minute}`, value: index };
  });
  const listData2 = [timeList, [{ value: '~', text: '~' }], timeList2];
  const confirmPicker = (
    options: PickerOption[],
    values: (string | number)[],
  ) => {
    onConfirm([options[0].text, options[2].text]);
  };
  // 选择变化
  const changePicker = (options: any[], values: any, columnIndex: number) => {
    console.log('picker onChange', columnIndex, values, options);
    if (options.length === 3) {
      if (columnIndex === 0 && value[0] !== values[0]) {
        setValue([values[0], '~', Math.max(values[0], values[2])]);
      }
      if (columnIndex === 2 && value[2] !== values[2]) {
        setValue([Math.min(values[0], values[2]), '~', values[2]]);
      }
    }

    // 第一个时间需要比最后一个时间早
    // if (options[0].value > options[2].value) {
    //   setValue(options);
    // }
  };
  return (
    <>
      <View onClick={() => setIsVisible2(true)}>{children}</View>
      <NutPicker
        visible={isVisible2}
        options={listData2}
        onClose={() => setIsVisible2(false)}
        value={value}
        onChange={changePicker}
        onConfirm={(list, values) => confirmPicker(list, values)}
      />
    </>
  );
};
export default Picker;
