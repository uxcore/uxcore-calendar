import React from 'react';
import Formatter from 'uxcore-formatter';
import Tooltip from 'uxcore-tooltip';
import classnames from 'classnames';
import i18n from './locale';
import moment from 'moment';
import sortBy from 'lodash/sortBy';
// import Event from './Events';
/**
 * code should be an object like this {'xxxx-xx-xx': 'work/leave/schedule'}
 */
const generateContentRender = (str, lang = 'zh-cn') =>
  function contentRender(code, locale, current) {
    // see https://github.com/yiminghe/gregorian-calendar to get details about `current` API
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
          'kuma-calendar-date-content': true,
          work: isWork,
          leave: isLeave,
          schedule: isSchedule,
        })}
      >
        {current.getDayOfMonth()}
      </span>
    );
    if (isSchedule) {
      content.push(<span key="bottom-line" className="kuma-calendar-date-decoration" />);
    }
    if (isWork || isLeave) {
      return (
        <Tooltip placement="right" trigger={['hover']} overlay={tipMap[isWork ? 'work' : 'leave']}>
          <div className="kuma-calendar-date-content-box">{content}</div>
        </Tooltip>
      );
    }
    // only one child can be passed.
    return <div className="kuma-calendar-date-content-box">{content}</div>;
  }.bind(null, str, lang);

function getCalendarContainer() {
  const c = document.createElement('div');
  c.className = 'uxcore';
  document.body.appendChild(c);
  return c;
}

/**
 * for forward compatability
 */
function generalizeFormat(format) {
  return format.replace(/y|d/g, value => value.toUpperCase());
}
function getTime(props) {
  let { startHour, value } = props;
  startHour = startHour ? parseInt(startHour) : 9;
  return moment(value)
    .hour(startHour)
    .minute(0);
}
function getTimeLine(props, current) {
  const { prefixCls, gapMinute } = props;
  let hour = moment(current).hour();
  let minute = moment(current).minute() || 0;
  hour = hour > 9 ? hour : `0${hour}`;
  minute = minute > 9 ? minute : `0${minute}`;
  const prefixTime = hour > 12 ? 'pm' : 'am';
  let selected = hour === moment().hour();
  selected = selected && moment().minute() >= parseInt(minute);
  selected = selected && moment().minute() < gapMinute + parseInt(minute);

  return (
    <td className={`${prefixCls}-time-panel`} key={current}>
      <div
        className={classnames({
          [`${prefixCls}-timeline-now`]: selected,
        })}
        key={current}
      >
        <div className="cell-number">{`${hour}:${minute} ${prefixTime}`}</div>
      </div>
    </td>
  );
}
function isRange(sourceDate, targetDate) {
  let { sourceStart, sourceEnd } = sourceDate;
  const { targetStart, targetEnd } = targetDate;

  if (sourceStart <= sourceEnd) {
    if (sourceEnd > targetEnd) {
      sourceEnd = targetEnd;
    }
    if (sourceStart > targetStart) {
      sourceStart = targetStart;
    }
    if (sourceStart <= targetStart && sourceEnd <= targetEnd) {
      return true;
    }
  }
  return false;
}
function sortByRender(events) {
  return sortBy(events, e => moment(e.start).valueOf());
}
/**
 * is in same row
 */
function inSameRow(target, source) {
  if (!target || !source) {
    return false;
  }
  const isLt =
    moment(source.start).isBefore(moment(source.start)) &&
    moment(source.start).isAfter(moment(target.end));
  const isEq =
    moment(source.start).isSame(moment(source.start)) &&
    moment(source.end).isSame(moment(source.end));
  return isLt || isEq;
}
/**
 * 获取当前日期在月面板的第几行
 */
function getDiffTop(start) {
  const firstDateOfMonth = moment(+new Date(start)).startOf('month');
  const diffDate = firstDateOfMonth.day();
  const firstDayOfMonthPanel =
    firstDateOfMonth.subtract(diffDate - 1).date() - moment(start).date();
  return Math.floor(Math.abs(firstDayOfMonthPanel) / 7);
}
/**
 * handle events is overlap
 *
 */
function handleEvents(events, opts) {
  let containerEvents = [];
  let wraperHtml = {};
  const { type } = opts;
  for (let i = 0, len = events.length; i < len; i++) {
    let event = events[i];
    const { start, end, isColspan } = event;
    const startKey = moment(start).format('YYYY-MM-DD');
    const endKey = moment(end).format('YYYY-MM-DD');
    const monthTop = isColspan ? getDiffTop(start) : `${startKey}~${endKey}`;
    if (!wraperHtml[monthTop]) {
      wraperHtml[monthTop] = {
        children: [],
        date: startKey,
        end,
        isColspan,
        monthTop,
        isContainer: true,
      };
    }
    wraperHtml[monthTop].children.push(event);
    let container = containerEvents.find(c => {
      return moment(c.end).valueOf() >= moment(start).valueOf();
    });

    // has overlap，this event will be a container to contain next event
    if (!container) {
      event.rows = [];
      containerEvents.push(event);
      continue;
    }

    // 找到evet的容器
    event.container = container;

    let row = null;
    for (let r = container.rows.length - 1; !row && r >= 0; r--) {
      if (inSameRow(event, container.rows[r])) {
        row = container.rows[r];
      }
    }
    if (row) {
      row.leaves.push(event);
      event.row = row;
    } else {
      event.leaves = [];
      container.rows.push(event);
    }
  }
  return wraperHtml;
}

function computeEventStyle(event, type, current) {
  const start = event.start || event.date;
  const { end, isColspan, monthTop, children } = event;
  const isSameDate = moment(event.end).isSame(current, 'd');
  const topDiff = isSameDate ? 0.06 : 0.05;
  let startDate = moment(start).day();
  startDate = startDate === 0 ? 7 : startDate;
  let widthSlice = 1;
  let offsetx = 0;
  if (type !== 'time' && (children || isColspan)) {
    widthSlice = 7;
    const diffEvent = moment(end).date() - moment(start).date() + 1;
    offsetx = (startDate - 1) / 7;
    let top = !isNaN(monthTop) ? monthTop : getDiffTop(start);
    event.top = type === 'month' ? top / 6 + topDiff : 0;
    return { width: children ? 1 - 0.015 : (1 / widthSlice) * diffEvent - 0.015, offsetX: offsetx + 0.005 };
  }
  if ((!event.rows || !event.rows.length) && !event.container) {
    return { width: 1 / widthSlice - 0.015, offsetX: offsetx + 0.005 };
  }
  if (type === 'month') return {};

  if (event.rows) {
    const columns = event.rows.reduce((max, row) => Math.max(max, row.leaves.length + 1), 0) + 1;
    return { width: 1 / (columns * widthSlice) - 0.01, offsetX: offsetx + 0.01 };
  }

  if (event.leaves) {
    const avaliableWidth = 1 / widthSlice - event.container.width;
    const otherWidth = avaliableWidth / (event.leaves.length + 1) - 0.01;
    offsetx = otherWidth + event.container.offsetX + 0.01;
    return { width: otherWidth, offsetX: offsetx };
  }

  let { leaves, offsetX } = event.row;
  const idx = leaves.indexOf(event);

  return {
    width: event.row.width - 0.01,
    offsetX: event.row.width * (idx + 1) + offsetX + 0.01,
  };
}
/**
 * generate schedule content
 * @param
 * ({
 *  start: '2018-11-12 12:00',
 *  end: '2018-11-12 14:00',
 *  cal: function(){}
 * })
 */
const generateScheduleContent = events => {
  let hasColspan = { count: 0 };
  return function scheduleRender(events, opts) {
    let containerEvents = evaluateStyle(events, opts, hasColspan);

    let resultScheduleHtml = [];
    for (let c in containerEvents) {
      let container = containerEvents[c];
      // console.log(container);
      let { children: rangeEvents, width, offsetX, height, top, isColspan } = container;
      // 如果有跨栏的，跨栏始终在上
      let notColspanTop = isColspan ? 0 : 1 * 0.055;
      let notColspanHeight = height - notColspanTop;
      notColspanHeight = notColspanHeight < 0.055 ? 0.055 : notColspanHeight;
      let containerStyle = {
        width: width * 100 + '%',
        left: offsetX * 100 + '%',
        top: top ? (top + notColspanTop) * 100 + '%' : 0,
        height: notColspanHeight * 100 + '%',
      };
      let containerCls = classnames({
        'cell-container': true,
        'colspan-cell': isColspan,
      });
      resultScheduleHtml.push(
        <div className={containerCls} key={container.end} style={containerStyle}>
          {rangeEvents.map((event, idx) => {
            let originEvt = event.event;
            let { start, end, cal } = originEvt;
            let eStyle = {
              top: event.top * 100 + '%',
              height: event.height * 100 + '%',
              left: event.offsetX * 100 + '%',
              width: event.width * 100 + '%',
            };
            let content = cal && typeof cal === 'function' ? cal(event) : moment(start).date();
            return (
              <div className="kuma-calendar-content-box" key={idx} style={eStyle}>
                <div className="kuma-calendar-content-wraper">{content}</div>
              </div>
            );
          })}
        </div>
      );
    }
    return resultScheduleHtml;
  }.bind(null, events);
};

/**
 * evaluate style of events
 *
 */
function isSameMoment(target, source) {
  target = moment(target).format('YYYY-MM-DD');
  source = moment(source).format('YYYY-MM-DD');
  return moment(target).isSame(source);
}

function initEvents(events, opts, hasColspan) {
  let resultEvents = [];
  events.forEach((event, idx) => {
    let { start, end } = event;
    event.id = idx;
    let diffDate = moment(end).diff(moment(start), 'days');
    if (diffDate > 0) {
      resultEvents = resultEvents.concat(splitEvents(event, diffDate, opts, hasColspan));
    } else {
      resultEvents.push(event);
    }
  });

  return resultEvents;
}
function getMomentValue(date, hour) {
  return moment(date)
    .hour(hour)
    .minute(0)
    .second(0)
    .valueOf();
}

/**
 * 拆分事件，是否为跨天事件
 */
function splitEvents(event, diffDays, opts, hasColspan) {
  let arrs = [];
  let { startHour, endHour, current, type } = opts;
  let { start, end, cal } = event;
  if (type === 'month') {
    return splitMonthEvents(event, diffDays, hasColspan);
  }
  let eStart = moment(start).valueOf();
  let eEnd = moment(end).valueOf();
  for (let i = 0; i <= diffDays; i++) {
    let startTime =
      i === 0
        ? start
        : moment(eStart)
          .add(i, 'd')
          .hour(startHour)
          .minute(0),
      endTime =
        i === diffDays
          ? end
          : moment(startTime)
            .hour(endHour)
            .minute(0);

    arrs.push({
      start: startTime,
      end: endTime,
      cal,
      eStart,
      eEnd,
    });
  }

  return arrs;
}
/**
 * 拆分月面板事件
 *
 */
function splitMonthEvents(event, diffDays, hasColspan) {
  let arrs = [];
  const { start, end, cal } = event;
  const startDay = moment(start).day();
  const eStart = moment(start).valueOf();
  const eEnd = moment(end).valueOf();
  // 是否在一行
  if (startDay + diffDays > 7) {
    const splitDays = Math.ceil(Math.abs(7 - (startDay + diffDays)) / 7);
    for (let i = 0; i <= splitDays; i++) {
      let startTime = i === 0 ? start : moment(eStart).add(8 - startDay + 7 * (i - 1), 'd'),
        endTime = i === splitDays ? end : moment(eStart).add(7 - startDay + 7 * i, 'd');
      hasColspan.count++;

      arrs.push({
        start: startTime,
        end: endTime,
        cal,
        eStart,
        eEnd,
        isColspan: true,
      });
    }
  } else {
    diffDays >= 1 && (hasColspan.count++);
    arrs.push({
      start,
      end,
      cal,
      eStart,
      eEnd,
      isColspan: diffDays >= 1,
    });
  }

  return arrs;
}
/**
 * 获取是否处于当前面板中
 */
function isInCurrentPanle(event, opts) {
  const { current, type } = opts;
  const { start } = event;
  if (type === 'time') {
    return isSameMoment(current, start);
  }
  if (type === 'week') {
    let day = moment(current).day();
    day = day === 0 ? 7 : day;
    const firstDate = moment(current).subtract(day, 'd');
    const lastDate = moment(current).add(7 - day, 'd');
    return moment(start).isBetween(firstDate, lastDate);
  }
  return moment(start).isSame(current, 'month');
}
function getEventTopHeight(event, opts) {
  const { startHour, current, slicePiece, gapMinute, type } = opts;
  const { start, startValue, endValue } = event;
  let startCurrent = getMomentValue(current, startHour);
  const totalSeconds = (slicePiece + 2) * gapMinute * 60 * 1000;
  if (type === 'time') {
    const diffStartCurrent = startValue - startCurrent + gapMinute * 60 * 1000;
    const diffEventHeight = endValue - startValue;
    event.top = diffStartCurrent / totalSeconds + 0.01;
    event.height = diffEventHeight / totalSeconds - 0.015;
    return;
  }
  if (type === 'week') {
    startCurrent = getMomentValue(start, startHour);
    const diffStartCurrent = startValue - startCurrent + gapMinute * 60 * 1000;
    const diffEventHeight = endValue - startValue;
    event.top = diffStartCurrent / totalSeconds + 0.01;
    event.height = diffEventHeight / totalSeconds - 0.015;
  }
}
function handleEventsInSameDate(eventsContainer, opts, containerEvents) {
  const { startHour, endHour, current, type } = opts;
  const containerStyle = computeEventStyle(eventsContainer, type, current);
  eventsContainer.width = containerStyle.width;
  eventsContainer.offsetX = containerStyle.offsetX;
  eventsContainer.height = type === 'month' ? 1 / 6 - 0.06 : 1;

  const events = eventsContainer.children;
  let rangeEvents = [];

  const startCurrent = getMomentValue(current, startHour);
  const endCurrent = getMomentValue(current, endHour);

  events.forEach(event => {
    const { start, end } = event;
    const eStart = moment(start).valueOf();
    const eEnd = moment(end).valueOf();
    event.startValue = eStart;
    event.endValue = eEnd;

    if (isInCurrentPanle(event, opts)) {
      // 获取事件的top值和高度
      getEventTopHeight(event, opts);
      const sourceDate = { sourceStart: eStart, sourceEnd: eEnd };
      const targetDate = { targetStart: startCurrent, targetEnd: endCurrent };
      const { width, offsetX } = computeEventStyle(event, type, current);
      if (isRange(sourceDate, targetDate)) {
        let evetObj = {};
        if (width !== 'undefined' || offsetX !== 'undefined') {
          event.width = width;
          event.offsetX = offsetX;
          evetObj = {
            event,
            top: event.top,
            height: event.height,
            width,
            offsetX,
          };
        } else {
          evetObj = {
            event,
          };
        }

        rangeEvents.push(evetObj);
      }
    }
  });
  return rangeEvents;
}
function evaluateStyle(events, opts, hasColspan) {
  // 拆分事件，为week时，跨两天拆分为两天

  const newEvents = initEvents(events, opts, hasColspan);

  // 对事件进行排序
  const sortedEvents = sortByRender(newEvents);
  // 获取同一段事件的容器位置
  const containerEvents = handleEvents(sortedEvents, opts);
  for (let o in containerEvents) {
    const wrapSchedule = containerEvents[o];
    containerEvents[o].children = handleEventsInSameDate(wrapSchedule, opts, containerEvents);
  }
  return containerEvents;
}

export default {
  generateContentRender,
  generateScheduleContent,
  getCalendarContainer,
  generalizeFormat,
  getTime,
  getTimeLine,
};
