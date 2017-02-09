import TimePicker from 'rc-time-picker/lib/Panel';
import React from 'react';

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
  showHour: React.PropTypes.bool,
  showSecond: React.PropTypes.bool,
  value: React.PropTypes.any,
};

export default Normal;
