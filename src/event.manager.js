const GregorianAdapter = require('coripo-core').GregorianAdapter;
const Event = require('coripo-core').Event;
const OneDate = require('coripo-core').OneDate;
const BasicGenerator = require('./basic.generator.js').Generator;

const EventManager = function EventManager(config = {}) {
  let primaryAdapterId;
  let primaryAdapter;
  let adapters = [];

  let generators = [];

  let events = [];

  const getAdaptersInfo = () => adapters.map(a => (
    { id: a.id, name: a.name, description: a.description }
  ));

  const getAdapter = (adapterId) => {
    const adapter = adapters.find(a => a.id === (adapterId || primaryAdapterId));
    if (!adapter) throw new Error(`requested adapter '${adapterId}' not found.`);
    return adapter;
  };

  const getMonthInfo = (year, month) => ({
    name: primaryAdapter.getMonthName(month),
    days: primaryAdapter.getMonthLength(year, month),
  });

  const getGenerator = (generatorId) => {
    const generator = generators.find(g => g.id === generatorId);
    if (!generator) throw new Error(`requested generator '${generatorId}' not found.`);
    return generator;
  };

  const construct = () => {
    adapters = ([GregorianAdapter]).concat((config.plugins || []).adapters || []);
    adapters = adapters.map(Adapter => new Adapter());
    primaryAdapterId = config.primaryAdapterId || new GregorianAdapter().id;
    primaryAdapter = getAdapter(primaryAdapterId);

    generators = ([BasicGenerator]).concat((config.plugins || []).generators || []);
    generators = generators.map((Generator) => {
      const dependencies = { Event, OneDate, getAdapter, primaryAdapterId };
      return new Generator(dependencies);
    });
  };
  construct();

  const addEvent = (evt) => {
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

  const getEventsIn = (since, till) => {
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

  return { getAdaptersInfo, getMonthInfo, addEvent, getEventsIn, edit, remove, getMonth, getYear };
};

exports.EventManager = EventManager;
