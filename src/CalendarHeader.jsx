import React from 'react';
import PropTypes from 'prop-types';
import createClass from 'create-react-class';
import MonthPanel from 'rc-calendar/lib/month/MonthPanel';
import YearPanel from 'rc-calendar/lib/year/YearPanel';
import toFragment from 'rc-util/lib/Children/mapSelf';
import Select from 'uxcore-select2';
import classnames from 'classnames';

const { Option } = Select;

function goMonth(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'months');
  this.props.onValueChange(next);
}

function goYear(direction) {
  const next = this.props.value.clone();
  next.add(direction, 'years');
  this.props.onValueChange(next);
}

const CalendarHeader = createClass({
  propTypes: {
    enablePrev: PropTypes.any,
    enableNext: PropTypes.any,
    prefixCls: PropTypes.string,
    showTimePicker: PropTypes.bool,
    locale: PropTypes.object,
    value: PropTypes.object,
    onValueChange: PropTypes.func,
    yearSelectOffset: PropTypes.number,
    yearSelectTotal: PropTypes.number,
    localeStr: PropTypes.string
  },

  getDefaultProps() {
    return {
      enableNext: 1,
      enablePrev: 1,
      yearSelectOffset: 100,
      yearSelectTotal: 150,
      localeStr: 'zh-cn'
    };
  },

  getInitialState() {
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    return {};
  },

  onSelect(value) {
    this.setState({
      showMonthPanel: 0,
      showYearPanel: 0,
    });
    this.props.onValueChange(value);
  },

  onYearChange(year) {
    const newValue = this.props.value.clone();
    newValue.year(parseInt(year, 10));
    const onValueChange = this.props.onValueChange;
    if (onValueChange) {
      onValueChange(newValue);
    }
  },

  onMonthChange(month) {
    const newValue = this.props.value.clone();
    newValue.month(parseInt(month, 10));
    const onValueChange = this.props.onValueChange;
    if (onValueChange) {
      onValueChange(newValue);
    }
  },

  getSelectContainer() {
    return this.root;
  },

  monthYearElement() {
    const props = this.props;
    const prefixCls = props.prefixCls;
    const locale = props.locale;
    const value = props.value.locale(props.localeStr);
    const monthBeforeYear = locale.monthBeforeYear;
    const selectClassName = `${prefixCls}-${monthBeforeYear ? 'my-select' : 'ym-select'}`;
    const yearValue = value.year();
    const startYear = yearValue - props.yearSelectOffset;
    const endYear = startYear + props.yearSelectTotal;
    const yearOptions = [];
    const monthOptions = [];
    const isLocaleCn = locale.year === '年';
    const suffix = isLocaleCn ? '年' : '';

    for (let i = startYear; i < endYear; i++) {
      yearOptions.push(<Option key={`${i}`} label={`${i + suffix}`}>{i}</Option>);
    }
    const year = (
      <Select
        value={`${yearValue}`}
        className={classnames(`${prefixCls}-year-select`, {
          [`${prefixCls}-cn-select`]: isLocaleCn,
        })}
        showSearch={false}
        dropdownMatchSelectWidth={false}
        dropdownClassName={`${prefixCls}-year-select-dropdown`}
        optionLabelProp="label"
        getPopupContainer={() => this.getSelectContainer()}
        dropdownAlign={{
          offset: [0, -2],
        }}
        onChange={this.onYearChange}
      >
        {yearOptions}
      </Select>
    );
    for (let i = 0; i < 12; i++) {
      const current = value.clone();
      const localeData = value.localeData();
      current.month(i);
      monthOptions.push(
        <Option
          key={`${i}`}
          label={localeData.monthsShort(current)}
        >{localeData.monthsShort(current)}</Option>,
      );
    }
    const month = (
      <Select
        value={`${value.month()}`}
        dropdownMatchSelectWidth={false}
        dropdownClassName={`${prefixCls}-month-select-dropdown`}
        className={classnames(`${prefixCls}-month-select`, {
          [`${prefixCls}-cn-select`]: isLocaleCn,
        })}
        showSearch={false}
        optionLabelProp="label"
        getPopupContainer={() => this.getSelectContainer()}
        dropdownAlign={{
          offset: [0, -2],
        }}
        onChange={this.onMonthChange}
      >
        {monthOptions}
      </Select>
    );
    let my = [];
    if (monthBeforeYear) {
      my = [month, year];
    } else {
      my = [year, month];
    }
    return (<span className={selectClassName}>
      {toFragment(my)}
    </span>);
  },

  showIf(condition, el) {
    return condition ? el : null;
  },

  showMonthPanel() {
    this.setState({
      showMonthPanel: 1,
      showYearPanel: 0,
    });
  },

  showYearPanel() {
    this.setState({
      showMonthPanel: 0,
      showYearPanel: 1,
    });
  },

  render() {
    const props = this.props;
    const { enableNext, enablePrev, prefixCls, locale, value, showTimePicker } = props;
    const state = this.state;
    let PanelClass = null;
    if (state.showMonthPanel) {
      PanelClass = MonthPanel;
    } else if (state.showYearPanel) {
      PanelClass = YearPanel;
    }
    let panel;
    if (PanelClass) {
      panel = (<PanelClass
        locale={locale}
        defaultValue={value}
        rootPrefixCls={prefixCls}
        onSelect={this.onSelect}
      />);
    }
    return (
      <div
        className={`${prefixCls}-header`}
        ref={(c) => {
          this.root = c;
        }}
      >
        <div style={{ position: 'relative' }}>
          {this.showIf(enablePrev,
            <a
              className={`${prefixCls}-prev-year-btn`}
              role="button"
              onClick={this.previousYear}
              title={locale.previousYear}
            />)}
          {this.showIf(enablePrev,
            <a
              className={`${prefixCls}-prev-month-btn`}
              role="button"
              onClick={this.previousMonth}
              title={locale.previousMonth}
            />)}
          {this.monthYearElement(showTimePicker)}
          {this.showIf(enableNext,
            <a
              className={`${prefixCls}-next-month-btn`}
              onClick={this.nextMonth}
              title={locale.nextMonth}
            />)}
          {this.showIf(enableNext,
            <a
              className={`${prefixCls}-next-year-btn`}
              onClick={this.nextYear}
              title={locale.nextYear}
            />)}
        </div>
        {panel}
      </div>
    );
  },
});

export default CalendarHeader;
