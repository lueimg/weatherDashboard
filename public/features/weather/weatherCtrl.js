(function () {
  'use strict';
  angular.module('doc.features')
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'features/weather/weather.html',
          controller: 'weatherCtrl'
        });
    }])
    .controller('weatherCtrl', [
      '$scope',
      '$http',
      'geoCoder',
      'AddressService',
      'ForecastIoService',
      'WeatherUndergroundService',
      'notification',
      function ($scope, $http, geoCoder, AddressService, ForecastIoService, WeatherUndergroundService, notification) {

        $scope.config = {
          temperatureType: 1, // Fahren : 1, celcius: 2
          selectedAddress: '',
          apiServer: '2',
          lat: '',
          lng: ''
        };

        $scope.weather = {};
        $scope.showSpinner = false;

        $scope.getAddress = function (viewValue) {
          if (viewValue) {
            $scope.showSpinner = true;
          }
          return AddressService.getList(viewValue).then(function (res) {
            $scope.showSpinner = false;
            return res.data.results;
          });
        };

        $scope.updateDashboard = function (value) {

          $scope.weather = {};
          $scope.showSpinner = true;
          $scope.config.temperatureType = value || $scope.config.temperatureType;

          if ($scope.config.selectedAddress && $scope.weatherService && $scope.weatherService.getWeather) {

            $scope.weatherService.lat = $scope.config.lat;
            $scope.weatherService.lng = $scope.config.lng;
            $scope.weatherService.isFahrenheit = $scope.config.temperatureType < 2;

            $scope.weatherService.getWeather().then(function (response) {
              $scope.weather = response.data;
              $scope.showSpinner = false;
            }, function () {
              $scope.showSpinner = false;
              notification.error('Oh my god! :( there was an problem loading the server, ' +
                'please refresh your page or use another Api server.');
            });
          } else {
            $scope.showSpinner = false;
          }
        };

        $scope.updateApiServer = function () {
          // Allow to add another services
          switch ($scope.config.apiServer) {
            case '1':
              $scope.weatherService = new ForecastIoService();
              break;
            case '2':
              $scope.weatherService = new WeatherUndergroundService();
              break;
          }
        };

        $scope.onApiServerChange = function () {
          $scope.updateApiServer();
          $scope.updateDashboard();
        };

        /**
         * Using $watch to use debounce into the input and delay the digest execution
         */
        $scope.$watch('config.selectedAddress', function () {
          geoCoder.getLatitudeLongitude($scope.config.selectedAddress).then(
            function (response) {
              $scope.config.lat = response.lat;
              $scope.config.lng = response.lng;
              $scope.updateDashboard();
            });
        });

        $scope.updateLocation = function (text) {
          $scope.config.selectedAddress = text;
        };

        // Initialize server
        $scope.updateApiServer();
        $scope.updateLocation('New York, NY, USA');

      }]);
})();
