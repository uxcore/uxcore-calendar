import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { getTitleString, getTodayTime } from 'rc-calendar/lib/util/';

export default class DateTHead extends React.Component {
  getPanelDays() {
    let days = [];
    const { value, prefixCls, dataCount } = this.props;
    let currentDay = null;
    currentDay = value || moment();
    let currentDate = currentDay.date();
    for (let i = 0; i < dataCount; i++) {
      days.push(currentDay.date());
      currentDay = moment(currentDay).add(1, 'days');
    }
    return days;
  }
  render() {
    const props = this.props;
    const { value, prefixCls, dataCount } = props;
    const now = moment();
    let current = value || now;

    const localeData = current.localeData();

    const firstDayOfWeek = localeData.firstDayOfWeek();

    const today = getTodayTime(current);
    const currentDay = today.day();

    const weekDays = [];
    const weekendDays = [];
    let panelDays = this.getPanelDays();

    for (let dateColIndex = 0; dateColIndex < dataCount; dateColIndex++) {
      weekDays[dateColIndex] = {};
      weekDays[dateColIndex].label = localeData.weekdaysShort(current);
      weekDays[dateColIndex].value = current;
      current = moment(current).add(1, 'days');
    }

    let weekDaysEls = weekDays.map((day, xindex) => {
      let cls = classnames({
        [`${prefixCls}-column-header`]: true,
        [`${prefixCls}-today`]: moment(day.value).isSame(now, 'day'),
      });
      return (
        <th key={xindex} role="columnheader" title={day} className={cls}>
          <span className={classnames(`${prefixCls}-column-header-inner`)}>
            <span className="header-date">{panelDays[xindex]}</span>
            {day.label}
          </span>
        </th>
      );
    });
    return (
      <thead>
        <tr role="row">{weekDaysEls}</tr>
      </thead>
    );
  }
}
