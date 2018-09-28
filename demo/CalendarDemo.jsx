import Button from 'uxcore-button';
import CalendarLocale from 'rc-calendar/lib/locale/zh_CN';
import React from 'react';
import moment from 'moment';
import RcCalendar from '../src/RcCalendar';
import Calendar from '../src';

const { MonthCalendar, YearCalendar, RangeCalendar, FullCalendar } = Calendar;

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
    this.onSelect = this.onSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.forceUpdate();
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
  getTimeRender(value) {
    return (
      <div>
        <span>{value}</span>
        <span>测试测试测试测试测试测试</span>
      </div>
    );
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
            width: '400px',
          }}
        >
          <p>基本</p>
          <Calendar
            showToday
            showTime={false}
            allowClear={false}
            showSecond={false}
            locale="en-us"
            yearSelectOffset={20}
            yearSelectTotal={50}
            size="middle"
            disabledTime={() => ({
              disabledMinutes: () => disabledMinutes,
            })}
            value={this.state.value}
            onSelect={this.onSelect}
            showDateInput
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>日期格式</p>
          <Calendar
            value={this.state.value}
            format="YYYY/MM/DD"
            onSelect={this.onSelect}
            showDateInput
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>选择日期</p>
          <Calendar onSelect={this.onSelect} value={this.state.value} />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>范围</p>
          <Calendar disabledDate={disabledDate} value={this.state.value} onSelect={this.onSelect} />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>时间选择</p>
          <Calendar
            hasTrigger
            showSecond
            showHour
            showTime
            size="small"
            timezone={8}
            locale="en-us"
            value={this.state.value}
            onSelect={this.onSelect}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>禁用</p>
          {/* <Calendar value={this.state.value} disabled onSelect={this.onSelect} /> */}
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>月份</p>
          <MonthCalendar
            size="middle"
            value={this.state.value}
            disabledDate={disabledDate}
            onSelect={this.onSelect}
            showDateInput
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>年份</p>
          <YearCalendar
            size="large"
            value={this.state.value}
            onSelect={this.onSelect}
            disabledDate={current => {
              console.log(current);
            }}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>显示日期和日程</p>
          <p>
            Calendar 通过开放 contentRender 参数来完成日期渲染上的定制，并提供了一个默认的渲染函数
            Calendar.util.generateContentRender(code) 来完成通用定制。
          </p>
          <Calendar
            value={this.state.value}
            onSelect={this.onSelect}
            contentRender={Calendar.util.generateContentRender(
              {
                '2016-01-07': 'leave',
                '2016-01-09': 'work',
                '2016-01-08': 'schedule',
              },
              'en'
            )}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>直接渲染面板</p>
          {/* <RcCalendar {...panelOptions} className="panel-demo" /> */}
        </div>
        <Button onClick={me.handleClick}>changeTime</Button>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>区间日期选择</p>
          <RangeCalendar
            size="large"
            value={this.state.rangeValue}
            onSelect={(v, formatted) => {
              console.log(v, formatted);
              this.onRangeSelect(v, formatted);
            }}
          />
        </div>
        {/* 大日历面板 */}
        <div
          className="kuma-form-field"
          style={{
            width: '800px',
            height: '400px',
          }}
        >
          <p>大日历日期选择</p>
          <FullCalendar
            size="middle"
            value={this.state.value}
            onSelect={this.onSelect}
            fullscreen
            type={'time'}
            locale="zh-cn"
            timeCellRender={this.getTimeRender}
            dateCellRender={this.getTimeRender}
          />
        </div>
      </div>
    );
  }
}

export default Demo;
