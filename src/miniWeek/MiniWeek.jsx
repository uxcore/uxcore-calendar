/**
 * 提供基础的mini周日历
 * 提供当天事件业务自己渲染
 * 提供基本信息
*/
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Assign from 'object-assign';
import { handlePropsEvents, getFormatDate, inSameWeek } from '../calendarFullUtil';

const DATE_COL_COUNT = 7;
const proptypes = {
  prefixCls: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  events: PropTypes.array,
  locale: PropTypes.string,
  scheduleRender: PropTypes.func,
};
const defaultProps = {
  prefixCls: 'kuma-calendar-mini',
  value: new Date(),
  locale: 'zh-cn',
  events: [],
  scheduleRender: null,
};
class MiniWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || new Date(),
      weekDays: [],
    };
  }

  componentDidMount() {
    this.setWeekDays();
  }

  setWeekDays() {
    this.setState({
      weekDays: this.getRenderData(),
    });
  }

  getVisibleEvents(eventsHash) {
    const objectKeys = Object.keys(eventsHash);
    const resultEventsHash = {};
    objectKeys.forEach((eventKey) => {
      resultEventsHash[eventKey] = { events: [] };
      const { events } = eventsHash[eventKey];
      const visibleEvents = events.filter(event => this.evaluateEventVisible(event, eventKey));
      resultEventsHash[eventKey].events = visibleEvents;
    });
    return resultEventsHash;
  }

  setValue(newValue) {
    this.setState({
      value: newValue,
      weekDays: this.getRenderData(newValue),
    });
  }

  getRenderShow() {
    const { weekDays } = this.state;
    if (weekDays && weekDays.length) {
      const { value: firstValue } = weekDays[0];
      const { value: endValue } = weekDays[weekDays.length - 1];
      const firstMonth = getFormatDate(firstValue, 'YYYY-MM');
      const endMonth = getFormatDate(endValue, 'YYYY-MM');
      if (firstMonth === endMonth) {
        return firstMonth;
      }
      return `${firstMonth}-${endMonth}`;
    }
    return '--';
  }

  getRenderData(newValue) {
    const { locale } = this.props;
    const { value: stateValue } = this.state;
    const value = newValue || stateValue;
    const { events } = this.props;
    const visibleEvents = {};
    handlePropsEvents(events, visibleEvents);
    this.getVisibleEvents(visibleEvents);
    let current = moment(value || new Date()).locale(locale);
    const cloneValue = current.clone();
    const localeData = current.localeData();
    const currentDay = moment(value).format('E');
    const weekDays = [];

    for (let i = 0; i < DATE_COL_COUNT; i++) {
      const diff = currentDay - i;
      if (diff < 0) {
        current = moment(cloneValue).add(Math.abs(diff), 'd');
      } else {
        current = moment(cloneValue).subtract(diff, 'd');
      }
      const key = getFormatDate(current, 'YYYY-MM-DD');

      weekDays[i] = {};
      weekDays[i].label = localeData.weekdaysShort(current);
      weekDays[i].value = current;
      weekDays[i].events = visibleEvents[key] ? visibleEvents[key].events : null;
    }
    return weekDays;
  }

  evaluateEventVisible(event, date) {
    const { value } = this.state;
    return inSameWeek(date, value);
  }

  handlePrev() {
    const { value } = this.state;
    const newValue = moment(value).subtract(1, 'w');
    this.setValue(newValue);
  }

  handleNext() {
    const { value } = this.state;
    const newValue = moment(value).add(1, 'w');
    this.setValue(newValue);
  }

  generateRender(dayInfo) {
    const { value } = dayInfo;
    this.setValue(value);
    const renderInfo = {};
    Assign(renderInfo, dayInfo);
    renderInfo.value = moment(value).toDate();
    const { scheduleRender } = this.props;
    if (scheduleRender) {
      scheduleRender(renderInfo);
    }
  }


  render() {
    const { prefixCls } = this.props;
    const { weekDays } = this.state;
    const now = moment();
    const showTitle = this.getRenderShow();
    const weekDaysEls = weekDays.map((day) => {
      const { value, label, events } = day;
      const { value: stateValue } = this.state;
      const currentDay = moment(value).day();
      const cls = classnames({
        [`${prefixCls}-day`]: true,
        today: value && moment(value).isSame(now, 'day'),
        rest: currentDay === 6 || currentDay === 0,
        past: moment(value).isBefore(now, 'date'),
        active: moment(value).isSame(stateValue),
        import: !!value.import,

      });
      return (
        <div
          key={value}
          title={label}
          className={cls}
          onClick={this.generateRender.bind(this, day)}
        >
          <p>{label}</p>
          <p className={classnames('header-date', {
            event: !!events,
          })}
          >
            {value && value.date()}
          </p>
        </div>
      );
    });
    return (
      <div className={`${prefixCls}-week`}>
        <span className={`${prefixCls}-prev-btn`} onClick={this.handlePrev.bind(this)} />
        <div className="title">{showTitle}</div>
        <div className={`${prefixCls}-date`}>{weekDaysEls}</div>
        <span className={`${prefixCls}-next-btn`} onClick={this.handleNext.bind(this)} />
      </div>
    );
  }
}
MiniWeek.displayName = 'MiniWeek';
MiniWeek.propTypes = proptypes;
MiniWeek.defaultProps = defaultProps;

export default MiniWeek;
