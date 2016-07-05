let locale = {
    'zh-cn': {
        'work': '上班',
        'leave': '休假'
    },
    'en-us': {
        'work': 'work',
        'leave': 'leave'
    },
    'pl-pl': {
        'work': 'zadanie',
        'leave': 'porzuć'
    }
}

locale['en'] = locale['en-us'];
locale['pl'] = locale['pl-pl'];

module.exports = locale;