import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
export default class WeekBody extends React.Component {
  constructor(props) {
    super(props);
    this.getTableCell = this.getTableCell.bind(this);
  }

  getTime() {
    let { startHour, value, defaultValue } = this.props;
    startHour = startHour ? parseInt(startHour) : 9;
    let current = value || defaultValue || moment();
    return current.hour(startHour).minute(0);
  }
  getTableCell() {
    const props = this.props;
    let { prefixCls, timeCellRender, slicePiece, startHour, endHour, gapMinute, format } = props;
    gapMinute = gapMinute ? parseInt(gapMinute) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    let now = moment();
    let nowDay = now.day();

    const trDateClass = `${prefixCls}-time-tr`;
    let tableHtml = [];
    let current = this.getTime();
    let cloneCurrent = current.clone();
    let dataCount = props.dataCount;

    for (let iIndex = 0; iIndex <= slicePiece; iIndex++) {
      let dateCells = [];
      let computedTime = current.clone();
      for (let jIndex = 0; jIndex < dataCount; jIndex++) {
        let dateHtml = null;
        let content = timeCellRender ? timeCellRender(current) : '';
        dateHtml = <div key={`${iIndex}-${jIndex}`}>{content}</div>;
        dateCells.push(
          <td
            key={`${iIndex}-${jIndex}`}
            onClick={props.onSelect.bind(null, current)}
            onMouseEnter={props.onDayHover && props.onDayHover.bind(null, current)}
            role="gridcell"
            className={classnames({
              [`${prefixCls}-time-cell`]: true,
              [`${prefixCls}-prev-time-cell`]: jIndex < nowDay - 1,
              [`${prefixCls}-next-time-cell`]: jIndex > nowDay - 1,
              [`${prefixCls}-current-time-cell`]: jIndex === nowDay - 1,
            })}
          >
            {dateHtml}
          </td>
        );
        current = moment(computedTime).add(1, 'days');
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
  timeCellRender: PropTypes.func,
};
