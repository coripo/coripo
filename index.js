const EventManager = require('./src/event.manager.js').EventManager;

const App = function App(config = {}) {
  const eventManager = new EventManager({
    primaryAdapterId: config.primaryAdapterId,
    plugins: {
      adapters: config.adapters || [],
      generators: config.generators || [],
    },
  });

  const addEvent = (title, note, since, till) => {
    eventManager.add({ title, note, since, till });
  };

  const getDateEvents = () => {

  };

  const getMonthEvents = () => {

  };

  return { addEvent, getDateEvents, getMonthEvents };
};

exports.App = App;
