/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const DefaultAdapter = require('../src/default.adapter.js').Adapter;

const defaultAdapter = new DefaultAdapter();

describe('Default Adapter', () => {
  describe('id', () => {
    it('should return a string', () => {
      expect(defaultAdapter.id).to.be.a('string');
    });
  });

  describe('name', () => {
    it('should return a string', () => {
      expect(defaultAdapter.name).to.be.a('string');
    });
  });
  describe('l10n', () => {
    it('should return an object containing the date given to the method', () => {
      const date = { year: 2017, month: 12, day: 20 };
      expect(defaultAdapter.l10n(date)).to.equal(date);
    });
  });

  describe('i18n', () => {
    it('should return an object containing the date given to the method', () => {
      const date = { year: 2017, month: 12, day: 20 };
      expect(defaultAdapter.i18n(date)).to.equal(date);
    });
  });

  describe('isValid', () => {
    it('should return true when input is (2016, 2, 29)', () => {
      const date = { year: 2016, month: 2, day: 29 };
      expect(defaultAdapter.isValid(date)).to.be.true;
    });
    it('should return true when input is (2017, 2, 28)', () => {
      const date = { year: 2017, month: 2, day: 28 };
      expect(defaultAdapter.isValid(date)).to.be.true;
    });
    it('should return false when input is (2017, 2, 29)', () => {
      const date = { year: 2017, month: 2, day: 29 };
      expect(defaultAdapter.isValid(date)).to.be.false;
    });
  });

  describe('isLeap', () => {
    it('should return false when input is 2015', () => {
      expect(defaultAdapter.isLeap(2015)).to.be.false;
    });
    it('should return true when input is 2016', () => {
      expect(defaultAdapter.isLeap(2016)).to.be.true;
    });
    it('should return false when input is 2017', () => {
      expect(defaultAdapter.isLeap(2017)).to.be.false;
    });
    it('should return true when input is 2020', () => {
      expect(defaultAdapter.isLeap(2020)).to.be.true;
    });
  });

  describe('getMonthName', () => {
    it('should return string when number is between 1 and 12', () => {
      for (let i = 1; i <= 12; i += 1) {
        expect(defaultAdapter.getMonthName(i)).to.be.a('string');
      }
    });
    it('should throw error when number is 0', () => {
      expect(() => { defaultAdapter.getMonthName(0); }).to.throw(Error);
    });
    it('should throw error when number is 13', () => {
      expect(() => { defaultAdapter.getMonthName(13); }).to.throw(Error);
    });
  });

  describe('getMonthLength', () => {
    it('should return 31 when input is (2017, 1)', () => {
      expect(defaultAdapter.getMonthLength(2017, 1)).to.equal(31);
    });
    it('should return 28 when input is (2017, 2)', () => {
      expect(defaultAdapter.getMonthLength(2017, 2)).to.equal(28);
    });
    it('should return 29 when input is (2016, 2)', () => {
      expect(defaultAdapter.getMonthLength(2016, 2)).to.equal(29);
    });
    it('should return 31 when input is (2017, 3)', () => {
      expect(defaultAdapter.getMonthLength(2017, 3)).to.equal(31);
    });
    it('should return 30 when input is (2017, 4)', () => {
      expect(defaultAdapter.getMonthLength(2017, 4)).to.equal(30);
    });
    it('should return 31 when input is (2017, 5)', () => {
      expect(defaultAdapter.getMonthLength(2017, 5)).to.equal(31);
    });
    it('should return 30 when input is (2017, 6)', () => {
      expect(defaultAdapter.getMonthLength(2017, 6)).to.equal(30);
    });
    it('should return 31 when input is (2017, 7)', () => {
      expect(defaultAdapter.getMonthLength(2017, 7)).to.equal(31);
    });
    it('should return 31 when input is (2017, 8)', () => {
      expect(defaultAdapter.getMonthLength(2017, 8)).to.equal(31);
    });
    it('should return 30 when input is (2017, 9)', () => {
      expect(defaultAdapter.getMonthLength(2017, 9)).to.equal(30);
    });
    it('should return 31 when input is (2017, 10)', () => {
      expect(defaultAdapter.getMonthLength(2017, 10)).to.equal(31);
    });
    it('should return 30 when input is (2017, 11)', () => {
      expect(defaultAdapter.getMonthLength(2017, 11)).to.equal(30);
    });
    it('should return 31 when input is (2017, 12)', () => {
      expect(defaultAdapter.getMonthLength(2017, 12)).to.equal(31);
    });
  });
});
