# uxcore-calendar

---

## TL;DR

transfer ui component for react

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
  document.getElementById('target')
);
```

### demo
http://uxcore.github.io/uxcore/components/calendar/

## API

### props

|参数|类型|默认值|说明|
|---|----|---|------|
|value|日期|string|无|
|defaultValue|日期|string|无|
|placeholder|placeholder文案|string|请选择日期|
|format|展示的日期格式|string|'yyyy-MM-dd'|
|locale|`en-us` 或`zh-cn`|string|`zh-cn`|
|disabledDate|日期|function|无|
|onSelect|日期|function|无|
|showTime|日期|boolean|false|
|disabled|日期|boolean|false|
