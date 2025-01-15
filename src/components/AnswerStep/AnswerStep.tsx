import { View, Image } from '@tarojs/components';
import './AnswerStep.scss';
import stepActiveImg from '@/images/feederCertification/stepActive.png';

interface Props {
  steps: AnswerStep[];
}

const AnswerStep = ({ steps }: Props) => {
  const getIconSrc = (status: AnswerStep['status'], index) => {
    switch (status) {
      case 'active':
        return (
          <View className="step-active">
            <View className="step-active-in">
              <Image src={stepActiveImg} className="icon10" />
            </View>
          </View>
        );
      case 'done':
        return (
          <View className="step-done">
            <View className="step-done-in">
              <View className="step-done-in-in" />
            </View>
          </View>
        );
      case 'waiting':
        return (
          <View className="step-waiting">
            {index + 1}
          </View>
        );
      default:
        return (
          <View className="step-waiting">
            {index + 1}
          </View>
        ); // 默认值，防止未定义状态
    }
  };

  return (
    <View className="AnswerStep-container">
      <View className="answer-step">
        {steps.map((step, index) => (
          <View key={step.title} className={`step ${step.status}`}>
            <View className="step-content">
              {getIconSrc(step.status, index)}
            </View>
            <View className="step-text">{step.title}</View>
          </View>
        ))}
        {steps.map((step, index) => {
          // 跳过最后一个步骤,因为最后一个步骤不需要背景条
          if (index === steps.length - 1) return null;
          // 计算当前背景条的宽度
          const width = `calc(100% / ${steps.length - 1})`;
          // 计算左偏移,使背景条位于正确位置
          const left = `calc(${width} * ${index})`;
          return (
            <View
              key={step.title}
              className={`step-bg ${step.status === 'active' ? 'step-bg-active' : ''}`}
              style={{
                width,
                left,
              }}
            />
          );
        })}
      </View>
    </View>

  );
};

export default AnswerStep;
