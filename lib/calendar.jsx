import React from 'react';
import RcCalendar from 'rc-calendar';
import assign from 'object-assign';

class Calendar extends RcCalendar {
    constructor(props) {
        super(props);
    }
}
Calendar.displayName = 'uxcore-calendar';
Calendar.defaultProps = assign(RcCalendar.defaultProps, {
    prefixCls: 'kuma-calendar'
});

export default Calendar;
