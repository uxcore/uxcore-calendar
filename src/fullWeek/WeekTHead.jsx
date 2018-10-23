import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import { getTodayTime } from 'rc-calendar/lib/util/';

const DATE_COL_COUNT = 8;
export default class DateTHead extends React.Component {
  getRenderData() {
    const { value } = this.props;
    const now = moment();
    let current = value || now;
    const cloneValue = current.clone();
    const localeData = current.localeData();
    const currentDay = moment(value).format('E');
    const weekDays = [];

    for (let i = 0; i < DATE_COL_COUNT; i++) {
      if (i === 0) {
        weekDays[i] = { label: '', value: '' };
      } else {
        const diff = currentDay - i;
        if (diff < 0) {
          current = moment(cloneValue).add(Math.abs(diff), 'd');
        } else {
          current = moment(cloneValue).subtract(diff, 'd');
        }
        weekDays[i] = {};
        weekDays[i].label = localeData.weekdaysShort(current);
        weekDays[i].value = current;
      }
    }
    return weekDays;
  }

  render() {
    const { prefixCls } = this.props;
    const now = moment();
    const weekDays = this.getRenderData();
    const weekDaysEls = weekDays.map((day) => {
      const cls = classnames({
        [`${prefixCls}-column-header`]: true,
        [`${prefixCls}-today`]: day.value && moment(day.value).isSame(now, 'day'),
      });
      return (
        <th key={day.value} role="columnheader" title={day} className={cls}>
          <span className={classnames(`${prefixCls}-column-header-inner`)}>
            <span className="header-date">{day.value && day.value.date()}</span>
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
