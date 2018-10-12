// customized rc-calendar https://github.com/react-component/calendar/blob/master/

import React from 'react';
import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

export default class DateTable extends React.Component {
  renderEvents() {
    let { scheduleRender, startHour, gapMinute, endHour, value, type } = this.props;
    let renderOpts = { startHour, gapMinute, endHour, type, current: value };
    if (scheduleRender) {
      const content = scheduleRender(renderOpts);
      return <div className="events-month-wrapper">{content}</div>;
    }
  }
  render() {
    const props = this.props;
    const { prefixCls } = props;
    return (
      <div className={`${prefixCls}-wrapper`}>
        <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
          <DateTHead {...props} />
          <DateTBody {...props} />
        </table>
        {this.renderEvents()}
      </div>
    );
  }
}
