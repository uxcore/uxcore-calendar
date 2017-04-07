import React from 'react';
import classnames from 'classnames';

class Pmam extends React.Component {
  handleClick(item) {
    const { value } = this.props;
    const newValue = value.clone();
    const hourMap = {
      am: 9,
      pm: 15,
    };
    newValue.hour(hourMap[item]);
    this.props.onChange(newValue);
  }
  render() {
    const { locale, value, prefixCls } = this.props;
    const items = ['am', 'pm'];
    const pmam = value.hour() >= 12 ? 'pm' : 'am';
    return (
      <div>
        <div
          className={`${prefixCls}-panel-selected-value`}
        >{locale[pmam]}</div>
        <ul className={`${prefixCls}-pmam-panel`}>
          {items.map(item => (
            <li
              key={item}
              className={classnames(`${prefixCls}-pmam-item`, {
                [`${prefixCls}-pmam-item-active`]: item === pmam,
              })} onClick={this.handleClick.bind(this, item)}
            >{locale[item]}</li>
          ))}
        </ul>
      </div>
    );
  }
}

Pmam.propTypes = {
  locale: React.PropTypes.object,
  value: React.PropTypes.any,
  prefixCls: React.PropTypes.string,
  onChange: React.PropTypes.func,
};

Pmam.defaultProps = {
  prefixCls: 'kuma-time-picker',
};

Pmam.displayName = 'Pmam';

export default Pmam;
