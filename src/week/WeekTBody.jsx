import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { getTime, getTimeLine } from '../util';
const DATE_COL_COUNT = 8;
export default class WeekBody extends React.Component {
  constructor(props) {
    super(props);
    this.getTableCell = this.getTableCell.bind(this);
  }
  getTableCell() {
    const props = this.props;
    let {
      prefixCls,
      weekRender,
      slicePiece,
      startHour,
      endHour,
      gapMinute,
      value,
      disabledTime,
      disabledDate,
      contentRender,
    } = props;

    gapMinute = gapMinute ? parseInt(gapMinute) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    let now = moment();
    value = value || now;

    let nowDay = value.day();
    nowDay = nowDay === 0 ? 7 : nowDay;
    const trDateClass = `${prefixCls}-date-tr`;
    let tableHtml = [];
    let current = getTime(props);
    let cloneCurrent = current.clone();

    for (let iIndex = 0; iIndex <= slicePiece + 1; iIndex++) {
      let dateCells = [];
      let computedTime = current.clone();
      let leftTimeLine = '';
      if (iIndex <= slicePiece) {
        leftTimeLine = getTimeLine(props, computedTime);
      }

      for (let jIndex = 0; jIndex < DATE_COL_COUNT; jIndex++) {
        if (jIndex === 0 && iIndex <= slicePiece) {
          dateCells.push(leftTimeLine);
          continue;
        }
        let gapDay = nowDay - jIndex;
        let dateHtml = null;
        let disableTime = false;
        let disableDate = false;
        current =
          gapDay > 0
            ? moment(computedTime).subtract(gapDay, 'days')
            : moment(computedTime).add(Math.abs(gapDay), 'days');

        if (disabledDate) {
          if (disabledDate(current, value)) {
            disableDate = true;
          }
        }
        if (disabledTime) {
          if (disabledTime(current, value)) {
            disableTime = true;
          }
        }

        if (jIndex !== 0 && weekRender) {
          dateHtml = weekRender(current, value);
        }

        let disabled = disableTime || disableDate;
        dateCells.push(
          <td
            key={`${iIndex}-${jIndex}`}
            onClick={disabled ? null : props.onSelect.bind(null, current)}
            onMouseEnter={
              disabled ? null : props.onDayHover && props.onDayHover.bind(null, current)
            }
            role="gridcell"
            className={classnames({
              [`${prefixCls}-date-cell`]: true,
              [`${prefixCls}-prev-date-cell`]: jIndex < nowDay - 1,
              [`${prefixCls}-next-date-cell`]: jIndex > nowDay - 1,
              [`${prefixCls}-current-date-cell`]: current.isSame(now, 'd'),
              [`${prefixCls}-date-disable-cell`]: disabled,
              [`${prefixCls}-date-disable-time`]: disableTime,
              [`${prefixCls}-date-disable-date`]: disableDate,
            })}
          >
            {dateHtml}
          </td>
        );
      }
      cloneCurrent = moment(cloneCurrent).add(gapMinute, 'm');
      current = cloneCurrent;
      tableHtml.push(
        <tr key={iIndex} role="row" className={trDateClass}>
          {dateCells}
        </tr>
      );
    }
    return tableHtml;
  }

  render() {
    const { prefixCls } = this.props;
    return <tbody className={`${prefixCls}-tbody`}>{this.getTableCell()}</tbody>;
  }
}

WeekBody.displayName = 'WeekBody';
WeekBody.defaultProps = {};
WeekBody.propTypes = {
  prefixCls: PropTypes.string,
  weekRender: PropTypes.func,
};
