const Adapter = function Adapter() {
  const name = 'dariush-alipour.onecalendar.adapter.default';

  const months = [
    { name: 'January', short: 'Jan' },
    { name: 'February', short: 'Feb' },
    { name: 'March', short: 'Mar' },
    { name: 'April', short: 'Apr' },
    { name: 'May', short: 'May' },
    { name: 'June', short: 'Jun' },
    { name: 'July', short: 'Jul' },
    { name: 'August', short: 'Aug' },
    { name: 'September', short: 'Sept' },
    { name: 'October', short: 'Oct' },
    { name: 'November', short: 'Nov' },
    { name: 'December', short: 'Dec' },
  ];

  const l10n = date => date;

  const i18n = ldate => ldate;

  const getMonthName = (month, short) => {
    const mon = (months[month - 1]);
    if (typeof mon === 'undefined') {
      throw new Error('Invalid month number, number should be between 1 and 12');
    }
    return short ? mon.short : mon.name;
  };

  const getMonthLength = (year, month) => new Date(year, month, 0).getDate();

  const isValid = date => (date.year >= 1)
    && (date.month >= 1 && date.month <= 12)
    && (date.day >= 1 && date.day <= getMonthLength(date.year, date.month));

  const isLeap = year => ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);

  return { name, l10n, i18n, isValid, isLeap, getMonthName, getMonthLength };
};

exports.Adapter = Adapter;
