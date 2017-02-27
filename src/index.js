/**
 * Calendar Component for uxcore
 * @author
 *
 * Copyright 2014-2015, Uxcore Team, Alinw.
 * All rights reserved.
 */


const MonthCalendar = require('./MonthCalendar');
const YearCalendar = require('./YearCalendar');
const Calendar = require('./Calendar');
const RangeCalendar = require('./RangeCalendar');
const Pmam = require('./timePicker/Pmam');

Calendar.MonthCalendar = MonthCalendar;
Calendar.YearCalendar = YearCalendar;
Calendar.RangeCalendar = RangeCalendar;
Calendar.Pmam = Pmam;

module.exports = Calendar;
