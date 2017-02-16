(function (angular) {
    angular.module('app').config(
        function ($routeProvider, $locationProvider) {
            $routeProvider.when('/asdf', {
                controller: 'UserCtrl',
                templateUrl: '/idum-ui/app/templates/login.tmpl.html'
            });

            $locationProvider.html5Mode(true);
        }
    );
})(angular);