import { language } from '@/locales';
import { getBaseDictList } from '.';

// 定义更明确的baseDict类型结构，假设data的结构包含code、nameEnus、nameZhcn、nameZhtw等属性
type DictData = {
  label: string;
  value: string;
};
type ReqDictData = {
  code: string;
  nameEnus: string;
  nameZhcn: string;
  nameZhtw: string;
};
const baseDict = {
  MAP_TYPE: null,
  MAP_AUDIT: null,
};

const getBaseDictValue = async (dictKey: string): Promise<DictData[]> => {
  if (baseDict[dictKey]) return baseDict[dictKey];
  const { data } = await getBaseDictList(dictKey);
  console.log('🚀 ~ getBaseDictValue ~ language:', language);
  const baseDictI18n = (n: ReqDictData) => {
    if (language === 'en') {
      return { value: n.code, label: n.nameEnus };
    } if (language === 'zh-CN') {
      return { value: n.code, label: n.nameZhcn };
    } if (language === 'zh-TW') {
      return { value: n.code, label: n.nameZhtw };
    }
    return { value: n.code, label: n.nameEnus }; // 默认返回英文，可根据实际需求调整
  };
  baseDict[dictKey] = data.map((item) => baseDictI18n(item));
  return baseDict[dictKey];
};
/**
 * 格式转为valueEnum格式
 */
export const convertToValueEnum = (arr: DictData[]): Record<string, string> => {
  return arr.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {} as Record<string, string>);
};
/**
 * 字典-宠物友好地图-类型
 */
export const baseDictMapType = async () => getBaseDictValue('MAP_TYPE');

/**
 * 字典-宠物友好地图-审核
 */
export const baseDictMapAudit = async () => getBaseDictValue('MAP_AUDIT');
