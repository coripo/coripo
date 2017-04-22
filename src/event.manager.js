const Event = require('./event.class.js');

const EventManager = function EventManager(data) {
  const construct = () => {
    this.events = [];
    this.adapter = data.adapter;
  };
  construct();

  const add = (startDate, endDate, title, description, tags) => {
    const event = new Event({ startDate, endDate, title, description, tags });
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

  return { add, getDate, getMonth };
};

exports.EventManager = EventManager;
