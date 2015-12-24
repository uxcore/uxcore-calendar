let RcCalendar = require('rc-calendar');
let Datepicker = require('./picker');
let GregorianCalendar = require('gregorian-calendar');
let DateTimeFormat = require('gregorian-calendar-format');
let RcMonthCalendar = require('rc-calendar/lib/MonthCalendar');

let defaultValueLocale = {};
let CalendarLocale = {};
defaultValueLocale['zh-cn'] = require('gregorian-calendar/lib/locale/zh-cn');
defaultValueLocale['en-us'] = require('gregorian-calendar/lib/locale/en-us');
CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh-cn');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en-us');

function getGregorianCalendarDate(date, locale){
    let value = new GregorianCalendar(defaultValueLocale[locale]);
    value.setTime(new Date(date).valueOf());
    return value;
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let me = this;
        let p = me.props;
        let formatter = new DateTimeFormat(p.format);
        let calendarOptions = {
            className: p.className,
            style: p.style,
            disabledDate: p.disabledDate,
            showWeekNumber: p.showWeekNumber,
            showToday: p.showToday,
            showTime: p.showTime,
            locale: CalendarLocale[p.locale],
            orient: ['top', 'left'],
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            formatter: formatter,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            getCalendarContainer: function(){
                let c = document.createElement('div');
                c.className = 'uxcore';
                document.body.appendChild(c);
                return c;
            }
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale);
            pickerOptions.value = calendarOptions.value = value;
        } else {
            pickerOptions.value = calendarOptions.value = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale);
            calendarOptions.defaultValue = value;
        }
        if (p.hasTrigger) {
            pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender"></i>;
        }
        let calendar = <RcCalendar {...calendarOptions}/>;

        function _onChange(v){
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        return (
            <Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
            {...pickerOptions}>
                <input disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
            </Datepicker>
        );
    }
}

Calendar.displayName = 'Calendar';
Calendar.defaultProps = {
    format: 'yyyy-MM-dd',
    placeholder: '请选择日期',
    defaultValue: Date.now(),
    onSelect: function () {},
    locale: 'zh-cn',
    hasTrigger: false
};
Calendar.propTypes = {
    format: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string,
    hasTrigger: React.PropTypes.bool
};

class MonthCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        let me = this;
        let p = me.props;
        let formatter = new DateTimeFormat(p.format);
        let calendarOptions = {
            className: p.className,
            style: p.style,
            showWeekNumber: p.showWeekNumber,
            locale: CalendarLocale[p.locale],
            orient: ['top', 'left'],
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            formatter: formatter,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            getCalendarContainer: function(){
                let c = document.createElement('div');
                c.className = 'uxcore';
                document.body.appendChild(c);
                return c;
            }
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale);
            pickerOptions.value = calendarOptions.value = value;
        } else {
            pickerOptions.value = calendarOptions.value = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale);
            calendarOptions.defaultValue = value;
        }
        if (p.hasTrigger) {
            pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender"></i>;
        }
        let calendar = <RcMonthCalendar {...calendarOptions}/>;

        function _onChange(v){
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        return (
            <Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
            {...pickerOptions}>
                <input disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
            </Datepicker>
        );
    }
}

MonthCalendar.displayName = 'MonthCalendar';
MonthCalendar.defaultProps = {
    format: 'yyyy-MM',
    placeholder: '请选择月份',
    defaultValue: Date.now(),
    onSelect: function () {},
    locale: 'zh-cn',
    hasTrigger: false
};
MonthCalendar.propTypes = {
    format: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string,
    hasTrigger: React.PropTypes.bool
};

Calendar.MonthCalendar = MonthCalendar;

module.exports = Calendar;
