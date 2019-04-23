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
      showDateInput: p.showDateInput,
      orient: ['top', 'left'],
      prefixCls: 'kuma-calendar',
    };
    const pickerOptions = {
      disabled: p.disabled,
      align: p.align,
      transitionName: p.transitionName,
      onOpenChange: p.onOpenChange,
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
  allowClear: true,
  showDateInput: false,
  hasTrigger: true,
  getPopupContainer: undefined,
  inputWidth: undefined,
};
YearCalendar.propTypes = {
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

export default YearCalendar;
