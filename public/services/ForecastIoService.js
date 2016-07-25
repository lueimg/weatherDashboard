(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('ForecastIoService', ['$q', '$http', 'cacheService', function ($q, $http, cacheService) {
      var ForecastObject = function (params) {
            this.lat = params.lat;
            this.lng = params.lng;
            this.isFahrenheit = params.isFahrenheit;
          },
          _preprocessData = function (values) {
            var weather = {
                  currently: {},
                  daily: []
                };

            weather.currently.temperature = values.currently.temperature;
            weather.currently.summary = values.currently.summary;
            weather.currently.icon = values.currently.icon;

            values.daily.data.forEach(function (item) {
              weather.daily.push({
                time: item.time * 1000,
                icon: item.icon,
                temperatureMin: item.temperatureMin,
                temperatureMax: item.temperatureMax,
                summary: item.summary
              });
            });

            return weather;
          };

      Object.defineProperty(ForecastObject.prototype, 'temperatureType', {
        get: function () {
          return this.isFahrenheit ? '' : '?units=si';
        }
      });
      Object.defineProperty(ForecastObject.prototype, 'jsonpCall', {
        get: function () {
          return this.isFahrenheit ? '?callback=JSON_CALLBACK' : '&callback=JSON_CALLBACK';
        }
      });

      Object.defineProperty(ForecastObject.prototype, 'urlAPI', {
        get: function () {
          return 'https://api.forecast.io/forecast/e8437ef6c0a9cfd216b775251ec083c3/' +
            this.lat + ',' + this.lng + this.temperatureType + this.jsonpCall;
        }
      });

      /**
       * Define Cache key per day
       */
      Object.defineProperty(ForecastObject.prototype, 'cacheKey', {
        get: function () {
          return 'ForecastIO ,' + this.lat + ',' + this.lng + ',' + this.isFahrenheit + ',' + moment().format('YYYYMMD');
        }
      });

      ForecastObject.prototype.getWeatherFromApi = function () {
        var deferred = $q.defer(),
            cacheData = cacheService.get(this.cacheKey),
            self = this;

        if (cacheData) {
          deferred.resolve(cacheData);
        } else {
          $http.jsonp(this.urlAPI).then(function (response) {
            cacheData = _preprocessData(response.data);
            cacheService.put(self.cacheKey, cacheData);
            deferred.resolve(cacheData);
          }, function (error) {
            deferred.reject(error);
          });
        }

        return deferred.promise;
      };

      return ForecastObject;
    }]);
})();
