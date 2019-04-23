import Datepicker from 'rc-calendar/lib/Picker';
import RcMonthCalendar from 'rc-calendar/lib/MonthCalendar';
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Icon from 'uxcore-icon';
import classnames from 'classnames';
import util from './util';

const CalendarLocale = {};
const { getCalendarContainer, generalizeFormat } = util;

CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');

class MonthCalendar extends React.Component {
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
    const { onSelect } = this.props;
    onSelect(null, null);
  }

  saveRef(refName) {
    const me = this;
    return (c) => {
      me[refName] = c;
    };
  }

  handleChange(v) {
    const { onSelect, format } = this.props;
    if (v) {
      const date = v.valueOf();
      onSelect(new Date(date), v.format(format));
    } else {
      onSelect(v, v);
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
      orient: ['top', 'left'],
      showDateInput: p.showDateInput,
      prefixCls: 'kuma-calendar',
      onChange: p.onChange ? p.onChange : () => {},
      disabledDate: (moment) => {
        const range = p.allowedMonthRange;
        if (!range || typeof range === 'string') {
          return false
        }
        let ret = true;
        const isArray = range.splice && range.length;
        const allowedRanges = isArray ? range : [range];
        for (let i = 0; i < allowedRanges.length; i++) {
          const allowed = allowedRanges[i];
          const { start, end } = allowed;
          if (!start && !end ) {
            break
          }
          if (!start && moment.isBefore(end) || !end && moment.isAfter(start)) {
            ret = false;
            break
          }
          if (moment.isBetween(start, end, 'month', '[]')) {
            ret = false;
            break
          }
        }
        return ret;
      }
    };
    const pickerOptions = {
      disabled: p.disabled,
      onOpenChange: p.onOpenChange,
      align: p.align,
      transitionName: p.transitionName,
      adjustOrientOnCalendarOverflow: false,
      prefixCls: 'kuma-calendar-picker',
      getCalendarContainer: p.getPopupContainer || getCalendarContainer,
    };

    if (p.value) {
      const value = this.getDate(p.value);
      pickerOptions.value = value;
      calendarOptions.defaultValue = value;
    } else {
      pickerOptions.value = null;
      calendarOptions.defaultValue = p.defaultOpenValue ? this.getDate(p.defaultOpenValue) : null;
    }

    if (p.defaultValue) {
      const value = this.getDate(p.defaultValue);
      calendarOptions.defaultValue = value;
      pickerOptions.defaultValue = value;
    } else if (!calendarOptions.defaultValue) {
      calendarOptions.defaultValue = this.getDate(new Date().getTime());
    }

    const calendar = <RcMonthCalendar {...calendarOptions} />;

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
        dropdownClassName={`date-picker-dropdown-offset-${p.size}`}
      >
        {({ value }) => {
          const showClear = p.allowClear ? (value && !p.disabled) : false;
          let newValue = value;
          if (newValue) {
            newValue = newValue.format(generalizeFormat(p.format));
          } else {
            newValue = '';
          }
          return (
            <span className={triggerClassName} style={triggerStyle} ref={me.saveRef('trigger')}>
              <input
                value={newValue}
                readOnly
                disabled={me.props.disabled}
                placeholder={me.props.placeholder}
                className={inputClassName}
              />
              {p.hasTrigger ? <Icon usei name="riqi" className={`kuma-calendar-trigger-icon ${showClear ? 'kuma-calendar-trigger-icon__has-clear' : ''}`} /> : null}
              {showClear
                ? (
                  <i
                    className="uxcore-icon uxicon-biaodanlei-tongyongqingchu kuma-icon-close"
                    onClick={this.clearValue}
                  />
                )
                : null}
            </span>
          );
        }}
      </Datepicker>
    );
  }
}

MonthCalendar.displayName = 'MonthCalendar';
MonthCalendar.defaultProps = {
  format: 'YYYY-MM',
  placeholder: '请选择月份',
  allowClear: true,
  onSelect() { },
  locale: 'zh-cn',
  transitionName: 'calendarSlideUp',
  align: {
    offset: [0, 0],
  },
  showDateInput: false,
  hasTrigger: true,
  getPopupContainer: undefined,
  inputWidth: undefined,
};
MonthCalendar.propTypes = {
  allowClear: PropTypes.bool,
  format: PropTypes.string,
  inputWidth: PropTypes.number,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  locale: PropTypes.string,
  getPopupContainer: PropTypes.func,
  hasTrigger: PropTypes.bool,
  showDateInput: PropTypes.bool,
  align: PropTypes.object,
  transitionName: PropTypes.string,
};


export default MonthCalendar;
