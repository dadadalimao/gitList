import { View, Image, Text } from '@tarojs/components';
import './CertificationNote.scss';
import { useState } from 'react';
import { VIEW } from '@tarojs/runtime';
import Agreement from '@/components/Agreement/Agreement';
import noteSel from '@/images/feederCertification/noteSel.png';
import { toast } from '@/utils/utils';

interface Props {
  onSuccess: () => void
}
/**
 * 认证须知
 * @param onSuccess 认证须知成功回调
 */
export default function CertificationNote({ onSuccess }: Props) {
  const [agreement, setAgreement] = useState(false);
  const data = {
    applicationConditions: {
      title: '申请条件',
      content: [
        '申请人需年满21周岁至45周岁，需提供身份证明文件以证实年龄。',
        '申请人应具有良好的身体健康状况，能够有效履行喂养员职责的基本要求。',
        '申请人无违法犯罪记录及个人不良信用记录，且需提供芝麻信用分，分数须不低于650分。',
        '申请人需具备至少2年以上的科学的个人宠物养护经验，并能够熟练掌握不同品种宠物的养护知识。',
        '申请人需具备良好的沟通表达能力、亲和力，以及情绪稳定性。',
        '申请人需对喂养员的工作性质与职责有充分了解，具有强烈的服务意识和责任心。',
      ],
    },
    certificationInfo: {
      title: 'Woffie认证须知',
      content: [
        '申请人认证前需充分了解并认同沃飞品牌的理念和价值观。',
        '本行业的工作需求量可能会因节假日及其他季节性因素而波动，因此淡旺季的变化可能会影响接单频率。',
        '非一二线城市或偏远市郊的申请人，请根据服务需求密度谨慎考虑申请。',
        '申请人认证时必须提供清晰的身份证原件，且证件需在有效期内。',
        '使用沃飞小程序进行注册时，所用微信账号的实名信息需与申请认证时的实名信息一致，以确保服务结算和提现无误。',
        '喂养员需接受平台组织的定期培训和考核，不断规范和完善服务质量。对于服务中出现严重违规行为或未通过考核的喂养员，平台有权随时终止合作。',
        '申请人需缴纳500元押金，该押金用于确保服务质量，并在合作结束且主动申请退还押金的情况下全额退还。',
        '申请人需了解并同意，现阶段平台将扣除上门总服务费的8-10%',
      ],
    },
    certificationSteps: {
      title: '认证步骤',
      content: [
        '请自行填写、提交个人基本信息以及与宠物的合照。',
        '需观看完整培训视频，学习必要的上门服务知识与技能。',
        '进行基础知识考核： 20道选择题，需正确答对至少18题。',
        '进行主观题考核，考核内容将提交人工审核，需在1个自然日内完成。',
        '主观题审核通过后，进行保证金的缴纳（该保证金在喂养师退出平台服务时可申请退费）。',
        '完成以上步骤后，平台审核专员将通过视频通话与您进行人工终审，通常需2个自然日。',
        '审核结果将通过【微信服务通知】的形式告知申请人。',
        '认证成功后，请您进行实名认证，加入所在城市的喂养员群组，并在工作台完成接单设置，之后即可开始接单。',
      ],
    },
  };

  return (
    <View className="certification-note">
      {/* 申请条件 */}
      <View className="note-section">
        <View className="note-title">《WOFFIE沃飞喂养员认证须知》</View>
        <View className="section-title">{data.applicationConditions.title}</View>
        <View className="section-items">
          {data.applicationConditions.content.map((item, index) => (
            <View className="flex">
              <View>
                {`${index + 1}.`}
              </View>
              <View className="item">
                {item}
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* 认证须知 */}
      <View className="note-section">
        <View className="section-title">{data.certificationInfo.title}</View>
        <View className="section-items">
          {data.certificationInfo.content.map((item, index) => (
            <View className="flex">
              <View>
                {`${index + 1}.`}
              </View>
              <View className="item">
                {item}
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* 认证步骤 */}
      <View className="note-section">
        <View className="section-title">{data.certificationSteps.title}</View>
        <View className="section-tip fz14 c_75 mt6">
          （感谢您对沃飞品牌的支持，对毛孩子的热爱，woffie致力于为广大毛孩子提供更多的关怀与守护，快来完成以下认证 加入我们吧！）
        </View>
        <View className="section-items mt10">
          {data.certificationSteps.content.map((item, index) => (
            <View className="flex">
              <View>
                {`${index + 1}.`}
              </View>
              <View className="item">
                {item}
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className="note-footer">
        <View
          className="note-footer-agreement flex_ic"
          onClick={() => {
            setAgreement((prev) => !prev);
          }}
        >
          <View className="note-footer-agreement-checkbox flex_cc mr4">
            {agreement ? <Image className="icon10" src={noteSel} /> : null}
          </View>
          <View className="note-footer-agreement-text">我已阅读并同意</View>
          <Agreement type="feeder" className="c_main">喂养员协议</Agreement>
        </View>
        <View
          className="btn_main"
          onClick={() => {
            if (agreement) {
              onSuccess();
            } else {
              toast('请先阅读并同意喂养员协议');
            }
          }}
        >
          开始考试
        </View>
      </View>
    </View>
  );
}
