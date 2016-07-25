(function () {
  'use strict';
  angular.module('doc.features')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'features/weather/weather.html',
          controller: 'weatherCtrl',
          controllerAs: 'wc'
        });
    }])
    .controller('weatherCtrl', [
      '$scope',
      '$http',
      'geoCoder',
      'AddressService',
      'WeatherService',
      'notification',
      function ($scope, $http, geoCoder, AddressService, WeatherService, notification) {
        var wc = this;

        wc.weatherService = new WeatherService();
        wc.weather = {};
        wc.showSpinner = false;
        wc.serviceList = wc.weatherService.getList();
        wc.selectedAddress = '';

        wc.getAddress = function (viewValue) {
          if (viewValue) {
            wc.showSpinner = true;
          }
          return AddressService.getList(viewValue).then(function (res) {
            wc.showSpinner = false;
            return res.data.results;
          });
        };

        wc.updateDashboard = function (isFahrenheit) {
          wc.showSpinner = true;
          wc.weather = {};

          // If temperature type was changed manually
          wc.weatherService.isFahrenheit = isFahrenheit || isFahrenheit === false ?
            isFahrenheit : wc.weatherService.isFahrenheit;

          if (wc.selectedAddress) {
            wc.weatherService.getWeather().then(function (response) {
              wc.weather = response;
              wc.showSpinner = false;
            }, function () {
              wc.showSpinner = false;
              notification.error('Oh my god! :( there was an problem loading the server, ' +
                'please refresh your page or use another Api server.');
            });
          } else {
            wc.showSpinner = false;
          }
        };

        wc.updateLocation = function (text) {
          wc.selectedAddress = text;
        };

        $scope.$watch('wc.selectedAddress', function () {
          geoCoder.getLatitudeLongitude(wc.selectedAddress).then(
            function (response) {
              wc.weatherService.setCoordinates(response);
              wc.updateDashboard();
            });
        });

        // Initialize server
        wc.updateLocation('New York, NY, USA');
      }]);
})();
