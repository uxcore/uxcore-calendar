const current = +new Date();
export default [
  {
    start: '2019-05-10 14:00', // 事件开始时间
    end: '2019-05-11 16:00', // 事件结束时间
    important: true,
    style: {
      background: 'lightblue',
      color: 'red'
    },
    // 事件的渲染函数
    render: () => <div>事件1</div>,
  },
  {
    start: '2019-05-10 14:00', // 事件开始时间
    end: '2019-05-14 16:00', // 事件结束时间
    important: true,
    // style: {
    //   background: '#ddd',
    //   color: 'blue'
    // },
    // 事件的渲染函数
    render: () => (
      <div>
        <span>事件2</span>
      </div>
    ),
  },
  {
    start: '2019-05-10 14:00', // 事件开始时间
    end: '2019-05-21 16:00', // 事件结束时间
    important: true,
    style: {
      background: 'yellow',
      color: 'blue'
    },
    // 事件的渲染函数
    render: () => <div>事件3</div>,
  },
  {
    start: '2019-05-30 14:00', // 事件开始时间
    end: '2019-06-13 17:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件4</div>,
  },
  {
    start: '2019-05-30 14:00', // 事件开始时间
    end: '2019-05-30 18:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件5</div>,
  },
  {
    start: '2019-05-30 14:00', // 事件开始时间
    end: '2019-06-13 21:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件8</div>,
  },
  {
    start: '2019-05-01 14:00', // 事件开始时间
    end: '2019-06-03 21:00', // 事件结束时间
    important: true,
    style: {
      background: 'lightblue',
      color: 'white'
    },
    // 事件的渲染函数
    render: () => <div>事件9</div>,
  },
  {
    start: '2019-04-29 14:00', // 事件开始时间
    end: '2019-04-30 21:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件10</div>,
  },
  {
    start: '2019-06-05 06:00', // 事件开始时间
    end: '2019-06-06 21:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件11</div>,
  },
  {
    start: '2019-06-05 09:00', // 事件开始时间
    end: '2019-06-08 21:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件12</div>,
  },
  {
    start: '2019-06-05 14:00', // 事件开始时间
    end: '2019-06-05 21:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件13</div>,
  },
  {
    start: '2019-06-04 01:00', // 事件开始时间
    end: '2019-06-04 24:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>14</div>,
  },
];
