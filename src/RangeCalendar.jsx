import Datepicker from 'rc-calendar/lib/Picker';
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import Icon from 'uxcore-icon';
import TimePicker from './timePicker/Normal';
import RcRangeCalendar from './RcRangeCalendar';
import util from './util';
import i18n from './locale';
import DateRangeSelector from "./DateRangeSelector";
import Tooltip from 'uxcore-tooltip'

const CalendarLocale = {};

CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');

CalendarLocale['zh-cn'] = { ...CalendarLocale['zh-cn'], ...i18n['zh-cn'] };
CalendarLocale['en-us'] = { ...CalendarLocale['en-us'], ...i18n['en-us'] };

const { getCalendarContainer, generalizeFormat } = util;

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clearValue = this.clearValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.TimePickerElement = (
      <TimePicker prefixCls="kuma-time-picker-panel"/>
    );
  }

  getTriggerNode() {
    return this.trigger;
  }

  getDate(date = []) {
    const me = this;
    const { timezone, locale } = me.props;
    const value = date.map(item => moment(item).locale(locale));
    if (timezone) {
      return value.map(item => item.utcOffset(parseInt(timezone, 10) * 60));
    }
    return value;
  }

  getFormat() {
    const { format, locale, showTime } = this.props;
    if (format) return format;
    const defaultFormatMap = {
      'zh-cn': {
        day: 'YYYY-MM-DD',
        time: 'YYYY-MM-DD HH:mm:ss',
      },
      'en-us': {
        day: 'DD/MM/YYYY',
        time: 'DD/MM/YYYY HH:mm:ss',
      },
      en: {
        day: 'DD/MM/YYYY',
        time: 'DD/MM/YYYY HH:mm:ss',
      },
    };
    return defaultFormatMap[locale][showTime ? 'time' : 'day'];
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
    const { onSelect } = this.props;
    if (v) {
      const date = v.map(item => new Date(item.valueOf()));
      const formattedDate = v.map(item => item.format(generalizeFormat(this.getFormat())));
      onSelect(date, formattedDate);
    } else {
      onSelect(v, v);
    }
  }

  handleQuickRangeSelect = (start, end) => {
    this.handleChange([moment(start), moment(end)])
    this.hideQuickSelector()
  };

  hideQuickSelector() {
    const overlay = document.querySelector('.date-quick-range-selector')
    if (overlay) {
      overlay.classList.add('kuma-tooltip-hidden')
    }
  }
  render() {
    const me = this;
    const p = me.props;
    const timePaneNumber = 1 + p.showHour + p.showSecond;
    const calendarOptions = {
      className: classnames({
        [p.className]: !!p.className,
        'kuma-calendar-two-time-panel': timePaneNumber === 2,
        'kuma-calendar-one-time-panel': timePaneNumber === 1,
        [`kuma-calendar-${p.size}`]: !!p.size,
      }),
      style: p.style,
      contentRender: (current, value) => {
        if (typeof p.contentRender === 'function') {
          const date = current.clone();
          date.getTime = current.valueOf;
          date.getDayOfMonth = date.date;
          return p.contentRender(date, value);
        }
        return current.date();
      },
      disabledDate: (current) => {
        if (typeof p.disabledDate === 'function' && current) {
          const date = current.clone();
          date.getTime = current.valueOf;
          return p.disabledDate(date);
        }
        return false;
      },
      disabledTime: (current) => {
        if (typeof p.disabledTime === 'function' && current) {
          const date = current.clone();
          date.getTime = current.valueOf;
          return p.disabledTime(date);
        }
        return false;
      },
      showSecond: p.showSecond,
      showHour: p.showHour,
      format: generalizeFormat(this.getFormat()),
      showWeekNumber: p.showWeekNumber,
      showToday: p.showToday,
      timePicker: p.timePicker || (p.showTime ? me.TimePickerElement : null),
      showDateInput: p.showDateInput,
      locale: CalendarLocale[p.locale],
      localeStr: p.locale,
      prefixCls: 'kuma-calendar',
      renderSidebar: p.renderSidebar ? p.renderSidebar : () => null,
      renderFooter: p.renderFooter ? p.renderFooter : () => null
    };
    const pickerOptions = {
      disabled: p.disabled,
      align: p.align,
      transitionName: p.transitionName,
      onOpenChange: p.onOpenChange,
      adjustOrientOnCalendarOverflow: false,
      prefixCls: 'kuma-calendar-picker',
      placement: 'bottomLeft',
      getCalendarContainer: p.getPopupContainer || getCalendarContainer,
    };

    if (p.value && Array.isArray(p.value) && p.value.length !== 0) {
      const value = this.getDate(p.value);
      pickerOptions.value = value;
      calendarOptions.defaultValue = value;
    } else {
      pickerOptions.value = null;
      calendarOptions.defaultValue = null;
    }

    if (p.defaultValue && Array.isArray(p.defaultValue) && p.defaultValue.length !== 0) {
      const value = this.getDate(p.defaultValue);
      calendarOptions.defaultValue = value;
      pickerOptions.defaultValue = value;
    } else {
      const thisMonth = new Date().getMonth();
      const value = [
        new Date().getTime(),
        new Date().setMonth(thisMonth + 1),
      ];
      calendarOptions.defaultValue = this.getDate(value);
    }
    if (p.hasTrigger) {
      pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender"/>;
    }

    const calendar = <RcRangeCalendar {...calendarOptions} />;

    const triggerStyle = {};
    if (p.inputWidth) {
      triggerStyle.width = `${p.inputWidth}px`;
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
          const showClear = p.allowClear ? (value && !p.disabled) : false;
          let newValue = value;
          if (newValue) {
            newValue = newValue.map(item => moment(item).format(generalizeFormat(this.getFormat()))).join(' - ');
          } else {
            newValue = '';
          }
          const field =
            <span className={triggerClassName} style={triggerStyle} ref={me.saveRef('trigger')}>
              <input
                value={newValue}
                readOnly
                disabled={me.props.disabled}
                placeholder={me.props.placeholder || calendarOptions.locale.placeholder}
                className={inputClassName}
              />
              {p.hasTrigger ? <Icon usei name="riqi" className={`kuma-calendar-trigger-icon ${showClear ? 'kuma-calendar-trigger-icon__has-clear' : ''}`}/> : null}
              {showClear ? <i className="uxcore-icon uxicon-biaodanlei-tongyongqingchu kuma-icon-close" onClick={this.clearValue}/> : null}
            </span>;
          return (
            p.quickSelectRanges.length
              ? <Tooltip
                overlayClassName={'date-quick-range-selector'}
                overlay={() => {
                  return (
                    <DateRangeSelector
                      dateRanges={p.quickSelectRanges}
                      onSelect={me.handleQuickRangeSelect}
                    />
                  )
                }}
                placement="bottomLeft"
              >
                {field}
              </Tooltip>
              :
              field
          );
        }}
      </Datepicker>
    );
  }
}

Calendar.displayName = 'Calendar';
Calendar.defaultProps = {
  placeholder: '',
  onSelect() {
  },
  locale: 'zh-cn',
  align: {
    offset: [0, 0],
  },
  allowClear: true,
  showSecond: true,
  showHour: true,
  showDateInput: true,
  hasTrigger: true,
  transitionName: 'calendarSlideUp',
  quickSelectRanges: []
};
Calendar.propTypes = {
  format: PropTypes.string,
  inputWidth: PropTypes.number,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  locale: PropTypes.string,
  allowClear: PropTypes.bool,
  hasTrigger: PropTypes.bool,
  showSecond: PropTypes.bool,
  showTime: PropTypes.bool,
  showHour: PropTypes.bool,
  getPopupContainer: PropTypes.func,
  quickSelectRanges: PropTypes.array
};


export default Calendar;
