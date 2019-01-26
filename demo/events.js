const current = +new Date();
export default [

  {
    start: '2018-12-24 14:00', // 事件开始时间
    end: '2018-12-24 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>24</div>,
  },
  {
    start: '2018-12-24 14:00', // 事件开始时间
    end: '2018-12-25 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>24</div>,
  },
  {
    start: '2018-12-23 14:00', // 事件开始时间
    end: '2018-12-27 16:00', // 事件结束时间
    // 事件的渲染函数
    render: () => <div>21-29</div>,
  },

];
