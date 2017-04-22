const Event = function Event(data) {
  const construct = () => {
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.title = data.title;
    this.description = data.description;
    this.tags = data.tags;
  };
  construct(data);

  const isIn = (_startDate, _endDate) => {
    if (data.startDate.int() >= _startDate.int() && data.startDate.int() <= _endDate.int()) {
      return true;
    }
    if (data.endDate.int() >= _startDate.int() && data.endDate.int() <= _endDate.int()) {
      return true;
    }
    return false;
  };
  return { isIn };
};

exports.Event = Event;
