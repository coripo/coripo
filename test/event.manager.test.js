/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const Event = require('coripo-core').Event;
const GregorianAdapter = require('coripo-core').GregorianAdapter;
const JalaliAdapter = require('coripo-adapter-jalali').Adapter;
const BasicGenerator = require('../src/basic.generator.js').Generator;
const MenstruationGenerator = require('coripo-generator-menstruation').Generator;
const EventManager = require('../src/event.manager.js').EventManager;

describe('Event Manager', () => {
  const BASIC_GENERATOR_ID = new BasicGenerator(Event).id;
  const MENSTRUATION_GENERATOR_ID = new MenstruationGenerator(Event).id;
  const GREGORIAN_ADAPTER_ID = new GregorianAdapter().id;
  const JALALI_ADAPTER_ID = new JalaliAdapter().id;

  describe('getAdaptersInfo()', () => {
    const eventManager = new EventManager();

    it('should return an array', () => {
      expect(eventManager.getAdaptersInfo()).to.be.an('array');
    });
  });

  describe('getGeneratorsInfo()', () => {
    const eventManager = new EventManager();

    it('should return an array', () => {
      expect(eventManager.getGeneratorsInfo()).to.be.an('array');
    });
  });

  describe('generateDate()', () => {
    const eventManager = new EventManager();

    it('should return a OneDate Object', () => {
      const date = eventManager.generateDate({ year: 2017, month: 10, day: 23 });
      expect(date.int()).to.equal(20171023);
    });
  });

  describe('getCurrentDate()', () => {
    const eventManager = new EventManager();

    it('should return an object with year, month and day property', () => {
      const date = eventManager.getCurrentDate();
      expect(date).to.be.an('object');
      expect(date.year).to.be.a('number');
      expect(date.month).to.be.a('number');
      expect(date.day).to.be.a('number');
    });
  });

  describe('getMonthInfo()', () => {
    const eventManager = new EventManager();

    it('should return an object with name string and days number', () => {
      const info = eventManager.getMonthInfo(2017, 10);
      expect(info.name).to.be.a('string');
      expect(info.days).to.be.a('number');
    });
  });

  describe('addEvent()', () => {
    it('should increase events array size appropriately', () => {
      const eventManager = new EventManager();

      expect(eventManager.addEvent({
        generatorId: BASIC_GENERATOR_ID,
        title: 'Dentist Appointment',
        note: 'Don\'t ask the dentist why he smokes',
        since: { year: 2017, month: 5, day: 14, adapterId: GREGORIAN_ADAPTER_ID },
      })).to.have.lengthOf(1);

      expect(eventManager.addEvent({
        generatorId: BASIC_GENERATOR_ID,
        title: 'Business Meeting',
        note: 'Fortunately it\'s an informal one',
        since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
      })).to.have.lengthOf(2);

      expect(eventManager.addEvent({
        generatorId: BASIC_GENERATOR_ID,
        title: 'Vacation Time',
        note: '5 days of pure fun and relaxation in 305',
        since: { year: 2017, month: 9, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        till: { year: 2017, month: 9, day: 10, adapterId: GREGORIAN_ADAPTER_ID },
      })).to.have.lengthOf(3);
    });
  });

  describe('getEventsIn()', () => {
    context('when all gregorian', () => {
      it('should return an array of 2 events', () => {
        const eventManager = new EventManager();

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Dentist Appointment',
          note: 'Don\'t ask the dentist why he smokes',
          since: { year: 2017, month: 5, day: 14, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Business Meeting',
          note: 'Fortunately it\'s an informal one',
          since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Vacation Time',
          note: '5 days of pure fun and relaxation in 305',
          since: { year: 2017, month: 9, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
          till: { year: 2017, month: 9, day: 10, adapterId: GREGORIAN_ADAPTER_ID },
        });

        const since = { year: 2017, month: 5, day: 1 };
        const till = { year: 2017, month: 10, day: 8 };
        expect(eventManager.getEventsIn(since, till)).to.have.lengthOf(2);
      });
    });
    context('when various adapters with gregorian as primary', () => {
      it('should return an array of 2 events', () => {
        const eventManager = new EventManager({
          plugins: { adapters: [JalaliAdapter] },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Teheran',
          note: 'Yay!',
          since: { year: 1396, month: 2, day: 4, adapterId: JALALI_ADAPTER_ID },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Business Meeting',
          note: 'Fortunately it\'s an informal one',
          since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Sacramento',
          note: 'As usual..',
          since: { year: 2017, month: 4, day: 25, adapterId: GREGORIAN_ADAPTER_ID },
        });

        expect(eventManager.getEventsIn({ year: 2017, month: 4, day: 20 },
          { year: 2017, month: 4, day: 30 })).to.have.lengthOf(2);
      });
    });
    context('when various adapters with jalali as primary', () => {
      it('should return an array of 2 events', () => {
        const eventManager = new EventManager({
          plugins: { adapters: [JalaliAdapter] },
          primaryAdapterId: JALALI_ADAPTER_ID,
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Teheran',
          note: 'Yay!',
          since: { year: 1396, month: 2, day: 4, adapterId: JALALI_ADAPTER_ID },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Business Meeting',
          note: 'Fortunately it\'s an informal one',
          since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Sacramento',
          note: 'As usual..',
          since: { year: 2017, month: 4, day: 25, adapterId: GREGORIAN_ADAPTER_ID },
        });

        expect(eventManager.getEventsIn({ year: 1396, month: 2, day: 3 },
          { year: 1396, month: 2, day: 5 })).to.have.lengthOf(2);
      });
    });
    context('when has sequels and repeats', () => {
      it('should return an array of 3 events', () => {
        const eventManager = new EventManager();

        eventManager.addEvent({
          generatorId: BASIC_GENERATOR_ID,
          title: 'overlap trim test',
          since: { year: 2017, month: 4, day: 4 },
          till: { year: 2017, month: 4, day: 6 },
          repeats: [
            { times: -1, cycle: 'day', step: 28 },
          ],
          internalOverlap: 'trim',
          externalOverlap: 'trim',
          sequels: [
            {
              title: 'trimmed stage',
              since: { scale: 'day', offset: 4 },
              till: { scale: 'day', offset: 8 },
            },
            {
              title: 'remaining stage',
              since: { scale: 'day', offset: 2 },
              till: { scale: 'day', offset: 5 },
            },
          ],
        });
        const events = eventManager.getEventsIn({ year: 2017, month: 4, day: 1 },
          { year: 2017, month: 5, day: 1 });
        expect(events).to.have.lengthOf(3);
      });
      it('should return an array of 6 events', () => {
        const eventManager = new EventManager({
          plugins: { generators: [MenstruationGenerator] },
        });

        eventManager.addEvent({
          generatorId: MENSTRUATION_GENERATOR_ID,
          start: { year: 2017, month: 4, day: 4 },
          periodLength: 5,
          cycleLength: 28,
        });
        const events = eventManager.getEventsIn({ year: 2017, month: 5, day: 1 },
          { year: 2017, month: 6, day: 1 });
        expect(events).to.have.lengthOf(6);
      });
    });
    context('when has external overlap case', () => {
      it('should return an array of 8 events including Peak Ovulation 20170413-20170415', () => {
        const eventManager = new EventManager({
          plugins: { generators: [MenstruationGenerator] },
        });

        eventManager.addEvent({
          generatorId: MENSTRUATION_GENERATOR_ID,
          id: 1,
          start: { year: 2017, month: 4, day: 3 },
          periodLength: 5,
          cycleLength: 28,
        });

        eventManager.addEvent({
          generatorId: MENSTRUATION_GENERATOR_ID,
          id: 2,
          start: { year: 2017, month: 4, day: 18 },
          periodLength: 5,
          cycleLength: 28,
        });

        const events = eventManager.getEventsIn({ year: 2017, month: 4, day: 1 },
          { year: 2017, month: 4, day: 30 });
        expect(events.filter(e => e.title === 'Peak Ovulation'
          && e.since.int() === 20170413
          && e.till.int() === 20170415)).to.have.lengthOf(1);
        expect(events).to.have.lengthOf(8);
      });
    });
    context('when has external overlap case', () => {
      it('should return an array of 8 events including Peak Ovulation 20170511-20170512', () => {
        const eventManager = new EventManager({
          plugins: { generators: [MenstruationGenerator] },
        });

        eventManager.addEvent({
          generatorId: MENSTRUATION_GENERATOR_ID,
          id: 1,
          start: { year: 2017, month: 4, day: 3 },
          periodLength: 5,
          cycleLength: 28,
        });

        eventManager.addEvent({
          generatorId: MENSTRUATION_GENERATOR_ID,
          id: 2,
          start: { year: 2017, month: 5, day: 15 },
          periodLength: 5,
          cycleLength: 28,
        });

        const events = eventManager.getEventsIn({ year: 2017, month: 4, day: 1 },
          { year: 2017, month: 5, day: 30 });
        expect(events.filter(e => e.title === 'Peak Ovulation'
          && e.since.int() === 20170511
          && e.till.int() === 20170512)).to.have.lengthOf(1);
        expect(events).to.have.lengthOf(12);
      });
    });
  });

  describe('removeEvent()', () => {
    it('should return an array with length of 1', () => {
      const eventManager = new EventManager({});

      eventManager.addEvent({
        generatorId: BASIC_GENERATOR_ID,
        id: 1,
        since: { year: 2017, month: 4, day: 3 },
        till: { year: 2017, month: 4, day: 5 },
      });

      eventManager.addEvent({
        generatorId: BASIC_GENERATOR_ID,
        id: 2,
        since: { year: 2017, month: 4, day: 4 },
        till: { year: 2017, month: 4, day: 5 },
      });
      expect(eventManager.removeEvent(2)).to.have.lengthOf(1);
    });
  });

  describe('editEvent()', () => {
    it('should return an array with length of 1 with new values', () => {
      const eventManager = new EventManager({});
      const eventConfig = {
        generatorId: BASIC_GENERATOR_ID,
        id: 2,
        since: { year: 2017, month: 4, day: 4 },
        till: { year: 2017, month: 4, day: 5 },
      };
      const oldStore = eventManager.addEvent(eventConfig);
      const sampleString = 'The forgotten title';
      eventConfig.title = sampleString;
      const newStore = eventManager.editEvent(eventConfig);
      expect(newStore).to.have.lengthOf(1);
      expect(newStore).to.not.deep.equal(oldStore);
      expect(newStore[0].title).to.equal(sampleString);
    });
  });
});
