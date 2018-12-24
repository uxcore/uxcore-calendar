const current = +new Date();
const end = current + 8 * 60 * 60 * 1000;

export default [
  {
    start: '2018-12-20 14:00', // 事件开始时间
    end: '2018-12-20 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>12-23 14:00 ~  12-26 16:00</div>,
  },
  {
    start: '2018-12-20 14:00', // 事件开始时间
    end: '2018-12-20 16:00', // 事件结束时间
    // 事件的渲染函数
    render: () => <div>12-20 14:00 ~  12-20 16:00</div>,
  },

];
