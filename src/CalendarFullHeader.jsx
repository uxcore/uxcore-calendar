import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'uxcore-button';
import classnames from 'classnames';
import moment from 'moment';
import { getTodayTime } from 'rc-calendar/lib/util/index';
import Calendar from './Calendar';
import MonthCalendar from './MonthCalendar';

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
function noop() { }

function ShowCalendar(config) {
  const {
    headerSize,
    yearSelectOffset,
    yearSelectTotal,
    value,
    onValueChange,
    type,
  } = config;
  if (type === 'month') {
    return <MonthCalendar value={value} onSelect={onValueChange} size={headerSize} style={{ top: '40px' }} />;
  }
  return (
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
      onSelect={onValueChange}
      hasTrigger={false}
      style={{ top: '40px' }}
    />
  );
}

class CalendarHeader extends Component {
  setToday() {
    const { onValueChange, value } = this.props;
    const now = getTodayTime(value);
    onValueChange(now);
  }

  getShowValue() {
    const { value, type, format } = this.props;
    if (type === 'time') {
      return moment(value).format(format);
    } if (type === 'week') {
      let day = moment(value).day();
      day = day === 0 ? 7 : day;
      const firstDate = moment(value)
        .subtract(day - 1, 'd')
        .format(format);
      const lastDate = moment(value)
        .add(7 - day, 'd')
        .format(format);
      return `${firstDate} ~ ${lastDate}`;
    }
    const newFormat = format.replace(/([-/])?dd/gi, '');
    return moment(value).format(newFormat);
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
    const { type, onValueChange, value } = this.props;
    let newValue = value || moment();
    if (type === 'time') {
      newValue = newValue.subtract(1, 'd');
    } else if (type === 'week') {
      newValue = newValue.subtract(1, 'w');
    } else {
      newValue = newValue.subtract(1, 'M');
    }
    onValueChange(newValue);
  }

  changeType(value) {
    const { typeChange } = this.props;
    typeChange(value);
  }

  handleNext() {
    const { type, onValueChange, value } = this.props;
    let newValue = value || moment();
    if (type === 'time') {
      newValue = moment(newValue).add(1, 'd');
    } else if (type === 'week') {
      newValue = moment(newValue).add(1, 'w');
    } else {
      newValue = moment(newValue).add(1, 'M');
    }
    onValueChange(newValue);
  }


  // 日历选择
  initCalendar() {
    const {
      prefixCls,
    } = this.props;
    const showValue = this.getShowValue();

    return (
      <div className={`${prefixCls}-date-select`}>
        <span className={`${prefixCls}-prev-btn`} onClick={this.handlePrev.bind(this)} />
        <input value={showValue} readOnly className={`${prefixCls}-show-input kuma-input`} />
        <ShowCalendar {...this.props} />
        <span className={`${prefixCls}-next-btn`} onClick={this.handleNext.bind(this)} />
      </div>
    );
  }

  renderSwitcher() {
    const {
      prefixCls, showTypeSwitch, type, locale,
    } = this.props;
    const switchCls = `${prefixCls}-header-switcher`;
    return showTypeSwitch ? (
      <span className={switchCls}>
        {SWITCHERS.map(s => (
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
        ))}
      </span>
    ) : null;
  }

  render() {
    const { prefixCls, width } = this.props;
    const headerStyle = { width };

    return (
      <div className={`${prefixCls}-header`} style={headerStyle}>
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
  typeChange: PropTypes.func,
  prefixCls: PropTypes.string,
  type: PropTypes.string,
  showTypeSwitch: PropTypes.bool,
  showToday: PropTypes.bool,
};
CalendarHeader.defaultProps = {
  yearSelectOffset: 10,
  yearSelectTotal: 20,
  onValueChange: noop,
  showToday: true,
  type: 'time',
  showTypeSwitch: true,
  typeChange() { },
};

export default CalendarHeader;
