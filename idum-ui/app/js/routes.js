(function (angular) {
    angular.module('app').config(
        function ($routeProvider, $locationProvider) {
            $routeProvider.when('/login', {
                controller: 'UserCtrl',
                templateUrl: '/idum-ui/app/templates/login.tmpl.html'
            });
            $routeProvider.when('/register', {
                controller: 'UserCtrl',
                templateUrl: '/idum-ui/app/templates/register.tmpl.html'
            });
            $routeProvider.when('/projects', {
                controller: 'ProjectsListCtrl',
                templateUrl: '/idum-ui/app/templates/projects.tmpl.html'
            });
            $routeProvider.when('/new-project', {
                controller: 'NewProjectCtrl',
                templateUrl: '/idum-ui/app/templates/new-project.tmpl.html'
            });
            $routeProvider.when('/projects/:projectId', {
                controller: 'ProjectCtrl',
                templateUrl: '/idum-ui/app/templates/project-detail.tmpl.html'
            });

            $locationProvider.html5Mode(true);
        }
    );
})(angular);