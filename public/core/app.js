
(function () {
  'use strict';

  // ========== initialize main module ========== //
  angular
    .module('weatherApp', [
      'ngRoute',
      'ngSanitize',
      'mgcrea.ngStrap',
      'angularSpinner',
      'debounce',
      'doc.features'
    ]);
  angular.module('doc.features', []);
})();
