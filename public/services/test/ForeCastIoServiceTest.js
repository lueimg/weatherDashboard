(function () {
  'use strict';

  describe('Weather Services Test', function () {

    beforeEach(module('weatherApp'));

    describe('ForecastIoService service', function () {
      var instanceService,
          params,
          scope;

      beforeEach(inject(function (ForecastIoService, $rootScope) {
        scope = $rootScope.$new();
        params = {
          lat: 1,
          lng: 1,
          isFahrenheit: true
        };
        instanceService = new ForecastIoService(params);
      }));

      it('should verify ForecastIoService service instance', function ( ) {

        expect(instanceService.lat).toBeDefined();
        expect(instanceService.lng).toBeDefined();
        expect(instanceService.isFahrenheit).toBeDefined();
        expect(instanceService.temperatureType).toBeDefined();
        expect(instanceService.jsonpCall).toBeDefined();
        expect(instanceService.urlAPI).toBeDefined();
        expect(instanceService.getWeatherFromApi).toBeDefined();

      });

      it('should return temperature type empty if it is fahrenheit', function () {
        instanceService.isFahrenheit = false;
        expect(instanceService.temperatureType).toBe('?units=si');
      });

      it('should form callback param properly', function () {
        instanceService.isFahrenheit = false;
        expect(instanceService.jsonpCall).toContain('&');
        instanceService.isFahrenheit = true;
        expect(instanceService.jsonpCall).toContain('?');
      });

      it('should process data after calling get weather', inject(function ($httpBackend, cacheService) {

        $httpBackend.whenJSONP('https://api.forecast.io/forecast/e8437ef6c0a9cfd216b775251ec083c3/1,1?callback=JSON_CALLBACK')
          .respond({currently: {}, daily: {data: []}});

        instanceService.getWeatherFromApi().then(function(response) {
          expect(response.currently).toBeDefined();
          expect(response.daily).toBeDefined();
        });

        scope.$apply();
        $httpBackend.flush();

        expect(cacheService.get(instanceService.cacheKey)).toBeDefined();

      }));

    });
  });
})();