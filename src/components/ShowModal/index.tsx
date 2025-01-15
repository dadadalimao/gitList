import { View, Image } from '@tarojs/components';
import {
  ReactNode, useMemo,
} from 'react';
import modalSuc from '@/images/modalSuc.png';
import iconClose from '@/images/close.png';
import './index.scss';

type ModalKeys = 'ApplyAnnotationSuc' | 'Custom';
/**
 * 定义展示模态框的属性接口
 * 包括使用哪个模态框，以及可选的按钮点击事件处理函数和自定义按钮渲染
 */
interface ShowModalProps {
  size?: 'default' | 'small';
  visible: boolean;
  modal: ModalKeys;
  title?: string;
  content?: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  cancelShow?: boolean;
  className?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  onClose?: () => void
}
interface ModalConfig {
  closeIcon?: IconConfig; // 关闭图标路径，可选
  headerImg?: {
    src: string;
    width: number;
    height: number;
  }; // 头部图片配置，可选
  title?: string; // 模态框标题
  content?: string | ReactNode; // 模态框内容
  cancelShow?: boolean; // 是否显示取消按钮，默认为 undefined
  cancelText?: string; // 取消按钮文本，默认为 undefined
  confirmText?: string; // 确认按钮文本
}
interface IconConfig {
  src: string;
  width: number;
  height: number;
}

const iconCloseList: Record<'default', IconConfig> = {
  default: {
    src: iconClose,
    width: 24,
    height: 24,
  },
};

/**
 * 展示模态框的组件
 * 根据传入的modal属性选择对应的模态框配置进行展示
 *
 * modal, visible, onCancel, onConfirm
 * @returns {JSX.Element} 渲染的模态框组件
 * @example
 * <ShowModal modal="applyAnnotation" visible={visible} onConfirm={() => { }} />
 */
const ShowModal = ({
  size = 'default',
  modal, visible, title,
  cancelShow = false,
  content,
  confirmText = '确认',
  cancelText = '取消',
  className = '',
  onCancel, onConfirm, onClose,
}: ShowModalProps) => {
  /**
   * 定义一个模态框配置的集合
   * 包含不同场景下使用的模态框配置
   * Custom时可以自定义模态框内容
   */
  const modals: { [key in ModalKeys]: ModalConfig } = useMemo(() => ({
    ApplyAnnotationSuc: {
      closeIcon: iconCloseList.default,
      headerImg: {
        src: modalSuc,
        width: 200,
        height: 110,
      },
      title: '提交成功',
      content: '审核完成需1-2个工作日，请耐心等待',
      cancelShow: false,
      cancelText: '',
      confirmText: '返回上一页',
    },
    Custom: {
      title,
      content,
      cancelShow,
      cancelText,
      confirmText,
    },
  }), [title, content, cancelShow, cancelText, confirmText]);

  const config = modals[modal];

  // 渲染模态框
  return (
    <View className={`ShowModal-container ${className}`} style={{ display: visible ? 'flex' : 'none' }}>
      <view className="ShowModal-mask" />
      <View className={`ShowModal-content ${size === 'small' ? ' ShowModal-content-small' : ''}`}>
        {config?.closeIcon && <Image className="ShowModal-content-close" src={config.closeIcon.src} style={{ width: config.closeIcon.width, height: config.closeIcon.height }} onClick={() => onClose?.()} />}
        {config?.headerImg && <Image className="ShowModal-content-header-img" src={config.headerImg.src} style={{ width: config.headerImg.width, height: config.headerImg.height }} />}
        {config?.title && <View className="ShowModal-content-title">{config.title}</View>}
        {config?.content && <View className="ShowModal-content-content">{config.content}</View>}
        <View className={`ShowModal-content-btn ${config?.cancelShow ? 'ShowModal-content-btn-list' : ''}`}>
          {config?.cancelShow && (
            <View
              className="ShowModal-content-btn-cancel"
              onClick={() => onCancel?.()}
            >
              {config?.cancelText || '取消'}
            </View>
          )}
          <View
            className="ShowModal-content-btn-confirm btn_main"
            onClick={() => onConfirm?.()}
          >
            {config?.confirmText || '确定'}
          </View>
        </View>
      </View>
    </View>
  );
};

export default ShowModal;
