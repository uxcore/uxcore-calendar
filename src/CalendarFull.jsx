import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import objectAssign from 'object-assign';
import util from './util';
import i18n from './locale';
import RcCalendarFull from './RcCalendarFull';

const CalendarLocale = {};

CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');

CalendarLocale['zh-cn'] = { ...CalendarLocale['zh-cn'], ...i18n['zh-cn'] };
CalendarLocale['en-us'] = { ...CalendarLocale['en-us'], ...i18n['en-us'] };

const { generalizeFormat } = util;

export default class FullCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type || 'week',
    };
    const { locale } = props;
    this.locale = locale ? locale.toLowerCase().replace('_', '-') : 'zh-cn';
  }

  onSelect(value) {
    if (value) {
      const { onSelect } = this.props;
      const date = value.valueOf();
      onSelect(new Date(date), value.format(generalizeFormat(this.getFormat('time'))));
    }
  }

  getFormat(key) {
    const newKey = key || 'day';
    const { format } = this.props;
    if (format) return format;
    const defaultFormatMap = {
      'zh-cn': { day: 'YYYY-MM-DD', time: 'YYYY-MM-DD HH:mm' },
      'en-us': { day: 'DD/MM/YYYY', time: 'DD/MM/YYYY HH:mm' },
      en: { day: 'DD/MM/YYYY', time: 'DD/MM/YYYY HH:mm' },
    };

    return defaultFormatMap[this.locale][newKey];
  }

  setType(type) {
    this.setState({ type }, () => {
      const { onTypeChange } = this.props;
      onTypeChange(type);
    });
  }

  getDate(date) {
    const me = this;
    const { timezone } = me.props;
    const value = moment(date).locale(this.locale);
    if (timezone) {
      return value.utcOffset(parseInt(timezone, 10) * 60);
    }
    return value;
  }

  getDateValue() {
    const {
      defaultValue,
      timeRender,
      dateRender,
      weekRender,
      scheduleRender,
      contentRender,
      value,
    } = this.props;
    const newOptions = {};
    let cvalue
    if (value || defaultValue) {
      cvalue = this.getDate(value || defaultValue);
      newOptions.defaultValue = cvalue;
    } else {
      cvalue = this.getDate(new Date().getTime());
      newOptions.defaultValue = cvalue;
    }
    if (timeRender) {
      newOptions.timeRender = this.handleCellRender.bind(this, 'timeRender');
    }
    if (weekRender) {
      newOptions.weekRender = this.handleCellRender.bind(this, 'weekRender');
    }
    if (dateRender) {
      newOptions.dateRender = this.handleCellRender.bind(this, 'dateRender');
    }
    if (scheduleRender && typeof scheduleRender === 'function') {
      newOptions.scheduleRender = scheduleRender;
    }
    if (contentRender && typeof contentRender === 'function') {
      newOptions.contentRender = contentRender;
      newOptions.contentRender = (events, current) => {
        if (typeof contentRender === 'function') {
          const date = current.clone();
          date.getTime = current.valueOf;
          date.getDayOfMonth = date.date;
          return contentRender(events, current);
        }
        return current.date();
      };
    }
    return newOptions;
  }

  handleCellRender(renderType, current, value) {
    if (renderType && value && this.props[renderType]) {
      return this.props[renderType](
        moment(current).toDate(),
        value.format(generalizeFormat(this.getFormat('time'))),
      );
    }
    return '';
  }

  render() {
    const me = this;
    const p = me.props;
    const {
      className,
      style,
      prefixCls,
      disabledDate,
      disabledTime,
      format,
      locale,
      value,
      defaultValue,
      onSelect,
      timeRender,
      weekRender,
      dateRender,
      contentRender,
      scheduleRender,
      type,
      ...otherProps
    } = p;

    const { type: stateType } = this.state;
    const calendarOptions = {
      className: classnames({ [className]: !!className }),
      style: p.style,
      prefixCls: 'kuma-calendar-full',
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
          date.getHours = current.hour;
          return p.disabledTime(date);
        }
        return false;
      },
      format: generalizeFormat(this.getFormat()),
      locale: CalendarLocale[this.locale],
      originLocale: this.locale,
      type: stateType,
    };
    const newOption = this.getDateValue();
    objectAssign(calendarOptions, newOption);
    return (
      <div className={prefixCls}>
        <RcCalendarFull
          {...calendarOptions}
          setType={this.setType.bind(this)}
          onSelect={this.onSelect.bind(this)}
          {...otherProps}
        />
      </div>
    );
  }
}

FullCalendar.displayName = 'FullCalendar';
FullCalendar.defaultProps = {
  align: {
    offset: [0, 0],
  },
  locale: 'zh-cn',
  type: 'time',
  format: 'YYYY-MM-DD',
  fullscreen: true,
  showHeader: true,
  prefixCls: 'kuma-full-calendar',
  startHour: 9,
  endHour: 23,
  step: 60,
  onTypeChange() {},
};
FullCalendar.propTypes = {
  align: PropTypes.object,
  prefixCls: PropTypes.string,
  format: PropTypes.string,
  fullscreen: PropTypes.bool,
  locale: PropTypes.string,
  type: PropTypes.string,
  showHeader: PropTypes.bool,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  step: PropTypes.number,
  onSelect: PropTypes.func,
  onTypeChange: PropTypes.func,
  contentRender: PropTypes.func,
  weekRender: PropTypes.func,
  dateRender: PropTypes.func,
  scheduleRender: PropTypes.func,
  timeRender: PropTypes.func,
  headerComponent: PropTypes.object, // The whole header component
  headerRender: PropTypes.func,
  disabledDate: PropTypes.func,
  disabledTime: PropTypes.func,
};
