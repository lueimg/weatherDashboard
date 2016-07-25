(function () {
  'use strict';
  angular
  .module('doc.features')
  .directive('gMap', function () {
    return {
      restrict : 'A',
      scope: {
        lat: '=',
        lng: '='
      },
      link : function (scope) {
        scope.$watch('lat', function () {
          if (scope.lat && scope.lng) {
            var myLatLng = {lat: scope.lat, lng: scope.lng},
                map = new google.maps.Map(document.getElementById('map'), {
                  center: myLatLng,
                  scrollwheel: false,
                  zoom: 6
                }),
                marker = new google.maps.Marker({
                  map: map,
                  position: myLatLng,
                  title: ''
                });
          }
        });
      }
    };
  })
  .directive('weatherIcon', ['$timeout', function ($timeout) {
    return {
      restrict : 'EA',
      scope: {
        image: '=',
        idName: '@',
        size: '@'
      },
      templateUrl: 'core/template/weatherIcon.html',
      link : function (scope) {
        scope.$watch('image', function () {
          scope.isImage = scope.image.indexOf('http') > -1;
          if (!scope.isImage) {
            // Allow to load the canvas first at all
            $timeout(function () {
              var skycons = new Skycons({color: 'black'});
              skycons.add('icon-' + scope.idName, scope.image);
              skycons.play();
            }, 500);
          }
        });
      }
    };
  }]);
})();
