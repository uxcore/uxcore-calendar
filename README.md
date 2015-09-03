# uxcore-calendar

- tags: uxcore, calendar
- description: uxcore calendar
- maintainers: vincent.bian, eternalsky
- version: 0.1.5
- lastupdate: 2015/7/12
- screenshots:
---

## TL;DR

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-calendar
$ cd uxcore-calendar
$ npm install
$ gulp server
```

## Usage

```js
var Calendar = require('uxcore-calendar');
React.render(
  (<Calendar />),
  document.getElementById('content')
);
```

### demo
http://uxcore.github.io/uxcore-calendar/

## API

### props

|参数|类型|默认值|说明|
|---|----|---|------|
|format|string|'yyyy-MM-dd'|输入框中时间的显示格式|
|placeholder|string|'请选择日期'|输入框中的 placeholder|
|onSelect|function|-|选中时触发|
|locale|string|'zh-cn'|目前仅支持 'zh-cn' 和 'en-us'
|hasTrigger|boolean|false|是否显示触发区域（一个小图标）|
|className|string|-|弹出日历的额外顶级类名|
|style|object|-|修改弹出日历的样式时可以使用|
|disabledDate|function|-|function 返回 true 的部分不显示，传入两个参数，current 和 value|
|showWeekNumber|boolean|-|-|
|showToday|boolean|-|-|
|showTime|boolean|-|-|
|disabled|boolean|false|是否禁用|

