// customized rc-calendar https://github.com/react-component/calendar/blob/master/

import React from 'react';
import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

export default class DateTable extends React.Component {
  renderEvents() {
    const {
      scheduleRender, startHour, step, endHour, value, type, width,
    } = this.props;
    const renderOpts = {
      startHour, step, endHour, type, current: value, width, ...this.props,
    };
    if (scheduleRender) {
      const content = scheduleRender(renderOpts);
      return <div className="events-month-wrapper">{content}</div>;
    }
    return '';
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-wrapper`}>
        <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
          <DateTHead {...this.props} />
          <DateTBody {...this.props} />
        </table>
        {this.renderEvents()}
      </div>
    );
  }
}
