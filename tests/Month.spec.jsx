import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';

import Calendar from '../src';

const { MonthCalendar } = Calendar;

describe('MonthCalendar', () => {
  let wrapper;
  it('should be ok without props', () => {
    mount(<MonthCalendar />);
  });
  it('value', () => {
    wrapper = mount(<MonthCalendar value="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016-01');
  });

  it('defaultValue', () => {
    wrapper = mount(<MonthCalendar defaultValue="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016-01');
  });
});
