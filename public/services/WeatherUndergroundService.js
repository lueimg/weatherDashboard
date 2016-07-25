(function () {
  'use strict';
  angular
    .module('doc.features')
    .factory('WeatherUndergroundService', ['$q', '$http', 'cacheService', function ($q, $http, cacheService) {
      var WeatherUndergroundService = function (params) {
          this.lat = params.lat;
          this.lng = params.lng;
          this.isFahrenheit = params.isFahrenheit;
          this.urlAPI = 'http://api.wunderground.com/api/3e35f75cbe7b1a19/';
        },
        _preprocessData = function (values, isFahrenheit) {
          var weather = {
                currently: {},
                daily: []
              },
              currentData = values[0].data.current_observation,
              dailyData = values[1].data.forecast.simpleforecast.forecastday;

          // Current weather
          weather.currently.temperature = isFahrenheit ? currentData.temp_f : currentData.temp_c;
          weather.currently.summary = currentData.weather;
          weather.currently.icon = currentData.icon_url;

          // Daily forecast
          dailyData.forEach(function (item) {
            weather.daily.push({
              time: item.date.epoch * 1000,
              icon: item.icon_url,
              temperatureMin: isFahrenheit ? item.low.fahrenheit : item.low.celsius,
              temperatureMax: isFahrenheit ? item.high.fahrenheit : item.high.celsius,
              summary: item.conditions
            });
          });

          return weather;
        };

      Object.defineProperty(WeatherUndergroundService.prototype, 'urlSuffix', {
        get: function () {
          return this.lat + ',' + this.lng + '.json';
        }
      });
      Object.defineProperty(WeatherUndergroundService.prototype, 'urlAPICondition', {
        get: function () {
          return this.urlAPI + 'conditions/q/' + this.urlSuffix;
        }
      });
      Object.defineProperty(WeatherUndergroundService.prototype, 'urlAPIforecast10day', {
        get: function () {
          return this.urlAPI + 'forecast10day/q/' + this.urlSuffix;
        }
      });

      Object.defineProperty(WeatherUndergroundService.prototype, 'cacheKey', {
        get: function () {
          return 'WUDGS ,' + this.lat + ',' + this.lng + ',' + this.isFahrenheit + ',' + moment().format('YYYYMMD');
        }
      });

      WeatherUndergroundService.prototype.getWeatherFromApi = function () {
        var promises = [],
            deferred = $q.defer(),
            cacheData = cacheService.get(this.cacheKey),
            anotherCaseCacheData,
            self = this;

        if (cacheData) {
          deferred.resolve(cacheData);
        } else {
          // Returns current weather
          promises.push($http.get(this.urlAPICondition));
          // Returns week forecast
          promises.push($http.get(this.urlAPIforecast10day));

          $q.all(promises).then(function (values) {
            cacheData = _preprocessData(values, self.isFahrenheit);
            cacheService.put(self.cacheKey, cacheData);

            /**
             * Due that WUG returns fahrenheit and Celsius together
             * we can cache both in the same call
             */
            self.isFahrenheit = !self.isFahrenheit;
            anotherCaseCacheData = _preprocessData(values, self.isFahrenheit);
            cacheService.put(self.cacheKey, anotherCaseCacheData);

            deferred.resolve(cacheData);
          }, function (error) {
            deferred.reject(error);
          });
        }

        return deferred.promise;
      };

      return WeatherUndergroundService;
    }]);
})();
