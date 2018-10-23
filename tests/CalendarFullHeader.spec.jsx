import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CalendarFull from '../src/CalendarFull';

Enzyme.configure({ adapter: new Adapter() });

describe('CalendarFullHeader', () => {
  it('should be ok without props', () => {
    mount(<CalendarFull />);
  });
  describe('Props', () => {
    let wrapper;
    it('showTypeSwitch', () => {
      wrapper = mount(<CalendarFull showTypeSwitch={false} />);
      expect(wrapper.find('.kuma-calendar-full-header-switcher').length).to.be(0);
    });
    it('showToday', () => {
      wrapper = mount(<CalendarFull showToday={false} />);
      expect(wrapper.find('.today-btn').length).to.be(0);
    });
  });
});
