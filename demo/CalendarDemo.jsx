const Button = require('uxcore-button');
const CalendarLocale = require('rc-calendar/lib/locale/zh_CN');
const React = require('react');
const moment = require('moment');
// const TimePickerLocale = require('rc-time-picker/lib/locale/zh_CN');
// const TimePicker = require('rc-time-picker');


const RcCalendar = require('../src/RcCalendar');
const Calendar = require('../src');

// const TimePickerElement = <TimePicker prefixCls="kuma-time-picker" locale={TimePickerLocale} />;

const { MonthCalendar, YearCalendar, RangeCalendar } = Calendar;

function disabledDate(current) {
  return current.getTime() > Date.now();
}

const enabledMinutes = [0, 15, 30, 45];
const disabledMinutes = [];
for (let i = 0; i < 60; i++) {
  if (enabledMinutes.indexOf(i) === -1) {
    disabledMinutes.push(i);
  }
}

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: new Date().getTime(),
    };
  }

  onSelect(value, formatted) {
    console.log(value, formatted);
    this.setState({
      value,
    });
  }

  onRangeSelect(value) {
    this.setState({
      rangeValue: value,
    });
  }

  handleClick() {
    this.setState({
      value: '2017-01-05',
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
      value: moment(me.state.value).locale('zh-cn'),
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
            showTime={false}
            showSecond={false}
            locale="zh-cn"
            disabledTime={() => (
              {
                disabledMinutes: () => disabledMinutes,
              }
            )}
            // timePicker={<Calendar.Pmam />}
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
            format="YYYY/MM/DD"
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
            timezone={8}
            format="YYYY-MM-DD HH:mm:ss"
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
          <RcCalendar {...panelOptions} className="panel-demo" />
        </div>
        <Button onClick={me.handleClick.bind(me)}>changeTime</Button>
        <div
          className="kuma-form-field"
          style={{
            width: 400,
          }}
        >
          <p>区间日期选择</p>
          <RangeCalendar
            value={this.state.rangeValue}
            onSelect={(v, formatted) => {
              console.log(v, formatted);
              this.onRangeSelect(v, formatted);
            }}
          />
        </div>
      </div>
    );
  }
}

module.exports = Demo;
