import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Calendar from '../src';

const { YearCalendar } = Calendar;

Enzyme.configure({ adapter: new Adapter() });

describe('YearCalendar', () => {
  let wrapper;
  it('should be ok without props', () => {
    mount(<YearCalendar />);
  });
  it('value', () => {
    wrapper = mount(<YearCalendar value="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').instance().value).to.be('2016');
  });

  it('defaultValue', () => {
    wrapper = mount(<YearCalendar defaultValue="2016-01-02" />);
    expect(wrapper.find('.kuma-calendar-picker-input > input').instance().value).to.be('2016');
  });
});
