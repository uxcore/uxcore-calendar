const LANG_PACK = {
  'zh-cn': {
    work: '上班',
    locale: 'zh-cn',
    leave: '休假',
    am: '上午',
    pm: '下午',
    now: '今天',
    time: '日',
    week: '周',
    close: '关闭',
    placeholder: '请选择日期'
  },
  'zh-hk': {
    work: '上班',
    locale: 'zh-hk',
    leave: '休假',
    am: '上午',
    pm: '下午',
    now: '今天',
    time: '日',
    week: '周',
    close: '關閉',
    placeholder: '請選擇日期'
  },
  'en-us': {
    work: 'work',
    leave: 'leave',
    locale: 'en-us',
    am: 'AM',
    pm: 'PM',
    now: 'now',
    time: 'date',
    week: 'week',
    close: 'close',
    placeholder: 'Please select date'
  },
  'pl-pl': {
    work: 'zadanie',
    leave: 'porzuć',
    locale: 'pl',
    am: 'AM',
    pm: 'PM',
    now: 'NOW',
    time: 'DATE',
    week: 'WEEK',
    close: 'close',
    placeholder: 'Please select date'
  },
};

LANG_PACK.en = LANG_PACK['en-us'];
LANG_PACK.pl = LANG_PACK['pl-pl'];

LANG_PACK['en_US'] = LANG_PACK['en-us'];
LANG_PACK['zh_CN'] = LANG_PACK['zh-cn'];

export default LANG_PACK;
