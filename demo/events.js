const current = +new Date();
export default [
  // {
  //   start: '2019-05-08 14:00', // 事件开始时间
  //   end: '2019-05-08 16:00', // 事件结束时间
  //   important: true,
  //   title: '事件1',
  //   // 事件的渲染函数
  //   render: '自定义事件1来看看见啊收到了快放假了卡萨帝解放了卡萨帝减肥',
  // },
  {
    start: '2019-05-10 14:00', // 事件开始时间
    end: '2019-05-11 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件4</div>,
  },
  {
    start: '2019-05-10 14:00', // 事件开始时间
    end: '2019-05-14 16:00', // 事件结束时间
    important: true,
    style: {
      background: '#ddd',
      color: 'blue'
    },
    // 事件的渲染函数
    render: () => <div><span>事件福利卡多久啊莱克斯顿解放了卡斯柯剪短发啦睡觉地方了卡萨帝解放啦水豆腐加2</span></div>,
  },
  {
    start: '2019-05-10 14:00', // 事件开始时间
    end: '2019-05-21 16:00', // 事件结束时间
    important: true,
    // 事件的渲染函数
    render: () => <div>事件3</div>,
  },
];
