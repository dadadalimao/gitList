/* eslint-disable import/prefer-default-export */
import orderWaitingForArrivalImg from '@/images/mine/orderWaitingForArrival.png';
import orderInProgressImg from '@/images/mine/orderInProgress.png';
import orderUnpaidImg from '@/images/mine/orderUnpaid.png';
import orderWaitingForAcceptanceImg from '@/images/mine/orderWaitingForAcceptance.png';
import orderWaitingForApprovalImg from '@/images/mine/orderWaitingForApproval.png';

/** 宠物主订单 */
export const orderCard = [
  {
    title: '待付款',
    icon: orderUnpaidImg,
    key: 'Unpaid',
    url: '/pages/myOrder/index?nowKey=Unpaid',
  },
  {
    title: '待接单',
    icon: orderWaitingForAcceptanceImg,
    key: 'WaitingForAcceptance',
    url: '/pages/myOrder/index?nowKey=WaitingForAcceptance',

  },
  {
    title: '待上门',
    icon: orderWaitingForArrivalImg,
    key: 'WaitingForArrival',
    url: '/pages/myOrder/index?nowKey=WaitingForArrival',

  },
  {
    title: '进行中',
    icon: orderInProgressImg,
    key: 'InProgress',
    url: '/pages/myOrder/index?nowKey=InProgress',

  },
  {
    title: '待审核',
    icon: orderWaitingForApprovalImg,
    key: 'WaitingForApproval',
    url: '/pages/myOrder/index?nowKey=WaitingForApproval',
  },
];
/** 喂养员订单 */
export const feederOrderCard = [
  {
    title: '待接单',
    icon: orderWaitingForAcceptanceImg,
    key: 'WaitingForAcceptance',
    url: '/pages/myOrder/index?nowKey=WaitingForAcceptance',

  },
  {
    title: '待上门',
    icon: orderWaitingForArrivalImg,
    key: 'WaitingForArrival',
    url: '/pages/myOrder/index?nowKey=WaitingForArrival',

  },
  {
    title: '进行中',
    icon: orderInProgressImg,
    key: 'InProgress',
    url: '/pages/myOrder/index?nowKey=InProgress',

  },
  {
    title: '待审核',
    icon: orderWaitingForApprovalImg,
    key: 'WaitingForApproval',
    url: '/pages/myOrder/index?nowKey=WaitingForApproval',
  },
];
/** 宠物主信息 */
export const basicInfo = [
  {
    label: '昵称',
    key: 'nickName',
    type: 'text',
    plo: '请输入昵称',
    max: 14,
  },
  {
    label: '手机号',
    key: 'phoneNum',
    type: '',
    plo: '请输入手机号',

  },
  {
    label: '性别',
    key: 'sex',
    plo: '请选择性别',

  },
];
/** 喂养员信息 */
export const feederInfo = [
  {
    label: '昵称',
    key: 'nickName',
    type: 'text',
    max: 14,
    plo: '请输入昵称',

  },
  {
    label: '手机号',
    key: 'phoneNum',
    type: 'text',
    plo: '请输入手机号',

  },
  {
    label: '性别',
    key: 'sex',
    plo: '请选择性别',

  },
  {
    label: '服务类型',
    key: 'serviceType',

  },
  {
    label: '专业技能',
    key: 'fdSpecialList',

  },
];
