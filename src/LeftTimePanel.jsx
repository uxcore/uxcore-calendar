import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
export default class LeftTimePanel extends React.Component {
  getTimeLine() {
    let { prefixCls, startHour, gapMinute, endHour, slicePiece } = this.props;
    startHour = startHour ? parseInt(startHour) : 9;
    endHour = endHour ? parseInt(endHour) : 9;
    gapMinute = gapMinute ? parseInt(gapMinute) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    let prefixTime = startHour > 12 ? 'pm' : 'am';

    let current = moment()
      .hour(startHour)
      .minute(0);

    let timeResult = [
      {
        hour: startHour,
        minute: 0,
        label: `${startHour}:00 ${prefixTime}`,
        value: current,
      },
    ];

    for (let i = 0; i < slicePiece; i++) {
      current = moment(current).add(gapMinute, 'm');

      let hour = moment(current).hour();
      let minute = moment(current).minute();
      hour = hour > 9 ? hour : `0${hour}`;
      minute = minute > 9 ? minute : `0${minute}`;
      let prefixTime = hour > 12 ? 'pm' : 'am';
      timeResult.push({
        hour,
        minute,
        label: `${hour}:${minute} ${prefixTime}`,
        value: current,
      });
    }
    return timeResult;
  }

  render() {
    let { prefixCls } = this.props;
    let timeResult = this.getTimeLine();
    let timePanelCls = `${prefixCls}-timeline`;
    let currentHour = moment().hour();
    return (
      <div className={timePanelCls}>
        {timeResult.map((time, idx) => {
          return (
            <div
              className={classnames({
                [`${prefixCls}-timeline-cell`]: true,
                [`${prefixCls}-timeline-now`]: time.hour == currentHour,
              })}
              key={time.value}
            >
              <div className="cell-number">{time.label}</div>
            </div>
          );
        })}
      </div>
    );
  }
}
