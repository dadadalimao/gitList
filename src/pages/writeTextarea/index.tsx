import {
  Button, Form, Textarea,
  View,
} from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import ShowModal from '@/components/ShowModal';
import request from '@/api/apiRequest';
import './index.scss';

export default function Index() {
  // const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [valueLen, setValueLen] = useState<number>(0);
  const [form, setForm] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const sendCommit = (e) => {
    const params = { ...form, ...e.detail.value };
    console.log('🚀 ~ sendCommit ~ params:', params);
    if (!params.content.trim()) {
      Taro.showToast({
        title: '请输入评论内容',
        icon: 'none',
      });
      return;
    }
    if (!params.mapId) {
      Taro.showToast({
        title: '请选择地图',
        icon: 'none',
      });
      return;
    }

    Taro.requestSubscribeMessage({
      tmplIds: ['FWRe_t_G1hXleNJFIkbfClqSg7wRH9Lnhy9hVlAccQw'],
      entityIds: [], // alipay的 暂时无视
      complete(res: any) {
        request({
          url: '/fr/comment/add',
          method: 'POST',
          data: {
            subscribed: res?.FWRe_t_G1hXleNJFIkbfClqSg7wRH9Lnhy9hVlAccQw === 'accept',
            ...params,
          },
          loading: '正在提交',
          failToast: true,
        }).then(() => {
          setVisible(true);
        });
      },
    });
  };

  useLoad((options) => {
    if (options.type === 'mapCommit') {
      setForm({
        mapId: options.mapId,
      });
    }
  });

  return (
    <View className="writeTextarea-container">
      <Form onSubmit={(e) => {
        sendCommit(e);
      }}
      >
        <View className="content">
          <Textarea
            className="textarea"
            placeholder="分享您在这里的真实体验~"
            placeholderClass="textarea-placeholder"
            maxlength={200}
            name="content"
            onInput={(e) => {
              setValueLen(Math.min(e.detail.value.length, 200));
            }}
          />
          <View className="textarea-count c_75">
            {valueLen}
            /200
          </View>
          {/* <View className="mt12">
            <UploadImg
              imgUrl={imgUrl}
              setImgUrl={setImgUrl}
            />
          </View> */}
        </View>
        <View className="fz10 c_75 mt16">为了营造和谐友爱的评论环境，请大家友好评论。</View>
        <Button className="resetBnt btn_main btn-submit" formType="submit">发布</Button>
      </Form>
      <ShowModal
        size="small"
        modal="Custom"
        content="感谢您的评论，请耐心等待1-2天审核，结果请关注微信通知~"
        confirmText="好的"
        visible={visible}
        onConfirm={() => {
          setVisible(false);
          Taro.navigateBack();
        }}
      />
    </View>
  );
}
