import AdapterManager from './adapter.manager';
import EventManager from './event.manager';

const App = function App(_AdapterManager, _EventManager) {
  const construct = () => { };
  construct();

  const loadAdapters = (primaryAdapterName, externalAdapters) => {
    this.adapterManager = new _AdapterManager(primaryAdapterName, externalAdapters);
    this.eventManager = new _EventManager(this.adapterManager.primary);
  };

  const addEvent = () => {

  };

  const getDateEvents = () => {

  };

  const getMonthEvents = () => {

  };

  return { loadAdapters, addEvent, getDateEvents, getMonthEvents };
};

exports.App = new App(new AdapterManager(), new EventManager());
