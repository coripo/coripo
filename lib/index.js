'use strict';

var EventManager = require('./event.manager.js').EventManager;

var App = function App() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var eventManager = new EventManager({
    primaryAdapterId: config.primaryAdapterId,
    plugins: {
      adapters: config.adapters || [],
      generators: config.generators || []
    },
    locale: config.locale || 'en'
  });

  var getAdaptersInfo = function getAdaptersInfo() {
    return eventManager.getAdaptersInfo();
  };
  var setPrimaryAdapterId = function setPrimaryAdapterId(adapterId) {
    return new App({
      primaryAdapterId: adapterId,
      adapters: config.adapters,
      generators: config.generators
    });
  };
  var getGeneratorsInfo = function getGeneratorsInfo() {
    return eventManager.getGeneratorsInfo();
  };
  var generateDate = function generateDate(dateConfig) {
    return eventManager.generateDate(dateConfig);
  };
  var getCurrentDate = function getCurrentDate() {
    return eventManager.getCurrentDate();
  };
  var addEvents = function addEvents(eventConfigs) {
    return eventConfigs.reduce(function (acc, cfg) {
      return eventManager.addEvent(cfg);
    });
  };
  var getMonthInfo = function getMonthInfo(year, month) {
    return eventManager.getMonthInfo(year, month);
  };
  var getEventsIn = function getEventsIn(since, till) {
    return eventManager.getEventsIn(since, till);
  };
  var addEvent = function addEvent(eventConfig) {
    return eventManager.addEvent(eventConfig);
  };
  var removeEvent = function removeEvent(eventId) {
    return eventManager.removeEvent(eventId);
  };
  var editEvent = function editEvent(eventConfig) {
    return eventManager.editEvent(eventConfig);
  };

  return {
    getAdaptersInfo: getAdaptersInfo,
    setPrimaryAdapterId: setPrimaryAdapterId,
    getGeneratorsInfo: getGeneratorsInfo,
    generateDate: generateDate,
    getCurrentDate: getCurrentDate,
    addEvents: addEvents,
    getMonthInfo: getMonthInfo,
    getEventsIn: getEventsIn,
    addEvent: addEvent,
    removeEvent: removeEvent,
    editEvent: editEvent
  };
};

exports.CoripoApi = App;
//# sourceMappingURL=index.js.map