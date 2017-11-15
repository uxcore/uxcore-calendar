# uxcore-calendar

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url] 
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-calendar.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-calendar
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-calendar.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-calendar
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-calendar.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-calendar?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-calendar.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-calendar
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-calendar.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-calendar#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-calendar.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-calendar.svg
[sauce-url]: https://saucelabs.com/u/uxcore-calendar

## TL;DR

transfer ui component for react

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-calendar
$ cd uxcore-calendar
$ npm install
$ npm start
```

## Usage

```js
var Calendar = require('uxcore-calendar');
var MonthCalendar = Calendar.MonthCalendar;
var YearCalendar = Calendar.YearCalendar;
React.render(
  (<Calendar />),
  document.getElementById('target')
);
```

### demo
http://uxco.re/components/calendar/

## API
- onSelect(date, formatDateString)
    - date `date`
    - formatDateString `string`

## Attention

0.8.0 之后，我们使用 moment 替代了 gregorianCalendar，在一些格式上和用法上有了一些变化。

### props

|参数|说明|类型|默认值|版本|
|---|----|---|------|---|
|value|日期|string/number|无||
|defaultValue|日期|string/number|无||
|placeholder|占位符|string|请选择日期||
|format|展示的日期格式|string|'YYYY-MM-DD'||
|locale|`en-us`,`zh-cn` 和 `pl-pl`|string|`zh-cn`||
|disabledDate|不可选择的日期|(currentDate) => boolean|无||
|disabledTime|不可选择的时间，返回格式见下文|function(date)||
|onSelect|当日期被选中时触发|function(date)|无||
|showTime|是否显示时间选择面板|boolean|false||
|showHour|时间选择面板是否显示小时|boolean|true|0.6.3|
|showSecond|时间选择面板是否显示秒|boolean|true|0.6.3|
|disabled|禁用|boolean|false||
|timePicker|自己传入定制的 timePicker|React Element|-||
|getPopupContainer| 弹出的菜单渲染在哪个容器中 | function(trigger:Node):Node | function(){return document.body;}||
|yearSelectOffset | 年选择器中第一个年份与当前选中值之间的距离，例如当前为 1997 年，距离为 50，则最早可选择年份为 1947 年 | number | 50 | 0.9.7 |
|yearSelectTotal| 年选择器中年份的总数，如最早可选为 1947 年，总数为 100，则可选年份范围为 1947 - 2047 | number | 100 | 0.9.7 |
|size| 尺寸，支持 large/middle/small | string | large | 0.9.8 |
|allowClear| 是否支持清空 | boolean | true | 0.9.12 |


#### disabledTime 例子

``` js
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function disabledTime() {
  return {
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
}
```

### MonthCalendar Props

|参数|说明|类型|默认值|版本|
|---|----|---|------|---|
|value|日期|string/number|无|
|defaultValue|日期|string/number|无|
|placeholder|占位符|string|请选择日期|
|format|展示的日期格式|string|'yyyy-MM'|
|locale|`en-us`,`zh-cn` 和 `pl-pl`|string|`zh-cn`|
|onSelect|当日期被选中时触发|function|无|
|disabled|禁用|boolean|false|
|getPopupContainer| 弹出的菜单渲染在哪个容器中 | function(trigger:Node):Node | function(){return document.body;}|
|allowClear| 是否支持清空 | boolean | true | 0.9.12 |

### YearCalendar Props

|参数|说明|类型|默认值|版本|
|---|----|---|------|---|
|value|日期|string/number|无|
|defaultValue|日期|string/number|无|
|placeholder|占位符|string|请选择日期|
|format|展示的日期格式|string|'yyyy'|
|locale|`en-us`,`zh-cn` 和 `pl-pl`|string|`zh-cn`|
|onSelect|当日期被选中时触发|function|无|
|disabled|禁用|boolean|false|
|getPopupContainer| 弹出的菜单渲染在哪个容器中 | function(trigger:Node):Node | function(){return document.body;}|
|allowClear| 是否支持清空 | boolean | true | 0.9.12 |

### RangeCalendar Props

参数基本与 Calendar 相同

|参数|说明|类型|默认值|版本|
|---|----|---|------|---|
|value|日期|array|无|
|defaultValue|日期|array|无|


#### util

> 一些辅助函数，用于某些套餐化定制

* Calendar.util.generateContentRender(code, locale): 用于在日历上标注非常规的休假、上班以及日程。
    * code should be an object like this {'xxxx-xx-xx': ['work/leave/schedule']}
    * locale should be `zh-cn` or `en-us`