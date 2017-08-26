'use strict';

describe('Bodyweights E2E Tests:', function () {
  describe('Test Bodyweights page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/bodyweights');
      expect(element.all(by.repeater('bodyweight in bodyweights')).count()).toEqual(0);
    });
  });
});
