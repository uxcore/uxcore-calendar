let Formatter = require('uxcore-formatter');
let Tooltip = require('uxcore-tooltip');
let classnames = require('classnames');
let i18n = require('./locale');

/**
 * code should be an object like this {'xxxx-xx-xx': 'work/leave/schedule'}
 */
let generateContentRender = (code, locale = 'zh-cn') => {
    return function contentRender(code, locale, current, value) {
        // see https://github.com/yiminghe/gregorian-calendar to get details about `current` API
        let time = current.getTime();
        let date = Formatter.date(time, 'YYYY-MM-DD');
        let type = code[date];
        if (typeof type == 'string') {
            type = [type];
        } else if (type == undefined) {
            type = [];
        }
        let tipMap = i18n[locale];
        let content = [];
        let isWork = type.indexOf('work') !== -1;
        let isLeave = type.indexOf('leave') !== -1;
        let isSchedule = type.indexOf('schedule') !== -1;
        content.push(<span key="date" className={classnames({
            'kuma-calendar-date-content': true,
            'work': isWork,
            'leave': isLeave,
            'schedule': isSchedule
        })}>{current.getDayOfMonth()}</span>);
        if (isSchedule) {
            content.push(<span key="bottom-line" className="kuma-calendar-date-decoration"></span>)
        }

        if (isWork || isLeave) {
            return <Tooltip placement="right" trigger={["hover"]} overlay={tipMap[isWork ? 'work' : 'leave']}>
                <div className="kuma-calendar-date-content-box">{content}</div>         
            </Tooltip>
        } else {
            // only one child can be passed.
            return <div className="kuma-calendar-date-content-box">{content}</div>;
        }
    }.bind(null, code, locale)
}

module.exports = {
    generateContentRender: generateContentRender
};