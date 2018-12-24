/**
 * 提供基础的mini周日历
 * 提供当天事件业务自己渲染
 * 提供基本信息
*/
import React from 'react';
import moment from 'moment';
import classnames from 'classnames';
import PropTypes from 'prop-types';

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
    };
  }

  setValue(newValue) {
    this.setState({
      value: newValue,
    });
  }

  getRenderData() {
    const { locale } = this.props;
    const { value } = this.state;
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
      weekDays[i] = {};
      weekDays[i].label = localeData.weekdaysShort(current);
      weekDays[i].value = current;
    }
    return weekDays;
  }


  handlePrev() {
    const { value } = this.state;
    let newValue = moment(value);
    newValue = newValue.subtract(1, 'w');
    this.setValue(newValue);
  }

  handleNext() {
    const { value } = this.state;
    let newValue = moment(value);
    newValue = moment(newValue).add(1, 'w');
    this.setValue(newValue);
  }

  render() {
    const { prefixCls } = this.props;
    const now = moment();
    const weekDays = this.getRenderData();

    const weekDaysEls = weekDays.map((day) => {
      const { value, label } = day;
      const currentDay = moment(value).day();
      const cls = classnames({
        [`${prefixCls}-day`]: true,
        today: value && moment(value).isSame(now, 'day'),
        rest: currentDay === 6 || currentDay === 0,
        past: moment(value).isBefore(now, 'date'),
      });
      return (
        <div key={value} role="columnheader" title={label} className={cls}>
          <p>{label}</p>
          <p className="header-date">{value && value.date()}</p>
        </div>
      );
    });
    return (
      <div className={`${prefixCls}-week`}>
        <span className={`${prefixCls}-prev-btn`} onClick={this.handlePrev.bind(this)} />
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
