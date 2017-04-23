const EventManager = require('./event.manager.js').EventManager;

const App = function App(config = {}) {
  const construct = () => {
    this.eventManager = new EventManager({
      primaryAdapterId: config.primaryAdapterId,
      externalAdapters: config.externalAdapters,
    });
  };
  construct();

  const addEvent = (title, note, since, till) => {
    this.eventManager.add({ title, note, since, till });
  };

  const getDateEvents = () => {

  };

  const getMonthEvents = () => {

  };

  return { addEvent, getDateEvents, getMonthEvents };
};

exports.App = App;
