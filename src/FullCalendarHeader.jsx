import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'uxcore-select2';
const { Option } = Select;
import i18n from './locale';
import Button from 'uxcore-button';
import Calendar from './Calendar';
import classnames from 'classnames';
import moment from 'moment';
import { getTodayTime } from 'rc-calendar/lib/util/index';
import { getCalendarContainer, generalizeFormat } from './util';
const SWITCHERS = [
  {
    label: 'time',
    value: 'time',
  },
  {
    label: 'week',
    value: 'week',
  },
  {
    label: 'month',
    value: 'month',
  },
];
function noop() {}

class CalendarHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showValue: props.value,
    };
  }

  setToday() {
    let { onValueChange, value } = this.props;
    const now = getTodayTime(value);
    onValueChange(now);
  }
  changeType(value) {
    this.props.onTypeChange(value);
  }

  todayElement() {
    const { showToday, locale } = this.props;
    return showToday ? (
      <Button type="secondary" onClick={this.setToday.bind(this)} className="today-btn">
        {locale.today}
      </Button>
    ) : null;
  }
  handlePrev() {
    let { type, onValueChange, value } = this.props;
    value = value || moment();
    if (type === 'time') {
      value = value.subtract(1, 'd');
    } else if (type === 'week') {
      value = value.subtract(1, 'w');
    } else {
      value = value.subtract(1, 'M');
    }
    onValueChange(value);
  }
  handleNext() {
    let { type, onValueChange, value } = this.props;
    value = value || moment();
    if (type === 'time') {
      value = moment(value).add(1, 'd');
    } else if (type === 'week') {
      value = moment(value).add(1, 'w');
    } else {
      value = moment(value).add(1, 'M');
    }
    onValueChange(value);
  }
  getShowValue() {
    let { value, type, format } = this.props;
    if (type === 'time') {
      return moment(value).format(format);
    } else if (type === 'week') {
      let day = moment(value).day();
      day = day === 0 ? 7 : day;
      let firstDate = moment(value)
        .subtract(day - 1, 'd')
        .format(format);
      let lastDate = moment(value)
        .add(7 - day, 'd')
        .format(format);
      return `${firstDate} ~ ${lastDate}`;
    } else {
      let newFormat = format.replace(/([-/])?dd/gi, '');
      return moment(value).format(newFormat);
    }
  }
  // 日历选择
  initCalendar() {
    const {
      locale,
      headerSize,
      yearSelectOffset,
      yearSelectTotal,
      prefixCls,
      value,
      format,
    } = this.props;
    let showValue = this.getShowValue();
    return (
      <div className={`${prefixCls}-date-select`}>
        <a className={`${prefixCls}-prev-btn`} role="button" onClick={this.handlePrev.bind(this)} />
        <input value={showValue} readOnly className={`${prefixCls}-show-input kuma-input`} />
        <Calendar
          showToday={false}
          showTime={false}
          allowClear={false}
          showDateInput={false}
          showSecond={false}
          yearSelectOffset={yearSelectOffset}
          yearSelectTotal={yearSelectTotal}
          size={headerSize}
          value={value}
          onSelect={this.props.onValueChange}
          hasTrigger={false}
        />
        <a className={`${prefixCls}-next-btn`} onClick={this.handleNext.bind(this)} />
      </div>
    );
  }
  renderSwitcher() {
    const { prefixCls, showTypeSwitch, type, locale } = this.props;
    const switchCls = `${prefixCls}-header-switcher`;
    return showTypeSwitch ? (
      <span className={switchCls}>
        {SWITCHERS.map((s, idx) => {
          return (
            <span
              onClick={this.changeType.bind(this, s.value)}
              key={s.label}
              className={classnames({
                [`${switchCls}-normal`]: true,
                [`${switchCls}-time`]: s.value === 'time',
                [`${switchCls}-week`]: s.value === 'week',
                [`${switchCls}-date`]: s.value === 'month',
                [`${switchCls}-focus`]: type === s.value,
              })}
            >
              {locale[s.label] || '日'}
            </span>
          );
        })}
      </span>
    ) : null;
  }
  render() {
    let { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-header`}>
        {this.todayElement()}
        {this.initCalendar()}
        {this.renderSwitcher()}
      </div>
    );
  }
}
CalendarHeader.propTypes = {
  yearSelectOffset: PropTypes.number,
  yearSelectTotal: PropTypes.number,
  onValueChange: PropTypes.func,
  onTypeChange: PropTypes.func,
  prefixCls: PropTypes.string,
  type: PropTypes.string,
  showTypeSwitch: PropTypes.bool,
  showToday: PropTypes.bool,
};
CalendarHeader.defaultProps = {
  yearSelectOffset: 10,
  yearSelectTotal: 20,
  onValueChange: noop,
  onTypeChange: noop,
  showToday: true,
  type: 'time',
};

export default CalendarHeader;
