import React from 'react';
import Button from 'uxcore-button';

const CalendarFooter = (props) => {
  return (
    <div className={`${props.prefixCls}-footer`}>
      <Button onClick={props.onOk}>{props.locale.ok}</Button>
    </div>
  );
};

CalendarFooter.propTypes = {
  locale: React.PropTypes.object,
  prefixCls: React.PropTypes.string,
  onOk: React.PropTypes.func,
};

CalendarFooter.defaultProps = {
  onOk: () => {},
};

export default CalendarFooter;

