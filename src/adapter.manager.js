const DefaultAdapter = require('./default.adapter.js').Adapter;

const AdapterManager = function AdapterManager(data = {}) {
  const construct = () => {
    this.adapters = [...(data.externalAdapters || []), new DefaultAdapter()];
    this.primary = this.adapters.find(adapter => adapter.name === data.primaryAdapterName || 'dariush-alipour.onecalendar.adapter.default');
    return this.adapters;
  };
  construct();

  const get = (adapterName) => {
    const adapter = this.adapters.find(item => item.name === adapterName);
    if (!adapter) throw new Error(`requested adapter '${adapterName}' not found.`);
    return adapter;
  };

  return { primary: this.primary, get };
};

exports.AdapterManager = AdapterManager;
