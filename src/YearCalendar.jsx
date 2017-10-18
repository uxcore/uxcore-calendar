import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'uxcore-icon';
import classnames from 'classnames';
import Datepicker from 'rc-calendar/lib/Picker';
import RcYearCalendar from './RcYearCalendar';
import util from './util';

const CalendarLocale = {};

CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');


const { getCalendarContainer, generalizeFormat } = util;

class YearCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.clearValue = this.clearValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getTriggerNode() {
    return this.trigger;
  }

  getDate(date) {
    const me = this;
    const { timezone, locale } = me.props;
    const value = moment(date).locale(locale);
    if (timezone) {
      return value.utcOffset(parseInt(timezone, 10) * 60);
    }
    return value;
  }

  clearValue(e) {
    e.stopPropagation();
    this.props.onSelect(null, null);
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  handleChange(v) {
    const p = this.props;
    if (v) {
      const date = v.valueOf();
      this.props.onSelect(new Date(date), v.format(p.format));
    } else {
      this.props.onSelect(v, v);
    }
  }

  render() {
    const me = this;
    const p = me.props;
    const calendarOptions = {
      className: classnames(p.className, {
        [`kuma-calendar-${p.size}`]: !!p.size,
      }),
      style: p.style,
      locale: CalendarLocale[p.locale],
      showDateInput: p.showDateInput,
      orient: ['top', 'left'],
      prefixCls: 'kuma-calendar',
    };
    const pickerOptions = {
      disabled: p.disabled,
      align: p.align,
      transitionName: p.transitionName,
      adjustOrientOnCalendarOverflow: false,
      prefixCls: 'kuma-calendar-picker',
      getCalendarContainer: p.getPopupContainer || getCalendarContainer,
    };

    if (p.value) {
      const value = this.getDate(p.value);
      pickerOptions.value = calendarOptions.defaultValue = value;
    } else {
      pickerOptions.value = calendarOptions.defaultValue = null;
    }

    if (p.defaultValue) {
      const value = this.getDate(p.defaultValue);
      calendarOptions.defaultValue = value;
      pickerOptions.defaultValue = value;
    } else {
      const value = this.getDate(new Date().getTime());
      calendarOptions.defaultValue = value;
    }

    const calendar = <RcYearCalendar {...calendarOptions} />;

    const triggerStyle = {};
    if (p.inputWidth) {
      triggerStyle.width = p.inputWidth;
    }

    const inputClassName = classnames('kuma-input', {
      [`kuma-input-${p.size}-size`]: !!p.size,
    });

    const triggerClassName = classnames('kuma-calendar-picker-input', {
      [`kuma-calendar-picker-input-${p.size}`]: !!p.size,
    });

    return (
      <Datepicker
        calendar={calendar}
        onChange={me.handleChange}
        {...pickerOptions}
      >
        {({ value }) => {
          const showClear = value && !p.disabled;
          let newValue = value;
          if (newValue === null) {
            newValue = '';
          }
          return (
            <span className={triggerClassName} style={triggerStyle} ref={me.saveRef('trigger')}>
              <input
                value={newValue && newValue.format(generalizeFormat(p.format))}
                readOnly
                disabled={me.props.disabled}
                placeholder={this.props.placeholder}
                className={inputClassName}
              />
              {p.hasTrigger ? <Icon name="riqi" className={`kuma-calendar-trigger-icon ${showClear ? 'kuma-calendar-trigger-icon__has-clear' : ''}`} /> : null}
              {showClear
                ? <i
                  className="uxcore-icon uxicon-biaodanlei-tongyongqingchu kuma-icon-close"
                  onClick={this.clearValue}
                />
                : null}
            </span>
          );
        } }
      </Datepicker>
    );
  }
}

YearCalendar.displayName = 'YearCalendar';
YearCalendar.defaultProps = {
  format: 'YYYY',
  placeholder: '请选择年份',
  onSelect() { },
  locale: 'zh-cn',
  transitionName: 'calendarSlideUp',
  align: {
    offset: [0, 0],
  },
  showDateInput: false,
  hasTrigger: true,
};
YearCalendar.propTypes = {
  format: PropTypes.string,
  inputWidth: PropTypes.number,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  locale: PropTypes.string,
  getPopupContainer: PropTypes.func,
};

export default YearCalendar;
