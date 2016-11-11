const RcCalendar = require('./RcCalendar');
const GregorianCalendar = require('gregorian-calendar');
const DateTimeFormat = require('gregorian-calendar-format');
const Datepicker = require('rc-calendar/lib/Picker');
const RcMonthCalendar = require('rc-calendar/lib/MonthCalendar');
const RcYearCalendar = require('./YearCalendar');
const TimePicker = require('rc-time-picker/lib/module/Panel');
const util = require('./util');
const React = require('react');
const classnames = require('classnames');

const defaultValueLocale = {};
const CalendarLocale = {};
const TimePickerLocale = {};

defaultValueLocale['zh-cn'] = require('gregorian-calendar/lib/locale/zh_CN');
defaultValueLocale['en-us'] = require('gregorian-calendar/lib/locale/en_US');
CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh_CN');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en_US');
TimePickerLocale['zh-cn'] = require('rc-time-picker/lib/locale/zh_CN');
TimePickerLocale['en-us'] = require('rc-time-picker/lib/locale/en_US');

function getGregorianCalendarDate(date, locale, timezone) {
    if (timezone) {
        defaultValueLocale[locale].timezoneOffset = parseInt(timezone, 10) * 60;
    }
    else {
        defaultValueLocale[locale].timezoneOffset = -new Date().getTimezoneOffset();
    }
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
        this.clearValue = this.clearValue.bind(this);
    }

    componentWillMount() {
        const me = this;
        
        me.TimePickerElement = (
            <TimePicker prefixCls="kuma-time-picker-panel" locale={TimePickerLocale[me.props.locale]} />  
        );
    }

    clearValue(e) {
        e.stopPropagation();
        this.props.onSelect(null, null)
    }

    render() {
        let me = this;
        let p = me.props;
        let formatter = new DateTimeFormat(p.format);
        const timePaneNumber = 1 + p.showHour + p.showSecond;
        let calendarOptions = {
            className: classnames({
                [p.className]: !!p.className,
                [`kuma-calendar-two-time-panel`]: timePaneNumber === 2,
                [`kuma-calendar-one-time-panel`]: timePaneNumber === 1,
            }),
            style: p.style,
            contentRender: p.contentRender,
            disabledDate: p.disabledDate,
            disabledTime: p.disabledTime,
            showSecond: p.showSecond,
            showHour: p.showHour,
            showWeekNumber: p.showWeekNumber,
            showToday: p.showToday,
            timePicker: p.timePicker ? p.timePicker : (p.showTime ? me.TimePickerElement : null),
            showDateInput: p.showDateInput,
            locale: CalendarLocale[p.locale],
            formatter: formatter,
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            formatter: formatter,
            align: p.align,
            transitionName: p.transitionName,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            placement: 'bottomLeft',
            getCalendarContainer: p.getPopupContainer || getCalendarContainer
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale, p.timezone);
            pickerOptions.value = calendarOptions.defaultValue = value;
        } else {
            pickerOptions.value = calendarOptions.defaultValue = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale, p.timezone);
            calendarOptions.defaultValue = value;
            pickerOptions.defaultValue = value;
        } else {
            let value = getGregorianCalendarDate(new Date().getTime(), p.locale, p.timezone);
            calendarOptions.defaultValue = value;
        }
        if (p.hasTrigger) {
            pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender"></i>;
        }

        let calendar = <RcCalendar {...calendarOptions}/>;

        function _onChange(v) {
            if (v) {
                let date = v.getTime();
                let value = getGregorianCalendarDate(date, p.locale, p.timezone);
                this.props.onSelect(new Date(date), formatter.format(value));
            }
            else {
                this.props.onSelect(v, v);
            }
        }

        const triggerStyle = {};
        if (p.inputWidth) {
            triggerStyle.width = p.inputWidth;
        }

        

        return (
            <Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
            {...pickerOptions}>
                {({value}) => {
                    const showClear = value && !p.disabled
                    let newValue = value;
                    if (newValue) {
                        newValue = formatter.format(value);
                    } else {
                        newValue = '';
                    }
                    return <span className="kuma-calendar-picker-input" style={triggerStyle} >
                        <input value={newValue} readOnly disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-input" />
                        {p.hasTrigger ? <i className={`kuma-icon kuma-icon-calender ${showClear ? 'kuma-icon-calender__has-clear' : ''}`}></i> : null}
                        {showClear ? <i className="kuma-icon kuma-icon-close" onClick={this.clearValue}></i> : null }
                    </span>
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
    align: {
        offset: [0, 0]
    },
    showSecond: true,
    showHour: true,
    showDateInput: true,
    hasTrigger: true,
    transitionName: 'slideUp'
};
Calendar.propTypes = {
    format: React.PropTypes.string,
    inputWidth: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string,
    hasTrigger: React.PropTypes.bool,
    showSecond: React.PropTypes.bool,
    showHour: React.PropTypes.bool,
    getPopupContainer: React.PropTypes.func
};

class MonthCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.clearValue = this.clearValue.bind(this);
    }

    clearValue(e) {
        e.stopPropagation();
        this.props.onSelect(null, null)
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
            showDateInput: p.showDateInput,
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            align: p.align,
            transitionName: p.transitionName,
            formatter: formatter,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            getCalendarContainer: p.getPopupContainer || getCalendarContainer
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale, p.timezone);
            pickerOptions.value = calendarOptions.defaultValue = value;
        } else {
            pickerOptions.value = calendarOptions.defaultValue = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale, p.timezone);
            calendarOptions.defaultValue = value;
        }
        let calendar = <RcMonthCalendar {...calendarOptions}/>;

        function _onChange(v) {
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale, p.timezone);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        const triggerStyle = {};
        if (p.inputWidth) {
            triggerStyle.width = p.inputWidth;
        }

        return (
            <Datepicker
            calendar={calendar}
            onChange={_onChange.bind(me)}
                {...pickerOptions}>
                {({value}) => {
                    const showClear = value && !p.disabled
                    return <span className="kuma-calendar-picker-input" style={triggerStyle} >
                        <input value={value && formatter.format(value)} readOnly disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-input" />
                        {p.hasTrigger ? <i className={`kuma-icon kuma-icon-calender ${showClear ? 'kuma-icon-calender__has-clear' : ''}`}></i> : null}
                        {showClear ? <i className="kuma-icon kuma-icon-close" onClick={this.clearValue}></i> : null }
                    </span>
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
    transitionName: 'slideUp',
    align: {
        offset: [0, 0]
    },
    showDateInput: false,
    hasTrigger: true,
};
MonthCalendar.propTypes = {
    format: React.PropTypes.string,
    inputWidth: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string,
    getPopupContainer: React.PropTypes.func
};

class YearCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.clearValue = this.clearValue.bind(this);
    }

    clearValue(e) {
        e.stopPropagation();
        this.props.onSelect(null, null)
    }

    render() {
        let me = this;
        let p = me.props;
        let formatter = new DateTimeFormat(p.format);
        let calendarOptions = {
            className: p.className,
            style: p.style,
            locale: CalendarLocale[p.locale],
            showDateInput: p.showDateInput,
            orient: ['top', 'left'],
            prefixCls: 'kuma-calendar'
        };
        let pickerOptions = {
            disabled: p.disabled,
            align: p.align,
            formatter: formatter,
            transitionName: p.transitionName,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: 'kuma-calendar-picker',
            getCalendarContainer: p.getPopupContainer || getCalendarContainer
        };

        if (p.value) {
            let value = getGregorianCalendarDate(p.value, p.locale, p.timezone);
            pickerOptions.value = calendarOptions.defaultValue = value;
        } else {
            pickerOptions.value = calendarOptions.defaultValue = null;
        }

        if (p.defaultValue) {
            let value = getGregorianCalendarDate(p.defaultValue, p.locale, p.timezone);
            calendarOptions.defaultValue = value;
        }
        let calendar = <RcYearCalendar {...calendarOptions}/>;

        function _onChange(v) {
            let date = v.getTime();
            let value = getGregorianCalendarDate(date, p.locale, p.timezone);
            this.props.onSelect(new Date(date), formatter.format(value));
        }

        const triggerStyle = {};
        if (p.inputWidth) {
            triggerStyle.width = p.inputWidth;
        }

        return (
            <Datepicker
                calendar={calendar}
                onChange={_onChange.bind(me)}
                {...pickerOptions}
            >
                {({value}) => {
                    const showClear = value && !p.disabled
                    return <span className="kuma-calendar-picker-input" style={triggerStyle} >
                        <input value={value && formatter.format(value)} readOnly disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-input" />
                        {p.hasTrigger ? <i className={`kuma-icon kuma-icon-calender ${showClear ? 'kuma-icon-calender__has-clear' : ''}`}></i> : null}
                        {showClear ? <i className="kuma-icon kuma-icon-close" onClick={this.clearValue}></i> : null }
                    </span>
                }}
            </Datepicker>
        );
    }
}

YearCalendar.displayName = 'YearCalendar';
YearCalendar.defaultProps = {
    format: 'yyyy',
    placeholder: '请选择年份',
    onSelect: function() {},
    locale: 'zh-cn',
    transitionName: 'slideUp',
    align: {
        offset: [0, 0]
    },
    showDateInput: false,
    hasTrigger: true,
};
YearCalendar.propTypes = {
    format: React.PropTypes.string,
    inputWidth: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    locale: React.PropTypes.string,
    getPopupContainer: React.PropTypes.func
};

Calendar.MonthCalendar = MonthCalendar;
Calendar.YearCalendar = YearCalendar;
Calendar.CalendarPanel = RcCalendar;
Calendar.util = util;

module.exports = Calendar;
