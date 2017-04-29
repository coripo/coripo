/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const Event = require('coripo-core').Event;
const OneDate = require('coripo-core').OneDate;
const GregorianAdapter = require('coripo-core').GregorianAdapter;
const BasicGenerator = require('../src/basic.generator.js').Generator;

const basicGenerator = new BasicGenerator({
  Event,
  OneDate,
  getAdapter: () => new GregorianAdapter(),
  primaryAdapterId: () => new GregorianAdapter().id,
});

describe('Basic Generator', () => {
  describe('id', () => {
    it('should return a string', () => {
      expect(basicGenerator.id).to.be.a('string');
    });
  });

  describe('name', () => {
    it('should return a string', () => {
      expect(basicGenerator.name).to.be.a('string');
    });
  });

  describe('description', () => {
    it('should return a string', () => {
      expect(basicGenerator.description).to.be.a('string');
    });
  });

  describe('inputs', () => {
    it('should return a non-empty array', () => {
      expect(basicGenerator.inputs).to.not.be.empty;
    });
  });

  describe('generate()', () => {
    it('should return an event object', () => {
      const event = basicGenerator.generate({
        title: 'Thanksgiving at grandma\'s house',
        note: 'Wear good stuff, put some cologne and DO NOT talk much',
        since: { year: 2017, month: 11, day: 23 },
      });
      expect(event).to.be.an('object');
    });
  });
});
