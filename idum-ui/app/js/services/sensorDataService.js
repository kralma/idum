(function (angular) {
    var app = angular.module("app");
    app.service("SensorDataService", function (restUrlPrefix, $http) {
        return {
            getSensorData: function (sensorId) {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'values.php?sensorId=' + sensorId
                });
            },
            setSensorData: function (data) {
                return $http({
                    method: 'POST',
                    url: restUrlPrefix + 'values.php'
                });
            }
        };
    });
})(angular);