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

  componentDidMount() {
    this.getTimeLine();
  }

  getTimeLine() {
    let { startHour, step, endHour } = this.props;
    startHour = startHour ? parseInt(startHour, 10) : 9;
    endHour = endHour ? parseInt(endHour, 10) : 23;
    step = step ? parseInt(step, 10) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }
    const slicePiece = Math.ceil(((endHour - startHour) * 60) / step);
    this.setState({ slicePiece });
  }

  renderEvents() {
    const {
      scheduleRender, startHour, step, endHour, value, type,
    } = this.props;
    const { slicePiece } = this.state;
    const renderOpts = {
      startHour, step, endHour, type, slicePiece, current: value,
    };
    if (scheduleRender) {
      const content = scheduleRender(renderOpts);
      return <div className="events-wrapper">{content}</div>;
    }
    return null;
  }

  render() {
    const { slicePiece } = this.state;
    const { showCount, prefixCls } = this.props;
    const timeCls = `${prefixCls}-time`;
    const tableCls = `${prefixCls}-table`;
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
  step: 60,
};
TimeTable.propTypes = {
  prefixCls: PropTypes.string,
  showCount: PropTypes.number,
  timeRender: PropTypes.func,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  step: PropTypes.number,
};
export default TimeTable;
