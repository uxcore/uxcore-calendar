import React, { Component } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';


const propTypes = {
  prefixCls: PropTypes.string,
  step: PropTypes.number,
  current: PropTypes.object,
};

const defaultProps = {
  prefixCls: '',
  step: 60,
  current: {},
};
class LeftTimeLine extends Component {
  render() {
    const { prefixCls, step, current } = this.props;
    let hour = moment(current).hour();
    let minute = moment(current).minute() || 0;
    hour = hour > 9 ? hour : `0${hour}`;
    minute = minute > 9 ? minute : `0${minute}`;
    const prefixTime = hour > 12 ? 'pm' : 'am';

    let selected = hour === moment().hour();
    selected = selected && moment().minute() >= parseInt(minute, 10);
    selected = selected && moment().minute() < step + parseInt(minute, 10);

    return (
      <td className={`${prefixCls}-time-panel`} key={current}>
        <div
          className={classnames({
            [`${prefixCls}-timeline-now`]: selected,
          })}
          key={current}
        >
          <div className="cell-number">
            {`${hour}:${minute} ${prefixTime}`}
          </div>
        </div>
      </td>
    );
  }
}

LeftTimeLine.propTypes = propTypes;
LeftTimeLine.defaultProps = defaultProps;
export default LeftTimeLine;
