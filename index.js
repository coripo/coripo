/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable object-shorthand */
const EventManager = require('./src/event.manager.js').EventManager;

const App = function App(_config) {
  const config = _config || {};
  const eventManager = new EventManager({
    primaryAdapterId: config.primaryAdapterId,
    plugins: {
      adapters: config.adapters || [],
      generators: config.generators || [],
    },
  });

  const getAdaptersInfo = function getAdaptersInfo() {
    return eventManager.getAdaptersInfo();
  };

  const setPrimaryAdapterId = function setPrimaryAdapterId(adapterId) {
    return new App({
      primaryAdapterId: adapterId,
      adapters: config.adapters,
      generators: config.generators,
    });
  };

  const getGeneratorsInfo = function getGeneratorsInfo() {
    return eventManager.getGeneratorsInfo();
  };

  const generateDate = function generateDate(dateConfig) {
    return eventManager.generateDate(dateConfig);
  };

  const getCurrentDate = function getCurrentDate() {
    return eventManager.getCurrentDate();
  };

  const addEvents = function addEvents(eventConfigs) {
    return eventConfigs.reduce(function (acc, cfg) { return eventManager.addEvent(cfg); }, {});
  };

  const getMonthInfo = function getMonthInfo(year, month) {
    return eventManager.getMonthInfo(year, month);
  };

  const getEventsIn = function getEventsIn(since, till) {
    return eventManager.getEventsIn(since, till);
  };

  const addEvent = function addEvent(eventConfig) {
    return eventManager.addEvent(eventConfig);
  };

  const removeEvent = function removeEvent(eventId) {
    return eventManager.removeEvent(eventId);
  };

  const editEvent = function editEvent(eventConfig) {
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
    editEvent: editEvent,
  };
};

exports.CoripoApi = App;
