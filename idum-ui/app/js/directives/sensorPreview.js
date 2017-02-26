(function (angular) {
    angular.module('app')
        .directive('sensorPreview', function () {
            return {
                restrict: 'E',
                replace: true,
                scope: {sensor: '='},
                templateUrl: 'idum-ui/app/js/directives/templates/sensor-preview.tmpl.html',
                link: function (scope, elem, attrs) {
                    scope.showMore = false;
                    scope.getExtendedData = function () {
                        scope.showMore = true;
                        SensorDataService.getSensorData(scope.sensor.sensorId).then(function (response) {
                            scope.allValues = response.data;
                        });
                    };
                }
            };
        });
})(angular);