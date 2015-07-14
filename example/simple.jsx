import '../style/kuma/src/less/kuma.less';
import React from 'react';
import Calendar from '../index.js';

function onSelect(value) {
  console.log('onSelect');
  console.log(value);
}

React.render(
  <div>
    <h2>calendar (en-us, U.S.A.  California  San Francisco)</h2>
    <Calendar showWeekNumber={true}
      showOk={0}
      showClear={0}
      onSelect={onSelect}
      showTime={true}/>
  </div>, document.getElementById('content'));
