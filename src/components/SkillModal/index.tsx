import { View, Image, Button, Text, Textarea } from '@tarojs/components';
import './index.scss';
import { AtCheckbox, AtModal } from 'taro-ui';
import { useState } from 'react';
import { useLoad } from '@tarojs/taro';
import request from '@/api/apiRequest';
// import radioSelImg from '@/images/loginRadio.png';
import Taro from '@tarojs/taro';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  skillList: any;
  setSkillList: (item: any) => void;
  skillOpts: any;
  onSuccess: () => void;
}
export default function ModalAlert({
  visible,
  setVisible,
  title,
  skillList,
  setSkillList,
  skillOpts,
  onSuccess,
}: Props) {
  /** 当前添加的技能标签 */
  const [nowSkill, setNowSkill] = useState<any>();

  return (
    <AtModal isOpened={visible}>
      <View className="m">
        <View className="m-title">{title}</View>
        <View className="m-body">
          {Object.keys(skillOpts).map((key) => (
            <View className="m-body-item">
              <View
                onClick={() => {
                  setNowSkill(key);
                }}
                className="m-body-item-check"
              >
                {/* {nowSkill === key ? (
                  <Image className="icon14 mr4" src={radioSelImg} />
                ) : (
                  // <Image className="icon14 mr4" src="" />
                  <View className="radio_nor mr4" />
                )} */}
              </View>
              {skillOpts[key]}
            </View>
          ))}
        </View>
      </View>
      <View className="m-footer">
        <View
          className="m-cancel"
          onClick={() => {
            setVisible(false);
            setNowSkill(undefined);
          }}
        >
          取消
        </View>
        <View
          className="m-ok"
          onClick={() => {
            onSuccess();
            const d: any = [];
            if (skillList.length > 0) {
              skillList.forEach((ele) => {
                if (ele === nowSkill) {
                  d.push(ele);
                }
              });
              if (d.length > 0) {
                Taro.showToast({ title: '该技能已经添加', icon: 'none' });
                return;
              }
            }
            setSkillList((prev) => [...prev, ...[nowSkill]]);
            setVisible(false);
            setNowSkill(undefined);
          }}
        >
          确定
        </View>
      </View>
    </AtModal>
  );
}
