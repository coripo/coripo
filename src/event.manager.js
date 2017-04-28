const GregorianAdapter = require('coripo-core').GregorianAdapter;
const Event = require('coripo-core').Event;
const OneDate = require('coripo-core').OneDate;
const BasicGenerator = require('./basic.generator.js').Generator;

const EventManager = function EventManager(config = {}) {
  let primaryAdapterId;
  let primaryAdapter;
  let adapters = [];
  let generators = [];
  let eventStore = [];

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
    adapters = ([GregorianAdapter]).concat((config.plugins || {}).adapters || []);
    adapters = adapters.map(Adapter => new Adapter());
    primaryAdapterId = config.primaryAdapterId || new GregorianAdapter().id;
    primaryAdapter = getAdapter(primaryAdapterId);

    generators = ([BasicGenerator]).concat((config.plugins || {}).generators || []);
    generators = generators.map((Generator) => {
      const dependencies = { Event, OneDate, getAdapter, primaryAdapterId };
      return new Generator(dependencies);
    });
  };
  construct();

  const addEvent = (evt) => {
    const generator = getGenerator(evt.generatorId);
    const event = generator.generate(evt);
    eventStore = eventStore.concat([event]);
    return eventStore;
  };

  const edit = () => {

  };

  const remove = (eventId) => {
    eventStore = eventStore.filter(evt => evt.id !== eventId);
    return eventStore;
  };

  const getEventsIn = (since, till) => {
    const helper = { getAdapter, primaryAdapterId };
    let events = eventStore.reduce((acc, val) => acc.concat(val.query(
      new OneDate(since, helper),
      new OneDate(till, helper))), []);
    events = events.sort((a, b) => a.since.int() - b.since.int());
    return events;
  };

  return { getAdaptersInfo, getMonthInfo, addEvent, getEventsIn, edit, remove };
};

exports.EventManager = EventManager;
