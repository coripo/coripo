/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const Event = require('onecalendar-core').Event;
const OneDate = require('onecalendar-core').OneDate;
const GregorianAdapter = require('onecalendar-core').GregorianAdapter;
const BasicGenerator = require('../src/basic.generator.js').Generator;

const basicGenerator = new BasicGenerator(Event);

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

  describe('inputs', () => {
    it('should return a non-empty array', () => {
      expect(basicGenerator.inputs).to.not.be.empty;
    });
  });

  describe('generate', () => {
    it('should return an event object', () => {
      const event = basicGenerator.generate({
        title: 'Thanksgiving at grandma\'s house',
        note: 'Wear good stuff, put some cologne and DO NOT talk much',
        since: new OneDate({ year: 2017, month: 11, day: 23 },
          {
            getAdapter: () => new GregorianAdapter(),
            primaryAdapterId: new GregorianAdapter().id,
          }),
      });
      expect(event).to.be.an('object');
    });
  });
});
