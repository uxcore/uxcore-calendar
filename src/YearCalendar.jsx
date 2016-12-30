const DateTimeFormat = require('gregorian-calendar-format');
const Datepicker = require('rc-calendar/lib/Picker');
const RcYearCalendar = require('./RcYearCalendar');
const util = require('./util');
const React = require('react');
const GregorianCalendar = require('gregorian-calendar');

const defaultValueLocale = {};
const CalendarLocale = {};
const TimePickerLocale = {};

defaultValueLocale['zh-cn'] = require('gregorian-calendar/lib/locale/zh_CN');
defaultValueLocale['en-us'] = require('gregorian-calendar/lib/locale/en_US');
CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');
TimePickerLocale['zh-cn'] = require('rc-time-picker/lib/locale/zh_CN');
TimePickerLocale['en-us'] = require('rc-time-picker/lib/locale/en_US');

const { getCalendarContainer } = util;

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

  getGregorianCalendarDate(date) {
    const me = this;
    const { timezone, locale } = me.props;
    if (timezone) {
      defaultValueLocale[locale].timezoneOffset = parseInt(timezone, 10) * 60;
    } else {
      defaultValueLocale[locale].timezoneOffset = -new Date().getTimezoneOffset();
    }
    const value = new GregorianCalendar(defaultValueLocale[locale]);
    value.setTime(new Date(date).valueOf());
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
    const formatter = new DateTimeFormat(p.format);
    if (v) {
      const date = v.getTime();
      const value = this.getGregorianCalendarDate(date);
      this.props.onSelect(new Date(date), formatter.format(value));
    } else {
      this.props.onSelect(v, v);
    }
  }

  render() {
    const me = this;
    const p = me.props;
    const formatter = new DateTimeFormat(p.format);
    const calendarOptions = {
      className: p.className,
      style: p.style,
      locale: CalendarLocale[p.locale],
      showDateInput: p.showDateInput,
      orient: ['top', 'left'],
      prefixCls: 'kuma-calendar',
    };
    const pickerOptions = {
      disabled: p.disabled,
      align: p.align,
      formatter,
      transitionName: p.transitionName,
      adjustOrientOnCalendarOverflow: false,
      prefixCls: 'kuma-calendar-picker',
      getCalendarContainer: p.getPopupContainer || getCalendarContainer,
    };

    if (p.value) {
      const value = this.getGregorianCalendarDate(p.value);
      pickerOptions.value = calendarOptions.defaultValue = value;
    } else {
      pickerOptions.value = calendarOptions.defaultValue = null;
    }

    if (p.defaultValue) {
      const value = this.getGregorianCalendarDate(p.defaultValue);
      calendarOptions.defaultValue = value;
      pickerOptions.defaultValue = value;
    } else {
      const value = this.getGregorianCalendarDate(new Date().getTime());
      calendarOptions.defaultValue = value;
    }
    
    const calendar = <RcYearCalendar {...calendarOptions} />;

    const triggerStyle = {};
    if (p.inputWidth) {
      triggerStyle.width = p.inputWidth;
    }

    return (
      <Datepicker
        calendar={calendar}
        onChange={me.handleChange}
        {...pickerOptions}
      >
        {({ value }) => {
          const showClear = value && !p.disabled;
          return (
            <span className="kuma-calendar-picker-input" style={triggerStyle} ref={me.saveRef('trigger')}>
              <input
                value={value && formatter.format(value)}
                readOnly
                disabled={me.props.disabled}
                placeholder={this.props.placeholder}
                className="kuma-input"
              />
              {p.hasTrigger ? <i className={`kuma-icon kuma-icon-calender ${showClear ? 'kuma-icon-calender__has-clear' : ''}`} /> : null}
              {showClear
                ? <i className="kuma-icon kuma-icon-close" onClick={this.clearValue} />
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
  format: 'yyyy',
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
  format: React.PropTypes.string,
  inputWidth: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  locale: React.PropTypes.string,
  getPopupContainer: React.PropTypes.func,
};

module.exports = YearCalendar;
