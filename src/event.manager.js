const Event = require('./event.class.js');

const EventManager = function EventManager() {
  const construct = () => {
    this.events = [];
  };
  construct();

  const setAdapter = (adapter) => {
    this.adapter = adapter;
  };

  const add = (startDate, endDate, title, description, tags) => {
    const event = new Event(startDate, endDate, title, description, tags);
    this.events.push(event);
  };

  const getDate = (startDate, endDate) => {
    const events = this.events.filter(evt => evt.isIn(startDate, endDate));
    return events;
  };

  const getMonth = (year, month) => {
    for (let i = 1; i <= this.adapter.getMonthLength(year, month); i += 1) {
      this.getDate({ year, month, day: i });
    }
  };

  return { setAdapter, add, getDate, getMonth };
};

exports.EventManager = EventManager;
