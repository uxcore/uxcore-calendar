require('../assets/index.less');

import React from 'react';
import GregorianCalendarFormat from 'gregorian-calendar-format';
import zhCn from 'gregorian-calendar/lib/locale/zh-cn';
import DateTimeFormat from 'gregorian-calendar-format';
import GregorianCalendar from 'gregorian-calendar';
import CalendarLocale from '../src/locale/zh-cn';
import Calendar from '../index';

var formatter = new GregorianCalendarFormat('yyyy-MM-dd HH:mm:ss');
var DatePicker = Calendar.Picker;

function onSelect(value) {
  console.log('onSelect');
  console.log(formatter.format(value))
}

/* 直接显示 */
React.render(
  <div>
    <h2>Basic Usage</h2>
    <Calendar showWeekNumber={false}
      onSelect={onSelect} showTime={true}/>
  </div>, 
  document.getElementById('simple-calendar')
);

/* Default value example */
var defaultValue = new GregorianCalendar(zhCn);
defaultValue.setTime(+new Date() + 3600 * 24 * 1000);
React.render(
  <div>
    <h2>Default Value</h2>
    <Calendar showWeekNumber={false}
      onSelect={onSelect} showTime={true} value={defaultValue}/>
  </div>, 
  document.getElementById('defaultvalue-calendar')
);

/* Disabled example */
function disabledDate(current,value){
  var date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return current.getTime() < date.getTime();  //can not select days before today
}

React.render(
  <div>
    <h2>Disabled</h2>
    <Calendar showWeekNumber={true}
      disabledDate={disabledDate}
      onSelect={onSelect}/>
  </div>, 
  document.getElementById('disabled-calendar')
);

/* Picker */
var PickerCalendar = React.createClass({
  toggle: function () {
    this.refs.picker.toggle();
  },

  handleChange: function (value) {
    console.log('DatePicker change: ' + (value && this.props.formatter.format(value)));
  },

  handleCalendarSelect: function (value) {
    console.log('calendar select: ' + (value && this.props.formatter.format(value)));
    // controlled value
    this.setState({
      time: Date.now(),
      value: value
    });
  },

  getDefaultProps: function () {
    return {
      formatter: new DateTimeFormat('yyyy-MM-dd HH:mm:ss')
    }
  },

  getInitialState: function () {
    var value = new GregorianCalendar(zhCn);
    value.setTime(Date.now());
    return {
      time: Date.now(),
      showTime: true,
      value: value
    };
  },

  handleShowTimeChange: function (e) {
    this.setState({
      showTime: e.target.checked
    });
  },

  render: function () {
    var state = this.state;
    var calendar = <Calendar locale={CalendarLocale}
      orient={['top', 'left']}
      showTime={this.state.showTime} onSelect={this.handleCalendarSelect} onClear={this.handleCalendarSelect.bind(this, null)} showClear={true}/>;
    
    return <div className="form-group" style={{width: 400, margin: 20}} data-time={this.state.time}>
      <div className="input-group">
        <span>
          <input type='checkbox' checked={this.state.showTime} onChange={this.handleShowTimeChange} />
          showTime</span>
      </div>
      <div className="input-group">
        <DatePicker ref='picker'
          formatter={this.props.formatter} calendar={calendar}
          value={state.value} onChange={this.handleChange}>
          <input className="form-control uxcore-calendar-picker-input"/>
        </DatePicker>
        <span className="input-group-addon"
          style={{'-webkit-user-select': 'none'}}
          onMouseDown={prevent}
          unselectable="unselectable"
          onClick={this.toggle}>
          <span className="glyphicon glyphicon-calendar"></span>
        </span>
      </div>
    </div>;
  }
});

function prevent(e) {
  e.preventDefault();
}

React.render(
  <div>
    <h2>Picker</h2>
    <PickerCalendar />
  </div>, 
  document.getElementById('picker-calendar')
);

/**/
var value = new GregorianCalendar(zhCn);
value.setTime(Date.now());

var Test = React.createClass({
  getDefaultProps() {
    return {
      formatter: new DateTimeFormat('yyyy-MM-dd HH:mm:ss')
    }
  },

  getInitialState() {
    return {};
  },

  destroy() {
    this.setState({
      destroyed: 1
    });
  },

  render() {
    if (this.state.destroyed) {
      return null;
    }

    return <div style={{width: 236, margin: 20}}>
      <div style={{
        'position': 'relative',
        zIndex: 10,
        marginBottom: 22
      }}>
        <DatePicker
          renderCalendarToBody={true}
          trigger={<span className="uxcore-calendar-picker-icon" />}
          formatter={this.props.formatter} calendar={<Calendar
          style={{zIndex: 1000}}
          locale={CalendarLocale}/>}
          defaultValue={value}>
          <input className="uxcore-calendar-picker-input"/>
        </DatePicker>
      </div>
      <div style={{
        'position': 'relative',
        zIndex: 100,
        marginBottom: 22
      }}>
        <DatePicker
          renderCalendarToBody={true}
          trigger={<span className="uxcore-calendar-picker-icon" />}
          formatter={this.props.formatter} calendar={<Calendar
          style={{zIndex: 1000}}
          locale={CalendarLocale}/>}
          defaultValue={value}>
          <input className="uxcore-calendar-picker-input"/>
        </DatePicker>
      </div>

      <div>
        <button onClick={this.destroy}>destroy</button>
      </div>
    </div>;
  }
});

React.render(<div>
  <h2>Render Calendar To Body</h2>
  <Test />
</div>, document.getElementById('rendertobody-calendar'));