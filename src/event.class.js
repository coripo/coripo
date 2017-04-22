const Event = function Event(config) {
  let startDate;
  let endDate;
  let title;
  let note;
  let tags;

  const construct = () => {
    startDate = config.startDate;
    endDate = config.endDate;
    title = config.title;
    note = config.note;
    tags = config.tags || [];
  };
  construct();

  const isIn = (_startDate, _endDate) => {
    if (startDate.int() >= _startDate.int() && startDate.int() <= _endDate.int()) {
      return true;
    }
    if (endDate.int() >= _startDate.int() && endDate.int() <= _endDate.int()) {
      return true;
    }
    return false;
  };

  return { title, note, startDate, endDate, tags, isIn };
};

exports.Event = Event;
