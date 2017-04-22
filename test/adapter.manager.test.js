/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const AdapterManager = require('../src/adapter.manager.js').AdapterManager;

describe('Adapter Manager', () => {
  describe('primary', () => {
    it('should return an adapter object as primary object', () => {
      const adapterManager = new AdapterManager();
      expect(adapterManager.primary).to.be.an('object');
    });
  });

  describe('get', () => {
    it('should return an adapter object', () => {
      const adapterManager = new AdapterManager();
      expect(adapterManager.get('dariush-alipour.onecalendar.adapter.default')).to.be.an('object');
    });
    it('should throw error', () => {
      const adapterManager = new AdapterManager();
      expect(() => { adapterManager.get('impossibleadaptername'); }).to.throw(Error);
    });
  });
});
