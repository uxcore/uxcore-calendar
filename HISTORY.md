# History
## 0.10.34
* `FIXED` fix i18n form RangeCalendar

## 0.10.33
* `CHANGED` rcCalendar support renderFooter

## 0.10.32
* `CHANGED` make a refactor in fullcalendar

## 0.10.31
* `FIXED` fix a style bug in fullcalendar mode when event cross different month panel

## 0.10.29
* `FIXED` fix styles in year panel

## 0.10.28
* `NEW` add events support for vc-calendar

## 0.10.26
* `CHANGED` change some style in calendarfull
* `NEW` add new callback for schedule click

## 0.10.25
* `CHANGED` change date picker offset in MonthCalendar & YearCalendar

## 0.10.24
* `FIXED` locale fix

## 0.10.23
* `FIXED` revert to 0.10.21

## 0.10.22
* `NEW` add new prop firstDayOfWeek

## 0.10.21
* `NEW` Compatible with different locale formats

## 0.10.20
* `FIXED` fix disabledDate & disabledTime is not working when init

## 0.10.19
* `FIXED` placeholder support i18n

## 0.10.18
* `NEW` add miniWeek、fullWeek component and fix some documents


## 0.10.17
* `CHANGE` auto hidden value text when width is too small
           give a min-width to input-span: 80px which can at least show full year like 2019
           fix a wrong prop type of YearCalendar.transitionName

## 0.10.16
* `CHANGE` lock rc-calendar version

## 0.10.15
* `CHANGE` when select a quickSelectRanges, close the tooltip

## 0.10.13
* `FIXED` add new prop quickSelectRanges for RangeCalendar

## 0.10.11

* `CHANGED` modify footer close button text

## 0.10.10

* `NEW` add new prop quickSelectRanges for RangeCalendar

## 0.10.9

* `FIXED` year can not changed when defaultValue is not set in monthCalendar
* `NEW` add new prop allowedMonthRange for MonthCalendar

## 0.10.7

* `FIXED` month & year cannot be changed if defaultOpenValue is set
* `NEW` support FullCalendar thanks to @kwl777

## 0.10.6

* `CHANEGD` `Calendar`, `MonthCalendar`, `YearCalendar`, new prop `defaultOpenValue`
* `FIXED` some eslint error

## 0.10.4

* `FIXED` monthCalendar style bug after updating `rc-calendar` to `^9.6.0`

## 0.10.2

* `CHANGED` support js style export

## 0.10.0

* `CHANGED` update `uxcore-select` to `^0.5.0`
* `CHANGED` update `rc-calendar` to `^9.6.0`

## 0.9.24

* `CHANGED` value can be selected from end to start in cascade mode

## 0.9.23

* `FIXED` less cascade & usage

## 0.9.22

* `CHANGED` update `rc-time-picker` to `^3.0.0`

## 0.9.21

* `CHANGED` update `rc-util` to `4.x`

## 0.9.18

* `FIXED` RangeCalendar select error if value is null or []

## 0.9.17

* `FIXED` RangeCalendar locale presentation error if value is []

## 0.9.16

* `CHNAGED` update `rc-time-picker` to ~2.4.0

## 0.9.15

* `CHNAGED` update `rc-calendar` to ~8.4.0

## 0.9.14

* `CHANGED` support new prop `onOpenChange`

## 0.9.13

* `FIXED` timepicker style bug when calendar is shown around the border of the container.

## 0.9.11

* `NEW` support new prop `allowClear`


## 0.9.10

* `CHANGED` fit React@15

## 0.9.9

* `CHANGED` style adjustment for small & middle size

## 0.9.8

* `CHANGED` support new prop `size`

## 0.9.7

* `CHANGED` support new props `yearSelectOffset` & `yearSelectTotal`

## 0.9.6

* `FIXED` range picker selected color
* `FIXED` range picker width

## 0.9.5

* `FIXED` HeaderSelect can select disabled date.
* `FIXED` HeaderSelect style adaption

## 0.9.4

* `FIXED` add `generalizeFormat` in Month & Year Calendar

## 0.9.3

* `FIXED` incorrect style

## 0.9.2

* `CHANGED` default format for pmam timepicker

## 0.9.1

* `CHANGED` month & year panel style change

## 0.9.0

* `CHANGED` use new icon
* `CHANGED` style details adjustment

## 0.8.5

* `FIXED` fix year select menu will overflow if locale is en-us

## 0.8.4

* `CHANGED` base style change

## 0.8.2

* `NEW` add new sub Component `RangeCalendar`
* `CHANGED` default `yearSelectOffset` & `yearSelectTotal` change

## 0.8.1

* `FIX` fix style bug

## 0.8.0

* `NEW` new style & timePicker

## 0.7.0

* `NEW` new animation

## 0.6.6

* `CHANGED` ESLint: 80%
* `NEW` add new method `getTriggerNode`

## 0.6.5

`FIXED` can not reset input value if value is null in React@15.x

## 0.6.4
`FIXED` text-indent cause scroll issue.

## 0.6.3

`NEW` new props `showSecond` `showHour`

## 0.6.2

`FIXED` missing method `getTimeConfig`

## 0.6.1

`CHANGED` add prop `timezone` to fix calendar timezone

## 0.6.0

`CHANGED` all panel support clear icon

## 0.5.2

`FIXED` fix select time btn style bug

## 0.5.1

`FIXED` fix contentRender bug

## 0.5.0

`CHANGED` update dependency `rc-calendar` to ~6.0.0

## 0.4.3

`NEW` add new prop `inputWidth` for adjusting the trigger width.

## 0.4.2

`NEW` add polish support.

## 0.4.1

* `FIX` fix monthCalendar & yearCander picker input style bug
* `FIX` disable input style bug

## 0.4.0

`FIX` fix trigger icon

## 0.3.9

`FIX` fix style bug in `input[readonly]`

## 0.3.8

`NEW` add prop `getPopupContainer`

## 0.3.7

`NEW` add prop `timePicker`

## 0.3.6

`FIX` fix npm tarball download fail

## 0.3.5

`NEW` add animate effect

## 0.3.3

`NEW` add TransitionName prop

## 0.3.2
`NEW` export CalendarPanel in Calendar

## 0.3.1
`NEW` add util.generateContentRender to provide a custom package for date render.

## 0.3.0
* `CHANGED` new style
* `CHANGED` change rc-calendar to ~5.5.0

## 0.2.6
`FIXED` fix camelcase of picker.js

## 0.2.5
`FIXED` fix issue #12

## 0.2.4
`CHANGED` update scaffold

## 0.2.2

`CHANGED` set timezoneOffset by user's local timezoneOffset

## 0.2.1
`CHANGED` add year calendar

## 0.2.0
`CHANGED` add month calendar

## 0.1.14
`FIXED` #6

## 0.1.13
`FIXED` fix issue #5: calendar cannot be reset by null.

## 0.1.12
`FIXED` use getCalendarContainer to add uxcore wrap

## 0.1.11
`FIXED` sorry, fix https://github.com/uxcore/uxcore-calendar/issues/3 again

## 0.1.9
`FIXED` https://github.com/uxcore/uxcore-calendar/issues/3

## 0.1.7
`CHANGED` upgrade to react@0.14

## 0.1.6

`CHANGED` change to rc-calendar ver. 3.6.1

## 0.1.5

`FIXED` fix bug when selected

## 0.1.4

`FIXED` fix value and defaultValue bug
