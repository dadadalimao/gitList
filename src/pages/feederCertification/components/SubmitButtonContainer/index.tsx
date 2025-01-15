import { View } from '@tarojs/components';
import './index.scss';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  currentQuestionIndex: number;
  questions: any[];
  handleSubmit: () => void;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>
}

/**
 * 提交按钮容器
 */
const SubmitButtonContainer: React.FC<Props> = ({
  currentQuestionIndex,
  questions,
  handleSubmit,
  setCurrentQuestionIndex,
}) => {
  return (
    <View className="submit-button-container">
      {(currentQuestionIndex === 0 && currentQuestionIndex !== questions.length - 1) && (
        <View
          className="submit-button btn_main"
          onClick={handleSubmit}
        >
          下一题
        </View>
      )}
      {currentQuestionIndex > 0 && currentQuestionIndex < questions.length - 1 && (
        <View className="submit-button-list">
          <View
            className="submit-button btn_plain"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          >
            上一题
          </View>
          <View
            className="submit-button btn_main"
            onClick={handleSubmit}
          >
            下一题
          </View>
        </View>
      )}
      {currentQuestionIndex === questions.length - 1 && (
        <View className="submit-button-list">
          <View
            className="submit-button btn_plain"
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          >
            上一题
          </View>
          <View
            className="submit-button btn_main"
            onClick={handleSubmit}
          >
            提交
          </View>
        </View>
      )}
    </View>
  );
};

export default SubmitButtonContainer;
