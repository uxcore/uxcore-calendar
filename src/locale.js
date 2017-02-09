const locale = {
  'zh-cn': {
    work: '上班',
    leave: '休假',
    am: '上午',
    pm: '下午',
  },
  'en-us': {
    work: 'work',
    leave: 'leave',
    am: 'AM',
    pm: 'PM',
  },
  'pl-pl': {
    work: 'zadanie',
    leave: 'porzuć',
    am: 'AM',
    pm: 'PM',
  },
};

locale.en = locale['en-us'];
locale.pl = locale['pl-pl'];

module.exports = locale;
