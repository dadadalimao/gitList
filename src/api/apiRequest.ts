import Taro from '@tarojs/taro';

const hideLoading = (data) => {
  if (data.loading && typeof data.loading === 'string' && data.loading.trim() !== '') {
    Taro.hideLoading();
  }
};
/**
 * 封装网络请求，方便处理加载提示，也可以添加其他配置做业务处理
 *
 * @param {object} data - 请求配置对象
 * @param {string} [data.loading] - 加载提示文本
 * @param {boolean} [data.failToast] - 失败显示err.message
 * @returns {Promise<any>} - 返回一个Promise对象，解析为请求响应数据或拒绝为错误信息
 */
export default async function request(data) {
  // 显示加载提示
  if (data.loading && typeof data.loading === 'string' && data.loading.trim() !== '') {
    Taro.showLoading({
      title: data.loading,
      mask: true,
    });
  }

  // 复制请求配置并移除加载提示配置
  const req = { ...data };
  delete req.loading;
  delete req.failToast;

  try {
    // 发起网络请求
    const res = await Taro.request({ ...req });
    hideLoading(data);
    return res;
  } catch (err) {
    console.log('🚀 ~ request ~ err:', err.code, err.message);
    hideLoading(data);
    if (data.failToast) {
      Taro.showToast({
        title: err.message || '请求失败，请重试',
        icon: 'none',
      });
    }
    // 记录错误日志
    return await Promise.reject(err);
  }
}
