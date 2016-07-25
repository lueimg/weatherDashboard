(function () {
  'use strict';
  angular
    .module('doc.features')
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
})();
