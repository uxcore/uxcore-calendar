import React from 'react';
import PropTypes from 'prop-types';
import WeekTHead from './WeekTHead';
import WeekTBody from './WeekTBody';

class WeekTable extends React.Component {
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
      slicePiece,
      type,
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
    const { prefixCls } = this.props;
    const weekCls = `${prefixCls}-week`;
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
  prefixCls: '',
  weekRender: null,
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
