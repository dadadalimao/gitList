import { View, Image, Text } from '@tarojs/components';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import iconLikeNor from '@/images/likeNor.png';
import iconLikeSel from '@/images/likeSel.png';
import iconComment from '@/images/comment.png';
import Empty from '@/components/Empty';
import { getAvatar } from '@/utils/oss';
import request from '@/api/apiRequest';

interface Comment {
  id: number;
  memName: string;
  memPic: string;
  createdAt: string;
  content: string;
  upvoteNum: number;
  children?: Comment[];
}
interface UserCommentsProps {
  messages?: Comment[];
}
/**
 * auditInstructions: "mmmmm"
content: "kkkkkkkkk"
createdAt: 1735280329092
id: "1872527535884079105"
memName: "zq2"
memPic: "202412/6bd4c10e-3fe1-45a8-beb3-e4478abfb604"
remark: "ooooo"
sortedNum: 1
upvoteNum: 0
userId: "1870009719888941057"
 * */
export default function UserComments({ messages }: UserCommentsProps) {
  const [list, setList] = useState<Comment[]>([]);
  useEffect(() => {
    if (!messages) return;
    setList(messages);
  }, [messages]);
  return (
    <View className="user-comments">
      {list.map((item) => (
        <View key={item.id} className="message">
          <Image className="avatar40 mr8" src={getAvatar(item.memPic)} mode="aspectFill" />
          <View className="message-content">
            <Text className="user-name fz14 c_3 mr8">{item.memName}</Text>
            <Text className="message-time fz12 c_9">{dayjs(item.createdAt).format('YYYY年MM月DD日')}</Text>
            <View className="message-text fz12 c_6">{item.content}</View>
            <View className="message-actions">
              {/* <View
                className="flex_ic message-actions-item mr8"
                onClick={() => {
                  request({
                    url: '/fr/comment/thumbsUp',
                    method: 'GET',
                    data: { id: item.id, thumbsUp: !item.thumbsUp },
                  }).then((res) => {
                    setList((pre) => {
                      const newList = [...pre];
                      const index = newList.findIndex((i) => i.id === item.id);
                      newList[index].thumbsUp = !item.thumbsUp;
                      newList[index].upvoteNum = !item.thumbsUp
                        ? item.upvoteNum - 1 : item.upvoteNum + 1;
                      return newList;
                    });
                  });
                }}
              >
                <Image className="icon14 mr4" src={item.thumbsUp ? iconLikeSel : iconLikeNor} />
                <Text className="fz12 c_6">{item.upvoteNum}</Text>
              </View>
              <View className="flex_ic message-actions-item">
                <Image className="icon14 mr4" src={iconComment} />
                <Text className="fz12 c_6">回复</Text>
              </View> */}
            </View>
            {/* {item.children?.length && (
              <View className="message-children">
                <UserComments messages={item.children} />
              </View>
            )} */}
          </View>
        </View>
      ))}
      {(!messages || messages.length === 0) && <Empty top="0%" />}
    </View>
  );
}
