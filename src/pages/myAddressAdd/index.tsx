import {
  View, Text, Checkbox, Button, Image,
  Form,
  Input,
  Textarea,
} from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import './index.scss';
import { useState } from 'react';
import radioSelImg from '@/images/radioSel.png';
import rightImg from '@/images/right.png';
import AlertPage from '@/components/AlertPage';
import { toast } from '@/utils/utils';
import { addressInfo, addressModify } from '@/api';

const inputItems = [
  {
    key: 'name',
    label: '联系人',
    placeholder: '请输入联系人姓名',
    max: 10,
    require: true,
  },
  {
    key: 'phone',
    label: '手机号码',
    placeholder: '请输入手机号码',
    max: 11,
    require: true,
  },
  {
    key: 'address',
    label: '所在地址',
    placeholder: '请选择所在地址',
    chooseLocation: true,
    require: true,
  },
  {
    key: 'info', label: '详细地址', placeholder: '如楼栋，门牌号', max: 50, require: true,
  },
];

export default function Index() {
  const [form, setForm] = useState<any>({
    latitude: '',
    longitude: '',
    addressName: '',
    address: '',
    name: '',
    phone: '',
    isPrimary: false,
  });

  const renderInputField = (item) => {
    if (item.key === 'info') {
      return (
        <Textarea
          className="textarea"
          name={item.key}
          placeholderClass="c_c3"
          maxlength={item.max}
          placeholder={item.placeholder}
          value={form?.[item.key] || ''}
          autoHeight
          onInput={(e) => {
            setForm((pre) => ({
              ...pre,
              [item.key]: e.detail.value,
            }));
          }}
        />
      );
    }

    return (
      <Input
        className="input"
        name={item.key}
        placeholderClass="c_c3"
        maxlength={item.max}
        placeholder={item.placeholder}
        value={form?.[item.key] || ''}
        onInput={(e) => {
          setForm((pre) => ({
            ...pre,
            [item.key]: e.detail.value,
          }));
        }}
      />
    );
  };

  const submit = (e) => {
    const params = { ...form, ...e.detail.value };
    const validationMessages: { [key: string]: string } = {
      name: '请输入联系人姓名',
      phone: '请输入联系人电话',
      address: '请选择地址',
      info: '请输入详细地址',
    };

    // 使用 Object.keys 和 some 方法进行验证
    if (Object.keys(validationMessages).some((key) => !params[key])) {
      const firstInvalidKey = Object.keys(validationMessages).find((key) => !params[key]);
      toast(validationMessages[firstInvalidKey!]);
      return;
    }

    console.log('🚀 ~ submit ~ params:', params, e.detail.value, form);

    addressModify(params).then((res) => {
      Taro.showToast({
        title: '保存成功',
      });
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    });
  };
  useLoad((o) => {
    console.log('🚀 ~ useLoad ~ o:', o);
    if (o.id && o.id !== 'undefined') {
      Taro.setNavigationBarTitle({
        title: '编辑地址',
      });
      addressInfo({ id: o.id }).then((res) => {
        setForm(res.data);
      });
    } else {
      Taro.setNavigationBarTitle({
        title: '新增地址',
      });
    }
  });
  return (
    <View className="myAddressAdd-container">
      <Form onSubmit={submit}>
        <View className="form-content fz14">
          <View
            className="flex_ic"
            onClick={() => setForm((pre) => ({ ...pre, isPrimary: !(pre?.isPrimary) }))}
          >
            {form?.isPrimary
              ? <Image src={radioSelImg} className="icon18 mr8" />
              : <View className="radio-nor mr8" />}
            设为默认地址
          </View>
          <View className="input-list">
            {inputItems.map((item) => (
              <View key={item.key} className="input-item">
                <View className="flex_ic">
                  <View className="input-label flex_csb">
                    <Text className="c_main">*</Text>
                    {item.label?.split('').map((text) => <View>{text}</View>)}
                  </View>
                  <View className="input-line" />
                </View>
                <View className="input-value">
                  {item.chooseLocation ? (
                    <View
                      className="flex_csb"
                      onClick={() => {
                        Taro.chooseLocation({
                          success(result) {
                            console.log('🚀 ~ success ~ result:', result);
                            if (result.name) {
                              setForm((pre) => ({
                                ...pre,
                                addressName: result.name,
                                address: result.address,
                                latitude: result.latitude,
                                longitude: result.longitude,
                              }));
                            }
                          },
                        });
                      }}
                    >
                      {form?.address && (
                        <View className="input-address">
                          <View className="c_3">{form.addressName}</View>
                          <View className="c_9 fz12">{form.address}</View>
                        </View>
                      )}
                      {!form?.address && <View className="c_c3 input-address">{item.placeholder}</View>}
                      <Image className="icon18" src={rightImg} />
                    </View>
                  ) : renderInputField(item)}
                </View>
              </View>
            ))}
          </View>
        </View>

        <AlertPage>
          <Button className="resetBtn btn_main" formType="submit">保存并使用</Button>
        </AlertPage>
      </Form>
    </View>
  );
}
