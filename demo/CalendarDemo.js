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
				<div className="kuma-form-item">
					<label className="kuma-label">基本</label>
					<Calendar value="" />
				</div>
				<div className="kuma-form-item">
					<label className="kuma-label">日期格式</label>
					<Calendar value="2015/01/01" format="yyyy/MM/dd" />
				</div>
				<div className="kuma-form-item">
					<label className="kuma-label">选择日期</label>
					<Calendar onSelect={onSelect} />
				</div>
				<div className="kuma-form-item">
					<label className="kuma-label">范围</label>
					<Calendar disabledDate={disabledDate} />
				</div>
				<div className="kuma-form-item">
					<label className="kuma-label">时间选择</label>
					<Calendar focused={true} hasTrigger={true} showTime={true} format="yyyy-MM-dd HH:mm:ss" />
				</div>
				<div className="kuma-form-item">
					<label className="kuma-label">禁用</label>
					<Calendar value="2015-06-06" disabled={true} />
				</div>
			</div>
		)
	}
}

module.exports = Demo;
