import ReactDOM from 'react-dom';
import Button from 'uxcore-button';
import CalendarLocale from 'rc-calendar/lib/locale/zh_CN';
import React from 'react';
import moment from 'moment';
import RcCalendar from '../src/RcCalendar';
import Calendar from '../src';
import events from './events';

const { MonthCalendar, YearCalendar, RangeCalendar, CalendarFull, MiniWeek } = Calendar;

function disabledDate(current) {
  if (current) {
    return current.getTime() > Date.now();
  }
  return false;
}
function disabledTime(current) {
  if (current) {
    const hours = current.getHours();
    return hours < new Date().getHours();
  }
  return false;
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
      value: '',
    };
    this.onSelect = this.onSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.miniWeekRender = this.miniWeekRender.bind(this);
  }

  componentDidMount() {
    this.forceUpdate();
    const node = <div>2222</div>;
    ReactDOM.createPortal(node, this.miniRender);
  }

  onSelect(value) {
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

  miniWeekRender(dateInfo) {
    const { value } = this.state;
    const { events: eventsInfo, label } = dateInfo;
    if (!events || !events.length) {
      return null;
    }
    return (
      <div className="schedule-container">
        <h3>
          这是
          {/* {value} */}
          {label}
          日程渲染事件
        </h3>
        {eventsInfo.map((event, idx) => (
          <div key={idx}>
            开始时间
            {event.start}
            -结束时间
            {event.end}
          </div>
        ))}
      </div>
    );
  }

  onScheduleClick = (e, schedule) => {
    console.log(e, schedule);
    alert(schedule.name);
  };

  render() {
    const me = this;
    const panelOptions = {
      showToday: true,
      timePicker: me.TimePickerElement,
      showDateInput: false,
      locale: CalendarLocale,
      prefixCls: 'kuma-calendar',
      value: moment(me.state.value || new Date().getTime()).locale('zh-cn'),
    };
    const { value, rangeValue } = this.state;
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
            showTime={true}
            allowClear={false}
            showSecond={false}
            // locale="en-us"
            yearSelectOffset={20}
            yearSelectTotal={50}
            size="middle"
            disabledTime={() => ({
              disabledMinutes: () => disabledMinutes,
            })}
            value={value}
            onSelect={this.onSelect}
            showDateInput
            // renderFooter={() => {return 'aaa'}}
          />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>日期格式</p>
          <Calendar value={value} format="YYYY/MM/DD" onSelect={this.onSelect} showDateInput />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>选择日期</p>
          <Calendar onSelect={this.onSelect} value={value} />
        </div>
        <div
          className="kuma-form-field"
          style={{
            width: '400px',
          }}
        >
          <p>范围</p>
          <Calendar disabledDate={disabledDate} value={value} onSelect={this.onSelect} />
        </div>
        <div className="kuma-form-field">
          <p>时间选择</p>
          <Calendar
            hasTrigger
            showSecond
            showHour
            showTime
            size="small"
            timezone={8}
            defaultOpenValue={new Date(2018, 8, 1, 3, 12)}
            locale="en-us"
            value={value}
            onSelect={this.onSelect}
          />
        </div>
        <div className="kuma-form-field">
          <p>禁用</p>
          <Calendar value={value} disabled onSelect={this.onSelect} />
        </div>
        <div className="kuma-form-field">
          <p>月份</p>
          <MonthCalendar
            size="middle"
            value={value}
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
            value={value}
            onSelect={this.onSelect}
            disabledDate={() => {}}
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
            value={value}
            onSelect={this.onSelect}
            contentRender={Calendar.util.generateContentRender(
              {
                '2016-01-07': 'leave',
                '2016-01-09': 'work',
                '2016-01-08': 'schedule',
              },
              'en',
            )}
          />
        </div>
        <div className="kuma-form-field">
          <p>直接渲染面板</p>
          <RcCalendar {...panelOptions} className="panel-demo" />
        </div>
        <Button onClick={me.handleClick}>changeTime</Button>
        <div className="kuma-form-field">
          <p>区间日期选择</p>
          <RangeCalendar
            size="large"
            value={rangeValue}
            // locale={'en-us'}
            quickSelectRanges={[
              {
                text: '19年1、2月份',
                value: {
                  start: '2019-01',
                  end: '2019-02',
                },
              },
              {
                text: '18年S2',
                value: {
                  start: '2018-09',
                  end: '2019-03',
                },
              },
            ]}
            onSelect={(v, formatted) => {
              this.onRangeSelect(v, formatted);
            }}
          />
        </div>
        <div className="kuma-form-field">
          <p>
            大日历日期选择,跨日程，提供Calendar.util.generateScheduleContent方法，返回具体日程的相关信息
          </p>
          <CalendarFull
            value={value}
            onSelect={this.onSelect}
            fullscreen
            type="week"
            locale="zh-cn"
            format="yyyy/MM/dd"
            scheduleRender={Calendar.fullUtil.generateScheduleContent(events, this.onScheduleClick)}
            startHour={0}
            endHour={24}
            step={60}
          />
          <MiniWeek
            value="2018-12-24"
            locale="en-us"
            events={events}
            scheduleRender={this.miniWeekRender}
            getPopupContainer={() => this.miniRender}
          />
          <div
            className="miniweek-container"
            ref={c => {
              this.miniRender = c;
            }}
          />
        </div>
      </div>
    );
  }
}

export default Demo;
