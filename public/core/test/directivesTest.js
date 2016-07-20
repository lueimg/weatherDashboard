(function () {
  'use strict';

  describe('Weather directive Test', function () {
    var scope,
        el;

    beforeEach(module('weatherApp'));

    it('should verfiy weather Icon', inject(function ($compile, $rootScope, $httpBackend) {
      scope = $rootScope.$new();

      $httpBackend.whenGET('core/template/weatherIcon.html')
        .respond(__html__['public/core/template/weatherIcon.html']);
      scope.icon = 'http://cnd.com/imagen.jpg';

      el = $compile('<weather-icon ' +
            'data-image="icon" data-id-name="1"data-size="30"></weather-icon>')(scope);
      scope.$digest();
      $httpBackend.flush();

      expect(el.html()).toContain(scope.icon);
    }));
  });
})();