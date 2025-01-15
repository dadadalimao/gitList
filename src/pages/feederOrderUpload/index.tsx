import { View, Image, Text, Textarea, Button } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';
import defaultAvatar from '@/images/defaultAvatar.png';
import copyImg from '@/images/myOrder/copy.svg';
import CustomNavigationBar from '@/components/CustomNavigationBar';
import UploadImg from '@/components/UploadImg';

export default function Index() {
  /** 服务图片 */
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  /** 服务视频 */
  const [videoUrl, setVideoUrl] = useState<string[]>([]);
  /** 服务描述 */
  const [note, setNote] = useState<string>();

  useLoad(() => {});

  const navTo = (url) => {
    // if (state?.loginMember && !guestAccessiblePages.includes(url)) {
    Taro.navigateTo({ url });
    // } else {
    //   setLoginVisible(true);
    // }
  };
  return (
    <View>
      <CustomNavigationBar title="上传材料" theme="feeder" showBack>
        <View className="f-body">
          <View>
            <View
              className="order"
              onClick={() => {
                // Taro.navigateTo({ url: '/pages/myOrderInfo/index' });
              }}
            >
              <View className="title-code">
                <View>订单编号:&nbsp;202412250001</View>
                <View className="title-copy">
                  <Image src={copyImg} />
                </View>
              </View>
              <View className="content">
                <View className="petImgs">
                  <View className="img">
                    <Image src={defaultAvatar} />
                  </View>
                  <View className="text">
                    <View className="text-name">多乐</View>
                    <View className="text-address ellipsis">
                      服务地址:&nbsp;上海市浦东区张扬路500号好好好爱奥啊哈哈啊哈啊哈哈哈哈哈哈哈
                    </View>
                    <View className="ellipsis">
                      服务项目:&nbsp;上门喂养、遛狗山山水水那失手随你随你酸牛奶说你是
                    </View>
                  </View>
                </View>
                <View className="time ellipsis">
                  <Text>接单时间:&nbsp;</Text>2024-12-12 14:00~15:00
                </View>
                <View className="time ellipsis">
                  <Text>上门时间:&nbsp;</Text>2024-12-12 14:00~15:00
                </View>
              </View>
            </View>
            <View className="forms">
              <View className="title">服务描述</View>
              <View>
                <Textarea
                  className="note-text"
                  placeholder="请详细描述服务过程中的情况，包括宠物的表现、喂食量等信息"
                  // maxlength={150}
                  showCount
                  value={note}
                  onInput={(e) => {
                    setNote(e.detail.value);
                  }}
                />
              </View>
              <View className="title">服务图片</View>
              <View className="UploadImg">
                <UploadImg imgUrl={imgUrl} setImgUrl={setImgUrl} max={3} />
              </View>
              <View className="title">服务视频</View>
              <View className="UploadImg">
                <UploadImg imgUrl={videoUrl} setImgUrl={setVideoUrl} max={3} />
              </View>
            </View>
            <View style={{ height: '100px' }} />
          </View>
        </View>
      </CustomNavigationBar>
      <View className="btn">
        <Button className="resetBtn btn_feeder w160" formType="submit" onClick={(e) => {}}>
          暂存
        </Button>
        <Button className="resetBtn btn_feeder w160" formType="submit" onClick={(e) => {}}>
          上传
        </Button>
      </View>
    </View>
  );
}
