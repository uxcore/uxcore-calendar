import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MiniWeek from '../src/miniWeek/MiniWeek';

Enzyme.configure({ adapter: new Adapter() });

describe('MiniWeek', () => {
  it('should be ok without props', () => {
    mount(<MiniWeek />);
  });
  describe('Props', () => {
    let wrapper;
    it('value', () => {
      wrapper = mount(<MiniWeek value="2018-10-02" />);
      expect(wrapper.find('.past').length).to.be(7);
    });

    it('locale', () => {
      wrapper = mount(<MiniWeek value="2018-10-02" locale="en-us" />);
      expect(wrapper.find('[title="Sun"]').length).to.be(1);
    });

    it('events', () => {
      wrapper = mount(<MiniWeek
        value="2018-12-24"
        locale="en-us"
        events={[{
          start: '2018-12-24 14:00', // 事件开始时间
          end: '2018-12-24 16:00', // 事件结束时间
          important: true,
          // 事件的渲染函数
          render: () => <div>24</div>,
        }]}
      />);
      expect(wrapper.find('.event').length).to.be(1);
    });
  });
});
