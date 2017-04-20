var expect = require('chai').expect;
var adapter = require('../src/default.adapter.js');

describe('Default Adapter', function() {
	describe('l10n', function() {
		it('should return an object containing the date given to the method', function() {
			var date = {year: 2017, month: 12, day: 20}
	    	expect(adapter.l10n(date)).to.equal(date);
	    });

	});

	describe('i18n', function() {
		it('should return an object containing the date given to the method', function() {
			var date = {year: 2017, month: 12, day: 20}
	    	expect(adapter.i18n(date)).to.equal(date);
	    });
	});

	describe('isValid', function() {
		it('should return true when input is (2016, 2, 29)', function() {
			var date = {year: 2016, month: 2, day: 29}; 
	    	expect(adapter.isValid(date)).to.equal(true);
	    });
		it('should return true when input is (2017, 2, 28)', function() {
			var date = {year: 2017, month: 2, day: 28}; 
	    	expect(adapter.isValid(date)).to.equal(true);
	    });
		it('should return false when input is (2017, 2, 29)', function() {
			var date = {year: 2017, month: 2, day: 29}; 
	    	expect(adapter.isValid(date)).to.equal(false);
	    });
	});

	describe('isLeap', function() {
		it('should return false when input is 2015', function() {
	    	expect(adapter.isLeap(2015)).to.equal(false);
	    });		
	    it('should return true when input is 2016', function() {
	    	expect(adapter.isLeap(2016)).to.equal(true);
	    });
	    it('should return false when input is 2017', function() {
	    	expect(adapter.isLeap(2017)).to.equal(false);
	    });
	    it('should return true when input is 2020', function() {
	    	expect(adapter.isLeap(2020)).to.equal(true);
	    });
	});

	describe('getMonthName', function() {
		it('should return string when number is between 1 and 12', function() {
			for (var i = 1; i <= 12; i++) {
				expect(adapter.getMonthName(i)).to.be.a('string');
			}
	    });
		it('should throw error when number is 0', function() {
	    	expect(function() {adapter.getMonthName(0);}).to.throw(Error);
	    });
		it('should throw error when number is 13', function() {
	    	expect(function() {adapter.getMonthName(13);}).to.throw(Error);
	    });
	});

	describe('getMonthLength', function() {
		it('should return 31 when input is (2017, 1)', function() {
	    	expect(adapter.getMonthLength(2017, 1)).to.equal(31);
	    });
		it('should return 28 when input is (2017, 2)', function() {
	    	expect(adapter.getMonthLength(2017, 2)).to.equal(28);
	    });
	    it('should return 29 when input is (2016, 2)', function() {
	    	expect(adapter.getMonthLength(2016, 2)).to.equal(29);
	    });
		it('should return 31 when input is (2017, 3)', function() {
	    	expect(adapter.getMonthLength(2017, 3)).to.equal(31);
	    });
		it('should return 30 when input is (2017, 4)', function() {
	    	expect(adapter.getMonthLength(2017, 4)).to.equal(30);
	    });
		it('should return 31 when input is (2017, 5)', function() {
	    	expect(adapter.getMonthLength(2017, 5)).to.equal(31);
	    });
		it('should return 30 when input is (2017, 6)', function() {
	    	expect(adapter.getMonthLength(2017, 6)).to.equal(30);
	    });
		it('should return 31 when input is (2017, 7)', function() {
	    	expect(adapter.getMonthLength(2017, 7)).to.equal(31);
	    });
		it('should return 31 when input is (2017, 8)', function() {
	    	expect(adapter.getMonthLength(2017, 8)).to.equal(31);
	    });
		it('should return 30 when input is (2017, 9)', function() {
	    	expect(adapter.getMonthLength(2017, 9)).to.equal(30);
	    });
		it('should return 31 when input is (2017, 10)', function() {
	    	expect(adapter.getMonthLength(2017, 10)).to.equal(31);
	    });
		it('should return 30 when input is (2017, 11)', function() {
	    	expect(adapter.getMonthLength(2017, 11)).to.equal(30);
	    });
		it('should return 31 when input is (2017, 12)', function() {
	    	expect(adapter.getMonthLength(2017, 12)).to.equal(31);
	    });
	});
});