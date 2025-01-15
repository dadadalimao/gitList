import { View } from '@tarojs/components';
import { useEffect, useRef, useState } from 'react';
import './SingleChoice.scss';
import Taro from '@tarojs/taro';
import ShowModal from '@/components/ShowModal';
import { toast } from '@/utils/utils';
import request from '@/api/apiRequest';
import { getState } from '@/store';
import SubmitButtonContainer from '../SubmitButtonContainer';
import { getBaseDictInfo, getConstantInfo } from '@/api';

interface Props {
  onSuccess: () => void;
}
/**
 * 单选考核
 * @param onSuccess 单选考核成功回调
 */
const SingleChoice: React.FC<Props> = ({ onSuccess }) => {
  // 考试id
  const testId = useRef('');
  // 剩余次数

  const [remainingTimes, setRemainingTimes] = useState(0);
  // 选中的单选题
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  // 答题记录
  const [answerRecord, setAnswerRecord] = useState<any[]>([]);
  // 答对题数
  const [correctCount, setCorrectCount] = useState(3);
  // 答题结果弹框
  const [showModal, setShowModal] = useState(false);
  const optionsText = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  // 题目
  const [questions, setQuestions] = useState<any[]>([]);
  // 当前题目index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 当前题目
  const currentQuestion = questions[currentQuestionIndex];
  // 考试信息结果
  const [testInfo, setTestInfo] = useState<any>({});
  /** 选择答案 */
  const handleSelect = (option: any) => {
    setSelectedAnswer(option.id);
    setAnswerRecord((prev) => {
      const newAnswerRecord = [...prev];
      newAnswerRecord[currentQuestionIndex] = {
        isCorrect: option.isCorrect,
        // options: option.content,
        optionId: option.id,
        questId: currentQuestion.id,
        // questions: currentQuestion.content,
        // testId: testId.current,
      };
      return newAnswerRecord;
    });
  };
  /** 获取剩余答题次数 */
  const getTestInfo = async () => {
    const res = await request({
      url: `/fd/test/info?id=${testId.current}`,
      method: 'GET',
    });

    return res;
  };
  /** 提交 */
  const handleSubmit = async () => {
    if (selectedAnswer === '' && !answerRecord[currentQuestionIndex]) {
      toast('请选择答案');
      return;
    }
    // 如果当前题目不是最后一题，则跳到下一题
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      // 如果当前题目是最后一题，则提交
      Taro.showLoading({
        title: '提交中',
      });

      // const res2 = await request({
      //   url: '/fd/test/startTheExam',
      //   method: 'GET',
      //   failToast: true,
      // });
      // testId.current = res2.data;

      request({
        url: '/fd/test/endTheExam',
        method: 'POST',
        data: {
          startTime: new Date().getTime(),
          tQuestList: answerRecord.map((item) => {
            const n = { ...item };
            delete n.isCorrect;
            return n;
          }),
        },
      }).then(async (res) => {
        testId.current = res.data.testId;
        // const info = await getTestInfo();
        const totalTimes = await getConstantInfo('VOIP_TEST_TIMES');
        setTestInfo(res.data);
        setRemainingTimes(totalTimes.data - res.data.testCounted);
        // if (info.data.isPass) {
        setCorrectCount(answerRecord.filter((i) => i.isCorrect).length);
        setShowModal(true);
        // } else {
        //   setCorrectCount(answerRecord.filter((i) => i.isCorrect).length);
        //   setShowModal(true);
        // }

        Taro.hideLoading();
      }).catch(() => {
        Taro.hideLoading();
      });
    }
  };

  const getConfirmText = (count: number, times: number) => {
    if (testInfo.isPass) return '继续答题';
    if (times > 0) return '再次答题';
    return '返回主页';
  };
  /** 获取题目  */
  const getQuestions = async () => {
    try {
      const { data: size } = await getConstantInfo('VOIP_TEST_NOME') || 20;
      const res = await request({
        url: '/fd/quest/find',
        method: 'POST',
        data: {
          type: 'QUESTION_BANK_TYPE_RADIO',
          size,
          typeOfServiceList: getState()?.loginMember?.feeder?.typeOfServiceList || [],
        },
        loading: '题库加载中',
      });
      setQuestions(res.data);
    } catch (error) {
      Taro.showModal({
        title: '题库加载失败',
        content: '请稍后再试',
        showCancel: false,
        success: () => {
          Taro.navigateBack();
        },
      });
    }
  };
  useEffect(() => {
    console.log('单选题开始');
    getQuestions();
  }, []);
  // useEffect(() => {
  //   console.log('🚀 ~ SingleChoice ~ answerRecord:', answerRecord);
  // }, [answerRecord]);
  return (
    <View className="single-choice">
      <View className="question-header flex_csb">
        <View className="bold fz16">单选题</View>
        <View className="question-number">{`${currentQuestionIndex + 1}/${questions.length}`}</View>
      </View>
      <View className="question-title">{currentQuestion?.content}</View>
      <View className="options-container">
        {currentQuestion?.optionList.map((option, index) => (
          <View
            key={option.id}
            className={`option-item ${(selectedAnswer === option.id || answerRecord[currentQuestionIndex]?.optionId === option.id) ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            <View className="option-content break-all">{`${optionsText[index]}、${option.content}`}</View>
          </View>
        ))}
      </View>

      <SubmitButtonContainer
        currentQuestionIndex={currentQuestionIndex}
        questions={questions}
        handleSubmit={handleSubmit}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />

      <ShowModal
        className="single-choice-modal"
        modal="Custom"
        size="small"
        visible={showModal}
        content={(
          <View>
            <View className="total-score">
              {`${(correctCount * (100 / questions.length)).toFixed(0)}分`}
            </View>
            <View className="fz16">
              {remainingTimes === 0 && !testInfo.isPass ? '很遗憾您的答题机会已用完，无法申请喂养员认证~' : ''}
              {remainingTimes > 0 && !testInfo.isPass ? `很遗憾您本次答题未能通过，还剩${remainingTimes}次机会~` : ''}
              {testInfo.isPass ? '恭喜您顺利完成单选题考核，请继续完成主观题考核~' : ''}
            </View>
          </View>
        )}
        cancelShow={(!testInfo.isPass && remainingTimes > 0)}
        cancelText="下次再来"
        confirmText={getConfirmText(correctCount, remainingTimes)}
        onClose={() => { setShowModal(false); }}
        onConfirm={() => {
          setShowModal(false);
          // 如果得分大于passScore，则通过
          if (testInfo.isPass) {
            onSuccess();
            return;
          }
          // 如果剩余次数大于0，则重新答题
          if (remainingTimes > 0) {
            getQuestions();
            setRemainingTimes(remainingTimes - 1);
            setCurrentQuestionIndex(0);
            setSelectedAnswer('');
            setAnswerRecord([]);
            setCorrectCount(0);
            return;
          }
          // 如果剩余次数为0，则返回主页
          Taro.switchTab({ url: '/pages/petServices/index' });
        }}
        onCancel={() => {
          // 下次再来，返回
          Taro.navigateBack();
        }}
      />
    </View>
  );
};

export default SingleChoice;
