import React from 'react';
import PropTypes from 'prop-types';
import Button from 'uxcore-button';

const CalendarFooter = props => (
  <div className={`${props.prefixCls}-footer`}>
    <Button onClick={props.onOk} size="small">
      {props.locale.ok}
    </Button>
  </div>
);

CalendarFooter.propTypes = {
  locale: PropTypes.object,
  prefixCls: PropTypes.string,
  onOk: PropTypes.func,
};

CalendarFooter.defaultProps = {
  onOk: () => {},
  locale: {},
  prefixCls: '',
};

export default CalendarFooter;
