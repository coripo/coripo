const defaultAdapter = require('./default.adapter.js');

let primary;
let adapters;

const load = function setAdapters(primaryAdapterName = 'dariush-alipour.onecalendar.adapter.default', externalAdapters = []) {
  adapters = [...externalAdapters, defaultAdapter];
  primary = adapters.find(adapter => adapter.name === primaryAdapterName);
  return adapters;
};

const get = function getAdapter(adapterName) {
  const adapter = adapters.find(item => item.name === adapterName);
  if (!adapter) throw new Error(`requested adapter '${adapterName}' not found.`);
  return adapter;
};

exports.primary = primary;
exports.load = load;
exports.get = get;
