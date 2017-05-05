const GregorianAdapter = require('coripo-core').GregorianAdapter;
const Event = require('coripo-core').Event;
const OneDate = require('coripo-core').OneDate;
const i18next = require('i18next');
const BasicGenerator = require('./basic.generator.js');
const locales = require('../locales/index.js');

const EventManager = function EventManager(config = {}) {
  i18next.init({
    lng: config.locale || 'en',
    fallbackLng: 'en',
    initImmediate: false,
    resources: locales,
  });
  const trl = (key) => {
    i18next.store.data = locales;
    i18next.changeLanguage(config.locale || 'en');
    return i18next.t(key);
  };
  let primaryAdapterId;
  let primaryAdapter;
  let adapters = [];
  let generators = [];
  let eventStore = [];

  const getAdaptersInfo = () => adapters.map(a => (
    { id: a.id, name: a.name, description: a.description }
  ));

  const getGeneratorsInfo = () => generators.map(g => (
    {
      id: g.id,
      name: g.name,
      description: g.description,
      inputs: g.inputs.concat([
        {
          title: trl('event-manager.common-generator.field-group.organization.title'),
          fields: [
            {
              id: 'categoryId',
              label: trl('event-manager.common-generator.field-group.organization.field.category-id.label'),
              type: 'category',
              optional: true,
            },
            {
              id: 'tags',
              label: trl('event-manager.common-generator.field-group.organization.field.tags.label'),
              type: 'tags',
              optional: true,
            },
          ],
        },
      ]),
    }
  ));

  const getAdapter = (adapterId) => {
    const adapter = adapters.find(a => a.id === (adapterId || primaryAdapterId));
    if (!adapter) throw new Error(`requested adapter '${adapterId}' not found.`);
    return adapter;
  };

  const generateDate = (dateConfig) => {
    const helper = { getAdapter, primaryAdapterId };
    return new OneDate(dateConfig, helper);
  };

  const getCurrentDate = () => {
    const date = primaryAdapter.l10n({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    });
    return generateDate(date);
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
    const locale = config.locale || 'en';
    adapters = ([GregorianAdapter]).concat((config.plugins || {}).adapters || []);
    adapters = adapters.map(Adapter => new Adapter({ locale }));
    primaryAdapterId = config.primaryAdapterId || new GregorianAdapter({ locale }).id;
    primaryAdapter = getAdapter(primaryAdapterId);

    generators = ([BasicGenerator]).concat((config.plugins || {}).generators || []);
    generators = generators.map((Generator) => {
      const dependencies = { Event, OneDate, getAdapter, primaryAdapterId };
      return new Generator(dependencies, { locale });
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

  const handleOverlaps = (seriesArray, _since, _till) => seriesArray.reduce((sArray, series) => {
    if (series.overlap.external.includes('allow')) return sArray.concat([series]);

    const conflicts = sArray.filter((s) => {
      const sameGenerator = s.generatorId === series.generatorId;
      const sameOverlapRule = s.overlap.external === series.overlap.external;
      return sameGenerator && sameOverlapRule;
    }).concat([series])
      .sort((a, b) => b.range.since.int() - a.range.since.int());
    if (conflicts.length === 1) return sArray.concat([series]);

    const master = conflicts[0];

    const items = sArray.filter((s) => {
      const sameGenerator = s.generatorId === series.generatorId;
      const sameOverlapRule = s.overlap.external === series.overlap.external;
      return !(sameGenerator && sameOverlapRule);
    });

    const forever = series.overlap.external.includes('forever');

    const rangeSince = master.range.since;
    const rangeTill = forever ? _till.offsetYear(1) : master.range.till;

    if (series.overlap.external.includes('remove')) {
      const slaves = conflicts.slice(1).reduce((sa, s) => {
        const item = s;
        item.events = s.events
          .filter(e => !e.collides(rangeSince, rangeTill));
        return sa.concat(item);
      }, []);
      return items.concat([master]).concat(slaves);
    }
    if (series.overlap.external.includes('trim')) {
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
          let col = slave.collides(rangeSince, rangeTill);
          while (col) {
            if (col.includes('outside')) {
              slave = undefined;
            } else if (col.includes('left') && col.includes('right')) {
              slave = undefined;
            } else if (col.includes('right')) {
              slave = (new Event(Object.assign({}, slave, {
                till: rangeSince.offsetDay(-1),
              }))).query(_since, _till, 'event[]')[0];
            } else if (col.includes('left')) {
              slave = (new Event(Object.assign({}, slave, {
                since: rangeTill.offsetDay(1),
              }))).query(_since, _till, 'event[]')[0];
            } else if (col.includes('inside')) {
              slave = (new Event(Object.assign({}, slave, {
                till: rangeSince.offsetDay(-1),
              }))).query(_since, _till, 'event[]')[0];
            }
            col = slave ? slave.collides(rangeSince, rangeTill) : false;
          }
          return slave;
        }).filter(evt => evt !== undefined);
        item.events = evts.concat(trimmedSlaves);
        return sa.concat(item);
      }, []);
      return items.concat([master]).concat(slaves);
    }
    return sArray.concat([series]);
  }, []);

  const getEventsIn = (_since, _till) => {
    const since = generateDate(_since);
    const till = generateDate(_till);
    const seriesArray = eventStore.reduce((acc, e) => {
      let sa = acc;
      const series = e.query(since, till);
      if (!series.events.length) return sa;
      sa = sa.concat([series]);
      sa = handleOverlaps(sa, since, till);
      return sa;
    }, []);
    let events = seriesArray.reduce((evts, s) => evts.concat(s.events), []);
    events = events.sort((a, b) => a.since.int() - b.since.int());
    return events;
  };

  return {
    getAdaptersInfo,
    getGeneratorsInfo,
    generateDate,
    getCurrentDate,
    getMonthInfo,
    addEvent,
    getEventsIn,
    editEvent,
    removeEvent,
  };
};

module.exports = EventManager;
