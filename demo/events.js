const current = +new Date();
const end = current + 8 * 60 * 60 * 1000;

export default [
  {
    start: new Date(),
    end,
    cal: current => {
      return <span>从现在到之后的8小时</span>;
    },
  },

  {
    start: '2018-10-10 13:00',
    end: '2018-10-10 14:00',
    cal: current => {
      return <span>10-10</span>;
    },
  },
  {
    start: '2018-10-10 13:00',
    end: '2018-10-10 14:00',
    cal: current => {
      return <span>10-10</span>;
    },
  },
];
