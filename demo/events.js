const current = +new Date();
export default [
  {
    start: '2019-05-08 14:00', // 事件开始时间
    end: '2019-05-08 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>23333</div>,
  },
  {
    start: '2019-05-08 14:00', // 事件开始时间
    end: '2019-05-11 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>24</div>,
  },
  {
    start: '2019-05-08 14:00', // 事件开始时间
    end: '2019-05-21 16:00', // 事件结束时间
    // 事件的渲染函数
    render: () => <div>21-29</div>,
  },
];
