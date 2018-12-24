import React from 'react';
import Formatter from 'uxcore-formatter';
import Tooltip from 'uxcore-tooltip';
import classnames from 'classnames';
import i18n from './locale';

/**
 * code should be an object like this {'xxxx-xx-xx': 'work/leave/schedule'}
 */
const generateContentRender = (str, lang = 'zh-cn') => function contentRender(code, locale, current) {
  // see https://github.com/yiminghe/gregorian-calendar to get details about
  // `current` API
  const time = current.getTime();
  const date = Formatter.date(time, 'YYYY-MM-DD');
  let type = code[date];
  if (typeof type === 'string') {
    type = [type];
  } else if (type === undefined) {
    type = [];
  }
  const tipMap = i18n[locale];
  const content = [];
  const isWork = type.indexOf('work') !== -1;
  const isLeave = type.indexOf('leave') !== -1;
  const isSchedule = type.indexOf('schedule') !== -1;

  content.push(
    <span
      key="date"
      className={classnames({
        'kuma-calendar-date-content': true, work: isWork, leave: isLeave, schedule: isSchedule,
      })}
    >
      {current.getDayOfMonth()}
    </span>,
  );
  if (isSchedule) {
    content.push(<span key="bottom-line" className="kuma-calendar-date-decoration" />);
  }
  if (isWork || isLeave) {
    return (
      <Tooltip
        placement="right"
        trigger={['hover']}
        overlay={tipMap[isWork
          ? 'work'
          : 'leave']}
      >
        <div className="kuma-calendar-date-content-box">
          {content}
        </div>
      </Tooltip>
    );
  }
  // only one child can be passed.
  return (
    <div className="kuma-calendar-date-content-box">
      {content}
    </div>
  );
}.bind(null, str, lang);

function getCalendarContainer() {
  const c = document.createElement('div');
  c.className = 'uxcore';
  document
    .body
    .appendChild(c);
  return c;
}

/**
 * for forward compatability
 */
function generalizeFormat(format) {
  return format.replace(/y|d/g, value => value.toUpperCase());
}

export default {
  generateContentRender,
  getCalendarContainer,
  generalizeFormat,
};
