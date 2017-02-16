(function (angular) {
    angular.module("app").controller("UserCtrl", function ($scope, UserService) {
        $scope.login = function () {
            UserService.login($scope.user).then(function (response) {
                console.log(response.data);
            });
        };

        $scope.register = function () {
            UserService.register($scope.user).then(function (response) {
                console.log(response.data);
            });
        };
    });
})(angular);
