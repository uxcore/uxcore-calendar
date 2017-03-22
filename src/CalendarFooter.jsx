import React from 'react';
import Button from 'uxcore-button';

const CalendarFooter = props => (
  <div className={`${props.prefixCls}-footer`}>
    <Button onClick={props.onOk} size="small">{props.locale.ok}</Button>
  </div>
);

CalendarFooter.propTypes = {
  locale: React.PropTypes.object,
  prefixCls: React.PropTypes.string,
  onOk: React.PropTypes.func,
};

CalendarFooter.defaultProps = {
  onOk: () => {},
};

export default CalendarFooter;

