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

    describe('ForecastIoService service', function () {
      var instanceService;

      beforeEach(inject(function (ForecastIoService) {
        instanceService = new ForecastIoService();
      }));

      it('should verify ForecastIoService service instance', function ( ) {

        expect(instanceService.lat).toBeDefined();
        expect(instanceService.lng).toBeDefined();
        expect(instanceService.isFahrenheit).toBeDefined();
        expect(instanceService.temperatureType).toBeDefined();
        expect(instanceService.jsonpCall).toBeDefined();
        expect(instanceService.urlAPI).toBeDefined();
        expect(instanceService.getWeather).toBeDefined();

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
    });

    describe('WeatherUndergroundService service', function () {
      var deferred,
          instanceService,
          scope;

      beforeEach(inject(function (WeatherUndergroundService, $q, $rootScope) {
        scope = $rootScope.$new();
        deferred = $q.defer();
        instanceService = new WeatherUndergroundService();
      }));

      it('should verify ForecastIoService service instance', function () {
        expect(instanceService.lat).toBeDefined();
        expect(instanceService.lng).toBeDefined();
        expect(instanceService.isFahrenheit).toBeDefined();
        expect(instanceService.urlAPI).toBeDefined();
        expect(instanceService.urlSuffix).toBeDefined();
        expect(instanceService.urlAPICondition).toBeDefined();
        expect(instanceService.urlAPIforecast10day).toBeDefined();
        expect(instanceService.getWeather).toBeDefined();
      });

      it('should return urlSuffix ', function () {
        expect(instanceService.urlSuffix).toContain('.json');
      });

      it('should process data after calling get weather', inject(function ($httpBackend) {

        $httpBackend.whenGET('http://api.wunderground.com/api/3e35f75cbe7b1a19/conditions/q/0,0.json')
          .respond({current_observation: {temp_f: 1, temp_c: 1}});
        $httpBackend.whenGET('http://api.wunderground.com/api/3e35f75cbe7b1a19/forecast10day/q/0,0.json')
          .respond({forecast: {simpleforecast: {forecastday: []}}});

        instanceService.getWeather().then(function(response) {
          expect(response.data.currently).toBeDefined();
          expect(response.data.daily).toBeDefined();
        });

        scope.$apply();
        $httpBackend.flush();

      }));

    });
  });
})();