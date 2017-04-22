const OneDate = function OneDate(data) {
  const construct = () => {
    this.adapterId = data.adapterId;
    this.year = data.year;
    this.month = data.month;
    this.day = data.day;
  };
  construct();

  const int = () => parseInt(`${this.year.slice(-4)}${this.month.slice(-2)}${this.day.slice(-2)}`, 10);

  return { int };
};

exports.OneDate = OneDate;
