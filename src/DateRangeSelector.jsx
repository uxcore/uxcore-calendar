import React from 'react'
import PropTypes from 'prop-types'
import Tag from 'uxcore-tag'

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
      dateRanges.length
        ? <Tag addTags={false}>
          {dateRanges.map(range => {
            const { text, value } = range;
            return (
              <Tag.Item
                type={'info'}
                onClick={() => this.onSelectHandle(value.start, value.end)}
                key={text}
              >
                {text}
              </Tag.Item>
            )
          })}
        </Tag>
        : null
    )
  }
}

export default DateRangeSelector