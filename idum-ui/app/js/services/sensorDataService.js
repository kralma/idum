(function (angular) {
    var app = angular.module("app");
    app.service("SensorDataService", function (restUrlPrefix, $http) {
        return {
            getSensorData: function () {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'values.php'
                });
            }
        };
    });
})(angular);