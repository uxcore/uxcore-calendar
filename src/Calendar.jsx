const DateTimeFormat = require('gregorian-calendar-format');
const Datepicker = require('rc-calendar/lib/Picker');
const TimePicker = require('rc-time-picker/lib/module/Panel');
const React = require('react');
const classnames = require('classnames');
const GregorianCalendar = require('gregorian-calendar');

const RcCalendar = require('./RcCalendar');
const util = require('./util');
const MonthCalendar = require('./MonthCalendar');
const YearCalendar = require('./YearCalendar');

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

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.clearValue = this.clearValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const me = this;

    me.TimePickerElement = (
      <TimePicker prefixCls="kuma-time-picker-panel" locale={TimePickerLocale[me.props.locale]} />
    );
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
    const timePaneNumber = 1 + p.showHour + p.showSecond;
    const calendarOptions = {
      className: classnames({
        [p.className]: !!p.className,
        'kuma-calendar-two-time-panel': timePaneNumber === 2,
        'kuma-calendar-one-time-panel': timePaneNumber === 1,
      }),
      style: p.style,
      contentRender: p.contentRender,
      disabledDate: p.disabledDate,
      disabledTime: p.disabledTime,
      showSecond: p.showSecond,
      showHour: p.showHour,
      showWeekNumber: p.showWeekNumber,
      showToday: p.showToday,
      timePicker: p.timePicker || (p.showTime ? me.TimePickerElement : null),
      showDateInput: p.showDateInput,
      locale: CalendarLocale[p.locale],
      formatter,
      prefixCls: 'kuma-calendar',
    };
    const pickerOptions = {
      disabled: p.disabled,
      formatter,
      align: p.align,
      transitionName: p.transitionName,
      adjustOrientOnCalendarOverflow: false,
      prefixCls: 'kuma-calendar-picker',
      placement: 'bottomLeft',
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
    if (p.hasTrigger) {
      pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender" />;
    }

    const calendar = <RcCalendar {...calendarOptions} />;

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
          let newValue = value;
          if (newValue) {
            newValue = formatter.format(value);
          } else {
            newValue = '';
          }
          return (
            <span className="kuma-calendar-picker-input" style={triggerStyle} ref={me.saveRef('trigger')}>
              <input
                value={newValue}
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

Calendar.displayName = 'Calendar';
Calendar.defaultProps = {
  format: 'yyyy-MM-dd',
  placeholder: '请选择日期',
  onSelect() { },
  locale: 'zh-cn',
  align: {
    offset: [0, 0],
  },
  showSecond: true,
  showHour: true,
  showDateInput: true,
  hasTrigger: true,
  transitionName: 'calendarSlideUp',
};
Calendar.propTypes = {
  format: React.PropTypes.string,
  inputWidth: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  locale: React.PropTypes.string,
  hasTrigger: React.PropTypes.bool,
  showSecond: React.PropTypes.bool,
  showHour: React.PropTypes.bool,
  getPopupContainer: React.PropTypes.func,
};


Calendar.MonthCalendar = MonthCalendar;
Calendar.YearCalendar = YearCalendar;
Calendar.CalendarPanel = RcCalendar;
Calendar.util = util;

module.exports = Calendar;
