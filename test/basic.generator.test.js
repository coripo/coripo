/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const DefaultGenerator = require('../src/default.generator.js').Generator;
const Event = require('onecalendar-core').Event;
const OneDate = require('onecalendar-core').OneDate;

const defaultGenerator = new DefaultGenerator(Event);

describe('Default Generator', () => {
  describe('id', () => {
    it('should return a string', () => {
      expect(defaultGenerator.id).to.be.a('string');
    });
  });

  describe('name', () => {
    it('should return a string', () => {
      expect(defaultGenerator.name).to.be.a('string');
    });
  });

  describe('inputs', () => {
    it('should return a non-empty array', () => {
      expect(defaultGenerator.inputs).to.not.be.empty;
    });
  });

  describe('generate', () => {
    it('should return an event object', () => {
      const event = defaultGenerator.generate({
        title: 'Thanksgiving at grandma\'s house',
        note: 'Wear good stuff, put some cologne and DO NOT talk much',
        since: new OneDate({ year: 2017, month: 11, day: 23 }),
      });
      expect(event).to.be.an('object');
    });
  });
});
