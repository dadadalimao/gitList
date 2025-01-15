import { View, Image, Text } from '@tarojs/components';
import './Deposit.scss';

// 导入物资图片
import Taro from '@tarojs/taro';
import { useEffect, useState } from 'react';
import workClothesImg from '@/images/feederCertification/materialWorkClothes.png';
import phoneHolderImg from '@/images/feederCertification/materialPhoneHolder.png';
import glovesImg from '@/images/feederCertification/materialGloves.png';
import sanitizerImg from '@/images/feederCertification/materialSanitizer.png';
import wipesImg from '@/images/feederCertification/materialWipes.png';
import shoeCoversImg from '@/images/feederCertification/materialShoeCovers.png';
import depositCardImg from '@/images/feederCertification/depositCard.svg';
import woffieImg from '@/images/feederCertification/woffie.svg';
import request from '@/api/apiRequest';
import { getBaseDictList } from '@/api';
import { getState } from '@/store';
import { getUrl } from '@/utils/oss';

// 保证金退还须知
const depositRefundInfo = [
  '保证金退还时不会从中扣除认证产生的费用；',
  '只可全额退还账户中保证金余额，不可分批退还；',
  '喂养员认证保证金退还即注销喂养师身份；',
  '成为喂养员后无违规行为且没有未完成的任务，退还支付的全部喂养员保证金；',
  '成为喂养员后有违规行为或仍有未完成的任务，退还账户中剩余喂养员保证金；',
];

/**
 * 缴纳押金
 */
export default function Deposit() {
  const [supplies, setSupplies] = useState<any[]>([
    {
      id: '1879451757713690626',
      code: 'PIC_FEEDER_CLOTHES',
      nameEnus: 'Work clothes',
      nameZhcn: '工作服',
      nameZhtw: '工作服',
      vals: '202501/43339a07-7898-468b-a916-20e9845ba41b',
    },
    {
      id: '1879452119489187841',
      code: 'PIC_FEEDER_HOLDER',
      nameEnus: 'Mobile phone holder',
      nameZhcn: '手机支架',
      nameZhtw: '手机支架',
      vals: '202501/5ffa1fa1-dadd-452f-bfd6-61f59b70c336',
    },
    {
      id: '1879452308773933058',
      code: 'PIC_FEEDER_GLOVES',
      nameEnus: 'PVC gloves',
      nameZhcn: 'PVC手套',
      nameZhtw: 'PVC手套',
      vals: '202501/0f911f93-94ed-4226-aae0-cb8e63520443',
    },
    {
      id: '1879452820432883714',
      code: 'PIC_FEEDER_PAPER',
      nameEnus: 'Antisepsis paper',
      nameZhcn: '消毒纸巾',
      nameZhtw: '消毒纸巾',
      vals: '202501/109449c3-f7a5-42ef-bd12-810f27ea8a3e',
    },
    {
      id: '1879453499251625985',
      code: 'PIC_FEEDER_SPRAY',
      nameEnus: 'Disinfectant spray',
      nameZhcn: '消毒喷雾',
      nameZhtw: '消毒喷雾',
      vals: '202501/c64d2818-a6b4-4d6e-858c-439bedfbcfa3',
    },
    {
      id: '1879454916834103298',
      code: 'PIC_FEEDER_SHOE',
      nameEnus: 'Shoe cover',
      nameZhcn: '无纺布鞋套',
      nameZhtw: '无纺布鞋套',
      vals: '202501/fb31d653-551f-4f98-b521-d3df8b1263d4',
    },
  ]);
  useEffect(() => {
    getBaseDictList('PIC').then((res) => {
      const list = res.data.filter((item) => item.code.indexOf('PIC_MATERIAL') !== -1);
      if (list?.length) setSupplies(list);
    });
  }, []);
  return (
    <View className="deposit-container">
      {/* 押金卡片 */}
      <View className="deposit-card flex_cc">
        <Image className="deposit-card-img wh100 block" src={depositCardImg} mode="aspectFill" />
        <Image className="deposit-card-woffie" src={woffieImg} mode="aspectFill" />

        <View className="deposit-card-content wh100">
          <View className="deposit-desc">喂养员认证保证金</View>
          <View className="deposit-subtitle">上门服务宠物 获得服务报酬</View>
        </View>

        {/* <View className="deposit-content">

        </View> */}
      </View>

      {/* 物资派发 */}
      <View className="supplies-section">
        <View className="section-title">物资派发</View>
        <View className="supplies-grid">
          {supplies.map((item) => (
            <View key={item.nameZhcn} className="supply-item">
              <Image className="supply-image" src={getUrl(item.vals)} mode="aspectFill" />
              <View className="supply-name">{item.nameZhcn}</View>
            </View>
          ))}
        </View>
      </View>

      {/* 保证金说明 */}
      <View className="deposit-info">
        <View className="info-title">喂养员认证保证金说明</View>
        <View className="info-content">
          <View>
            <Text className="highlight">【再次强调】</Text>
            喂养员认证保证金只针对
            <Text className="c_main">轻度违约行为</Text>
            ，若在服务过程中由于喂养员自身原因发生用户的
            <Text className="c_main">隐私或财产被侵犯</Text>
            等涉及法律相关问题，并不是几百元的保证金就可以解决的；如若发生恶性事件，平台会坚决走
            <Text className="c_main">法律程序</Text>
            判定击任并追责，绝不姑息！！！
          </View>
          <View>请各位喂养员严于律己！！！！</View>
        </View>
      </View>
      <View className="deposit-info mt16">
        <View className="info-title">保证金退还须知</View>
        <View className="info-content">
          <View>
            <Text className="highlight">【退还前提】</Text>
            账户中无未完成/未结算的服务订单。
          </View>
          <View className="highlight mt8">【退还须知】</View>
          {depositRefundInfo.map((item, index) => (
            <View key={item}>{`${index + 1}.${item}`}</View>
          ))}
        </View>
      </View>
      {/* 支付按钮 */}
      <View
        className="pay-button btn_main"
        onClick={async () => {
          request({
            url: `/fd/deposit/oneDeposit?memberId=${getState()?.loginMember?.id}`,
          }).then((res) => {
            console.log(res);
            // let str = '';
            // if (res.data.length === 1) {
            //   str = res.data[0].data;
            // } else {
            //   // 找到最后一个 note为 第一次缴纳押金的 data
            //   for (let i = res.data.length - 1; i >= 0; i -= 1) {
            //     if (res.data[i].note === '第一次缴纳押金的') {
            //       str = res.data[i].data;
            //       return;
            //     }
            //   }
            //   str = res.data[res.data.length - 1].data;
            //   // note: "第一次缴纳押金"
            // }
            if (!res.data.data) {
              Taro.showToast({
                title: '支付订单错误，请联系客服',
                icon: 'none',
              });
              return;
            }
            const data = JSON.parse(res.data.data);
            Taro.requestPayment({
              timeStamp: data.timeStamp,
              nonceStr: data.nonceStr,
              package: data.packageVal,
              signType: data.signType,
              paySign: data.paySign,
              success: () => {
                Taro.reLaunch({
                  url: '/pages/paySuccess/index?type=feederCertification',
                });
              },
            });
          });

          // Taro.navigateTo({
          //   url: '/pages/paySuccess/index?type=feederCertification',
          // });
        }}
      >
        去缴费
      </View>
    </View>
  );
}
