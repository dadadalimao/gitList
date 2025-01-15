import { View, Image } from '@tarojs/components';
import { useState } from 'react';
import Taro, { useLoad } from '@tarojs/taro';
import AnswerStep from '@/components/AnswerStep/AnswerStep';
import BasicInfoForm from './components/BasicInfoForm/BasicInfoForm';
import './index.scss';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import dogImg from '@/images/feeder/dog.png';
import CertificationNote from './components/CertificationNote/CertificationNote';
import SingleChoice from './components/SingleChoice/SingleChoice';
import QuestionPage from './components/QuestionPage/QuestionPage';
import Deposit from './components/Deposit/Deposit';
import { getInfo } from '@/api/member';
import request from '@/api/apiRequest';
import { navTo } from '@/utils/utils';
import Loading from '@/components/Loading/Loading';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<AnswerStep[]>([
    { title: '基本信息', status: 'done' },
    { title: '单选考核', status: 'waiting' },
    { title: '主观考核', status: 'waiting' },
    { title: '最终准备', status: 'waiting' },
  ]);
  /** 是否显示认证须知 */
  const [showNote, setShowNote] = useState(false);
  useLoad((options) => {
    getInfo('', true).then((res) => {
      console.log('🚀 ~ Index ~ getInfo ~ res:', res);
      // FEEDER_CERTIFY_FINAL: '最终准备',
      // FEEDER_CERTIFY_SUBJECTIVE: '主观考核',
      // FEEDER_CERTIFY_SINGLE: '单选考核',
      // FEEDER_CERTIFY_BASIC: '基本信息',
      // res.process = 'FEEDER_CERTIFY_BASIC';
      // const process = 'FEEDER_CERTIFY_BASIC';
      const { process } = res.feeder;
      // 如果传入的参数有jumpBasic，则根据进度设置步骤
      if (process && options.jumpBasic) {
        // 基本信息完成
        if (process === 'FEEDER_CERTIFY_BASIC') {
          setSteps([
            { title: '基本信息', status: 'active' },
            { title: '单选考核', status: 'done' },
            { title: '主观考核', status: 'waiting' },
            { title: '最终准备', status: 'waiting' },
          ]);
          setShowNote(true);
        }
        // 单选考核完成
        if (process === 'FEEDER_CERTIFY_SINGLE') {
          setSteps([
            { title: '基本信息', status: 'active' },
            { title: '单选考核', status: 'active' },
            { title: '主观考核', status: 'done' },
            { title: '最终准备', status: 'waiting' },
          ]);
        }
        // 主观考核完成
        if (process === 'FEEDER_CERTIFY_SUBJECTIVE') {
          setSteps([
            { title: '基本信息', status: 'active' },
            { title: '单选考核', status: 'active' },
            { title: '主观考核', status: 'active' },
            { title: '最终准备', status: 'done' },
          ]);
        }
      }
      setLoading(false);
    }).catch((err) => {
      console.log('🚀 ~ Index ~ useLoad ~ err:', err);
      setLoading(false);
    });
  });
  return (
    <View className={`feederCertification-container ${showNote || steps[0].status === 'done' ? '' : 'feederCertification-container-fff'}`}>
      <CustomNavigationBar
        containerClassName="feederCertification-content"
        title="喂养员认证"
        showBack
        theme={(showNote || steps[0].status === 'done') ? 'owner' : 'owner-fff'}
      >
        <Loading loading={loading}>
          {!showNote && (
            <>
              <View className="header">
                <View>
                  <View className="fz20 bold">Woffie喂养员认证</View>
                  <View className="c_75 fz12 mt12">上门照顾宠物 获得服务报酬</View>
                </View>
                <Image src={dogImg} className="dogImg" />
              </View>

              <View className="answer-step-container">
                <AnswerStep steps={steps} />
              </View>
            </>
          )}

          {/* 基本信息 */}
          {steps[0].status === 'done' ? (
            <BasicInfoForm
              onSubmit={(e) => {
                console.log('🚀 ~ Index ~ e:', e);
                // setSteps([
                //   { title: '基本信息', status: 'active' },
                //   { title: '单选考核', status: 'done' },
                //   { title: '主观考核', status: 'waiting' },
                //   { title: '最终准备', status: 'waiting' },
                // ]);
                // setShowNote(true);
                navTo('/pages/feederCertification/index?jumpBasic=true');
              }}
            />
          ) : null}
          {/* 认证须知 */}
          {steps[1].status === 'done' && showNote
            ? (
              <CertificationNote onSuccess={() => {
                setShowNote(false);
              }}
              />
            ) : null}
          {/* 单选考核 */}
          {steps[1].status === 'done' && !showNote
            ? (
              <SingleChoice
                onSuccess={() => setSteps([
                  { title: '基本信息', status: 'active' },
                  { title: '单选考核', status: 'active' },
                  { title: '主观考核', status: 'done' },
                  { title: '最终准备', status: 'waiting' },
                ])}
              />
            ) : null}
          {/* 主观考核 */}
          {steps[2].status === 'done'
            ? (
              <QuestionPage onSuccess={() => setSteps([
                { title: '基本信息', status: 'active' },
                { title: '单选考核', status: 'active' },
                { title: '主观考核', status: 'active' },
                { title: '最终准备', status: 'done' },
              ])}
              />
            ) : null}
          {/* 最终准备 缴纳押金 */}
          {steps[3].status === 'done'
            ? <Deposit /> : null}
        </Loading>
      </CustomNavigationBar>
    </View>
  );
}
