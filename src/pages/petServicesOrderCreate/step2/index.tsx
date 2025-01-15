import {
  View, Text, Image,
} from '@tarojs/components';
import { useContext, useState } from 'react';
import '@nutui/nutui-react-taro/dist/esm/popover/style/css.js';
import Taro, { useDidShow, useLoad } from '@tarojs/taro';
import { Calendar } from '@nutui/nutui-react-taro';
import dayjs from 'dayjs';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import '../step1/index.scss';
import './index.scss';
import { dispatch, myContext } from '@/store';
import ServiceNotice from '../components/ServiceNotice';
import OrderType from '../components/OrderType';
import orderPetImg from '@/images/ownerOrder/orderPet.png';
import orderServiceBasicImg from '@/images/ownerOrder/orderServiceBasic.png';
import orderServiceMoreImg from '@/images/ownerOrder/orderServiceMore.png';
import orderDetailImg from '@/images/ownerOrder/orderDetail.png';
import CustomIcon from '@/components/CustomIcon/CustomIcon';
import moreTimesImg from '@/images/ownerOrder/moreTimes.png';
import moreAttunedImg from '@/images/ownerOrder/moreAttuned.png';
import tipImg from '@/images/tip.png';
import { navTo } from '@/utils/utils';
import Tabs from '@/components/Tabs/Tabs';

interface AdditionalService {
  [key: string]: number,
}
interface CounterProps {
  value: number;
  disabled?: boolean;
  onChange: (action: 'add' | 'minus') => void;
}

const Counter = ({ value, disabled, onChange }: CounterProps) => (
  <View className="counter flex_ic">
    <CustomIcon
      disabled={disabled}
      type="delete"
      onClick={() => onChange('minus')}
    />
    <View className="counter-num">{value || 0}</View>
    <CustomIcon
      type="add"
      onClick={() => onChange('add')}
    />
  </View>
);
export default function PetServicesOrderCreate() {
  const { state } = useContext(myContext);
  const [step2, setStep2] = useState<any>(null);
  // 服务类型
  const [orderType, setOrderType] = useState<string>('ASSIGN');
  // 附加服务数量
  const [additionalServices, setAdditionalServices] = useState<AdditionalService[]>([]);
  // 基础服务
  const [basicService, setBasicService] = useState<any[]>([]);
  // 服务日期
  const [selectedDate, setSelectedDate] = useState(['12-26', '12-27', '12-27', '12-27']);
  // 当前填写的服务日期Index
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  // 当前选择服务的宠物Index
  const [currentPetIndex, setCurrentPetIndex] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  // 服务列表
  const [serviceList, setServiceList] = useState([
    {
      name: '遛狗/陪玩',
      value: 'PET_SERVICE_TYPE_WALK',
      icon: '',
    },
    {
      name: '清洁打扫',
      value: 'PET_SERVICE_TYPE_CLEAN',
      icon: '',
    },
    {
      name: '喂药/护理',
      value: 'PET_SERVICE_TYPE_MEDICINE',
      icon: '',
    },
  ]);

  // 处理所选日期 附加服务数量变化
  const handleServiceChange = (type: string, action: 'add' | 'minus') => {
    setAdditionalServices((pre) => {
      const newAdditionalServices = [...pre];
      let n = newAdditionalServices[currentDateIndex];
      if (!n) {
        n = {
          [type]: 0,
        };
      }
      n[type] = Math.max(0, (n[type] || 0) + (action === 'add' ? 1 : -1));
      newAdditionalServices[currentDateIndex] = n;
      return newAdditionalServices;
    });
  };
  // 处理所选日期 基础服务变化
  const handleBasicServiceChange = (type: string) => {
    setBasicService((pre) => {
      const newBasicService = [...pre];
      let n = newBasicService[currentDateIndex];
      if (!n) {
        n = {
          [type]: true,
        };
      } else {
        n[type] = !n[type];
      }
      newBasicService[currentDateIndex] = n;
      return newBasicService;
    });
  };
  useLoad(() => {
    console.log(Taro.getCurrentInstance().preloadData);
    // const {step2:data} = Taro.getCurrentInstance().preloadData;
    const data = {
      orderType: 'ASSIGN',
      address: {
        id: '1878971732191219714', createdAt: 1736816745219, sortedNum: 1, memberId: '1872450364247248898', address: '江西省南昌市南昌县紫阳大道388号', info: '334444@@aaaaaaaaaaaaaaaaaaaaaaaaaaaaaadasdasdas', addressName: '江西科技学院', longitude: '116.01798192134856', latitude: '28.675125368986283', isPrimary: false, phone: '12222222222', name: '1322',
      },
      petList: [{
        id: '1878994540795400194', kindId: '1866291171861598209', kindName: '喵宝', name: '333氨氮', gender: 'PET_SEX_FEMINA', variety: '1873558526551527446', dates: ['2025/01/15', '2025/01/16', '2025/01/17', '2025/01/18', '2025/01/19', '2025/01/23'], selected: true,
      }, {
        id: '1879003293804531714', kindId: '1866058624737087489', kindName: '汪宝', name: '额额', gender: 'PET_SEX_FEMINA', variety: '1873558526618636294', selected: true, dates: ['2025/01/14', '2025/01/16', '2025/01/17'],
      }, {
        id: '1879003293804531714', kindId: '1866058624737087489', kindName: '汪宝', name: 'aaaaa额额', gender: 'PET_SEX_FEMINA', variety: '1873558526618636294', selected: true, dates: ['2025/01/14', '2025/01/16', '2025/01/17'],
      }, {
        id: '1879003293804531714', kindId: '1866058624737087489', kindName: '汪宝', name: '额额aaaaaaaa', gender: 'PET_SEX_FEMINA', variety: '1873558526618636294', selected: true, dates: ['2025/01/14', '2025/01/16', '2025/01/17'],
      }, {
        id: '1879003293804531714', kindId: '1866058624737087489', kindName: '汪宝', name: '大啊啊', gender: 'PET_SEX_FEMINA', variety: '1873558526618636294', selected: true, dates: ['2025/01/14', '2025/01/16', '2025/01/17'],
      }, {
        id: '1879003293804531714', kindId: '1866058624737087489', kindName: '汪宝', name: '啊啊额额', gender: 'PET_SEX_FEMINA', variety: '1873558526618636294', selected: true, dates: ['2025/01/14', '2025/01/16', '2025/01/17'],
      }, {
        id: '1879003293804531714', kindId: '1866058624737087489', kindName: '汪宝', name: '啊啊啊 额额', gender: 'PET_SEX_FEMINA', variety: '1873558526618636294', selected: true, dates: ['2025/01/14', '2025/01/16', '2025/01/17'],
      }],
      keyType: '密码锁',
      doorTime: ['12:00', '14:30'],
      remarkCount: 9,
    };
    if (data) {
      setOrderType(data.orderType);
      const initBasicService: any[] = [];
      // 获取宠物的日期 去除重复  根据日期排序
      const petDates = data.petList.flatMap((pet) => {
        initBasicService.push({
          PET_SERVICE_TYPE_FEED: true,
        });
        return pet.dates;
      });
      setBasicService(initBasicService);
      const uniqueDates = [...new Set(petDates)];
      const sortedDates = uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      setSelectedDate(sortedDates);
      console.log('🚀 ~ useLoad ~ petDates:', sortedDates);
      setStep2(data);
    }
  });

  return (
    <View className="pet-services-order-create">
      <CustomNavigationBar title="宠物服务下单" theme="owner-claw" showBack>
        <View className="container xsafe_16">
          {/* 下单方式 */}
          <OrderType type={orderType} />

          {/* 服务日期 */}
          <View className="section date-section">
            <View className="section-title">
              <View className="title-left">
                <Image src={orderPetImg} className="icon" />
                <Text className="main-title">服务日期</Text>
              </View>
            </View>
            <View className="date-list">
              {selectedDate.map((date, index) => (
                <View
                  className={`date-item ${currentDateIndex === index ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrentDateIndex(index);
                  }}
                >
                  <View className="date">{dayjs(date).format('MM-DD')}</View>
                  <View className="status ellipsis">
                    {step2?.petList?.filter((pet) => pet.dates.includes(date))?.map((pet) => pet.name).join('、')}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 服务项目 */}
          <View className="section service-section">
            <View className="service-item flex_csb">
              <View className="flex_ic">
                <Image className="service-icon" src={moreTimesImg} />
                <View>
                  <View className="service-name">一天多次（服务费x80%）</View>
                  <View className="service-desc">在一次服务时间内上门服务</View>
                </View>
              </View>
              <Counter
                value={additionalServices[currentDateIndex]?.moreTime || 0}
                disabled={!additionalServices[currentDateIndex]?.moreTime}
                onChange={(action) => handleServiceChange('moreTime', action)}
              />
            </View>
            <View className="service-item flex_csb">
              <View className="flex_ic">
                <Image className="service-icon" src={moreAttunedImg} />
                <View>
                  <View className="service-name">提前熟悉（服务费x70%）</View>
                  <View className="service-desc">喂养员在服务日期前上门熟悉宠物</View>
                </View>
              </View>
              <Counter
                value={additionalServices[currentDateIndex]?.moreAttuned || 0}
                disabled={!additionalServices[currentDateIndex]?.moreAttuned}
                onChange={(action) => handleServiceChange('moreAttuned', action)}
              />
            </View>
          </View>

          <View className="title flex_ic fz16 mb8">
            <Image src={orderServiceBasicImg} className="icon22 mr6" />
            <Text>选择服务</Text>
          </View>
          {/* 选择服务 */}
          <Tabs
            list={step2?.petList || []}
            activeIndex={currentPetIndex}
            onChange={(index) => setCurrentPetIndex(index)}
          >
            <View className="section select-service-section">
              <View className="service-options fz14">
                <View
                  className={`service-option flex_ccc ${basicService[currentDateIndex]?.PET_SERVICE_TYPE_FEED && 'selected'}`}
                  onClick={() => handleBasicServiceChange('PET_SERVICE_TYPE_FEED')}
                >
                  <CustomIcon
                    className="check-icon"
                    type={basicService[currentDateIndex]?.PET_SERVICE_TYPE_FEED
                      ? 'radioSel' : 'radioNor'}
                  />
                  <Image className="pet-icon" src={orderPetImg} />
                  <View>宠物喂养</View>
                </View>
                <View
                  className={`service-option flex_ccc ${basicService[currentDateIndex]?.PET_SERVICE_TYPE_WALK && 'selected'}`}
                  onClick={() => handleBasicServiceChange('PET_SERVICE_TYPE_WALK')}
                >
                  <CustomIcon
                    className="check-icon"
                    type={basicService[currentDateIndex]?.PET_SERVICE_TYPE_WALK
                      ? 'radioSel' : 'radioNor'}
                  />
                  <Image className="pet-icon" src={orderPetImg} />
                  <View>上门遛狗</View>
                </View>
              </View>
              {/* 附加服务 */}
              <View className="section additional-section">
                <View className="section-title flex_csb">
                  <View className="flex_ic">
                    <Image src={orderServiceMoreImg} className="icon" />
                    <Text>附加服务</Text>
                  </View>
                  <View className="subtitle fz10 c_75 flex_ic">
                    <Image src={tipImg} className="icon12 mr6" />
                    服务费用
                  </View>
                </View>
                <View className="additional-services">
                  {serviceList.map((n) => (
                    <View className="service-item">
                      <View className="service-info">
                        <Image className="service-icon" src={n.icon} />
                        <Text>{n.name}</Text>
                      </View>
                      <Counter
                        value={additionalServices[currentDateIndex]?.[n.value] || 0}
                        disabled={!additionalServices[currentDateIndex]?.[n.value]}
                        onChange={(action) => handleServiceChange(n.value, action)}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Tabs>

          {/* 费用明细 */}
          <View className="section cost-detail">
            <View className="section-title">
              <Image src={orderDetailImg} className="icon" />
              <Text>当日明细</Text>
            </View>
            <View className="cost-items">
              <View className="cost-item">
                <Text>基础服务费</Text>
                <Text>¥130</Text>
              </View>
              <View className="cost-item">
                <Text>时间附加费</Text>
                <Text>¥10</Text>
              </View>
              <View className="cost-item">
                <Text>一天多次 (x5)</Text>
                <Text>¥60</Text>
              </View>
              <View className="cost-item">
                <Text>喂药</Text>
                <Text>¥20</Text>
              </View>
              <View className="cost-item">
                <Text>陪玩</Text>
                <Text>¥10</Text>
              </View>
              <View className="cost-total">
                <Text>费用总计</Text>
                <Text className="total-amount">¥230</Text>
              </View>
            </View>
          </View>

          {/* 服务项目总计 */}
          <View className="section service-total">
            <View className="flex_csb">
              <Text>服务项目总计</Text>
              <Text className="count">3项</Text>
              <Text className="arrow" />
            </View>
          </View>

          {/* 服务须知 */}
          <ServiceNotice />

          {/* 底部按钮 */}
          <View className="footer-view">
            <View className="bottom-button cancel-button flex_cc">上一步</View>
            <View
              className="bottom-button btn_main"
              onClick={() => {
                // Taro.preload({
                //   step3: {
                //     value: 2,
                //   },
                // });
                // navTo('/pages/petServicesOrderCreate/step2/index?111');
              }}
            >
              去结算
            </View>
          </View>
        </View>
      </CustomNavigationBar>
    </View>
  );
}
