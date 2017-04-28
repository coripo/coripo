/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const Event = require('coripo-core').Event;
const GregorianAdapter = require('coripo-core').GregorianAdapter;
const JalaliAdapter = require('coripo-adapter-jalali').Adapter;
const BasicGenerator = require('../src/basic.generator.js').Generator;
const EventManager = require('../src/event.manager.js').EventManager;

describe('Event Manager', () => {
  const BASIC_GENERATOR_ID = new BasicGenerator(Event).id;
  const GREGORIAN_ADAPTER_ID = new GregorianAdapter().id;
  const JALALI_ADAPTER_ID = new JalaliAdapter().id;

  describe('getAdaptersInfo()', () => {
    const eventManager = new EventManager();

    it('should return an array', () => {
      expect(eventManager.getAdaptersInfo()).to.be.an('array');
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

  describe('add', () => {
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

  describe('edit', () => {

  });

  describe('remove', () => {

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
    });
  });
});
