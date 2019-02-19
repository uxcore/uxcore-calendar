import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'uxcore-button';
import Icon from 'uxcore-icon';
import Select from 'uxcore-select2';
import classnames from 'classnames';
import moment from 'moment';
import { getTodayTime } from 'rc-calendar/lib/util/index';
import Calendar from './Calendar';
import MonthCalendar from './MonthCalendar';

const { Option } = Select;

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
const TYPE_HASH = { time: 'd', week: 'w', month: 'M' };

function ShowCalendar(config) {
  const { headerSize, yearSelectOffset, yearSelectTotal, value, onValueChange, type } = config;
  if (type === 'month') {
    return (
      <MonthCalendar
        value={value}
        onSelect={onValueChange}
        size={headerSize}
        style={{ top: '40px' }}
      />
    );
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
    }
    if (type === 'week') {
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

  getSelectSwitcher() {
    const { type, locale } = this.props;
    return (
      <Select
        defaultValue={type}
        className="select-switcher"
        onSelect={this.changeType.bind(this)}
        size="small"
      >
        {SWITCHERS.map(switcher => (
          <Option value={switcher.value} key={switcher.value}>
            {locale[switcher.label] || '日'}
          </Option>
        ))}
      </Select>
    );
  }

  getExpandedSwitcher() {
    const { prefixCls, type, locale } = this.props;
    const switchCls = `${prefixCls}-header-switcher`;
    return (
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
    );
  }

  todayElement() {
    const { showToday, locale } = this.props;
    const isSuperMini = this.fullHeader ? this.fullHeader.offsetWidth <= 380 : false;
    const cls = classnames({
      'today-btn': true,
      'super-mini': isSuperMini,
    });
    return showToday ? (
      <Button type="secondary" onClick={this.setToday.bind(this)} className={cls}>
        <Icon usei name="zhixiang-qianjin" className="forward" />
        {!isSuperMini && locale.today}
      </Button>
    ) : null;
  }

  handlePrev() {
    const { type, onValueChange, value } = this.props;
    let newValue = value || moment();
    newValue = newValue.subtract(1, TYPE_HASH[type]);
    onValueChange(newValue);
  }

  changeType(value) {
    const { typeChange } = this.props;
    typeChange(value);
  }

  handleNext() {
    const { type, onValueChange, value } = this.props;
    let newValue = value || moment();
    newValue = newValue.add(1, TYPE_HASH[type]);
    onValueChange(newValue);
  }

  // 日历选择
  initCalendar() {
    const { prefixCls } = this.props;
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
    const { showTypeSwitch } = this.props;
    if (!showTypeSwitch) {
      return null;
    }
    if (this.fullHeader && this.fullHeader.offsetWidth < 380) {
      return this.getSelectSwitcher();
    }
    return this.getExpandedSwitcher();
  }

  render() {
    const { prefixCls } = this.props;

    return (
      <div
        className={`${prefixCls}-header`}
        ref={c => {
          this.fullHeader = c;
        }}
      >
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
  onValueChange: null,
  showToday: true,
  type: 'time',
  showTypeSwitch: true,
  typeChange() {},
  prefixCls: '',
};

export default CalendarHeader;
