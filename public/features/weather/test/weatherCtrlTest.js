(function () {
  'use strict';

  describe('Weather Controller Test', function () {
    var scope,
        deferred;

    beforeEach(module('weatherApp'));

    beforeEach(inject(function ($controller, $rootScope, $q) {
      scope = $rootScope.$new();
      deferred = $q.defer();

      $controller('weatherCtrl', {
        $scope: scope
      });

    }));

    it('should verify initial data', function () {
      expect(scope.config.temperatureType).toBe(1);
      expect(scope.config.selectedAddress).toBe('New York, NY, USA');
      expect(scope.config.apiServer).toBe('2');
      expect(scope.weatherService.getWeather).toBeDefined();
      expect(scope.weather).toEqual({});
      expect(scope.showSpinner).toBe(false);
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

        scope.getAddress(text);
        deferred.resolve({lat: 4, lng: 4});
        scope.$apply();
        expect(geoCoder.getLatitudeLongitude).toHaveBeenCalled();
        expect(scope.weatherService.lat).toBe(4);
        expect(scope.weatherService.lng).toBe(4);
    }));

    it('should verify update weather service instance', inject(function (ForecastIoService, WeatherUndergroundService) {
      scope.config.apiServer = '1';
      scope.updateApiServer();
      expect(scope.weatherService instanceof ForecastIoService).toBe(true);
      scope.config.apiServer = '2';
      scope.updateApiServer();
      expect(scope.weatherService instanceof WeatherUndergroundService).toBe(true);
    }));

    it('should verify dashboard is updated with data', inject(function () {
      spyOn(scope.weatherService, 'getWeather').and.returnValue(deferred.promise);
      scope.config.lat = 1;
      scope.config.lng = 2;
      scope.temperatureType = 1;
      scope.updateDashboard();
      expect(scope.weatherService.lat).toBe(1);
      expect(scope.weatherService.lng).toBe(2);
      expect(scope.weatherService.isFahrenheit).toBe(true);
      expect(scope.showSpinner).toBe(true);

      deferred.resolve({data: [{id: 1}]});
      scope.$apply();
      expect(scope.showSpinner).toBe(false);
      expect(scope.weather.length).toBe(1);

    }));

    it('should verify an error is showed', inject(function (notification) {
      spyOn(scope.weatherService, 'getWeather').and.returnValue(deferred.promise);
      spyOn(notification, 'error');
      scope.updateDashboard();

      deferred.reject();
      scope.$apply();
      expect(scope.showSpinner).toBe(false);
      expect(notification.error).toHaveBeenCalled();

    }));

    it('should update the weather service and dashboard when api server change', inject(function (WeatherUndergroundService, ForecastIoService) {

      expect(scope.weatherService instanceof WeatherUndergroundService).toBe(true);
      scope.config.apiServer = '1';
      scope.onApiServerChange();
      expect(scope.weatherService instanceof ForecastIoService).toBe(true);
    }));
  });
})();
