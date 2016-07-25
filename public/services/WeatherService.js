(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('WeatherService', [
      '$q',
      '$http',
      'ForecastIoService',
      'WeatherUndergroundService',
      function ($q, $http, ForecastIoService, WeatherUndergroundService) {
        var WeatherService = function () {
              this.lat = 0;
              this.lng = 0;
              this.isFahrenheit = true;
              this.serviceType = 1;
            };

        WeatherService.prototype.getList = function () {
          return [
            {
              id: 1,
              name: 'Forecast IO'
            },
            {
              id: 2,
              name: 'Weather Underground'
            }
          ];
        };

        WeatherService.prototype.setCoordinates = function (options) {
          this.lat = options.lat;
          this.lng = options.lng;
        };

        WeatherService.prototype.getWeather = function () {

          switch (this.serviceType) {
            case 1:
              this.serviceInstance = new ForecastIoService(this);
              break;
            case 2:
              this.serviceInstance = new WeatherUndergroundService(this);
              break;
          }

          return this.serviceInstance.getWeatherFromApi();
        };

        return WeatherService;
      }]);
})();
