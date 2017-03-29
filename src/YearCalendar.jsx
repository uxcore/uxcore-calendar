const Datepicker = require('rc-calendar/lib/Picker');
const RcYearCalendar = require('./RcYearCalendar');
const React = require('react');
const moment = require('moment');
const Icon = require('uxcore-icon');
const util = require('./util');

const CalendarLocale = {};

CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');


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
      className: p.className,
      style: p.style,
      locale: CalendarLocale[p.locale],
      showDateInput: p.showDateInput,
      orient: ['top', 'left'],
      prefixCls: 'kuma-calendar',
      disabledDate: (current) => {
        if (typeof p.disabledDate === 'function' && current) {
          const date = current.clone();
          date.getTime = current.valueOf;
          return p.disabledDate(date);
        }
        return false;
      },
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
                value={value && value.format(p.format)}
                readOnly
                disabled={me.props.disabled}
                placeholder={this.props.placeholder}
                className="kuma-input"
              />
              {p.hasTrigger ? <Icon name="riqi" className={`kuma-calendar-trigger-icon ${showClear ? 'kuma-calendar-trigger-icon__has-clear' : ''}`} /> : null}
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
  format: React.PropTypes.string,
  inputWidth: React.PropTypes.number,
  placeholder: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  locale: React.PropTypes.string,
  getPopupContainer: React.PropTypes.func,
};

module.exports = YearCalendar;
