import React from 'react';
import PropTypes from 'prop-types';
import TimeTHead from './TimeTHead';
import TimeTBody from './TimeTBody';

class TimeTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slicePiece: 0,
    };
    this.getSlicePiece = this.getSlicePiece.bind(this);
  }

  componentDidMount() {
    this.getSlicePiece();
  }

  getSlicePiece() {
    let { startHour, step, endHour } = this.props;

    startHour = typeof startHour !== 'undefined' ? parseInt(startHour, 10) : 9;
    endHour = typeof endHour !== 'undefined' ? parseInt(endHour, 10) : 23;
    step = step ? parseInt(step, 10) : 60;
    if (endHour < startHour) {
      endHour = startHour;
    }

    const slicePiece = Math.ceil(((endHour - startHour) * 60) / step);
    this.setState({ slicePiece });
  }

  renderEvents() {
    const { scheduleRender, startHour, step, endHour, value, type } = this.props;
    const { slicePiece } = this.state;
    const renderOpts = {
      startHour,
      step,
      endHour,
      type,
      slicePiece,
      current: value,
      ...this.props,
    };
    if (scheduleRender) {
      return scheduleRender(renderOpts);
    }
    return null;
  }

  render() {
    const { slicePiece } = this.state;
    const { showCount, prefixCls, cellMaxheight, cellMinheight } = this.props;
    const timeCls = `${prefixCls}-time`;
    const tableCls = `${prefixCls}-table`;
    const realSlices = slicePiece + 2;
    const maxCellHeight = cellMaxheight * realSlices + 32;
    const minCellHeight = cellMinheight * realSlices + 32;
    const tableStyle = { minHeight: minCellHeight, maxHeight: maxCellHeight };
    return (
      <div className={timeCls}>
        <table className={tableCls} cellSpacing="0" role="grid" style={tableStyle}>
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
  cellMaxheight: 68,
  cellMinheight: 32,
};
TimeTable.propTypes = {
  prefixCls: PropTypes.string,
  showCount: PropTypes.number,
  timeRender: PropTypes.func,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  step: PropTypes.number,
  cellMaxheight: PropTypes.number,
  cellMinheight: PropTypes.number,
};
export default TimeTable;
