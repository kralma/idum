(function (angular) {
    angular.module("app", ['ngRoute', 'textAngular', 'pascalprecht.translate', 'ngCookies', 'ui.bootstrap', 'ngFileUpload']);
})(angular);
(function (angular) {
    var app = angular.module("app");
    app.constant("restUrlPrefix", "api/");
})(angular);

(function (angular) {
    angular.module("app").controller("SensorDataCtrl", ["$scope", "SensorDataService", function ($scope, SensorDataService) {
        SensorDataService.getSensorData().then(function (response) {
            $scope.data = response.data;
        });
    }]);
})(angular);
(function (angular) {
    angular.module("app").controller("UserCtrl", ["$scope", "UserService", function ($scope, UserService) {
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
    }]);
})(angular);
(function (angular) {
    var app = angular.module("app");

    app.directive("graph", ["$window", function ($window) {
        return {
            restrict: 'E',
            replace: true,
            transclude: false,
            template: "<div><svg width='200' height='200'></svg></div>",
            scope: {data: '='},
            link: function (scope, elem, attrs) {
                scope.$watch('data', function () {
                    updateGraph();
                });

                angular.element($window).bind('resize', function () {
                    updateGraph();
                });

                function updateGraph() {
                    if (scope.data == null) {
                        return;
                    }
                    var width = elem[0].clientWidth;
                    var height = 4 * width / 16;
                    var svgElement = elem[0].firstChild;

                    svgElement.setAttribute('width', width);
                    svgElement.setAttribute('height', height);

                    var valueMin = scope.data[0].val;
                    var valueMax = scope.data[0].val;
                    for (key in scope.data) {
                        if (scope.data.hasOwnProperty(key)) {
                            if (scope.data[key].val < valueMin) {
                                valueMin = scope.data[key].val;
                            } else if (scope.data[key].val > valueMax) {
                                valueMax = scope.data[key].val;
                            }
                        }
                    }

                    var first = scope.data[0];
                    var dataLength = scope.data.length;
                    var last = scope.data[dataLength - 1];
                    var dateInitial = first.date;
                    var dateEnd = last.date;
                    var dateRange = dateEnd - dateInitial;
                    var valueRange = valueMax - valueMin;
                    var stepX = width / dateRange;
                    var stepY = height * 0.9 / valueRange;
                    var points = "";

                    for (key in scope.data) {
                        if (scope.data.hasOwnProperty(key)) {
                            var d = scope.data[key];
                            var x = (d.date - dateInitial) * stepX;
                            var y = height - (d.val - valueMin) * stepY;
                            points = points + x + "," + y + " ";
                        }
                    }

                    svgElement.innerHTML = '<polyline points="' + points + '" style="fill:none;stroke:black;stroke-width:3"/>';
                }
            }
        };
    }]);
})(angular);
(function (angular) {
    var app = angular.module("app");
    app.service("SensorDataService", ["restUrlPrefix", "$http", function (restUrlPrefix, $http) {
        return {
            getSensorData: function () {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'values.php'
                });
            }
        };
    }]);
})(angular);

(function (angular) {
    var app = angular.module("app");
    app.service("UserService", ["restUrlPrefix", "$http", function (restUrlPrefix, $http) {
        return {
            register: function (user) {
                return $http({
                    method: 'POST',
                    url: restUrlPrefix + 'register.php',
                    data: user
                });
            },
            login: function (user) {
                return $http({
                    method: 'POST',
                    url: restUrlPrefix + 'login.php',
                    data: user
                });
            },
            currentUser: function (user) {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'login.php'
                });
            }
        };
    }]);
})(angular);