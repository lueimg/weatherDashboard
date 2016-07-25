(function () {
  'use strict';

  describe('Weather factory Test', function () {

    beforeEach(module('weatherApp'));

    it('should call notification methods', inject(function(notification) {
      spyOn(notification, 'great');
      notification.great('test');
      expect(notification.great).toHaveBeenCalledWith('test');

      spyOn(notification, 'error');
      notification.error('test');
      expect(notification.error).toHaveBeenCalledWith('test');
    }));
  });
})();