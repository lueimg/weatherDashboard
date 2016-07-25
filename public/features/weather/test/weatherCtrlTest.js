(function () {
  'use strict';

  describe('Weather Controller Test', function () {
    var scope,
        deferred,
        wc;

    beforeEach(module('weatherApp'));

    beforeEach(inject(function ($controller, $rootScope, $q, WeatherService) {
      scope = $rootScope.$new();
      deferred = $q.defer();

      wc = $controller('weatherCtrl', {
        $scope: scope,
        WeatherService: WeatherService
      });

    }));

    it('should verify initial data', function () {
      expect(wc.selectedAddress).toBe('New York, NY, USA');
      expect(wc.weatherService.serviceType).toBe(2);
      expect(wc.weatherService.isFahrenheit).toBe(true);
      expect(wc.weatherService.getWeather).toBeDefined();
      expect(wc.weather).toEqual({});
      expect(wc.showSpinner).toBe(false);
    });

    it('should verify coordenates are updated after changing location',
      inject(function (AddressService, geoCoder, $httpBackend) {
        var text = 'test';
        $httpBackend.expectGET('http://maps.googleapis.com/maps/api/geocode/json?address=test&sensor=false')
          .respond(200);
        $httpBackend.expectGET('http://api.wunderground.com/api/3e35f75cbe7b1a19/conditions/q/4,4.json')
          .respond(200);
        $httpBackend.expectGET('http://api.wunderground.com/api/3e35f75cbe7b1a19/forecast10day/q/4,4.json')
          .respond(200);
        spyOn(geoCoder, 'getLatitudeLongitude').and.returnValue(deferred.promise);

        wc.getAddress(text);
        deferred.resolve({lat: 4, lng: 4});
        scope.$apply();
        expect(geoCoder.getLatitudeLongitude).toHaveBeenCalled();
        expect(wc.weatherService.lat).toBe(4);
        expect(wc.weatherService.lng).toBe(4);
    }));

    it('should verify dashboard is updated with data', inject(function () {
      spyOn(wc.weatherService, 'getWeather').and.returnValue(deferred.promise);
      wc.weatherService.lat = 1;
      wc.weatherService.lng = 2;
      wc.weatherService.isFahrenheit = true;
      wc.updateDashboard();
      expect(wc.weatherService.lat).toBe(1);
      expect(wc.weatherService.lng).toBe(2);
      expect(wc.weatherService.isFahrenheit).toBe(true);
      expect(wc.showSpinner).toBe(true);

      deferred.resolve([{id: 1}]);
      scope.$apply();
      expect(wc.showSpinner).toBe(false);
      expect(wc.weather.length).toBe(1);

    }));

    it('should verify an error is showed', inject(function (notification) {
      spyOn(wc.weatherService, 'getWeather').and.returnValue(deferred.promise);
      spyOn(notification, 'error');
      wc.updateDashboard();

      deferred.reject();
      scope.$apply();
      expect(wc.showSpinner).toBe(false);
      expect(notification.error).toHaveBeenCalled();

    }));

  });
})();
