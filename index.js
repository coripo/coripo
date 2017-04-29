const EventManager = require('./src/event.manager.js').EventManager;

const App = function App(config = {}) {
  const eventManager = new EventManager({
    primaryAdapterId: config.primaryAdapterId,
    plugins: {
      adapters: config.adapters || [],
      generators: config.generators || [],
    },
  });

  const getAdaptersInfo = () => eventManager.getAdaptersInfo();
  const setPrimaryAdapterId = adapterId => new App({
    primaryAdapterId: adapterId,
    adapters: config.adapters,
    generators: config.generators,
  });
  const getGeneratorsInfo = () => eventManager.getGeneratorsInfo();
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
    getCurrentDate,
    addEvents,
    getMonthInfo,
    getEventsIn,
    addEvent,
    removeEvent,
    editEvent,
  };
};

exports.CoripoApi = App;
