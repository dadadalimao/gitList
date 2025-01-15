import { View, Textarea } from '@tarojs/components';
import { useEffect, useRef, useState } from 'react';
import '../SingleChoice/SingleChoice.scss';
import './QuestionPage.scss';
import Taro from '@tarojs/taro';
import { toast } from '@/utils/utils';
import request from '@/api/apiRequest';
import { getState } from '@/store';
import SubmitButtonContainer from '../SubmitButtonContainer';
import { getConstantInfo } from '@/api';

interface QuestionPageProps {
  onSuccess: () => void;
}

interface Question {
  id: number;
  content: string;
}

/**
 * 主观考核
 * @param onSuccess 主观考核成功回调
 */
export default function QuestionPage({ onSuccess }: QuestionPageProps) {
  // 答案
  const [answers, setAnswers] = useState<any[]>([]);
  // 当前题目索引
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // 题目
  const [questions, setQuestions] = useState<Question[]>([]);
  // 考试id
  const testId = useRef();
  // 当前题目
  const currentQuestion = questions[currentQuestionIndex];
  // 当前答案
  const currentAnswer = answers[currentQuestionIndex]?.answer || '';
  // 答案改变
  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      answer: value,
      testId: testId.current,
      questId: currentQuestion.id,
      // questions: currentQuestion.content,
    };
    setAnswers(newAnswers);
  };
  // 提交
  const handleSubmit = () => {
    if (!answers[currentQuestionIndex]?.answer.trim()) {
      toast('请填写您的答案');
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log('提交 answers', answers);
      // 提交
      request({
        url: '/fd/test/endTheExam',
        method: 'POST',
        data: {
          startTime: new Date().getTime(),
          tQuestList: answers,
        },
      }).then(() => {
        onSuccess();
      });
    }
  };
  // 获取题目 开始考试
  const getQuestions = async () => {
    try {
      const { data: size } = await getConstantInfo('VOIP_TEST_NOSE') || 20;
      const res = await request({
        url: '/fd/quest/find',
        method: 'POST',
        data: {
          type: 'QUESTION_BANK_TYPE_QA',
          size,
          typeOfServiceList: getState()?.loginMember?.feeder?.typeOfServiceList || [],
        },
        loading: '题库加载中',
      });
      setQuestions(res.data);
      // const res2 = await request({
      //   url: '/fd/test/startTheExam',
      //   method: 'GET',
      //   loading: '开始答题',
      //   failToast: true,
      // });
      // testId.current = res2.data;
    } catch {
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
    console.log('主观题开始');
    getQuestions();
  }, []);
  return (
    <View className="single-choice QuestionPage-container">
      <View className="question-header flex_csb">
        <View className="bold fz16">主观题</View>
        <View className="question-number">{`${currentQuestionIndex + 1}/${questions.length}`}</View>
      </View>
      <View className="question-title">{currentQuestion?.content}</View>
      <View className="question-container">
        <Textarea
          className="question-textarea"
          placeholderClass="question-textarea-placeholder"
          placeholder="请填写您的答案"
          value={currentAnswer}
          maxlength={400}
          autoHeight
          onInput={(e) => {
            handleAnswerChange(e.detail.value.slice(0, 400));
          }}
        />
      </View>

      <SubmitButtonContainer
        currentQuestionIndex={currentQuestionIndex}
        questions={questions}
        handleSubmit={handleSubmit}
        setCurrentQuestionIndex={setCurrentQuestionIndex}
      />

    </View>
  );
}
