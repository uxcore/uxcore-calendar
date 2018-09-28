import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
const DATE_COL_COUNT = 7;
export default class WeekBody extends React.Component {
  constructor(props) {
    super(props);
    this.getTableCell = this.getTableCell.bind(this);
  }
  getTime() {
    let { startHour, value } = this.props;
    startHour = startHour ? parseInt(startHour) : 9;
    return moment(value)
      .hour(startHour)
      .minute(0);
  }
  getTableCell() {
    const props = this.props;
    let { prefixCls, weekCellRender, slicePiece, startHour, endHour, gapMinute, value } = props;
    gapMinute = gapMinute ? parseInt(gapMinute) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    let now = moment();
    value = value || now;
    let nowDay = value.day();
    const trDateClass = `${prefixCls}-date-tr`;

    let tableHtml = [];
    let current = this.getTime();
    let cloneCurrent = current.clone();

    for (let iIndex = 0; iIndex <= slicePiece; iIndex++) {
      let dateCells = [];
      let computedTime = current.clone();
      for (let jIndex = 0; jIndex < DATE_COL_COUNT; jIndex++) {
        let gapDay = nowDay - 1 - jIndex;
        current =
          gapDay > 0
            ? moment(computedTime).subtract(gapDay, 'days')
            : moment(computedTime).add(Math.abs(gapDay), 'days');
        let dateHtml = null;
        let content = weekCellRender ? weekCellRender(current) : '';
        dateHtml = <div key={`${iIndex}-${jIndex}`}>{content}</div>;
        dateCells.push(
          <td
            key={`${iIndex}-${jIndex}`}
            onClick={props.onSelect.bind(null, current)}
            onMouseEnter={props.onDayHover && props.onDayHover.bind(null, current)}
            role="gridcell"
            className={classnames({
              [`${prefixCls}-date-cell`]: true,
              [`${prefixCls}-prev-date-cell`]: jIndex < nowDay - 1,
              [`${prefixCls}-next-date-cell`]: jIndex > nowDay - 1,
              [`${prefixCls}-current-date-cell`]: jIndex === nowDay - 1,
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
  weekCellRender: PropTypes.func,
};
