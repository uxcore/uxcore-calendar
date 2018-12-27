import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarMixin from 'rc-calendar/lib/mixin/CalendarMixin';
import CommonMixin from 'rc-calendar/lib/mixin/CommonMixin';
import CalendarFullHeader from './CalendarFullHeader';

import DateTable from './date/DateTable';
import WeekTable from './fullWeek/WeekTable';
import TimeTable from './fullTime/TimeTable';


const FullCalendar = createReactClass({
  propTypes: {
    defaultType: PropTypes.string,
    type: PropTypes.string,
    prefixCls: PropTypes.string,
    locale: PropTypes.object,
    setType: PropTypes.func,
    fullscreen: PropTypes.bool,
    selectedValue: PropTypes.any,
    onSelect: PropTypes.func,
    dateRender: PropTypes.func,
    weekRender: PropTypes.func,
    showTypeSwitch: PropTypes.bool,
    // headerComponents: PropTypes.array,
    headerComponent: PropTypes.object, // The whole header component
    headerRender: PropTypes.func,
    showHeader: PropTypes.bool,
    disabledDate: PropTypes.func,
    showCount: PropTypes.number,
  },
  mixins: [CommonMixin, CalendarMixin],
  getDefaultProps() {
    return {
      defaultType: 'month',
      fullscreen: false,
      showTypeSwitch: true,
      showHeader: true,
      showCount: 1,
      setType() { },
    };
  },

  onHeaderSelect(value, formatValue, momentValue) {
    const resultVal = momentValue || value;
    const { originLocale } = this.props;
    this.setValue(moment(resultVal).locale(originLocale));
  },

  setType(type) {
    const { setType } = this.props;
    setType(type);
  },

  getDateTableElement() {
    const {
      locale, prefixCls, disabledDate, onSelect, ...others
    } = this.props;
    const { value, selectedValue } = this.state;
    return (
      <DateTable
        locale={locale}
        prefixCls={prefixCls}
        value={value}
        onSelect={this.handleSelect}
        selectedValue={selectedValue}
        disabledDate={disabledDate}
        seeEventsDetail={this.seeEventsDetail}
        {...others}
      />
    );
  },
  getWeekTableElement() {
    const {
      locale, prefixCls, disabledDate, ...others
    } = this.props;
    const { value } = this.state;

    return (
      <WeekTable
        locale={locale}
        onSelect={this.onSelect}
        prefixCls={`${prefixCls}-week-panel`}
        value={value}
        disabledDate={disabledDate}
        {...others}
      />
    );
  },
  getTimeTableElement() {
    const {
      locale, prefixCls, showCount, ...others
    } = this.props;
    const { value } = this.state;

    return (
      <TimeTable
        locale={locale}
        onSelect={this.onSelect}
        prefixCls={`${prefixCls}-time-panel`}
        value={value}
        showCount={showCount}
        {...others}
      />
    );
  },
  getPanel() {
    const { type } = this.props;
    switch (type) {
      case 'month':
        return this.getDateTableElement();
      case 'week':
        return this.getWeekTableElement();
      case 'time':
        return this.getTimeTableElement();
      default:
        return '';
    }
  },

  handleSelect(value) {
    this.onSelect(value);
  },

  seeEventsDetail(type, value) {
    const { originLocale } = this.props;
    this.setValue(moment(value).locale(originLocale));
    this.setType(type);
  },

  initHeader() {
    const {
      prefixCls, showHeader, headerComponent, headerRender, type,
    } = this.props;

    const { value } = this.state;
    let header = null;
    if (showHeader) {
      if (headerRender) {
        header = headerRender(moment(value).toDate(), type);
      } else {
        const TheHeader = headerComponent || CalendarFullHeader;
        header = (
          <TheHeader
            key="calendar-header"
            prefixCls={`${prefixCls}`}
            type={type}
            value={value}
            typeChange={this.setType}
            onValueChange={this.onHeaderSelect}
            {...this.props}
          />
        );
      }
    }
    return header;
  },
  render() {
    const { prefixCls, fullscreen } = this.props;
    const header = this.initHeader();
    const children = [
      header,
      <div key="calendar-body" className={`${prefixCls}-calendar-body`}>
        {this.getPanel()}
      </div>,
    ];

    const className = [`${prefixCls}-full`];

    if (fullscreen) {
      className.push(`${prefixCls}-fullscreen`);
    }

    return this.renderRoot({
      children,
      className: className.join(' '),
    });
  },
});

export default FullCalendar;
