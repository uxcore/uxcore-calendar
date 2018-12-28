/**
 * 大日历组件处理思路
 * step1： initEvents 初始化事件，包括对事件日期是否正确的处理，进行排序;
 * step2: splitEvents 对于跨日程事件进行拆分 splitEvents;
 * step3: sortByEventRender 对于事件按日期进行排序;
 * step4：handleEvents 为日程容器添加日程事件;
 * step5: computeEventStyle 计算事件在面板中的位置
 */

import React from 'react';
import Icon from 'uxcore-icon';
import classnames from 'classnames';
import moment from 'moment';
import sortBy from 'lodash/sortBy';

const WEEK_COLUMN = 6;
const MONTH_CELL_HEIGHT = 20;

function getTime(props) {
  const { startHour, value } = props;
  const newStartHour = startHour
    ? parseInt(startHour, 10)
    : 9;
  return moment(value)
    .hour(newStartHour)
    .minute(0);
}

/**
 * 根据事件的开始时间进行排序
 * @param {array} events 事件数组
 */
function sortByEventRender(events) {
  return sortBy(events, e => moment(e.start).valueOf());
}

function getMomentValue(date, hour) {
  return moment(date)
    .hour(hour)
    .minute(0)
    .second(0)
    .valueOf();
}

function getFormatDate(value, format) {
  return moment(value).format(format);
}

/**
 * 获取日期是星期几
 * @param {object} date;
 */
function getDateDay(date) {
  const day = moment(date).day();
  return day === 0 ? 7 : day;
}

/**
 * 是否在同一行
 * @param {object} target 比较对象
 * @param {object} source 被比较对象
 */
function inSameRow(target, source) {
  if (!target || !source) {
    return false;
  }
  let isLt = moment(source.start).isBefore(moment(source.start));
  isLt = isLt && moment(source.start).isAfter(moment(target.end));
  let isEq = moment(source.start).isSame(moment(source.start));
  isEq = isEq && moment(source.end).isSame(moment(source.end));

  return isLt || isEq;
}

/**
 * 获取当前日期在月面板的第几行
 */
function getMonthEventTop(start) {
  const diffDate = moment(+new Date(start)).startOf('month').day();
  const firstDayOfMonthPanel = diffDate + moment(start).date() - 1;
  return Math.ceil(Math.abs(firstDayOfMonthPanel) / 7) - 1;
}

/**
 * 判断是日期相同
 * @param {object} target 比较对象
 * @param {object} source 被比较对象
 */
function isSameDateByType(target, source, type = 'date') {
  return moment(target).isSame(source, type);
}

function getWeekStartEnd(current) {
  const day = getDateDay(current);
  const firstDate = moment(current).subtract(day - 1, 'd');
  const lastDate = moment(current).add(7 - day, 'd');
  return { firstDate, lastDate };
}

/**
 * 判断是否在同一周
 * @param {moment} start 事件的开始时间
 * @param {moment} current 当前时间
 */
function inSameWeek(start, current) {
  const { firstDate, lastDate } = getWeekStartEnd(current);
  if (moment(start).isBetween(firstDate, lastDate)) {
    return true;
  }
  return moment(start).isSame(firstDate, 'Date') || moment(start).isSame(lastDate, 'Date');
}

/**
 * 获取是否处于当前面板中
 * @param {object} event 事件
 * @param {object} opts 大日历组件传入的相关参数 opts : {type,step,startHour,endHour}
 */
function isInCurrentPanle(event, opts) {
  const { current, type } = opts;
  const { start, end } = event;
  if (moment(end).valueOf() - moment(start).valueOf() < 0) {
    return false;
  }
  if (type === 'week') {
    return inSameWeek(start, current);
  }
  const typeHash = { time: 'date', month: 'month' };
  return isSameDateByType(start, current, typeHash[type]);
}

/**
 * 根据指定格式、分隔符获取hash值
 * @param {moment} start 开始时间
 * @param {moment} end 结束时间
 * @param {string} format 格式
 * @param {string} splitStr 分隔符
 */
function getHashKeyByFomart(start, end, format, splitStr) {
  const startKey = getFormatDate(start, format);
  if (start && end) {
    const endKey = getFormatDate(end, format);
    return `${startKey}${splitStr}${endKey}`;
  }
  return startKey;
}


/**
 * 获取月面板中的容器hash值
 * @param {object} event
 */
function getMonthContainerHash(event) {
  const { start } = event;
  const { firstDate, lastDate } = getWeekStartEnd(start);
  return getHashKeyByFomart(firstDate, lastDate, 'YYYY-MM-DD', '~');
}

/**
 * 获取容器的hash key值
 * @param {object} event 获取事件 ;
 * @param {objec} opts ;
 */
function getHashKey(event, opts) {
  const type = opts ? opts.type : 'week';
  if (type === 'month') {
    return getMonthContainerHash(event);
  }
  const { start, end } = event;
  return getHashKeyByFomart(start, end, 'YYYY-MM-DD', '~');
}

/**
 * 处理事件间的包含所属关系
 * @param {array} events
 */
function handleEvents(events, opts) {
  const containerEvents = [];
  const wraperHtml = {};
  for (let i = 0, len = events.length; i < len; i++) {
    const event = events[i];
    const hashKey = getHashKey(event, opts);
    const { start, end, isColspan } = event;

    if (!wraperHtml[hashKey]) {
      wraperHtml[hashKey] = {
        children: [],
        date: start,
        end,
        isColspan,
        monthTop: isColspan && getMonthEventTop(start),
        isContainer: true,
        sameDateArr: [],
      };
    }

    wraperHtml[hashKey].children.push(event);
    const container = containerEvents.find(c => moment(c.end).valueOf() >= moment(start).valueOf());

    if (!container) {
      event.rows = [];
      containerEvents.push(event);
    } else {
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
  }
  return wraperHtml;
}

/**
 *处理月面板中事件的展现
 * @param {object} event  事件
 */
function computeMonthEventStyle(event) {
  const {
    end, isColspan, monthTop, children, start, date,
  } = event;
  const eventStart = start || date;
  const top = !Number.isNaN(Number(monthTop)) ? monthTop : getMonthEventTop(eventStart);
  const widthSlice = 7;
  const diffEvent = moment(end).date() - moment(eventStart).date() + 1;
  const startDate = getDateDay(eventStart);
  const offsetx = (startDate - 1) / 7;

  if (event.isContainer) {
    return {
      width: 0.995,
      offsetX: 0.005,
      top: top / WEEK_COLUMN,
    };
  }

  return {
    width: (children && isColspan) ? 0.995 : (1 / widthSlice) * diffEvent - 0.005,
    offsetX: (children && isColspan) ? 0.005 : offsetx,
    top: top / WEEK_COLUMN,
  };
}

/**
 *计算事件的样式
 * @param {*} event 事件
 * @param {*} type 类型
 */
function computeEventStyle(event, type) {
  if (type === 'month') {
    return computeMonthEventStyle(event);
  }
  const {
    end, isColspan, children, start, date,
  } = event;

  const eventStart = start || date;
  const startDate = getDateDay(eventStart);

  let widthSlice = 1;
  let offsetx = 0;

  if (type !== 'time' && (children || isColspan)) {
    widthSlice = 7;
    const diffEvent = moment(end).date() - moment(eventStart).date() + 1;
    offsetx = (startDate - 1) / 7;
    return {
      width: (children && isColspan)
        ? 1 - 0.005
        : (1 / widthSlice) * diffEvent - 0.005,
      offsetX: (children && isColspan)
        ? 0.005
        : offsetx,
      top: 0,
    };
  }

  if ((!event.rows || !event.rows.length) && !event.container) {
    // 为外层包裹元素
    if (event.isContainer) {
      return {
        width: 1 / widthSlice - 0.010,
        offsetX: offsetx + 0.005,
      };
    }
    return {
      width: 1 / widthSlice,
      offsetX: offsetx,
    };
  }

  if (event.rows) {
    const columns = event
      .rows
      .reduce((max, row) => Math.max(max, row.leaves.length + 1), 0) + 1;
    return {
      width: 1 / (columns * widthSlice) - 0.01,
      offsetX: offsetx,
    };
  }


  if (event.leaves) {
    const totalCount = event.leaves.length + 2;
    const avaliableWidth = event.container.width;
    const leftWidth = 1 - avaliableWidth * totalCount;
    const averOffsetX = leftWidth / (totalCount - 1);
    offsetx = avaliableWidth + event.container.offsetX + averOffsetX;
    return { width: avaliableWidth, offsetX: offsetx };
  }

  const { leaves, offsetX } = event.row;
  const idx = leaves.indexOf(event);
  const averOffsetX = offsetX - event.row.width;

  return {
    width: event.row.width,
    offsetX: (event.row.width + averOffsetX) * (idx + 1) + offsetX,
  };
}

/**
 * 拆分月面板事件
 * @param {object} event 事件
 * @param {number} diffDays 事件头尾相差的天数
 */
function splitMonthEvents(event, diffDays) {
  const arrs = [];
  const { start, end, render } = event;
  const startDay = getDateDay(start);
  const eStart = moment(start).valueOf();
  const eEnd = moment(end).valueOf();
  // 头尾不在月面板中的一行
  if (startDay + diffDays > 7) {
    const splitDays = Math.ceil(Math.abs(7 - (startDay + diffDays)) / 7);
    for (let i = 0; i <= splitDays; i++) {
      const startTime = i === 0
        ? start
        : moment(eStart).add(8 - startDay + 7 * (i - 1), 'd');
      const endTime = i === splitDays
        ? end
        : moment(eStart).add(7 - startDay + 7 * i, 'd');
      arrs.push({
        start: startTime,
        end: endTime,
        render,
        eStart,
        eEnd,
        isColspan: true,
      });
    }
  } else {
    // 头尾在月面板中的一行
    arrs.push({
      start,
      end,
      render,
      eStart,
      eEnd,
      isColspan: diffDays >= 1,
    });
  }
  return arrs;
}

function getCorrectEventsDate(event, opts) {
  const { startHour, endHour } = opts;
  const { start, end } = event;
  const eHour = moment(end).hour();
  const newEnd = eHour > endHour
    ? moment(end).hour(endHour)
    : end;
  const sHour = moment(start).hour();
  const newStart = sHour < startHour
    ? moment(start).hour(startHour)
    : start;
  return { newEnd, newStart };
}
/**
 * 拆分事件，是否为跨天事件
 */
function splitEvents(event, diffDays, opts) {
  const arrs = [];
  const { startHour, endHour, type } = opts;
  const { start, end, render } = event;
  if (type === 'month') {
    return splitMonthEvents(event, diffDays);
  }

  const { newStart, newEnd } = getCorrectEventsDate(event, opts);

  const eStart = moment(start).valueOf();
  const eEnd = moment(end).valueOf();

  for (let i = 0; i <= diffDays; i++) {
    const startTime = i === 0
      ? newStart
      : moment(eStart)
        .add(i, 'd')
        .hour(startHour)
        .minute(0);

    const endTime = i === diffDays
      ? newEnd
      : moment(startTime)
        .hour(endHour)
        .minute(0);

    arrs.push({
      start: startTime, end: endTime, render, eStart, eEnd,
    });
  }
  return arrs;
}

function initEvents(events, opts) {
  let resultEvents = [];

  events.forEach((event) => {
    const { start, end } = event;
    const diffDate = moment(end).diff(moment(start), 'days');

    if (diffDate > 0) {
      resultEvents = resultEvents.concat(splitEvents(event, diffDate, opts));
    } else {
      const { newStart, newEnd } = getCorrectEventsDate(event, opts);
      event.start = newStart;
      event.end = newEnd;
      resultEvents.push(event);
    }
  });

  return resultEvents;
}

/**
 * 拆分跨日程事件
 * @param {object} event  事件
 * @param {number} continuousDay 连续的天数
 */
function handleSplitEvent(event, continuousDay) {
  const arrs = [];
  const { start, render } = event;

  for (let i = 0; i <= continuousDay; i++) {
    const startTime = moment(start).add(i, 'd').format('YYYY-MM-DD');
    arrs.push({
      start: startTime, end: startTime, render,
    });
  }
  return arrs;
}

/**
 * 处理事件，拆分为天
 * @param {array} events 事件数组
 */
function handlePropsEvents(events, results = {}) {
  events.forEach((event) => {
    const { start, end } = event;
    const startKey = moment(start).format('YYYY-MM-DD');
    const diffDate = moment(end).diff(moment(start), 'days');
    if (diffDate > 0) {
      const splitResultEvents = handleSplitEvent(event, diffDate);
      handlePropsEvents(splitResultEvents, results);
    } else {
      if (!results[startKey]) {
        results[startKey] = {
          events: [],
        };
      }
      results[startKey].events.push(event);
    }
  });
}

function getEventTopHeight(event, opts, sourceDate) {
  const {
    startHour, current, slicePiece, step, type,
  } = opts;
  const { start } = event;
  const { sourceStart, sourceEnd } = sourceDate;
  let startCurrent = getMomentValue(current, startHour);
  const totalSeconds = (slicePiece + 2) * step * 60 * 1000;
  let evetTop;
  let eventHeight;

  if (type === 'time') {
    const diffStartCurrent = sourceStart - startCurrent + step * 60 * 1000;
    const diffEventHeight = sourceEnd - sourceStart;
    evetTop = diffStartCurrent / totalSeconds + 0.005;
    eventHeight = diffEventHeight / totalSeconds - 0.01;
    return { top: evetTop, height: eventHeight };
  }
  if (type === 'week') {
    startCurrent = getMomentValue(start, startHour);
    const diffStartCurrent = sourceStart - startCurrent + step * 60 * 1000;
    const diffEventHeight = sourceEnd - sourceStart;
    evetTop = diffStartCurrent / totalSeconds + 0.005;
    eventHeight = diffEventHeight / totalSeconds - 0.01;
    return { top: evetTop, height: eventHeight };
  }
  return { top: 0, height: 0 };
}
function handleEventsInSameDate(eventsContainer, opts) {
  const { current, type } = opts;
  const events = eventsContainer.children;
  const rangeEvents = [];

  events.forEach((event) => {
    const { start, end } = event;
    const eStart = moment(start).valueOf();
    const eEnd = moment(end).valueOf();
    const sourceDate = {
      sourceStart: eStart,
      sourceEnd: eEnd,
    };

    // 在同一个面板中
    if (isInCurrentPanle(event, opts)) {
      // 获取事件的top值和高度
      const { top, height } = getEventTopHeight(event, opts, sourceDate);
      const { width, offsetX } = computeEventStyle(event, type, current);
      let evetObj = {};
      if (!Number.isNaN(Number(width)) && !Number.isNaN(Number(offsetX))) {
        event.width = width;
        event.offsetX = offsetX;
        evetObj = {
          event,
          top,
          height,
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
  });

  return rangeEvents;
}

function getEventContainer(events, opts) {
  // 拆分事件，为week时，跨两天拆分为两天
  const { type, current } = opts;
  const targetEvents = JSON.parse(JSON.stringify(events));
  const newEvents = initEvents(targetEvents, opts);

  // 对事件进行排序
  const sortedEvents = sortByEventRender(newEvents);


  // 获取同一段事件的容器位置
  const containerEvents = handleEvents(sortedEvents, opts);

  const containerEventsKeys = Object.keys(containerEvents);

  containerEventsKeys.forEach((key) => {
    const wrapSchedule = containerEvents[key];

    const containerStyle = computeEventStyle(wrapSchedule, type, current);

    wrapSchedule.height = type === 'month'
      ? (1 / 6 - 0.005)
      : 1;
    wrapSchedule.top = containerStyle.top;
    wrapSchedule.width = containerStyle.width;
    wrapSchedule.offsetX = containerStyle.offsetX;
    containerEvents[key].children = handleEventsInSameDate(wrapSchedule, opts, containerEvents);
  });

  return containerEvents;
}

function go2More(event, opts) {
  const { seeEventsDetail } = opts;
  seeEventsDetail('time', event);
}

/**
 * 获取月面板中能显示的事件个数
 * @param {object} event 事件
 * @param {array} moreInfoEvents 更多事件数组
 */
function handleShowMoreInfo(event, moreInfoEvents) {
  const { start, end, important } = event;
  const startDate = moment(start).date();
  const endDate = moment(end).date();
  const diffDate = endDate - startDate;
  for (let i = 0, len = diffDate; i <= len; i++) {
    const keyDate = moment(start).add(i, 'd');
    const startKey = keyDate.format('YYYY-MM-DD');
    const day = getDateDay(keyDate);
    if (moreInfoEvents[startKey]) {
      moreInfoEvents[startKey].count += 1;
    } else {
      moreInfoEvents[startKey] = {
        key: startKey,
        important,
        count: 1,
        offsetX: (day - 1) / 7,
        width: 1 / 7,
      };
    }
  }
}

function getJSXfromMoreInfos(moreInfoEvents, maxCount, opts) {
  const jsxArr = [];
  const eventKeys = Object.keys(moreInfoEvents);
  const now = new Date();
  eventKeys.forEach((event) => {
    const info = moreInfoEvents[event];
    const {
      offsetX, count, key, width, important,
    } = info;
    const moreStyle = {
      left: `${offsetX * 100}%`,
      width: `${width * 100}%`,
    };
    const moreEvent = classnames({
      'more-event': true,
      important: !!important,
    });
    const moreIcon = classnames({
      'more-icon': maxCount > -1,
      'hot-icon': maxCount === -1,
      past: moment(event).isBefore(moment(now), 'date'),
      today: moment(event).isSame(moment(now), 'date'),
    });
    jsxArr.push((
      <div className={moreEvent} style={moreStyle} key={key} onClick={go2More.bind(this, event, opts)}>
        {
          maxCount > -1 && (
            <span>
              {count}
              条
            </span>
          )
        }
        {!!important && maxCount === -1 && <Icon name="zhongyaoshijian" usei className="import-event" />}
        {(!important || maxCount > -1) && <span className={moreIcon} />}
      </div>
    ));
  });
  return jsxArr;
}
/**
 * 获取月面板中最多能显示的事件个数
 * @param {array} events 传入的事件
 * @param {bumber} maxCount 显示的最大数据
 */
function getVisibleEvent(events, maxCount, opts) {
  const isMonthType = opts.type === 'month';
  let resultArr = [];
  const moreInfoEvents = {};
  const eventLen = events.length;

  for (let i = 0; i < eventLen; i++) {
    const event = events[i];
    const originEvt = event.event;
    const { start, render, important } = originEvt;
    if (isMonthType) {
      handleShowMoreInfo(originEvt, moreInfoEvents);
    }

    if (resultArr.length < maxCount) {
      const importantCls = classnames({
        'kuma-calendar-content-box': true,
        'red-important': !!important,
      });
      const eStyle = {
        top: `${event.top * 100}%`,
        height: `${event.height * 100}%`,
        left: `${event.offsetX * 100}%`,
        width: `${event.width * 100}%`,
      };

      const content = render && typeof render === 'function'
        ? render(event)
        : moment(start).date();
      resultArr.push((
        <div className={importantCls} key={i} style={eStyle}>
          <div className="kuma-calendar-content-wraper">
            <div>
              {!!important && <Icon name="zhongyaoshijian" usei className="import-event" />}
              {content}
            </div>

          </div>
        </div>
      ));
    }
  }


  if (isMonthType && (resultArr.length < eventLen || resultArr.length === 0)) {
    resultArr = resultArr.concat(getJSXfromMoreInfos(moreInfoEvents, maxCount, opts));
  }

  return resultArr;
}

/**
 * 生成跨日程的事件提醒
 * @param
 * ({
 *  start: '2018-11-12 12:00',
 *  end: '2018-11-12 14:00',
 *  render: function(){}
 * })
 */
const generateScheduleContent = events => function scheduleRender(evts, opts, tableHeight) {
  if (!evts || !evts.length) {
    return;
  }

  const containerEvents = getEventContainer(evts, opts);
  const resultScheduleHtml = [];
  const eventsKeys = Object.keys(containerEvents);
  const isMonthType = opts.type === 'month';
  for (let i = 0, len = eventsKeys.length; i < len; i++) {
    const key = eventsKeys[i];
    const container = containerEvents[key];

    const {
      children: rangeEvents,
      width,
      offsetX,
      height,
      top,
      isColspan,
      end,
    } = container;

    let maxCount = 99;
    if (isMonthType) {
      const fulltMonthTableHeight = tableHeight || 0;
      const cellContainerHeight = 0.8 * ((fulltMonthTableHeight - 32) / WEEK_COLUMN);
      if (cellContainerHeight <= 42 && cellContainerHeight > 0) {
        maxCount = -1;
      } else if (cellContainerHeight > 42 && cellContainerHeight <= 50) {
        maxCount = 0;
      } else {
        maxCount = Math.floor(cellContainerHeight / MONTH_CELL_HEIGHT) - 1;
      }
    }

    // 月视图中展示的日期会占据一定的空间
    const isSameDate = moment(end).isSame(opts.current, 'd');
    const extraMonthPaddingTop = !isSameDate
      ? 25
      : 7 * (maxCount + 1);

    const containerStyle = {
      width: `${width * 100}%`,
      left: `${offsetX * 100}%`,
      top: top
        ? `${top * 100}%`
        : 0,
      paddingTop: isMonthType ? extraMonthPaddingTop : 0,
      height: `${height * 100}%`,
    };

    const containerCls = classnames({
      'cell-container': true,
      'colspan-cell': isColspan,
      'hide-event': isMonthType && !maxCount,
    });

    resultScheduleHtml.push(
      <div className={containerCls} key={i} style={containerStyle}>
        {getVisibleEvent(rangeEvents, maxCount, opts)}
      </div>,
    );
  }
  return (
    <div className={classnames('events-wrapper', { 'events-month-wrapper': isMonthType })}>
      {resultScheduleHtml}
    </div>
  );
}.bind(null, events);

export default {
  handlePropsEvents,
  getFormatDate,
  inSameWeek,
  generateScheduleContent,
  getTime,
};
