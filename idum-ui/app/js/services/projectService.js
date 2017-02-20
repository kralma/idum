(function (angular) {
    var app = angular.module("app");
    app.service("ProjectService", function (restUrlPrefix, $http) {
        return {
            createProject: function (data) {
                return $http({
                    method: 'POST',
                    url: restUrlPrefix + 'projects.php',
                    data: data
                });
            },
            getProject: function (projectId) {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'projects.php?project_id=' + projectId
                });
            },
            getProjects: function () {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'projects.php'
                });
            }
        };
    });
})(angular);