import { CalendarDay, Calendar as NutCalendar } from '@nutui/nutui-react-taro';
import '@nutui/nutui-react-taro/dist/esm/calendar/style/css.js';
import { Dispatch, SetStateAction, useState } from 'react';
import './Calendar.scss';
import { View } from '@tarojs/components';

// 继承 NutUI Calendar 的属性类型
type NutCalendarProps = React.ComponentProps<typeof NutCalendar>;

interface Props extends Omit<NutCalendarProps, 'visible' | 'onClose' | 'onDayClick' | 'onConfirm' | 'className' | 'type'> {
  className?: string;
  type?: 'single' | 'multiple' | 'range';
  /** 控制日历显示/隐藏 */
  visible: boolean;
  /** 设置日历显示状态 */
  setVisible: (visible: boolean) => void;
  /** 确定回调 */
  handleConfirm: (date: string[][]) => void;
  /** 取消回调 */
  handleCancel?: () => void;
}

/**
 * 日历组件
 * @description 基于 NutUI Calendar 的自定义日历组件，支持多选
 */
export default function WofiieCalendar({
  className,
  type = 'multiple',
  visible,
  setVisible,
  handleConfirm,
  handleCancel,
  ...restProps // 收集其他 NutUI Calendar 的属性
}: Props) {
  const [selectedDate, setSelectedDate] = useState<string[][]>([]);

  /**
   * 将日期字符串转换为时间戳
   * @param dateStr 日期字符串 (YYYY-MM-DD)
   * @returns 时间戳
   */
  const getTimestamp = (dateStr: string): number => {
    return new Date(dateStr).getTime();
  };

  /**
   * 对日期数组进行排序
   * @param dates 日期字符串数组
   * @returns 排序后的日期数组
   */
  const sortDates = (dates: string[][]): string[][] => {
    return [...dates].sort((a, b) => getTimestamp(a[3]) - getTimestamp(b[3]));
  };

  return (
    <NutCalendar
      showTitle={false}
      className={`calendar-container ${className}`}
      visible={visible}
      type={type}
      onClose={() => setVisible(false)}
      onDayClick={(date) => {
        console.log('🚀 ~ date:', date);
        // const formattedDates = date.map((item) => `${item[0]}-${item[1]}-${item[2]}`);
        // // 对选中的日期进行排序
        // const sortedDates = sortDates(formattedDates);
        setSelectedDate(date);
      }}
      renderDay={(date) => {
        return (
          <View className="calendar-day">
            {date.day}
            <span className="info">￥58</span>
          </View>
        );
      }}
      renderBottomButton={() => (
        <View className="calendar-footer flex_csb">
          <View
            className="cancel-btn btn_plain"
            onClick={() => {
              handleCancel?.();
              setVisible(false);
            }}
          >
            取消
          </View>
          <View
            className="confirm-btn btn_main"
            onClick={() => {
              // 对选中的日期进行排序
              const sortedDates = sortDates(selectedDate);
              handleConfirm(sortedDates);
              console.log('🚀 ~ handleConfirm ~ sortedDates:', sortedDates);
              setVisible(false);
            }}
          >
            确定
          </View>
        </View>
      )}
      {...restProps}
    />
  );
}
