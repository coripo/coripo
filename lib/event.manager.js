'use strict';

var GregorianAdapter = require('coripo-core').GregorianAdapter;
var Event = require('coripo-core').Event;
var OneDate = require('coripo-core').OneDate;
var i18next = require('i18next');
var BasicGenerator = require('./basic.generator.js').Generator;
var locales = require('../locales/index.js');

var EventManager = function EventManager() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  i18next.init({
    lng: config.locale || 'en',
    fallbackLng: 'en',
    initImmediate: false,
    resources: locales
  });
  var trl = function trl(key) {
    i18next.store.data = locales;
    return i18next.t(key);
  };
  var primaryAdapterId = void 0;
  var primaryAdapter = void 0;
  var adapters = [];
  var generators = [];
  var eventStore = [];

  var getAdaptersInfo = function getAdaptersInfo() {
    return adapters.map(function (a) {
      return { id: a.id, name: a.name, description: a.description };
    });
  };

  var getGeneratorsInfo = function getGeneratorsInfo() {
    return generators.map(function (g) {
      return {
        id: g.id,
        name: g.name,
        description: g.description,
        inputs: g.inputs.concat([{
          title: trl('event-manager.common-generator.field-group.organization.title'),
          fields: [{
            id: 'categoryId',
            label: trl('event-manager.common-generator.field-group.organization.field.category-id.label'),
            type: 'category',
            optional: true
          }, {
            id: 'tags',
            label: trl('event-manager.common-generator.field-group.organization.field.tags.label'),
            type: 'tags',
            optional: true
          }]
        }])
      };
    });
  };

  var getAdapter = function getAdapter(adapterId) {
    var adapter = adapters.find(function (a) {
      return a.id === (adapterId || primaryAdapterId);
    });
    if (!adapter) throw new Error('requested adapter \'' + adapterId + '\' not found.');
    return adapter;
  };

  var generateDate = function generateDate(dateConfig) {
    var helper = { getAdapter: getAdapter, primaryAdapterId: primaryAdapterId };
    return new OneDate(dateConfig, helper);
  };

  var getCurrentDate = function getCurrentDate() {
    var date = primaryAdapter.l10n({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    });
    return generateDate(date);
  };

  var getMonthInfo = function getMonthInfo(year, month) {
    return {
      name: primaryAdapter.getMonthName(month),
      days: primaryAdapter.getMonthLength(year, month)
    };
  };

  var getGenerator = function getGenerator(generatorId) {
    var generator = generators.find(function (g) {
      return g.id === generatorId;
    });
    if (!generator) throw new Error('requested generator \'' + generatorId + '\' not found.');
    return generator;
  };

  var construct = function construct() {
    var locale = config.locale || 'en';
    adapters = [GregorianAdapter].concat((config.plugins || {}).adapters || []);
    adapters = adapters.map(function (Adapter) {
      return new Adapter();
    });
    primaryAdapterId = config.primaryAdapterId || new GregorianAdapter({ locale: locale }).id;
    primaryAdapter = getAdapter(primaryAdapterId);

    generators = [BasicGenerator].concat((config.plugins || {}).generators || []);
    generators = generators.map(function (Generator) {
      var dependencies = { Event: Event, OneDate: OneDate, getAdapter: getAdapter, primaryAdapterId: primaryAdapterId };
      return new Generator(dependencies, { locale: locale });
    });
  };
  construct();

  var addEvent = function addEvent(eventConfig) {
    var generator = getGenerator(eventConfig.generatorId);
    var event = generator.generate(eventConfig);
    eventStore = eventStore.concat([event]);
    return eventStore;
  };

  var removeEvent = function removeEvent(eventId) {
    eventStore = eventStore.filter(function (evt) {
      return evt.id !== eventId;
    });
    return eventStore;
  };

  var editEvent = function editEvent(eventConfig) {
    removeEvent(eventConfig.id);
    return addEvent(eventConfig);
  };

  var handleOverlaps = function handleOverlaps(seriesArray, _since, _till) {
    return seriesArray.reduce(function (sArray, series) {
      if (series.overlap.external.includes('allow')) return sArray.concat([series]);

      var conflicts = sArray.filter(function (s) {
        var sameGenerator = s.generatorId === series.generatorId;
        var sameOverlapRule = s.overlap.external === series.overlap.external;
        return sameGenerator && sameOverlapRule;
      }).concat([series]).sort(function (a, b) {
        return b.range.since.int() - a.range.since.int();
      });
      if (conflicts.length === 1) return sArray.concat([series]);

      var master = conflicts[0];

      var items = sArray.filter(function (s) {
        var sameGenerator = s.generatorId === series.generatorId;
        var sameOverlapRule = s.overlap.external === series.overlap.external;
        return !(sameGenerator && sameOverlapRule);
      });

      var forever = series.overlap.external.includes('forever');

      var rangeSince = master.range.since;
      var rangeTill = forever ? _till.offsetYear(1) : master.range.till;

      if (series.overlap.external.includes('remove')) {
        var slaves = conflicts.slice(1).reduce(function (sa, s) {
          var item = s;
          item.events = s.events.filter(function (e) {
            return !e.collides(rangeSince, rangeTill);
          });
          return sa.concat(item);
        }, []);
        return items.concat([master]).concat(slaves);
      }
      if (series.overlap.external.includes('trim')) {
        var _slaves = conflicts.slice(1).reduce(function (sa, s) {
          var item = s;
          var slaveEvents = s.events.filter(function (e) {
            return e.collides(rangeSince, rangeTill);
          }).sort(function (a, b) {
            return b.since.int() - a.since.int();
          });
          if (!slaveEvents.length) return sa.concat(item);
          var evts = s.events.filter(function (e) {
            return !e.collides(rangeSince, rangeTill);
          });
          var trimmedSlaves = slaveEvents.map(function (evt) {
            var slave = evt;
            var collision = slave.collides(rangeSince, rangeTill);
            while (collision) {
              if (collision.includes('r')) {
                slave = new Event(Object.assign({}, slave, {
                  till: rangeSince.offsetDay(-1)
                })).query(_since, _till, 'event[]')[0];
              } else if (collision.includes('l')) {
                slave = new Event(Object.assign({}, slave, {
                  since: rangeTill.offsetDay(1)
                })).query(_since, _till, 'event[]')[0];
              }
              collision = slave ? slave.collides(rangeSince, rangeTill) : false;
            }
            return slave;
          }).filter(function (evt) {
            return evt && evt.till.int() - evt.since.int() >= 0;
          });
          item.events = evts.concat(trimmedSlaves);
          return sa.concat(item);
        }, []);
        return items.concat([master]).concat(_slaves);
      }
      return sArray.concat([series]);
    }, []);
  };

  var getEventsIn = function getEventsIn(_since, _till) {
    var since = generateDate(_since);
    var till = generateDate(_till);
    var seriesArray = eventStore.reduce(function (acc, e) {
      var sa = acc;
      var series = e.query(since, till);
      if (!series.events.length) return sa;
      sa = sa.concat([series]);
      sa = handleOverlaps(sa, since, till);
      return sa;
    }, []);
    var events = seriesArray.reduce(function (evts, s) {
      return evts.concat(s.events);
    }, []);
    events = events.sort(function (a, b) {
      return a.since.int() - b.since.int();
    });
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
    removeEvent: removeEvent
  };
};

exports.EventManager = EventManager;
//# sourceMappingURL=event.manager.js.map