import TimePicker from 'rc-time-picker/lib/Panel';
import React from 'react';
import PropTypes from 'prop-types';

const Normal = (props) => {
  const { showHour, showSecond, value } = props;
  const format = `${showHour ? 'HH : ' : ''}mm${showSecond ? ' : ss' : ''}`;
  return (
    <div>
      <div
        className="kuma-time-picker-panel-selected-value"
      >{value && value.format(format)}</div>
      <TimePicker prefixCls="kuma-time-picker-panel" hideDisabledOptions {...props} />
    </div>
  );
};

Normal.propTypes = {
  showHour: PropTypes.bool,
  showSecond: PropTypes.bool,
  value: PropTypes.any,
};

export default Normal;
