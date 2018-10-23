import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { getTime, getTimeLine } from '../util';

export default class WeekBody extends React.Component {
  constructor(props) {
    super(props);
    this.getTableCell = this.getTableCell.bind(this);
  }

  getTableCell() {
    let {
      prefixCls,
      timeRender,
      slicePiece,
      startHour,
      endHour,
      gapMinute,
      value,
      disabledTime,
      dataCount,
      onSelect,
      onDayHover,
    } = this.props;

    gapMinute = gapMinute ? parseInt(gapMinute, 10) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    const now = moment();
    const nowDay = now.day();

    const trDateClass = `${prefixCls}-tr`;
    const tableHtml = [];
    let current = getTime(this.props);
    let cloneCurrent = current.clone();

    for (let iIndex = 0; iIndex <= slicePiece + 1; iIndex++) {
      const dateCells = [];
      const computedTime = current.clone();
      let leftTimeLine = '';
      if (iIndex <= slicePiece) {
        leftTimeLine = getTimeLine(this.props, computedTime);
      }

      for (let jIndex = 0; jIndex < dataCount + 1; jIndex++) {
        if (jIndex === 0 && iIndex <= slicePiece) {
          dateCells.push(leftTimeLine);
        } else {
          let dateHtml = null;
          let disabled = false;

          if (disabledTime) {
            if (disabledTime(current, value)) {
              disabled = true;
            }
          }

          if (jIndex !== 0 && timeRender) {
            dateHtml = timeRender(current, value);
          }
          dateCells.push(
            <td
              key={`${iIndex}-${jIndex}`}
              onClick={disabled ? null : onSelect.bind(null, current)}
              onMouseEnter={
                disabled ? null : onDayHover && onDayHover.bind(null, current)
              }
              role="gridcell"
              className={classnames({
                [`${prefixCls}-time-cell`]: true,
                [`${prefixCls}-prev-time-cell`]: jIndex < nowDay - 1,
                [`${prefixCls}-next-time-cell`]: jIndex > nowDay - 1,
                [`${prefixCls}-current-time-cell`]: current.isSame(now, 'h'),
                [`${prefixCls}-time-disabled-cell`]: disabled,
              })}
            >
              {dateHtml}
            </td>,
          );
          current = moment(computedTime).add(1, 'days');
        }
      }
      cloneCurrent = moment(cloneCurrent).add(gapMinute, 'm');
      current = cloneCurrent;
      tableHtml.push(
        <tr key={iIndex} role="row" className={trDateClass}>
          {dateCells}
        </tr>,
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
  timeRender: PropTypes.func,
};
