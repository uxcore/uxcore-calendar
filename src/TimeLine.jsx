import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getTime, getTimeLine } from './util';
class TimeLine extends React.Component {
  constructor(props) {
    super(props);
  }
  getTableCell() {
    const props = this.props;
    let { prefixCls, slicePiece, startHour, endHour, gapMinute } = props;

    gapMinute = gapMinute ? parseInt(gapMinute) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    let tableHtml = [];
    let current = getTime(props);
    let cloneCurrent = current.clone();

    for (let iIndex = 0; iIndex <= slicePiece + 1; iIndex++) {
      let leftTimeLine = '';
      leftTimeLine = getTimeLine(props, cloneCurrent);
      cloneCurrent = moment(cloneCurrent).add(gapMinute, 'm');
      tableHtml.push(leftTimeLine);
    }

    return tableHtml;
  }

  render() {
    const { prefixCls } = this.props;
    const cls = `${prefixCls}-left-timeline`;
    return <div className={cls}>{this.getTableCell()}</div>;
  }
}
TimeLine.displayName = 'TimeLine';
TimeLine.defaultProps = {
  startHour: 9,
  endHour: 23,
  gapMinute: 60,
};
TimeLine.propTypes = {
  prefixCls: PropTypes.string,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  gapMinute: PropTypes.number,
};
export default TimeLine;
