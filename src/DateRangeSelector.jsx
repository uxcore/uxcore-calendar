import React from 'react'
import PropTypes from 'prop-types'
import Button from 'uxcore-button'

class DateRangeSelector extends React.Component{
  static defaultProps = {
    dateRanges: [],
    onSelect: () => {}
  };
  static propTypes = {
    dateRanges: PropTypes.array,
    onSelect: PropTypes.func
  };

  onSelectHandle = (start, end) => {
    this.props.onSelect(start, end)
  };

  render() {
    const { dateRanges } = this.props;
    return (
      dateRanges.map(range => {
        const { text, value } = range;
        return (
          <Button
            size={'small'}
            onClick={() => this.onSelectHandle(value.start, value.end)}
            key={text}
          >
            {text}
          </Button>
        )
      })
    )
  }
}

export default DateRangeSelector