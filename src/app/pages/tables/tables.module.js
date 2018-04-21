/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.tables', [])
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('tables', {
          url: '/tables',
          templateUrl: 'app/pages/tables/basic/tables.html',
          controller: 'TablesPageCtrl',
          title: 'Invites',
          sidebarMeta: {
            order: 0,
          }
        });
        // .state('tables.basic', {
        //   url: '/basic',
        //   templateUrl: 'app/pages/tables/basic/tables.html',
        //   title: 'Basic Tables',
        //   sidebarMeta: {
        //     order: 0,
        //   },
        // }).state('tables.smart', {
        //   url: '/smart',
        //   templateUrl: 'app/pages/tables/smart/tables.html',
        //   title: 'Smart Tables',
        //   sidebarMeta: {
        //     order: 100,
        //   },
        // });
    //$urlRouterProvider.when('/tables','/tables/basic');
  }

})();