const Event = function Event(config) {
  let since;
  let till;
  let title;
  let note;
  let tags;

  const construct = () => {
    since = config.since;
    till = config.till;
    title = config.title;
    note = config.note;
    tags = config.tags || [];
  };
  construct();

  const isIn = (_since, _till) => {
    if (_since.int() <= since.int() && _till.int() >= since.int()) {
      return true;
    }
    if (_since.int() <= till.int() && _till.int() >= till.int()) {
      return true;
    }
    return false;
  };

  return { title, note, since, till, tags, isIn };
};

exports.Event = Event;
