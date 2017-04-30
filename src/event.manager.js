/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const GregorianAdapter = require('coripo-core').GregorianAdapter;
const Event = require('coripo-core').Event;
const OneDate = require('coripo-core').OneDate;
const BasicGenerator = require('./basic.generator.js').Generator;

const EventManager = function EventManager(_config) {
  const config = _config || {};
  let primaryAdapterId;
  let primaryAdapter;
  let adapters = [];
  let generators = [];
  let eventStore = [];

  const getAdaptersInfo = function getAdaptersInfo() {
    return adapters.map(function (a) {
      return { id: a.id, name: a.name, description: a.description };
    });
  };

  const getGeneratorsInfo = function getGeneratorsInfo() {
    return generators.map(function (g) {
      return { id: g.id, name: g.name, description: g.description, inputs: g.inputs };
    });
  };

  const getAdapter = function getAdapter(adapterId) {
    const adapter = adapters.find(function (a) {
      return a.id === (adapterId || primaryAdapterId);
    });
    if (!adapter) throw new Error('requested adapter ' + adapterId + ' not found.');
    return adapter;
  };

  const generateDate = function generateDate(dateConfig) {
    const helper = { getAdapter, primaryAdapterId };
    return new OneDate(dateConfig, helper);
  };

  const getCurrentDate = function getCurrentDate() {
    const date = primaryAdapter.l10n({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    });
    return generateDate(date);
  };

  const getMonthInfo = function getMonthInfo(year, month) {
    return {
      name: primaryAdapter.getMonthName(month),
      days: primaryAdapter.getMonthLength(year, month),
    };
  };

  const getGenerator = function getGenerator(generatorId) {
    const generator = generators.find(function (g) { return g.id === generatorId; });
    if (!generator) throw new Error('requested generator ' + generatorId + ' not found.');
    return generator;
  };

  const construct = function construct() {
    adapters = ([GregorianAdapter]).concat((config.plugins || {}).adapters || []);
    adapters = adapters.map(function (Adapter) { return new Adapter(); });
    primaryAdapterId = config.primaryAdapterId || new GregorianAdapter().id;
    primaryAdapter = getAdapter(primaryAdapterId);

    generators = ([BasicGenerator]).concat((config.plugins || {}).generators || []);
    generators = generators.map(function (Generator) {
      const dependencies = { Event, OneDate, getAdapter, primaryAdapterId };
      return new Generator(dependencies);
    });
  };
  construct();

  const addEvent = function addEvent(eventConfig) {
    const generator = getGenerator(eventConfig.generatorId);
    const event = generator.generate(eventConfig);
    eventStore = eventStore.concat([event]);
    return eventStore;
  };

  const removeEvent = function removeEvent(eventId) {
    eventStore = eventStore.filter(function (evt) { return evt.id !== eventId; });
    return eventStore;
  };

  const editEvent = function editEvent(eventConfig) {
    removeEvent(eventConfig.id);
    return addEvent(eventConfig);
  };

  const handleOverlaps = function handleOverlaps(seriesArray, _since, _till) {
    return seriesArray.reduce(function (sArray, series) {
      if (series.overlap.includes('allow')) return sArray.concat([series]);

      const conflicts = sArray.filter(function (s) {
        const sameGenerator = s.generatorId === series.generatorId;
        const sameOverlapRule = s.overlap === series.overlap;
        return sameGenerator && sameOverlapRule;
      }).concat([series])
        .sort(function (a, b) { return b.range.since.int() - a.range.since.int(); });
      if (conflicts.length === 1) return sArray.concat([series]);

      const master = conflicts[0];

      const items = sArray.filter(function (s) {
        const sameGenerator = s.generatorId === series.generatorId;
        const sameOverlapRule = s.overlap === series.overlap;
        return !(sameGenerator && sameOverlapRule);
      });

      const forever = series.overlap.includes('forever');

      const rangeSince = master.range.since;
      const rangeTill = forever ? _till.offsetYear(1) : master.range.till;

      if (series.overlap.includes('remove')) {
        const slaves = conflicts.slice(1).reduce(function (sa, s) {
          const item = s;
          item.events = s.events
            .filter(function (e) { return !e.collides(rangeSince, rangeTill); });
          return sa.concat(item);
        }, []);
        return items.concat([master]).concat(slaves);
      }
      if (series.overlap.includes('trim')) {
        const slaves = conflicts.slice(1).reduce(function (sa, s) {
          const item = s;
          const slaveEvents = s.events
            .filter(function (e) { return e.collides(rangeSince, rangeTill); })
            .sort(function (a, b) { return b.since.int() - a.since.int(); });
          if (!slaveEvents.length) return sa.concat(item);
          const evts = s.events
            .filter(function (e) { return !e.collides(rangeSince, rangeTill); });
          const trimmedSlaves = slaveEvents.map(function (evt) {
            let slave = evt;
            let collision = slave.collides(rangeSince, rangeTill);
            while (collision) {
              if (collision.includes('r')) {
                slave = (new Event({
                  id: slave.id,
                  generatorId: slave.generatorId,
                  virtual: slave.virtual,
                  repeated: slave.repeated,
                  overlap: slave.overlap,
                  priority: slave.priority,
                  title: slave.title,
                  note: slave.note,
                  color: slave.color,
                  since: slave.since,
                  till: rangeSince.offsetDay(-1),
                })).query(_since, _till, 'event[]')[0];
              } else if (collision.includes('l')) {
                slave = (new Event({
                  id: slave.id,
                  generatorId: slave.generatorId,
                  virtual: slave.virtual,
                  repeated: slave.repeated,
                  overlap: slave.overlap,
                  priority: slave.priority,
                  title: slave.title,
                  note: slave.note,
                  color: slave.color,
                  since: rangeTill.offsetDay(1),
                  till: slave.till,
                })).query(_since, _till, 'event[]')[0];
              }
              collision = slave ? slave.collides(rangeSince, rangeTill) : false;
            }
            return slave;
          }).filter(function (evt) { return evt && evt.till.int() - evt.since.int() >= 0; });
          item.events = evts.concat(trimmedSlaves);
          return sa.concat(item);
        }, []);
        return items.concat([master]).concat(slaves);
      }
      return sArray.concat([series]);
    }, []);
  };

  const getEventsIn = function getEventsIn(_since, _till) {
    const since = generateDate(_since);
    const till = generateDate(_till);
    const seriesArray = eventStore.reduce(function (acc, e) {
      let sa = acc;
      const series = e.query(since, till);
      if (!series.events.length) return sa;
      sa = sa.concat([series]);
      sa = handleOverlaps(sa, since, till);
      return sa;
    }, []);
    let events = seriesArray.reduce(function (evts, s) { return evts.concat(s.events); }, []);
    events = events.sort(function (a, b) { return a.since.int() - b.since.int(); });
    return events;
  };

  return {
    getAdaptersInfo: getAdaptersInfo,
    getGeneratorsInfo: getGeneratorsInfo,
    generateDate: generateDate,
    getCurrentDate: getCurrentDate,
    getMonthInfo: getMonthInfo,
    addEvent: addEvent,
    getEventsIn: getEventsIn,
    editEvent: editEvent,
    removeEvent: removeEvent,
  };
};

exports.EventManager = EventManager;
