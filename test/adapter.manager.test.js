/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const adapterManager = require('../src/adapter.manager.js');

describe('Adapter Manager', () => {
  describe('load', () => {
    it('should return adapters array by length of 1', () => {
      expect(adapterManager.load()).to.have.lengthOf(1);
    });
  });

  describe('get', () => {
    it('should return adapter object', () => {
      expect(adapterManager.get('dariush-alipour.onecalendar.adapter.default')).to.be.an('object');
    });
    it('should throw error', () => {
      expect(() => { adapterManager.get('impossibleadaptername'); }).to.throw(Error);
    });
  });
});
