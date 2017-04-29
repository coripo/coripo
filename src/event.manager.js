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

  const addEvent = (eventConfig) => {
    const generator = getGenerator(eventConfig.generatorId);
    const event = generator.generate(eventConfig);
    eventStore = eventStore.concat([event]);
    return eventStore;
  };

  const removeEvent = (eventId) => {
    eventStore = eventStore.filter(evt => evt.id !== eventId);
    return eventStore;
  };

  const editEvent = (eventConfig) => {
    removeEvent(eventConfig.id);
    return addEvent(eventConfig);
  };

  const getEventsRange = evts => evts.reduce((range, e) => ({
    since: e.since.int() < range.since.int() ? e.since : range.since,
    till: e.till.int() > range.till.int() ? e.till : range.till,
  }), { since: evts[0].since, till: evts[0].till });

  const handleOverlaps = (seriesArray, _since, _till) => seriesArray.reduce((sArray, series) => {
    if (series.overlap.includes('allow')) return sArray.concat([series]);

    const conflicts = sArray.filter((s) => {
      const sameGenerator = s.generatorId === series.generatorId;
      const sameOverlapRule = s.overlap === series.overlap;
      return sameGenerator && sameOverlapRule;
    }).concat([series])
      .sort((a, b) => b.range.since.int() - a.range.since.int());
    if (conflicts.length === 1) return sArray.concat([series]);

    const master = conflicts[0];

    const items = sArray.filter((s) => {
      const sameGenerator = s.generatorId === series.generatorId;
      const sameOverlapRule = s.overlap === series.overlap;
      return !(sameGenerator && sameOverlapRule);
    });

    const forever = series.overlap.includes('forever');

    const rangeSince = master.range.since;
    const rangeTill = forever ? _till.offsetYear(1) : master.range.till;

    if (series.overlap.includes('remove')) {
      const slaves = conflicts.slice(1).reduce((sa, s) => {
        const item = s;
        item.events = s.events
          .filter(e => !e.collides(rangeSince, rangeTill));
        return sa.concat(item);
      }, []);
      return items.concat([master]).concat(slaves);
    }
    if (series.overlap.includes('trim')) {
      const slaves = conflicts.slice(1).reduce((sa, s) => {
        const item = s;
        const slaveEvents = s.events
          .filter(e => e.collides(rangeSince, rangeTill))
          .sort((a, b) => b.since.int() - a.since.int());
        if (!slaveEvents.length) return sa.concat(item);
        const evts = s.events
          .filter(e => !e.collides(rangeSince, rangeTill));
        const trimmedSlaves = slaveEvents.map((evt) => {
          let slave = evt;
          let collision = slave.collides(rangeSince, rangeTill);
          while (collision) {
            if (collision.includes('r')) {
              slave = (new Event({
                id: slave.id,
                generatorId: slave.generatorId,
                virtual: slave.virtual,
                overlap: slave.overlap,
                priority: slave.priority,
                title: slave.title,
                note: slave.note,
                color: slave.color,
                since: slave.since,
                till: rangeSince.offsetDay(-1),
              })).query(_since, _till)[0];
            } else if (collision.includes('l')) {
              slave = (new Event({
                id: slave.id,
                generatorId: slave.generatorId,
                virtual: slave.virtual,
                overlap: slave.overlap,
                priority: slave.priority,
                title: slave.title,
                note: slave.note,
                color: slave.color,
                since: rangeTill.offsetDay(1),
                till: slave.till,
              })).query(_since, _till)[0];
            }
            collision = slave.collides(rangeSince, rangeTill);
          }
          return slave;
        }).filter(evt => evt.till.int() - evt.since.int() >= 0);
        item.events = evts.concat(trimmedSlaves);
        return sa.concat(item);
      }, []);
      return items.concat([master]).concat(slaves);
    }
    return sArray.concat([series]);
  }, []);

  const getEventsIn = (_since, _till) => {
    const helper = { getAdapter, primaryAdapterId };
    const since = new OneDate(_since, helper);
    const till = new OneDate(_till, helper);
    const seriesArray = eventStore.reduce((acc, e) => {
      let sArray = acc;
      const eventsArray = e.query(since, till);
      if (!eventsArray.length) return sArray;
      sArray = sArray.concat([{
        generatorId: eventsArray[0].generatorId,
        overlap: eventsArray[0].overlap,
        events: eventsArray,
        range: getEventsRange(eventsArray),
      }]);
      sArray = handleOverlaps(sArray, since, till);
      return sArray;
    }, []);
    let events = seriesArray.reduce((evts, s) => evts.concat(s.events), []);
    events = events.sort((a, b) => a.since.int() - b.since.int());
    return events;
  };

  return {
    getAdaptersInfo,
    getMonthInfo,
    addEvent,
    getEventsIn,
    editEvent,
    removeEvent,
  };
};

exports.EventManager = EventManager;
