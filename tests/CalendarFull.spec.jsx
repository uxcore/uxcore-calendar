import expect from 'expect.js';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Calendar from '../src';
import CalendarFull from '../src/CalendarFull';

Enzyme.configure({ adapter: new Adapter() });

describe('CalendarFull', () => {
  it('should be ok without props', () => {
    mount(<CalendarFull />);
  });
  describe('Props', () => {
    let wrapper;
    it('value', () => {
      wrapper = mount(<CalendarFull value="2018-10-02" type="month" />);
      expect(wrapper.find('.kuma-calendar-full-show-input').instance().value).to.be('2018-10');
    });

    it('locale', () => {
      wrapper = mount(<CalendarFull locale="en-us" type="month" />);
      expect(wrapper.find('.kuma-calendar-full-header-switcher-time').at(0).text()).to.be('date');
    });

    it('format', () => {
      wrapper = mount(<CalendarFull value="2018-10-02" format="yyyy/MM" type="month" />);
      expect(wrapper.find('.kuma-calendar-full-show-input').instance().value).to.be('2018/10');
    });

    it('type', () => {
      wrapper = mount(<CalendarFull type="week" />);
      expect(wrapper.find('.kuma-calendar-full-header-switcher-week').hasClass('kuma-calendar-full-header-switcher-focus'));
    });

    it('startHour', () => {
      wrapper = mount(<CalendarFull type="week" startHour={12} />);
      expect(wrapper.find('.kuma-calendar-full-week-panel-time-panel').at(0).find('.cell-number').text()).to.be('12:00 am');
    });
    it('endHour', () => {
      wrapper = mount(<CalendarFull type="week" endHour={18} />);
      expect(wrapper.find('.kuma-calendar-full-week-panel-time-panel').last().find('.cell-number').text()).to.be('18:00 pm');
    });
    it('step', () => {
      wrapper = mount(<CalendarFull type="week" step={30} startHour={12} endHour={18} />);
      expect(wrapper.find('.kuma-calendar-full-week-panel-date-tr').length).to.be(14);
    });
    it('scheduleRender', () => {
      wrapper = mount(<CalendarFull
        type="week"
        step={30}
        startHour={12}
        endHour={18}
        scheduleRender={Calendar.fullUtil.generateScheduleContent([
          {
            start: '2018-10-23 13:00',
            end: '2018-10-23 14:00',
            cal: () => <div>2018-10-23</div>,
          },
        ])}
      />);
      expect(wrapper.find('.events-wrapper').length).to.be(1);
    });


    it.skip('choose today', () => {
      wrapper = mount(
        <CalendarFull type="week" startHour={12} />,
      );
      wrapper.find('.today-btn').simulate('click');
      expect(wrapper.find('.kuma-calendar-full-week-panel-today').length).to.be(1);
    });
  });
});
