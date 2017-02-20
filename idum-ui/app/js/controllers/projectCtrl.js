(function (angular) {
    angular.module("app").controller("ProjectsListCtrl", function ($scope, ProjectService, DialogService, $location) {
        ProjectService.getProjects().then(function (response) {
            $scope.projects = response.data;
        });
    });

    angular.module("app").controller("NewProjectCtrl", function ($scope, ProjectService, DialogService, $location) {
        $scope.createProject = function () {
            ProjectService.createProject($scope.project).then(function (response) {
                DialogService.sendPositiveNotification("Projekt byl úspěšně vytvořen");
                $location.path('projects/' + response.data.projectId);
            });
        };
    });

    angular.module("app").controller("ProjectCtrl", function ($scope, ProjectService, DialogService, SensorDataService, $routeParams) {
        var projectId = $routeParams.projectId;
        ProjectService.getProject(projectId).then(function (response) {
            $scope.project = response.data;
        });

        $scope.getExtendedData = function (sensor) {
            sensor.showExtended = true;
            SensorDataService.getSensorData(sensor.sensorId).then(function (response) {
                sensor.allValues = response.data;
            });
        };
    });
})(angular);
