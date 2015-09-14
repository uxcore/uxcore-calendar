let Calendar = require('../src');

function onSelect(value){
	alert(value);
	console.log(value);
}

function disabledDate(current, value){
	return current.getTime() > Date.now();
}

class Demo extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="kuma-form">
				<div className="kuma-form-field" style={{width: 400}}>
					<p>基本</p>
					<Calendar value="" />
				</div>
				<div className="kuma-form-field" style={{width: 400}}>
					<p>日期格式</p>
					<Calendar value="2015/01/01" format="yyyy/MM/dd" />
				</div>
				<div className="kuma-form-field" style={{width: 400}}>
					<p>选择日期</p>
					<Calendar onSelect={onSelect} />
				</div>
				<div className="kuma-form-field" style={{width: 400}}>
					<p>范围</p>
					<Calendar disabledDate={disabledDate} />
				</div>
				<div className="kuma-form-field" style={{width: 400}}>
					<p>时间选择</p>
					<Calendar defaultValue={Date.now()} hasTrigger={true} showTime={true} format="yyyy-MM-dd HH:mm:ss" />
				</div>
				<div className="kuma-form-field" style={{width: 400}}>
					<p>禁用</p>
					<Calendar value="2015-06-06" disabled={true} />
				</div>
			</div>
		)
	}
}

module.exports = Demo;
