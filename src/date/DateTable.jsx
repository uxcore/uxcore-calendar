// customized rc-calendar https://github.com/react-component/calendar/blob/master/

import React from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';
import DateTHead from './DateTHead';
import DateTBody from './DateTBody';

export default class DateTable extends React.Component {

  static propTypes = {
    localeStr: PropTypes.string
  }
  static defaultProps = {
    localeStr: 'zh-cn'
  }

  constructor(props) {
    super(props);
    this.state = {
      tableHeight: 0,
    };
  }

  componentDidMount() {
    this.setState({
      tableHeight: this.fullTable.offsetHeight,
    });
  }

  renderEvents() {
    const {
      scheduleRender, startHour, step, endHour, value, type,
    } = this.props;
    const { tableHeight } = this.state;

    const renderOpts = {
      startHour, step, endHour, type, current: value, ...this.props,
    };
    if (scheduleRender) {
      return scheduleRender(renderOpts, tableHeight);
    }
    return '';
  }

  render() {
    const { prefixCls } = this.props;
    const fullTableHeight = this.fullTable ? this.fullTable.offsetHeight : 0;
    const cellHeight = 0.8 * (fullTableHeight - 32) / 6;
    const tableCls = classnames({
      [`${prefixCls}-table`]: true,
      'super-mini': cellHeight <= 42 && cellHeight > 0,

    });
    return (
      <div className={tableCls} key={`${prefixCls}-date`}>
        <table className={`${prefixCls}-table`} cellSpacing="0" role="grid" ref={(c) => { this.fullTable = c; }}>
          <DateTHead {...this.props} />
          <DateTBody {...this.props} />
        </table>
        {this.renderEvents()}
      </div>
    );
  }
}
