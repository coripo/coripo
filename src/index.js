const EventManager = require('./event.manager.js');

const App = function App(config = {}) {
  if ((config.generators || []).length === 0) {
    throw new Error('config.generators array must at least have one generator');
  }
  const eventManager = new EventManager({
    primaryAdapterId: config.primaryAdapterId,
    plugins: {
      adapters: config.adapters || [],
      generators: config.generators,
    },
    locale: config.locale || 'en',
  });

  const getAdaptersInfo = () => eventManager.getAdaptersInfo();
  const setPrimaryAdapterId = adapterId => new App({
    primaryAdapterId: adapterId,
    adapters: config.adapters,
    generators: config.generators,
  });
  const getGeneratorsInfo = () => eventManager.getGeneratorsInfo();
  const generateDate = dateConfig => eventManager.generateDate(dateConfig);
  const getCurrentDate = () => eventManager.getCurrentDate();
  const addEvents = eventConfigs => eventConfigs.reduce((acc, cfg) => eventManager.addEvent(cfg));
  const getMonthInfo = (year, month) => eventManager.getMonthInfo(year, month);
  const getEventsIn = (since, till) => eventManager.getEventsIn(since, till);
  const addEvent = eventConfig => eventManager.addEvent(eventConfig);
  const removeEvent = eventId => eventManager.removeEvent(eventId);
  const editEvent = eventConfig => eventManager.editEvent(eventConfig);

  return {
    getAdaptersInfo,
    setPrimaryAdapterId,
    getGeneratorsInfo,
    generateDate,
    getCurrentDate,
    addEvents,
    getMonthInfo,
    getEventsIn,
    addEvent,
    removeEvent,
    editEvent,
  };
};

module.exports = App;
