const Button = require('uxcore-button');
const CalendarLocale = require('rc-calendar/lib/locale/zh_CN');
const React = require('react');
// const TimePickerLocale = require('rc-time-picker/lib/locale/zh_CN');
// const TimePicker = require('rc-time-picker');


const RcCalendar = require('../src/RcCalendar');
const Calendar = require('../src');

// const TimePickerElement = <TimePicker prefixCls="kuma-time-picker" locale={TimePickerLocale} />;
const MonthCalendar = Calendar.MonthCalendar;
const YearCalendar = Calendar.YearCalendar;

function disabledDate(current) {
  return current.getTime() > Date.now();
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '2016-01-02',
    };
  }

  onSelect(value, formatted) {
    console.log(value, formatted);
    this.setState({
      value,
    });
  }

  handleClick() {
    this.setState({
      value: '2016-02-05',
    });
  }

  render() {
    const me = this;
    const panelOptions = {
      showToday: true,
      timePicker: me.TimePickerElement,
      showDateInput: false,
      locale: CalendarLocale,
      prefixCls: 'kuma-calendar',
    };

    return (
      <div className="kuma-form">
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>基本</p>
          <Calendar
            showTime
            locale="en-us"
            timezone={8}
            value={this.state.value}
            onSelect={this.onSelect.bind(this)}
            showDateInput
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>日期格式</p>
          <Calendar
            value={this.state.value}
            format="yyyy/MM/dd"
            onSelect={this.onSelect.bind(this)}
            showDateInput
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>选择日期</p>
          <Calendar onSelect={this.onSelect.bind(this)} value={this.state.value} />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>范围</p>
          <Calendar
            disabledDate={disabledDate}
            value={this.state.value}
            onSelect={this.onSelect.bind(this)}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>时间选择</p>
          <Calendar
            hasTrigger
            showSecond={false}
            showHour
            showTime
            format="yyyy-MM-dd HH:mm:ss"
            value={this.state.value}
            onSelect={this.onSelect.bind(this)}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>禁用</p>
          <Calendar value={this.state.value} disabled onSelect={this.onSelect.bind(this)} />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>月份</p>
          <MonthCalendar
            value={this.state.value}
            onSelect={this.onSelect.bind(this)}
            showDateInput
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>年份</p>
          <YearCalendar value={this.state.value} onSelect={this.onSelect.bind(this)} />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>显示日期和日程</p>
          <p>Calendar 通过开放 contentRender 参数来完成日期渲染上的定制，并提供了一个默认的渲染函数 Calendar.util.generateContentRender(code) 来完成通用定制。</p>
          <Calendar
            value={this.state.value}
            onSelect={this.onSelect.bind(this)}
            contentRender={Calendar.util.generateContentRender({
              '2016-01-07': 'leave',
              '2016-01-09': 'work',
              '2016-01-08': 'schedule',
            }, 'en')}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>直接渲染面板</p>
          <RcCalendar {...panelOptions} />
        </div>
        <Button onClick={me.handleClick.bind(me)}>changeTime</Button>
      </div>
    );
  }
}

module.exports = Demo;
