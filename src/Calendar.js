let RcCalendar = require('rc-calendar');
let Datepicker = RcCalendar.Picker;
let GregorianCalendar = require('gregorian-calendar');
let DateTimeFormat = require('gregorian-calendar-format');

let zhCn = require('gregorian-calendar/lib/locale/zh-cn');
let CalendarLocale = require('rc-calendar/lib/locale/zh-cn');
let Locale = require('gregorian-calendar-format/lib/locale/zh-cn');

// 和顶部文案保持一致
Locale.shortMonths = ['1月', '2月', '3月', '4月', '5月', '6月',
                      '7月', '8月', '9月', '10月', '11月', '12月'];

// 以下两行代码
// 给没有初始值的日期选择框提供本地化信息
let defaultCalendarValue = new GregorianCalendar(zhCn);
defaultCalendarValue.setTime(Date.now());

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: !!props.value ? new GregorianCalendar(zhCn).setTime(new Date(props.value).valueOf()) : undefined
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            var value = new GregorianCalendar(zhCn);
            value.setTime(new Date(nextProps.value).valueOf());
            this.setState({
            value: value
            });
        }
    }
    handleChange(v) {
        let me = this;
        me.setState({
          value: v
        });
        me.props.onSelect(new Date(v.getTime()));
    }
    render() {
        let me = this;
        let calendar = <RcCalendar
                    disabledDate={me.props.disabledDate}
                    locale={CalendarLocale}
                    orient={['top', 'left']}
                    defaultValue={defaultCalendarValue}
                    showTime={me.props.showTime}
                    prefixCls="kuma-calendar"
                    showOk={me.props.showTime}
                    showClear={false}/>;

        return (
            <Datepicker
            transitionName={me.props.transitionName}
            trigger={<i className="kuma-icon kuma-icon-calender"></i>}
            calendar={calendar}
            adjustOrientOnCalendarOverflow={false}
            formatter={new DateTimeFormat(me.props.format)}
            value={me.state.value}
            prefixCls="kuma-calendar-picker"
            onChange={me.handleChange.bind(me)}>
                <input name={me.props.name} disabled={me.props.disabled} placeholder={this.props.placeholder} className="kuma-calendar-picker-input kuma-input" />
            </Datepicker>
        );
    }
}

Calendar.displayName = "Calendar";
Calendar.defaultProps = {
    name: '',
    format: 'yyyy-MM-dd',
    placeholder: '请选择日期',
    transitionName: 'slide-up',
    onSelect: function () {}
};
Calendar.propTypes = {
    name: React.PropTypes.string,
    format: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    transitionName: React.PropTypes.string,
    onSelect: React.PropTypes.func
}

module.exports = Calendar;
