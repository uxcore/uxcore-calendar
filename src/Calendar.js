let RcCalendar = require('./RcCalendar');
let GregorianCalendar = require('gregorian-calendar');
let DateTimeFormat = require('gregorian-calendar-format');
let Datepicker = require('rc-calendar/lib/Picker');
let RcMonthCalendar = require('rc-calendar/lib/MonthCalendar');
let RcYearCalendar = require('./YearCalendar');
let TimePicker = require('rc-time-picker');
let util = require('./util');
let React = require('react');

let defaultValueLocale = {};
let CalendarLocale = {};
let TimePickerLocale = {};
defaultValueLocale['zh-cn'] = require('gregorian-calendar/lib/locale/zh_CN');
defaultValueLocale['en-us'] = require('gregorian-calendar/lib/locale/en_US');
CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');
TimePickerLocale['zh-cn'] = require('rc-time-picker/lib/locale/zh_CN');
TimePickerLocale['en-us'] = require('rc-time-picker/lib/locale/en_US');

function getGregorianCalendarDate(date, locale) {
    defaultValueLocale[locale].timezoneOffset = -new Date().getTimezoneOffset();
    let value = new GregorianCalendar(defaultValueLocale[locale]);
    value.setTime(new Date(date).valueOf());
    return value;
}

function getCalendarContainer() {
    let c = document.createElement('div');
    c.className = 'uxcore';
    document.body.appendChild(c);
    return c;
}

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        let me = this;
        me.TimePickerElement = <TimePicker prefixCls="kuma-time-picker" locale={TimePickerLocale[me.props.locale]} />
    }

    render() {
        let me = this;
        let p = me.props;
        let formatter = new DateTimeFormat(p.format);
        let calendarOptions = {
            className: p.className,
            style: p.style,
            contentRender: p.contentRender,
            disabledDate: p.disabledDate,
            showWeekNumber: p.showWeekNumber,
            showToday: p.showToday,
            timePicker: p.timePicker ? p.timePicker : (p.showTime ? me.TimePickerElement : null),
            showDateInput: p.showDateInput,
            locale: CalendarLocale[p.locale],
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            formatter: formatter,
            transitionName: p.transitionName,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            placement: 'bottomLeft',
            getCalendarContainer: getCalendarContainer
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale);
            pickerOptions.value = calendarOptions.defaultValue = value;
        } else {
            pickerOptions.value = calendarOptions.defaultValue = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale);
            calendarOptions.defaultValue = value;
            pickerOptions.defaultValue = value;
        } else {
            let value = getGregorianCalendarDate(new Date().getTime(), p.locale);
            calendarOptions.defaultValue = value;
        }
        if (p.hasTrigger) {
            pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender"></i>;
        }

        let calendar = <RcCalendar {...calendarOptions}/>;

        function _onChange(v) {
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        return (
            <Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
            {...pickerOptions}>
                {({value}) => {
                    return <input value={value && formatter.format(value)} readOnly disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
                }}
            </Datepicker>
            );
    }
}

Calendar.displayName = 'Calendar';
Calendar.defaultProps = {
    format: 'yyyy-MM-dd',
    placeholder: '请选择日期',
    onSelect: function() {},
    locale: 'zh-cn',
    showDateInput: false,
    hasTrigger: false,
    transitionName: 'slideUp'
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
            locale: CalendarLocale[p.locale],
            orient: ['top', 'left'],
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            transitionName: p.transitionName,
            formatter: formatter,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            getCalendarContainer: getCalendarContainer
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale);
            pickerOptions.value = calendarOptions.defaultValue = value;
        } else {
            pickerOptions.value = calendarOptions.defaultValue = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale);
            calendarOptions.defaultValue = value;
        }
        let calendar = <RcMonthCalendar {...calendarOptions}/>;

        function _onChange(v) {
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        return (
            <Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
                {...pickerOptions}>
                    {({value}) => {
                    return <input readOnly value={value && formatter.format(value)} disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
                }}
            </Datepicker>
        );
    }
}

MonthCalendar.displayName = 'MonthCalendar';
MonthCalendar.defaultProps = {
    format: 'yyyy-MM',
    placeholder: '请选择月份',
    onSelect: function() {},
    locale: 'zh-cn',
    transitionName: 'slideUp'
};
MonthCalendar.propTypes = {
    format: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string
};

class YearCalendar extends React.Component {
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
            locale: CalendarLocale[p.locale],
            orient: ['top', 'left'],
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            formatter: formatter,
            transitionName: p.transitionName,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            getCalendarContainer: getCalendarContainer
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale);
            pickerOptions.value = calendarOptions.defaultValue = value;
        } else {
            pickerOptions.value = calendarOptions.defaultValue = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale);
            calendarOptions.defaultValue = value;
        }
        let calendar = <RcYearCalendar {...calendarOptions}/>;

        function _onChange(v) {
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        return (<Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
            {...pickerOptions}>
                    {({value}) => {
                return <input value={value && formatter.format(value)} readOnly disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
            }}
                </Datepicker>);
    }
}

YearCalendar.displayName = 'YearCalendar';
YearCalendar.defaultProps = {
    format: 'yyyy',
    placeholder: '请选择年份',
    onSelect: function() {},
    locale: 'zh-cn',
    transitionName: 'slideUp'
};
YearCalendar.propTypes = {
    format: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string
};

Calendar.MonthCalendar = MonthCalendar;
Calendar.YearCalendar = YearCalendar;
Calendar.CalendarPanel = RcCalendar;
Calendar.util = util;

module.exports = Calendar;
