(function (angular) {
    var app = angular.module("app");
    app.service("SensorService", function (restUrlPrefix, $http) {
        return {
            createSensor: function (data) {
                return $http({
                    method: 'POST',
                    url: restUrlPrefix + 'sensors.php',
                    data: data
                });
            },
            getProjectSensors: function (projectId) {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'sensors.php?projectId=' + projectId
                });
            }
        };
    });
})(angular);