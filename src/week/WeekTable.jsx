import React from 'react';
import PropTypes from 'prop-types';
import WeekTHead from './WeekTHead';
import WeekTBody from './WeekTBody';
class WeekTable extends React.Component {
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
    let renderOpts = { startHour, gapMinute, endHour, slicePiece, type, current: value };
    if (scheduleRender) {
      const content = scheduleRender(renderOpts);

      return <div className="events-wrapper">{content}</div>;
    }
  }
  render() {
    const { slicePiece } = this.state;
    const props = this.props;
    const prefixCls = props.prefixCls;
    let weekCls = `${prefixCls}-date`;
    return (
      <div className={weekCls}>
        <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
          <WeekTHead {...props} />
          <WeekTBody {...props} slicePiece={slicePiece} />
        </table>
        {this.renderEvents()}
      </div>
    );
  }
}
WeekTable.displayName = 'WeekTable';
WeekTable.defaultProps = {
  startHour: 9,
  endHour: 23,
  gapMinute: 60,
};
WeekTable.propTypes = {
  prefixCls: PropTypes.string,
  weekCellRender: PropTypes.func,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  gapMinute: PropTypes.number,
};
export default WeekTable;
