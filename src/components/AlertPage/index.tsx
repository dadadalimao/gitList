import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import './index.scss';
import {
  useEffect, useImperativeHandle, forwardRef, useRef,
  CSSProperties,
} from 'react';

/**
 * AlertPage 组件参数接口
 */
interface AlertPageProps {
  /** 控制弹窗显示/隐藏 */
  show?: boolean;
  /** 是否显示遮罩层 */
  mask?: boolean;
  /** 遮罩层颜色，支持 rgba */
  maskColor?: string;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 是否显示顶部横线 */
  topLine?: boolean;
  /** 点击遮罩层是否关闭弹窗 */
  tapMaskHide?: boolean;
  /** 弹窗内容区域的样式 */
  contentStyle?: string | CSSProperties;
  /** 弹窗的 z-index 值 */
  zIndex?: string;
  /** 弹窗关闭时的回调函数 */
  onClose?: () => void;
  /** 组件加载完成时的回调函数 */
  onLoad?: (ref: any) => void;
  /** 点击头部区域的回调函数 */
  onHeaderClick?: () => void;
  /** 弹窗内容 */
  children?: React.ReactNode;
}

/** 选择器查询返回的 DOM 信息类型 */
type SelectorQueryDOM =
  | Taro.NodesRef.BoundingClientRectCallbackResult
  | Taro.NodesRef.BoundingClientRectCallbackResult[];

/**
 * AlertPage 弹窗组件
 *
 * 用于显示模态弹窗，支持自定义内容、遮罩层、关闭按钮等功能
 * @param props - 组件属性
 * @param ref - 父组件传入的 ref
 */
const AlertPage = forwardRef<any, AlertPageProps>(
  (
    {
      show = true,
      mask = false,
      maskColor = 'rgba(51, 51, 51, 0.3)',
      showClose = false,
      topLine = false,
      tapMaskHide = true,
      contentStyle = '',
      zIndex = '1000',
      onClose,
      onLoad,
      onHeaderClick,
      children,
    },
    ref,
  ) => {
    // 组件加载完成时触发 onLoad 回调
    useEffect(() => {
      if (onLoad) {
        onLoad({ ref: null });
      }
    }, [onLoad]);

    /**
     * 关闭弹窗的处理函数
     * @param type - 关闭类型，'tapMask' 表示点击遮罩层关闭
     */
    const close = (type?: string) => {
      if (!tapMaskHide && type === 'tapMask') {
        console.log('tapMask');
        return;
      }
      if (onClose) {
        onClose();
      }
    };

    /**
     * 获取弹窗内容区域高度
     * @returns Promise<SelectorQueryDOM>
     */
    const getContentHeight = async () => {
      return new Promise<SelectorQueryDOM>((resolve, reject) => {
        const query = Taro.createSelectorQuery();
        query
          .select('.AlertPage-content')
          .boundingClientRect((res) => {
            if (res) {
              resolve(res);
            } else {
              reject(new Error('Failed to get bounding client rect'));
            }
          })
          .exec();
      });
    };

    // 存储获取内容高度的函数引用
    const contentHeightRef = useRef<() => Promise<SelectorQueryDOM>>();

    // 向父组件暴露获取内容高度的方法
    useImperativeHandle(ref, () => ({
      getContentHeight: contentHeightRef.current,
    }));

    contentHeightRef.current = getContentHeight;

    return (
      <View className="AlertPage-container">
        <View className={`AlertPage ${show ? 'AlertPage-active' : ''}`} style={{ zIndex }}>
          {/* 遮罩层 */}
          <View
            className={`AlertPage-mask ${mask ? 'AlertPage-mask-active' : ''}`}
            style={{ background: maskColor }}
            onClick={() => close('tapMask')}
          />
          {/* 弹窗内容区域 */}
          <View className="AlertPage-content" style={contentStyle}>
            {/* 弹窗头部 */}
            <View
              className="AlertPage-content-header"
              style={{
                paddingBottom: topLine ? '12px' : '0',
              }}
              onClick={onHeaderClick}
            >
              {topLine && <View className="AlertPage-content-topLine" />}
            </View>
            {/* 关闭按钮 */}
            {showClose && (
              <Image
                onClick={() => {
                  close();
                }}
                className="icon_close"
                src="@imgs/icon_close.png"
                mode="scaleToFill"
              />
            )}
            {/* 弹窗内容插槽 */}
            <View className="AlertPage-slot">
              {children}
            </View>
            <View className="AlertPage-bottom" />
          </View>
        </View>
      </View>
    );
  },
);

export default AlertPage;
