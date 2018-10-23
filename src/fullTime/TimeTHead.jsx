import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { getTodayTime } from 'rc-calendar/lib/util/';

export default class DateTHead extends React.Component {
  getPanelDays() {
    const days = [];
    const { value, dataCount } = this.props;
    let currentDay = null;
    currentDay = value || moment();
    for (let i = 0; i < dataCount + 1; i++) {
      if (i === 0) {
        days.push('');
      } else {
        days.push(currentDay.date());
        currentDay = moment(currentDay).add(1, 'days');
      }
    }
    return days;
  }

  render() {
    const { value, prefixCls, dataCount } = this.props;
    const now = moment();
    let current = value || now;
    const localeData = current.localeData();
    const weekDays = [];
    const panelDays = this.getPanelDays();

    for (let dateColIndex = 0; dateColIndex < dataCount + 1; dateColIndex++) {
      if (dateColIndex === 0) {
        weekDays[dateColIndex] = { label: '', value: '' };
      } else {
        weekDays[dateColIndex] = {};
        weekDays[dateColIndex].label = localeData.weekdaysShort(current);
        weekDays[dateColIndex].value = current;
        current = moment(current).add(1, 'days');
      }
    }

    const weekDaysEls = weekDays.map((day, xindex) => {
      const cls = classnames({
        [`${prefixCls}-column-header`]: true,
        [`${prefixCls}-today`]: day.value && moment(day.value).isSame(now, 'day'),
      });
      return (
        <th key={day.value} role="columnheader" title={day} className={cls}>
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
