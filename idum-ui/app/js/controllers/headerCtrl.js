(function (angular) {
    angular.module("app")
        .controller("HeaderCtrl", function ($rootScope, $scope, $location, $filter) {

            $scope.$on('$routeChangeStart', function (scope, next, current) {
            });
        });
})(angular);