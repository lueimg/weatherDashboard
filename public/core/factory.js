(function () {
  'use strict';
  angular
    .module('doc.features')
  /**
   * Show notification using angular strap
   */
    .factory('notification', function ($alert) {
      return {
        great: function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'success',
            show: true,
            container: '.message',
            duration: '8',
            animation: 'am-fade-and-slide-top'
          });
        },
        error : function (message) {
          $alert({
            title: message,
            placement: 'top',
            type: 'danger',
            show: true,
            container: '.message',
            duration: '10',
            animation: 'am-fade-and-slide-top'
          });
        }
      };
    })
    .factory('geoCoder', ['$q', function ($q) {
      return {
        getLatitudeLongitude : function (address) {
          var deferred = $q.defer(),
              geocoder = new google.maps.Geocoder();

          if (geocoder && address) {
            geocoder.geocode({
              'address': address
            }, function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {

                deferred.resolve({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
              } else {
                deferred.reject(results);
              }
            }, function (error) {
              deferred.reject(error);
            });
          } else {
            deferred.reject();
          }
          return deferred.promise;
        }
      };
    }])
    .factory('AddressService', ['$http', function ($http) {
      return {
        getList : function (viewValue) {
          var params = {address: viewValue, sensor: false};
          return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params});
        }
      };
    }])
    .factory('ForecastIoService', ['$q', '$http', function ($q, $http) {
      var ForecastObject = function () {
        this.lat = 0;
        this.lng = 0;
        this.isFahrenheit = true;
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
            this.lat + ',' + this.lng + this.temperatureType;
        }
      });

      ForecastObject.prototype.getWeather = function () {
        return $http.jsonp(this.urlAPI + this.jsonpCall);
      };

      return ForecastObject;
    }])
    .factory('WeatherUndergroundService', ['$q', '$http', function ($q, $http) {
      var WeatherUndergroundService = function () {
            this.lat = 0;
            this.lng = 0;
            this.isFahrenheit = true;
            this.urlAPI = 'http://api.wunderground.com/api/3e35f75cbe7b1a19/';
          },
          _preprocessData = function (values, isFahrenheit) {
            var weather = {
                  currently: {},
                  daily: {
                    data: []
                  }
                },
                currentData = values[0].data.current_observation,
                dailyData = values[1].data.forecast.simpleforecast.forecastday;

            // Current weather
            weather.currently.temperature = isFahrenheit ? currentData.temp_f : currentData.temp_c;
            weather.currently.summary = currentData.weather;
            weather.currently.icon = currentData.icon_url;

            // Daily forecast
            dailyData.forEach(function (item) {
              weather.daily.data.push({
                time: item.date.epoch,
                icon: item.icon_url,
                temperatureMin: isFahrenheit ? item.low.fahrenheit : item.low.celsius,
                temperatureMax: isFahrenheit ? item.high.fahrenheit : item.high.celsius,
                summary: item.conditions
              });
            });

            return {
              data: weather
            };
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

      WeatherUndergroundService.prototype.getWeather = function () {
        var promises = [],
            deferred = $q.defer(),
            self = this;

        // Returns current weather
        promises.push($http.get(this.urlAPICondition));
        // Returns week forecast
        promises.push($http.get(this.urlAPIforecast10day));

        $q.all(promises).then(function (values) {
          deferred.resolve(_preprocessData(values, self.isFahrenheit));
        }, function (error) {
          deferred.reject(error);
        });

        return deferred.promise;
      };

      return WeatherUndergroundService;
    }]);
})();
