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

  describe('add', () => {
    it('should increase events array size appropriately', () => {
      const eventManager = new EventManager();

      expect(eventManager.add({
        generatorId: BASIC_GENERATOR_ID,
        title: 'Dentist Appointment',
        note: 'Don\'t ask the dentist why he smokes',
        since: { year: 2017, month: 5, day: 14, adapterId: GREGORIAN_ADAPTER_ID },
      })).to.have.lengthOf(1);

      expect(eventManager.add({
        generatorId: BASIC_GENERATOR_ID,
        title: 'Business Meeting',
        note: 'Fortunately it\'s an informal one',
        since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
      })).to.have.lengthOf(2);

      expect(eventManager.add({
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

  describe('getDateRange', () => {
    context('when all gregorian', () => {
      it('should return an array of 2 events', () => {
        const eventManager = new EventManager();

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Dentist Appointment',
          note: 'Don\'t ask the dentist why he smokes',
          since: { year: 2017, month: 5, day: 14, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Business Meeting',
          note: 'Fortunately it\'s an informal one',
          since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Vacation Time',
          note: '5 days of pure fun and relaxation in 305',
          since: { year: 2017, month: 9, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
          till: { year: 2017, month: 9, day: 10, adapterId: GREGORIAN_ADAPTER_ID },
        });

        const since = { year: 2017, month: 5, day: 1 };
        const till = { year: 2017, month: 10, day: 8 };
        expect(eventManager.getDateRange(since, till)).to.have.lengthOf(2);
      });
    });
    context('when various adapters with gregorian as primary', () => {
      it('should return an array of 2 events', () => {
        const eventManager = new EventManager({
          externalAdapters: [JalaliAdapter],
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Teheran',
          note: 'Yay!',
          since: { year: 1396, month: 2, day: 4, adapterId: JALALI_ADAPTER_ID },
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Business Meeting',
          note: 'Fortunately it\'s an informal one',
          since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Sacramento',
          note: 'As usual..',
          since: { year: 2017, month: 4, day: 25, adapterId: GREGORIAN_ADAPTER_ID },
        });

        expect(eventManager.getDateRange({ year: 2017, month: 4, day: 20 },
          { year: 2017, month: 4, day: 30 })).to.have.lengthOf(2);
      });
    });
    context('when various adapters with jalali as primary', () => {
      it('should return an array of 2 events', () => {
        const eventManager = new EventManager({
          externalAdapters: [JalaliAdapter],
          primaryAdapterId: JALALI_ADAPTER_ID,
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Teheran',
          note: 'Yay!',
          since: { year: 1396, month: 2, day: 4, adapterId: JALALI_ADAPTER_ID },
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Business Meeting',
          note: 'Fortunately it\'s an informal one',
          since: { year: 2017, month: 3, day: 5, adapterId: GREGORIAN_ADAPTER_ID },
        });

        eventManager.add({
          generatorId: BASIC_GENERATOR_ID,
          title: 'Meeting in Sacramento',
          note: 'As usual..',
          since: { year: 2017, month: 4, day: 25, adapterId: GREGORIAN_ADAPTER_ID },
        });

        expect(eventManager.getDateRange({ year: 1396, month: 2, day: 3 },
          { year: 1396, month: 2, day: 5 })).to.have.lengthOf(2);
      });
    });
  });
});
