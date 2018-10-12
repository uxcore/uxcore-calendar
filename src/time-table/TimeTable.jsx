import React from 'react';
import PropTypes from 'prop-types';
import TimeTHead from './TimeTHead';
import TimeTBody from './TimeTBody';
class TimeTable extends React.Component {
  constructor(props) {
    super(props);
    this.getTimeLine = this.getTimeLine.bind(this);
    this.state = {
      slicePiece: 0,
    };
  }
  getTimeLine() {
    let { startHour, gapMinute, endHour } = this.props;
    startHour = startHour ? parseInt(startHour) : 9;
    endHour = endHour ? parseInt(endHour) : 23;
    gapMinute = gapMinute ? parseInt(gapMinute) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    let slicePiece = Math.ceil(((endHour - startHour) * 60) / gapMinute);
    this.setState({ slicePiece });
  }
  componentDidMount() {
    this.getTimeLine();
  }
  renderEvents() {
    let { scheduleRender, startHour, gapMinute, endHour, value, type } = this.props;
    const { slicePiece } = this.state;
    let renderOpts = { startHour, gapMinute, endHour, type, slicePiece, current: value };
    if (scheduleRender) {
      const content = scheduleRender(renderOpts);
      return <div className="events-wrapper">{content}</div>;
    }
  }
  render() {
    const { slicePiece } = this.state;
    const { showCount, prefixCls } = this.props;
    let timeCls = `${prefixCls}-time`;
    let tableCls = `${prefixCls}-table`;
    return (
      <div className={timeCls}>
        <table className={tableCls} cellSpacing="0" role="grid">
          <TimeTHead {...this.props} dataCount={showCount} />
          <TimeTBody {...this.props} slicePiece={slicePiece} dataCount={showCount} />
        </table>
        {this.renderEvents()}
      </div>
    );
  }
}
TimeTable.displayName = 'TimeTable';
TimeTable.defaultProps = {
  showCount: 1,
  startHour: 9,
  endHour: 23,
  gapMinute: 60,
};
TimeTable.propTypes = {
  prefixCls: PropTypes.string,
  showCount: PropTypes.number,
  timeCellRender: PropTypes.func,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  gapMinute: PropTypes.number,
};
export default TimeTable;
