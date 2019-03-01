import moment from 'moment';

export const getDate = (date, { timezone, locale, firstDayOfWeek }) => {
  moment.locale(locale, { week: { dow: firstDayOfWeek } });
  const value = moment(date);
  if (timezone) {
    return value.utcOffset(parseInt(timezone, 10) * 60);
  }
  return value;
};

export const getDates = (dates, { timezone, locale, firstDayOfWeek }) => {
  if (Array.isArray(dates)) {
    return dates.map(date => getDate(date, { timezone, locale, firstDayOfWeek }));
  }
  return [];
};
