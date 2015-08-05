# uxcore-calendar

- tags: uxcore, calendar
- description: uxcore calendar
- maintainers: vincent.bian
- version: 0.1.0
- lastupdate: 2015/7/12
- screenshots:
---

## TL;DR

#### setup develop environment

```sh
$ git clone https://github.com/uxcore/uxcore-calendar
$ cd uxcore-calendar
$ npm install
$ npm run dev
```
nav http://localhost:9090/webpack-dev-server/example/ to see the demo

#### deploy to gh-pages
[refer to]( http://stackoverflow.com/questions/17643381/how-to-upload-my-angularjs-static-site-to-github-pages)
```sh
$ npm run build
$ git add build & git commit -m 'update deploy files'
$ npm run deploy
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

|参数|说明|类型|默认值|
|---|----|---|------|
|value|日期|string|无|
|name|表单name值|string|无|
|format|展示的日期格式|string|'yyyy-MM-dd'|
|disabledDate|日期|function|无|
|onSelect|日期|function|无|
|showTime|日期|boolean|false|
|disabled|日期|boolean|false|
