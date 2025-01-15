import Taro from '@tarojs/taro';
import React, {
  Reducer, useMemo, useReducer, Dispatch, ReducerAction,
} from 'react';

/**
 * 使用示例
 *
 * initializeValue中添加状态
 * initializeValue：{
 *   variety:'默认值'
 * }
 *
 * actions中添加动作
 * actions:{
 *   setVariety: 'variety'  //方法 或 对应initializeValue状态键
 * }
 *
 * 获取状态
 * const variety = getState()?.variety;
 *
 * 修改状态
 * dispatch({ type: 'setVariety', payload: undefined });
 */
/** 状态 */
type State = {
  loginMember?: any;
  variety?: any;
  isLogin?: boolean;
  identity: 'owner' | 'feeder'; // 用户身份类型：宠物主或喂养员
  chooseAddress: any;
  quickLoginInfo: any; // 快速登录信息
  orderPetList: any[]; // 订单宠物列表
};
/** 状态key */
type StateKey = keyof typeof initializeValue;
/** 动作 */
type Action = {
  type: keyof typeof actions;
  payload?: any;
};
/** 动作key */
type ActionsKeys =
  'member.isLogin'
  | 'member.update'
  | 'member.logout'
  | 'setVariety'
  | 'setIdentity'
  | 'setChooseAddress'
  | 'setQuickLoginInfo'
  | 'setOrderPetList';
/** 动作映射 */
type ActionsType = {
  [K in ActionsKeys]: StateKey | ((state: State, action: Action) => State);
};

type ProviderValue = {
  state: State;
  dispatch: Dispatch<ReducerAction<Reducer<State, Action>>>;
};
/** 初始状态 */
const initializeValue: State = {
  variety: undefined,
  isLogin: false, // 是否需要登录(弹出登录框)
  identity: Taro.getStorageSync('identity') || 'owner', // 从本地存储获取身份，默认为宠物主
  chooseAddress: undefined,
  quickLoginInfo: undefined, // 快速登录信息
  orderPetList: [], // 订单选择的宠物列表
};

const myContext = React.createContext<ProviderValue>({
  dispatch: () => { },
  state: initializeValue,
});
/**
 * 定义了一个动作映射对象，用于映射动作类型到相应的处理函数或状态键,设置状态键会使用actionsSetData处理
 */
const actions: ActionsType = {
  'member.isLogin': 'isLogin',
  'member.update': 'loginMember',
  'member.logout': (state) => ({ ...state, loginMember: undefined }),
  setVariety: 'variety',
  setIdentity: (state, action) => {
    // 将新的身份信息保存到本地存储
    // Taro.setStorageSync('identity', action.payload);
    // 更新 store 中的身份状态
    return { ...state, identity: action.payload };
  },
  setChooseAddress: 'chooseAddress',
  setQuickLoginInfo: 'quickLoginInfo',
  setOrderPetList: 'orderPetList',
};

/**
 * 定义了一个用于设置状态数据的通用动作处理函数
 */
const actionsSetData = (state, action, key: StateKey) => ({ ...state, [key]: action.payload });
/**
 * 定义了reducer函数，用于根据动作更新状态
 * @param state 当前状态
 * @param action 动作对象，包含type和payload属性
 * @returns 返回新的状态对象
 */
function reducer(state: State, action: Action): State {
  // 检查是否有对应的动作处理函数或状态键
  if (actions[action.type]) {
    const actionHandler = actions[action.type];
    // 如果动作处理函数是一个函数，则调用它并传入当前状态和动作对象
    if (typeof actionHandler === 'function') {
      return actionHandler(state, action);
    }
    // 如果动作处理函数是一个字符串，则使用它作为键来更新状态
    if (typeof actionHandler === 'string') {
      return actionsSetData(state, action, actionHandler);
    }
  }
  // 如果没有找到对应的动作处理函数或状态键，则返回当前状态
  return state;
}

// eslint-disable-next-line import/no-mutable-exports
let outDispatch: Dispatch<ReducerAction<Reducer<State, Action>>> | undefined;
// eslint-disable-next-line import/no-mutable-exports
let outState: State | undefined;

function ContextProvider(props) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, initializeValue);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  outDispatch = value.dispatch;
  outState = value.state;

  return <myContext.Provider value={value}>{props.children}</myContext.Provider>;
}

function dispatch(action: Action) {
  if (outDispatch) {
    outDispatch(action);
  }
}

function getState() {
  return outState;
}

export {
  reducer, myContext, ContextProvider, dispatch, getState,
};
