var months = [
	{name: "January", short: "Jan"},
	{name: "February", short: "Feb"},
	{name: "March", short: "Mar"},
	{name: "April", short: "Apr"},
	{name: "May", short: "May"},
	{name: "June", short: "Jun"},
	{name: "July", short: "Jul"},
	{name: "August", short: "Aug"},
	{name: "September", short: "Sept"},
	{name: "October", short: "Oct"},
	{name: "November", short: "Nov"},
	{name: "December", short: "Dec"}
]

exports.l10n = function(date) {
	ldate = date;
	return ldate;
}

exports.i18n = function(ldate) {
	date = ldate;
	return date;
}

exports.isValid = function(date) {
	return (date.year >= 1)
		&& (date.month >= 1 && date.month <= 12)
		&& (date.day >= 1 && date.day <= exports.getMonthLength(date.year, date.month));
}

exports.isLeap = function(year) {
	return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

exports.getMonthName = function(month, short) {
	var mon = (months[month-1]);
	if(typeof mon === "undefined") {
		throw new Error("Invalid month number, number should be between 1 and 12");
	}
	return short?mon.short:mon.name;
}

exports.getMonthLength = function(year, month) {
	return new Date(year, month, 0).getDate();
}
