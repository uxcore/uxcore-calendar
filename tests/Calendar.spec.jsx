import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';
import KeyCode from 'rc-util/lib/KeyCode';
import formatter from 'uxcore-formatter';

import Calendar from '../src';

describe('Calendar', () => {
  it('should be ok without props', () => {
    mount(<Calendar />);
  });
  describe('Props', () => {
    let wrapper;
    it('value', () => {
      wrapper = mount(<Calendar value="2016-01-02" />);
      expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016-01-02');
    });

    it('defaultValue', () => {
      wrapper = mount(<Calendar defaultValue="2016-01-02" />);
      expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016-01-02');
    });

    it('placeholder', () => {
      wrapper = mount(<Calendar placeholder="测试" />);
      expect(wrapper.find('.kuma-calendar-picker-input > input').node.placeholder).to.be('测试');
    });

    it('format', () => {
      wrapper = mount(<Calendar value="2016-01-02" format="yyyy/MM/dd" />);
      expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016/01/02');
    });

    it('locale', () => {
      wrapper = mount(<Calendar locale="en-us" />);
      wrapper.find('.kuma-calendar-picker-input').simulate('click');
      const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
      expect(dropdownWrapper.find('.kuma-calendar-today-btn').text()).to.be('Today');
    });

    it('disabledDate', () => {
      wrapper = mount(
        <Calendar
          value="2016-10-10"
          disabledDate={current => current.getTime() > new Date('2016-10-11').getTime()}
        />
      );
      wrapper.find('.kuma-calendar-picker-input').simulate('click');
      const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
      expect(dropdownWrapper.find('.kuma-calendar-disabled-cell-first-of-row').length).not.to.be(0);
      expect(dropdownWrapper.find('.kuma-calendar-disabled-cell-first-of-row').node.title).to.be('2016-10-12');
    });

    it('generateContentRender', () => {
      wrapper = mount(
        <Calendar
          value="2016-01-07"
          contentRender={Calendar.util.generateContentRender({
            '2016-01-07': 'leave',
            '2016-01-09': 'work',
            '2016-01-08': 'schedule',
          }, 'en')}
        />
      );
      wrapper.find('.kuma-calendar-picker-input').simulate('click');
      const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
      expect(dropdownWrapper.find('.kuma-calendar-date-decoration').length).not.to.be(0);
    });

    it('ESC', () => {
      wrapper = mount(<Calendar />);
      wrapper.find('.kuma-calendar-picker-input').simulate('click');
      const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
      dropdownWrapper.find('.kuma-calendar').simulate('keyDown', { keyCode: KeyCode.ESC });
      expect(wrapper.find('Trigger').node.state.popupVisible).to.be(false);
    });

    it('choose today', (done) => {
      wrapper = mount(
        <Calendar
          onSelect={(value) => {
            expect(formatter.date(value)).to.be(formatter.date(new Date()));
            done();
          }}
        />);
      wrapper.find('.kuma-calendar-picker-input').simulate('click');
      const dropdownWrapper = mount(wrapper.find('Trigger').node.getComponent());
      dropdownWrapper.find('.kuma-calendar-today-btn').simulate('click');
    });
  });
});
