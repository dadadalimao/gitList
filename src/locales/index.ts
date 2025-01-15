import Taro from '@tarojs/taro';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import formats from './formats';

// import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init
import en from './en.json';
import zhCN from './zh-CN.json';

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  // .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  // .use(LanguageDetector)
  // .use(Backend)
  // .use(LanguageDetector) // 嗅探当前浏览器语言
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        translation: en,
      },
      'zh-CN': {
        translation: zhCN,
      },
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: (value, format, lng) => {
        if (format && formats[format]) {
          return formats[format].apply(null, [value, lng]);
        }
        return value;
      },
    },
  });

export default i18n;

/**
 * 支持的语言
 */
export const SUPPORT_LANGUAGES = [
  {
    code: 'zh-CN',
    display: '简体中文',
  },
  {
    code: 'en',
    display: 'English',
  },
];

/**
 * 获取当前语言
 * @returns {string} 当前语言
 */
export const getLanguage = () => {
  return 'zh-CN';
  const supportLangs = ['en', 'zh-CN'];
  const sysLang = navigator.language || Taro.getSystemInfoSync().language.replace(/_/g, '-');

  if (supportLangs.indexOf(sysLang) >= 0) {
    return sysLang;
  }
  if (sysLang.startsWith('zh')) {
    return 'zh-CN';
  }
  return 'en';
};
export const language = getLanguage();
/**
 * 获取语言详情
 * @param code 语言编码
 * @returns 语言详情
 */
export const getLanguageInfoByCode = (code: string) => SUPPORT_LANGUAGES
  .find((item) => item.code === code);
