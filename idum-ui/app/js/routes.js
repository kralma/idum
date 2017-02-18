(function (angular) {
    angular.module('app').config(
        function ($routeProvider, $locationProvider) {
            $routeProvider.when('/login', {
                controller: 'UserCtrl',
                templateUrl: '/idum-ui/app/templates/login.tmpl.html'
            });
            $routeProvider.when('/register', {
                controller: 'UserCtrl',
                templateUrl: '/idum-ui/app/templates/register.tmpl.html'
            });

            $locationProvider.html5Mode(true);
        }
    );
})(angular);