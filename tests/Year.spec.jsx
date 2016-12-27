import expect from 'expect.js';
import React from 'react';
import { mount } from 'enzyme';

import Calendar from '../src';

const { YearCalendar } = Calendar;

describe('YearCalendar', () => {
  let wrapper;
  it('should be ok without props', () => {
    mount(<YearCalendar />);
  });
  it('value', () => {
    wrapper = mount(<YearCalendar value="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016');
  });

  it('defaultValue', () => {
    wrapper = mount(<YearCalendar defaultValue="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').node.value).to.be('2016');
  });
});
