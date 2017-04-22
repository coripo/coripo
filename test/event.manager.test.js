/* eslint-disable no-unused-expressions */
const expect = require('chai').expect;
const EventManager = require('../src/event.manager.js').EventManager;

describe('Event Manager', () => {
  describe('add', () => {
    it('should increase events array size appropriately', () => {
      const eventManager = new EventManager();

      expect(eventManager.add({
        title: 'Dentist Appointment',
        note: 'Don\'t ask the dentist why he smokes',
        since: { year: 2017, month: 5, day: 14 },
      })).to.have.lengthOf(1);

      expect(eventManager.add({
        title: 'Business Meeting',
        note: 'Fortunately it\'s an informal one',
        since: { year: 2017, month: 3, day: 5 },
      })).to.have.lengthOf(2);

      expect(eventManager.add({
        title: 'Vacation Time',
        note: '5 days of pure fun and relaxation in 305',
        since: { year: 2017, month: 9, day: 5 },
        till: { year: 2017, month: 9, day: 10 },
      })).to.have.lengthOf(3);
    });
  });

  describe('edit', () => {

  });

  describe('remove', () => {

  });

  describe('getDateRange', () => {
    it('should return an array of 2 events', () => {
      const eventManager = new EventManager();

      eventManager.add({
        title: 'Dentist Appointment',
        note: 'Don\'t ask the dentist why he smokes',
        since: { year: 2017, month: 5, day: 14 },
      });

      eventManager.add({
        title: 'Business Meeting',
        note: 'Fortunately it\'s an informal one',
        since: { year: 2017, month: 3, day: 5 },
      });

      eventManager.add({
        title: 'Vacation Time',
        note: '5 days of pure fun and relaxation in 305',
        since: { year: 2017, month: 9, day: 5 },
        till: { year: 2017, month: 9, day: 10 },
      });

      expect(eventManager.getDateRange({ year: 2017, month: 5, day: 1 },
        { year: 2017, month: 10, day: 8 })).to.have.lengthOf(2);
    });
  });
});
