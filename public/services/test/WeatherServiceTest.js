(function () {
  'use strict';

  describe('Weather Services Test', function () {

    beforeEach(module('weatherApp'));

    describe('Weather service', function () {
      var instanceService,
          scope;

      beforeEach(inject(function (WeatherService, $rootScope) {
        scope = $rootScope.$new();
        instanceService = new WeatherService();
      }));

      it('should verify ForecastIoService service instance', function ( ) {

        expect(instanceService.lat).toBeDefined();
        expect(instanceService.lng).toBeDefined();
        expect(instanceService.isFahrenheit).toBeDefined();
        expect(instanceService.serviceType).toBeDefined();
        expect(instanceService.getList).toBeDefined();
        expect(instanceService.setCoordinates).toBeDefined();
        expect(instanceService.getWeather).toBeDefined();

      });

      it('should return service list', function () {

        expect(instanceService.getList()).toEqual([
          {
            id: 1,
            name: 'Forecast IO'
          },
          {
            id: 2,
            name: 'Weather Underground'
          }
        ]);
      });

      it('should assign Coordinates', function () {
        instanceService.setCoordinates({lat: 1, lng: 2});
        expect(instanceService.lat).toBe(1);
        expect(instanceService.lng).toBe(2);
      });

      it('should return an instance of a service', inject(function ($httpBackend, ForecastIoService, WeatherUndergroundService) {
        instanceService.serviceType = 2;
        instanceService.getWeather();
        expect(instanceService.serviceInstance instanceof WeatherUndergroundService).toBe(true);
        instanceService.serviceType = 1;
        instanceService.getWeather();
        expect(instanceService.serviceInstance instanceof ForecastIoService).toBe(true);

      }));

    });
  });
})();