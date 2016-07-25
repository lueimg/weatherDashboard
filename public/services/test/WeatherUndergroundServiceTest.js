(function () {
  'use strict';

  describe('Weather Services Test', function () {

    beforeEach(module('weatherApp'));

    describe('WeatherUndergroundService service', function () {
      var deferred,
        instanceService,
        scope;

      beforeEach(inject(function (WeatherUndergroundService, $q, $rootScope) {
        scope = $rootScope.$new();
        deferred = $q.defer();
        instanceService = new WeatherUndergroundService({
          lat: 1,
          lng: 1,
          isFahrenheit: true
        });
      }));

      it('should verify ForecastIoService service instance', function () {
        expect(instanceService.lat).toBeDefined();
        expect(instanceService.lng).toBeDefined();
        expect(instanceService.isFahrenheit).toBeDefined();
        expect(instanceService.urlAPI).toBeDefined();
        expect(instanceService.urlSuffix).toBeDefined();
        expect(instanceService.urlAPICondition).toBeDefined();
        expect(instanceService.urlAPIforecast10day).toBeDefined();
        expect(instanceService.getWeatherFromApi).toBeDefined();
      });

      it('should return urlSuffix ', function () {
        expect(instanceService.urlSuffix).toContain('.json');
      });

      it('should process data after calling get weather', inject(function ($httpBackend, cacheService) {

        $httpBackend.whenGET('http://api.wunderground.com/api/3e35f75cbe7b1a19/conditions/q/1,1.json')
          .respond({current_observation: {temp_f: 1, temp_c: 1}});
        $httpBackend.whenGET('http://api.wunderground.com/api/3e35f75cbe7b1a19/forecast10day/q/1,1.json')
          .respond({forecast: {simpleforecast: {forecastday: []}}});

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