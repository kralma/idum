(function (angular) {
    var app = angular.module("app", []);

    app.controller("SensorDataCtrl", function ($scope, SensorDataService) {
        SensorDataService.getSensorData().then(function (response) {
            $scope.data = response.data;
        });
    });

    app.controller("UserCtrl", function ($scope, UserService) {
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
