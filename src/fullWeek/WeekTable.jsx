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
      startHour, step, endHour, slicePiece, type, current: value,
    };
    if (scheduleRender) {
      const content = scheduleRender(renderOpts);
      return <div className="events-wrapper">{content}</div>;
    }
    return null;
  }

  render() {
    const { slicePiece } = this.state;
    const { prefixCls } = this.props;
    const weekCls = `${prefixCls}-date`;
    return (
      <div className={weekCls}>
        <table className={`${prefixCls}-table`} cellSpacing="0" role="grid">
          <WeekTHead {...this.props} />
          <WeekTBody {...this.props} slicePiece={slicePiece} />
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
  step: 60,
};
WeekTable.propTypes = {
  prefixCls: PropTypes.string,
  weekRender: PropTypes.func,
  startHour: PropTypes.number,
  endHour: PropTypes.number,
  step: PropTypes.number,
};
export default WeekTable;
