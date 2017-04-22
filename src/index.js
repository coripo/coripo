import AdapterManager from './adapter.manager';
import EventManager from './event.manager';

const App = function App(_AdapterManager, _EventManager) {
  const construct = function construct() {
    this.adapterManager = new _AdapterManager();
    this.eventManager = new _EventManager();
  };

  const loadAdapters = function loadAdapters() {
    this.adapterManager.load();
  };

  const addEvent = function addEvent() {

  };

  const getDateEvents = function getDateEvents() {

  };

  const getMonthEvents = function getMonthEvents() {

  };

  return { construct, loadAdapters, addEvent, getDateEvents, getMonthEvents };
};

exports.App = new App(new AdapterManager(), new EventManager());
