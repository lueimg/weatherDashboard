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
    .factory('AddressService', ['$http', function ($http) {
      return {
        getList : function (viewValue) {
          var params = {address: viewValue, sensor: false};
          return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params});
        }
      };
    }])
    .factory('cacheService', ['$cacheFactory', function($cacheFactory) {
      return $cacheFactory('cacheService');
    }]);
})();
