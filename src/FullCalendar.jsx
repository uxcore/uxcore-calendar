import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import util from './util';
import classnames from 'classnames';
import moment from 'moment';
import i18n from './locale';
import RcFullCalendar from './RcFullCalendar';
const CalendarLocale = {};

CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');

CalendarLocale['zh-cn'] = { ...CalendarLocale['zh-cn'], ...i18n['zh-cn'] };
CalendarLocale['en-us'] = { ...CalendarLocale['en-us'], ...i18n['en-us'] };

const { getCalendarContainer, generalizeFormat } = util;

export default class FullCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: props.type || props.defaultType || 'date',
      value: props.value || props.defaultValue,
    };
  }
  onSelect(value) {
    if (value) {
      const date = value.valueOf();
      this.props.onSelect(new Date(date), value.format(generalizeFormat(this.getFormat('time'))));
    }
  }
  handleCellRender(type, value) {
    if (value && value) {
      return this.props[type](value.format(generalizeFormat(this.getFormat('time'))));
    }
  }

  getFormat(key) {
    key = key || 'day';
    let { format, locale, type } = this.props;
    if (format) return format;
    const defaultFormatMap = {
      'zh-cn': { day: 'YYYY-MM-DD', time: 'YYYY-MM-DD HH:mm' },
      'en-us': { day: 'DD/MM/YYYY', time: 'DD/MM/YYYY HH:mm' },
      en: { day: 'DD/MM/YYYY', time: 'DD/MM/YYYY HH:mm' },
    };

    return defaultFormatMap[locale][key];
  }
  setType(type) {
    this.setState({ type: type });
    this.props.onTypeChange(type);
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
  getDateValue(calendarOptions) {
    let { value, defaultValue } = this.props;
    if (value || defaultValue) {
      let cvalue = this.getDate(value || defaultValue);
      calendarOptions.defaultValue = cvalue;
    } else {
      let cvalue = this.getDate(new Date().getTime());
      calendarOptions.defaultValue = cvalue;
    }
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
      type,
      value,
      defaultValue,
      onSelect,
      timeCellRender,
      weekCellRender,
      dateRender,
      ...otherProps
    } = p;
    const calendarOptions = {
      className: classnames({ [className]: !!className }),
      style: p.style,
      prefixCls: 'kuma-full-calendar',
      disabledDate: current => {
        if (typeof p.disabledDate === 'function' && current) {
          const date = current.clone();
          date.getTime = current.valueOf;
          return p.disabledDate(date);
        }
        return false;
      },
      disabledTime: current => {
        if (typeof p.disabledTime === 'function' && current) {
          const date = current.clone();
          date.getTime = current.valueOf;
          date.getHours = current.hour;
          return p.disabledTime(date);
        }
        return false;
      },
      format: generalizeFormat(this.getFormat()),
      locale: CalendarLocale[locale],
      type: this.state.type,
    };
    this.getDateValue(calendarOptions);

    return (
      <div className={prefixCls}>
        <RcFullCalendar
          {...calendarOptions}
          setType={this.setType.bind(this)}
          onSelect={this.onSelect.bind(this)}
          timeCellRender={this.handleCellRender.bind(this, 'timeCellRender')}
          weekCellRender={this.handleCellRender.bind(this, 'weekCellRender')}
          dateRender={this.handleCellRender.bind(this, 'dateCellRender')}
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
  fullscreen: true,
  showHeader: true,
  defaultType: 'date',
  prefixCls: 'kuma-full-calendar',
  onSelect() {},
  onTypeChange() {},
  weekCellRender() {},
};
FullCalendar.propTypes = {
  prefixCls: PropTypes.string,
  format: PropTypes.string,
  fullscreen: PropTypes.bool,
  locale: PropTypes.string,
  type: PropTypes.string,
  defaultType: PropTypes.string,
  showHeader: PropTypes.bool,
  onSelect: PropTypes.func,
  onTypeChange: PropTypes.func,
  getPopupContainer: PropTypes.func,
  weekCellRender: PropTypes.func,
  dateCellRender: PropTypes.func,
  contentRender: PropTypes.func,
  timeCellRender: PropTypes.func,
  headerComponents: PropTypes.array,
  headerComponent: PropTypes.object, // The whole header component
  headerRender: PropTypes.func,
  disabledDate: PropTypes.func,
  disabledTime: PropTypes.func,
};
