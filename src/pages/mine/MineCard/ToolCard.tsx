import { View, Image, Button } from '@tarojs/components';
import toolMyLocationImg from '@/images/mine/toolMyLocation.png';
import toolContactCustomerServiceImg from '@/images/mine/toolContactCustomerService.png';
import toolSubscribeNotificationsImg from '@/images/mine/toolSubscribeNotifications.png';
import toolPlatformAgreementImg from '@/images/mine/toolPlatformAgreement.png';
import toolFeedbackSuggestionsImg from '@/images/mine/toolFeedbackSuggestions.png';
import toolRealNameImg from '@/images/mine/toolRealName.png';
import { NotYetOpen, openServiceChat, toast } from '@/utils/utils';
import Agreement from '@/components/Agreement/Agreement';
import Card from './Card';
import { getState } from '@/store';

const toolCard = [
  {
    title: '我的地址',
    icon: toolMyLocationImg,
    url: '/pages/myAddress/index',
    type: 'nav',
    version: 2,
  },
  {
    title: '联系客服',
    icon: toolContactCustomerServiceImg,
    url: '',
    type: 'contact',
  },
  {
    title: '订阅通知',
    icon: toolSubscribeNotificationsImg,
    url: '',
    type: 'nav',
  },
  {
    title: '平台协议',
    icon: toolPlatformAgreementImg,
    url: 'platform',
    type: 'agreement',
  },
  {
    title: '实名认证',
    icon: toolRealNameImg,
    url: '/pages/nameVerify/index',
    type: 'nav',
    version: 2,
  },
  {
    title: '建议反馈',
    icon: toolFeedbackSuggestionsImg,
    url: '',
    type: 'nav',
    version: 3,
  },
];

interface ToolCardProps {
  navTo: (url: string) => void;
  setLoginVisible: (visible: boolean) => void;
  loginMember: any;
}

const ToolCard = ({ navTo, setLoginVisible, loginMember }: ToolCardProps) => {
  return (
    <View className="toolCard-view">
      <Card title="常用工具">
        <View className="toolCard  mt10">
          <View className="toolCard-list flex_csb">
            {toolCard.map((item) => (
              <View key={item.title} className="toolCard-item-view">
                {item.type === 'nav' && (
                  <View
                    className="flex_ccc toolCard-item"
                    onClick={() => {
                      if (NotYetOpen(item.version)) return;
                      if (item.url) {
                        if (item.url === '/pages/nameVerify/index') {
                          if (getState()?.loginMember?.feeder?.testPassed) {
                            navTo(item.url);
                          } else {
                            toast('您还未通过喂养员认证');
                          }
                        } else {
                          navTo(item.url);
                        }
                      } else {
                        NotYetOpen();
                      }
                    }}
                  >
                    <Image className="icon28" src={item.icon} />
                    <View className="mt4 c_75 fz12">{item.title}</View>
                  </View>
                )}
                {item.type === 'agreement' && (
                  <Agreement type={item.url === 'platform' ? 'platform' : 'privacy'}>
                    <View className="flex_ccc toolCard-item">
                      <Image className="icon28" src={item.icon} />
                      <View className="mt4 c_75 fz12">{item.title}</View>
                    </View>
                  </Agreement>
                )}
                {item.type === 'contact' && (
                  <Button
                    className="resetBtn flex_ccc toolCard-item"
                    onClick={() => {
                      if (loginMember) {
                        openServiceChat();
                      } else {
                        setLoginVisible(true);
                      }
                    }}
                  >
                    <Image className="icon28" src={item.icon} />
                    <View className="mt4 c_75 fz12">{item.title}</View>
                  </Button>
                )}
              </View>
            ))}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default ToolCard;
