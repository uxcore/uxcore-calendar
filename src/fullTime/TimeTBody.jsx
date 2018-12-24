import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import { getTime } from '../calendarFullUtil';
import LeftTimeLine from '../LeftTimeLine';

export default class WeekBody extends React.Component {
  constructor(props) {
    super(props);
    this.getTableCell = this.getTableCell.bind(this);
  }

  getTableCell() {
    const {
      prefixCls,
      timeRender,
      slicePiece,
      step,
      value,
      disabledTime,
      dataCount,
      onSelect,
      onDayHover,
    } = this.props;

    const newStep = step ? parseInt(step, 10) : 60;
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
        leftTimeLine = <LeftTimeLine prefixCls={prefixCls} step={step} current={computedTime} key={iIndex} />;
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
      cloneCurrent = moment(cloneCurrent).add(newStep, 'm');
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
WeekBody.defaultProps = {
  prefixCls: '',
  timeRender: null,
  slicePiece: 0,
  step: 60,
  value: {},
  disabledTime: null,
  dataCount: 0,
  onSelect: null,
  onDayHover: null,
};
WeekBody.propTypes = {
  prefixCls: PropTypes.string,
  timeRender: PropTypes.func,
  slicePiece: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.object,
  disabledTime: PropTypes.func,
  dataCount: PropTypes.number,
  onSelect: PropTypes.func,
  onDayHover: PropTypes.func,
};
