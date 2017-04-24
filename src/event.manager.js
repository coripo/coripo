const GregorianAdapter = require('onecalendar-core').GregorianAdapter;
const Event = require('onecalendar-core').Event;
const OneDate = require('onecalendar-core').OneDate;
const BasicGenerator = require('./basic.generator.js').Generator;

const EventManager = function EventManager(config = {}) {
  let primaryAdapterId;
  let primaryAdapter;
  let adapters = [];

  let generators = [];

  let events = [];

  const getAdapter = (adapterId) => {
    const adapter = adapters.find(a => a.id === (adapterId || primaryAdapterId));
    if (!adapter) throw new Error(`requested adapter '${adapterId}' not found.`);
    return adapter;
  };

  const getGenerator = (generatorId) => {
    const generator = generators.find(g => g.id === generatorId);
    if (!generator) throw new Error(`requested generator '${generatorId}' not found.`);
    return generator;
  };

  const construct = () => {
    adapters = ([GregorianAdapter]).concat(config.externalAdapters || []);
    adapters = adapters.map(Adapter => new Adapter());
    primaryAdapterId = config.primaryAdapterId || new GregorianAdapter().id;
    primaryAdapter = getAdapter(primaryAdapterId);

    generators = ([BasicGenerator]).concat(config.externalGenerators || []);
    generators = generators.map((Generator) => {
      const dependencies = { Event, OneDate, getAdapter, primaryAdapterId };
      return new Generator(dependencies);
    });
  };
  construct();

  const add = (evt) => {
    // const since = new OneDate(evt.since, { getAdapter, primaryAdapterId });
    // const till = evt.till ?
    //   new OneDate(evt.till, { getAdapter, primaryAdapterId }) :
    //   new OneDate(evt.since, { getAdapter, primaryAdapterId });
    const generator = getGenerator(evt.generatorId);
    const event = generator.generate(evt);
    events = events.concat([event]);
    return events;
  };

  const edit = () => {

  };

  const remove = (eventId) => {
    events = events.filter(evt => evt.id !== eventId);
    return events;
  };

  const getDateRange = (since, till) => {
    const helper = { getAdapter, primaryAdapterId };
    const result = events.reduce((acc, val) => acc.concat(val.query(
      new OneDate(since, helper),
      new OneDate(till, helper))), []);
    return result;
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

  return { add, edit, remove, getDateRange, getMonth, getYear };
};

exports.EventManager = EventManager;
