/* eslint-disable @typescript-eslint/quotes */
import { View, Image, Button, Input, Textarea, Text } from '@tarojs/components';
import Taro, { useLoad, setNavigationBarTitle } from '@tarojs/taro';
import './index.scss';
import { useContext, useState } from 'react';
import rightImg from '@/images/right.png';
import AlertPage from '@/components/AlertPage';
import Avatar from '@/components/Avatar';
import { getUrl, ossUpload } from '@/utils/oss';
import { logout } from '@/api/member';
import { getHideTel } from '@/utils/utils';
import UploadImg from '@/components/UploadImg';
import { basicInfo, feederInfo } from '@/utils/data';
import { getState, myContext } from '@/store';
import request from '@/api/apiRequest';

export default function Index() {
  /** 个人信息 */
  const [userInfo, setUserInfo] = useState<any>({});
  /** 性别 */
  const [sexOpts, setSexOpts] = useState<any>({});
  /** 头像 */
  const [pic, setPic] = useState<any>();
  /** 新头像 */
  const [newPic, setNewPic] = useState<any>();
  const { state } = useContext(myContext);
  // const state = { identity: 'feeder' };
  /** 当前选择宠物类别的合集 */
  const [nowKinds, setNowKinds] = useState<any>([]);
  /** 宠物合照 */
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  /** 技能列表 */
  const [skillList, setSkillList] = useState<any>([]);
  /** 专业技能选项 */
  const [skillOpts, setSkillOpts] = useState<any>([]);
  const [skillOpts2, setSkillOpts2] = useState<any>({});

  useLoad(() => {
    setNavigationBarTitle({ title: '个人信息' });
    /** 获取性别选项 */
    request({
      url: '/base/dict/getList?code=MEMBER_GENDER',
      method: 'GET',
    }).then((res) => {
      const result: any = {};
      res.data.forEach((item: any) => {
        result[item.code] = item.nameZhcn;
      });
      setSexOpts(result);
    });
    /** 获取专业技能选项 */
    request({
      url: '/base/dict/getList?code=FEEDER_SKILL',
      method: 'GET',
    }).then((res) => {
      const result: any = [];
      const result2: any = {};
      res.data.forEach((item: any) => {
        result.push({ value: item.code, label: item.nameZhcn });
        result2[item.code] = item.nameZhcn;
      });
      setSkillOpts(result);
      setSkillOpts2(result2);
    });
    /** 获取类别 */
    request({
      url: '/pt/kind/allNotDel',
      method: 'GET',
    }).then((res) => {
      if (state.identity === 'feeder') {
        request({
          url: `/fd/feeder/info?id=${getState()?.loginMember.id}`,
          // url: `/fd/feeder/info?id=1870009719888941057`,
          method: 'GET',
        }).then((res2) => {
          setUserInfo({
            ...res2.data,
            nickName: res2?.data?.member?.nickName,
            phoneNum: res2?.data?.member?.phoneNum,
            sex: res2?.data?.member?.sex,
          });
          setPic(res2?.data?.avatar);
          /** 专业技能 */
          setSkillList(res2?.data?.fdSpecialList ?? []);
          /** 服务类别 */
          const t = res2?.data?.typeOfServiceList ?? [];
          const result: any = [];
          res.data.forEach((item) => {
            if (t.includes(item.id)) {
              result.push({ ...item, isCheck: true });
            } else {
              result.push({ ...item, isCheck: false });
            }
          });
          setNowKinds(result);
        });
      } else {
        request({
          url: '/mem/member/info',
          method: 'GET',
        }).then((res3) => {
          setUserInfo(res3.data);
          setPic(res3.data.pic);
        });
      }
    });
  });

  return (
    <>
      <View className="myInfo-container">
        <View className="top flex_ccc pt20">
          <Avatar
            src={pic ? getUrl(pic) : undefined}
            id={undefined}
            onChange={(e) => {
              setNewPic(e);
            }}
          />
        </View>
        <View className="list fz14">
          {(state.identity === 'feeder' ? feederInfo : basicInfo)?.map((item) => (
            <View
              className={`list-item ${item.key === 'fdSpecialList' && 'skill-item'}`}
              style={{ alignItems: item.key === 'profile' ? 'flex-start' : 'center' }}
            >
              <View className="name flex_csb">
                <View>{item.label}</View>
                <View className="line" />
              </View>
              {item.key === 'fdSpecialList' ? (
                <>
                  {!skillList.length
                    ? null
                    : skillList?.map((item2) => (
                        <View className="skill-items" key={item2}>
                          {skillOpts2[item2]}
                          {/* <View className="skill-items-del">×</View> */}
                        </View>
                      ))}
                  <View
                    className="skill-items"
                    onClick={(e) => {
                      e.stopPropagation();
                      const re: string[] = [];
                      skillOpts.forEach((ele) => {
                        re.push(ele.label);
                      });
                      Taro.showActionSheet({
                        itemList: re,
                        success(result) {
                          const t: any = skillList;
                          if (skillList.includes(skillOpts[result.tapIndex].value)) {
                            Taro.showToast({ title: '该标签已经添加', icon: 'none' });
                            return;
                          }
                          t.push(skillOpts[result.tapIndex].value);
                          setUserInfo((pre) => ({
                            ...pre,
                            fdSpecialList: t,
                          }));
                        },
                      });
                    }}
                  >
                    +新建标签
                  </View>
                </>
              ) : (
                <View className={`${item.key === 'profile' ? 'intro-right' : ''} right`}>
                  {item.type === 'text' && (
                    <Input
                      className="right-view"
                      value={userInfo[item.key]}
                      maxlength={item.max || 200}
                      placeholder={item.plo}
                      onInput={(e) => {
                        setUserInfo((pre) => ({
                          ...pre,
                          [item.key]: e.detail.value,
                        }));
                      }}
                    />
                  )}
                  {item.key === 'phoneNum' && (
                    <View className="c_9">{getHideTel(userInfo[item.key])}</View>
                  )}
                  {item.key === 'sex' && (
                    <View
                      className="flex_csb wh100"
                      onClick={() => {
                        const re: string[] = [];
                        Object.keys(sexOpts).forEach((key) => {
                          re.push(sexOpts[key]);
                        });
                        Taro.showActionSheet({
                          itemList: re,
                          success(result) {
                            setUserInfo((pre) => ({
                              ...pre,
                              sex:
                                result.tapIndex === 0
                                  ? 'MEMBER_GENDER_MALE'
                                  : 'MEMBER_GENDER_FEMALE',
                            }));
                          },
                        });
                      }}
                    >
                      <View>{sexOpts !== undefined ? sexOpts[userInfo[item.key]] : ''}</View>
                      <Image className="icon18" src={rightImg} />
                    </View>
                  )}
                  {item.key === 'serviceType' && (
                    <View className="list-item-radio">
                      {nowKinds.map((option) => (
                        <View
                          onClick={() => {
                            const d: any = [];
                            nowKinds.forEach((ele) => {
                              if (ele.id === option.id) {
                                d.push({ ...ele, isCheck: !ele.isCheck });
                              } else {
                                d.push({ ...ele, isCheck: ele.isCheck });
                              }
                            });
                            setNowKinds(() => d);
                            const c: any = [];
                            d.forEach((ele) => {
                              if (ele.isCheck) {
                                c.push(ele.id);
                              }
                            });
                            setUserInfo((pre) => ({
                              ...pre,
                              typeOfServiceList: c,
                            }));
                          }}
                          className="list-item-radio-item"
                        >
                          <View
                            className={`flex_cc ${option.isCheck ? 'list-item-selected' : 'list-item-select'}`}
                          >
                            <Image
                              className="list-item-select-img"
                              src={`${process.env.STATIC}${option.icon}`}
                            />
                          </View>
                          <View>{option.name}</View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
          {/* 爱宠合照 */}
          {state.identity === 'feeder' && (
            <>
              <View className="pic intro-title">个人介绍</View>
              <View className="intro">
                <Textarea
                  className="intro-text"
                  placeholder="请输入个人介绍，最多150字"
                  maxlength={150}
                  showCount
                  value={userInfo.profile}
                  onInput={(e) => {
                    setUserInfo((pre) => ({
                      ...pre,
                      profile: e.detail.value,
                    }));
                  }}
                />
              </View>
              <View className="pic">与爱宠合照</View>
              <View className="UploadImg">
                <UploadImg imgUrl={imgUrl} setImgUrl={setImgUrl} max={9} />
              </View>
            </>
          )}
        </View>
      </View>
      {/* contentStyle={{ background: 'transparent' }} */}
      <AlertPage>
        <>
          <Button
            className={`resetBtn ${state.identity === 'feeder' ? 'btn_feeder' : 'btn_main'}`}
            onClick={async () => {
              let dataPic = pic;
              if (newPic) {
                dataPic = await ossUpload(newPic);
                setPic(dataPic);
                setNewPic(undefined);
              }
              if (state.identity === 'feeder') {
                /** 服务类型为空 */
                const m: any = [];
                nowKinds.forEach((item) => {
                  if (item.isCheck === true) {
                    m.push(item);
                  }
                });
                if (!m.length) {
                  Taro.showToast({ title: '服务类型不能为空', icon: 'none' });
                  return;
                }
                const t = { ...userInfo };
                t.petPicList = imgUrl;
                t.fdSpecialList = skillList;
                t.avatar = pic;
                t.fdSpecialList = skillList;
                t.member = {
                  id: userInfo.id,
                  nickName: userInfo.nickName,
                  phoneNum: userInfo.phoneNum,
                  sex: userInfo.sex,
                };
                delete t.nickName;
                delete t.phoneNum;
                delete t.sex;
                console.log('t', t);
                request({
                  url: '/fd/feeder/modify',
                  method: 'POST',
                  data: t,
                  loading: '正在保存',
                }).then((res) => {
                  Taro.showToast({ title: '保存成功', icon: 'success' });
                  Taro.navigateBack();
                });
                return;
              }
              console.log('userInfo', userInfo);
              request({
                url: '/mem/member/updateInfo',
                method: 'POST',
                data: { ...userInfo },
                loading: '正在保存',
              }).then((res) => {
                Taro.showToast({ title: '保存成功', icon: 'success' });
                Taro.navigateBack();
              });
            }}
          >
            保存
          </Button>
          <Button
            className="resetBtn btn_plain btn_max mt18"
            onClick={() => {
              Taro.showActionSheet({
                itemList: ['确定退出'],
                success(result) {
                  if (result.tapIndex === 0) {
                    logout();
                    Taro.showToast({ title: '退出成功', icon: 'success' });
                    setTimeout(() => {
                      Taro.switchTab({
                        url: '/pages/petServices/index',
                      });
                    }, 1500);
                  }
                },
              });
            }}
          >
            退出登录
          </Button>
        </>
      </AlertPage>
    </>
  );
}
