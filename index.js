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

  const getMonthInfo = (year, month) => eventManager.getMonthInfo(year, month);
  const getEventsIn = (since, till) => eventManager.getDateRange(since, till);
  const addEvent = (title, note, since, till) => eventManager.add({ title, note, since, till });

  return { getAdaptersInfo, setPrimaryAdapterId, getMonthInfo, getEventsIn, addEvent };
};

exports.App = App;
