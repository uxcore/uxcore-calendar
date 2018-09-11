import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Calendar from '../src';

const { MonthCalendar } = Calendar;

Enzyme.configure({ adapter: new Adapter() });

describe('MonthCalendar', () => {
  let wrapper;
  it('should be ok without props', () => {
    mount(<MonthCalendar />);
  });
  it('value', () => {
    wrapper = mount(<MonthCalendar value="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').instance().value).to.be('2016-01');
  });

  it('defaultValue', () => {
    wrapper = mount(<MonthCalendar defaultValue="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').instance().value).to.be('2016-01');
  });
});
