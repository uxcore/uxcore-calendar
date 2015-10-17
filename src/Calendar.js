let RcCalendar = require('rc-calendar');
let Datepicker = RcCalendar.Picker;
let GregorianCalendar = require('gregorian-calendar');
let DateTimeFormat = require('gregorian-calendar-format');

let defaultValueLocale = {};
let CalendarLocale = {};
defaultValueLocale['zh-cn'] = require('gregorian-calendar/lib/locale/zh-cn');
defaultValueLocale['en-us'] = require('gregorian-calendar/lib/locale/en-us');
CalendarLocale['zh-cn'] = require('rc-calendar/lib/locale/zh-cn');
CalendarLocale['en-us'] = require('rc-calendar/lib/locale/en-us');

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleChange(v) {
        let me = this;
        me.props.onSelect(new Date(v.getTime()));
    }
    render() {
        let me = this;
        let p = me.props;
        let fotmatter = new DateTimeFormat(p.format);
        let calendarOptions = {
            className: p.className,
            style: p.style,
            disabledDate: p.disabledDate,
            showWeekNumber: p.showWeekNumber,
            showToday: p.showToday,
            showTime: p.showTime,
            locale: CalendarLocale[p.locale],
            orient: ['top', 'left'],
            prefixCls: "kuma-calendar"
        };
        let pickerOptions = {
            disabled: p.disabled,
            formatter: fotmatter,
            adjustOrientOnCalendarOverflow: false,
            prefixCls: "kuma-calendar-picker"
        };

        if (p.value) {
            let value = new GregorianCalendar(defaultValueLocale[p.locale]);
            value.setTime(new Date(p.value || null).valueOf());
            pickerOptions.value = calendarOptions.value = value;
        }
        if (p.defaultValue) {
            let value = new GregorianCalendar(defaultValueLocale[p.locale]);
            value.setTime(new Date(p.defaultValue).valueOf());
            calendarOptions.defaultValue = value;
        }
        if (p.hasTrigger) {
            pickerOptions.trigger = <i className="kuma-icon kuma-icon-calender"></i>;
        }
        let calendar = <RcCalendar {...calendarOptions}/>;

        return (
            <Datepicker
            calendar={calendar}
            onChange={me.handleChange.bind(me)}
            {...pickerOptions}>
                <input disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
            </Datepicker>
        );
    }
}

Calendar.displayName = "Calendar";
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
}

module.exports = Calendar;
