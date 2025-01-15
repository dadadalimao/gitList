/**
 * 由于Android版本的bug，所以格式化的方法单独写一下
 * @param value 原始值
 * @returns 格式化之后的值
 */
const formatNum = (value: any) => {
  if (typeof value === 'number') {
    return value.toString().replace(/\d+/, (n) => n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
  }
  return value;
};

const priceWithUnit = (value: any, lng: string) => {
  if (lng.startsWith('en')) {
    const amount = (value as number);
    if (amount >= 1000000000) {
      return `${amount / 1000000000}B`;
    }
    if (amount >= 1000000) {
      return `${amount / 1000000}M`;
    }
    if (amount >= 1000) {
      return `${amount / 1000}K`;
    }
    return value;
  }
  return `${(value as number) / 10000}`;
};

const priceRange = (value: any, lng: string) => {
  if (lng.startsWith('en')) {
    return priceWithUnit((value as number * 10 * 1000), lng);
  }
  return value;
};

const simplifyPrice = (value: any, lng: string) => {
  const amount = parseInt(value, 10);
  if (lng.startsWith('en')) {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(0)}B`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(0)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}K`;
    }
    return value;
  }
  return `${(amount / 10000).toFixed(0)}`;
};

export default {
  formatNum,
  priceRange,
  priceWithUnit,
  simplifyPrice,
};
