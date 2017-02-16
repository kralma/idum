(function (angular) {
    angular.module("app").controller("SensorDataCtrl", function ($scope, SensorDataService) {
        SensorDataService.getSensorData().then(function (response) {
            $scope.data = response.data;
        });
    });
})(angular);
