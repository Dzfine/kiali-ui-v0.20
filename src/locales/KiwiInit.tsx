import KiwiIntl from 'kiwi-intl';

const locales = {
  'zh-CN': require('./zh-CN.json')
};
const intl = KiwiIntl.init('zh-CN', locales);

export { intl };
export default intl;
