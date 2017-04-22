const DefaultAdapter = require('./default.adapter.js').Adapter;
const Event = require('./event.class.js');
const OneDate = require('./event.class.js');

const EventManager = function EventManager(config = {}) {
  let primaryAdapterId = 'dariush-alipour.onecalendar.adapter.default';
  let primaryAdapter;
  let events = [];

  const getAdapter = (adapterId) => {
    const adapter = this.adapters.find(item => item.id === adapterId);
    if (!adapter) throw new Error(`requested adapter '${adapterId}' not found.`);
    return adapter;
  };

  const construct = () => {
    this.adapters = (config.externalAdapters || []).push(new DefaultAdapter());
    primaryAdapterId = config.primaryAdapterId || primaryAdapterId;
    primaryAdapter = getAdapter(primaryAdapterId);
  };
  construct();

  const add = (evt) => {
    const startDate = new OneDate(evt.startDate.concat({
      adapter: getAdapter(evt.startDate.adapterId),
    }));
    const endDate = evt.endDate ?
      new OneDate(evt.endDate.concat({
        adapter: getAdapter(evt.endDate.adapterId),
      })) :
      new OneDate(evt.startDate.concat({
        adapter: getAdapter(evt.startDate.adapterId),
      }));

    const event = new Event({
      startDate,
      endDate,
      title: evt.title,
      description: evt.description,
      tags: evt.tags,
    });
    this.events.push(event);
  };

  const edit = (eventId, evt) => {

  };

  const remove = (eventId) => {
    events = events.filter(evt => evt.id !== eventId);
    return events;
  };

  const getDateRange = (startDate, endDate) => {
    events = this.events.filter(evt => evt.isIn(startDate, endDate));
    return events;
  };

  const getMonth = (_year, _month) => {
    const now = new Date();
    const lnow = primaryAdapter.l10n({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate,
    });

    const year = _year || lnow.year;
    const month = _month || lnow.month;

    const monthLength = primaryAdapter.getMonthLength(year, month);
    return this.getDateRange({ year, month, day: 1 }, { year, month, day: monthLength });
  };

  const getYear = year => this.getDateRange(
    { year, month: 1, day: 1 }, { year, month: 12, day: 31 });

  return {
    add,
    edit,
    remove,
    getDateRange,
    getMonth,
    getYear,
  };
};

exports.EventManager = EventManager;
