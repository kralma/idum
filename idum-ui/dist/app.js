(function (angular) {
    angular.module("app", ['ngRoute', 'textAngular', 'pascalprecht.translate', 'ngCookies', 'ui.bootstrap', 'ngFileUpload']);
})(angular);
(function (angular) {
    var app = angular.module("app");
    app.constant("restUrlPrefix", "api/");
})(angular);
(function (angular) {
    angular.module('app').config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
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
    }]);
})(angular);
(function (angular) {
    angular.module("app").controller("DialogsCtrl", ["$scope", "$rootScope", "DialogService", function ($scope, $rootScope, DialogService) {

        $rootScope.$on("newFlashNotification", function () {
            $scope.flashNotifications = DialogService.flashNotifications;
        });

        $rootScope.$on("newDialog", function () {
            $scope.dialogs = DialogService.dialogs;
        });
    }]);
})(angular);
(function (angular) {
    angular.module("app").controller("HeaderCtrl", ["$rootScope", "$scope", "$location", "$filter", function ($rootScope, $scope, $location, $filter) {

        $scope.$on('$routeChangeStart', function (scope, next, current) {});
    }]);
})(angular);
(function (angular) {
    angular.module("app").controller("ProjectsListCtrl", ["$scope", "ProjectService", "DialogService", "$location", function ($scope, ProjectService, DialogService, $location) {
        ProjectService.getProjects().then(function (response) {
            $scope.projects = response.data;
        });
    }]);

    angular.module("app").controller("NewProjectCtrl", ["$scope", "ProjectService", "DialogService", "$location", function ($scope, ProjectService, DialogService, $location) {
        $scope.createProject = function () {
            ProjectService.createProject($scope.project).then(function (response) {
                DialogService.sendPositiveNotification("Projekt byl úspěšně vytvořen");
                $location.path('projects/' + response.data.projectId);
            });
        };
    }]);

    angular.module("app").controller("ProjectCtrl", ["$scope", "ProjectService", "DialogService", "SensorDataService", "$routeParams", function ($scope, ProjectService, DialogService, SensorDataService, $routeParams) {
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
    }]);
})(angular);
(function (angular) {
    angular.module("app").controller("SensorDataCtrl", ["$scope", "SensorDataService", function ($scope, SensorDataService) {
        SensorDataService.getSensorData().then(function (response) {
            $scope.data = response.data;
        });
    }]);
})(angular);
(function (angular) {
    angular.module("app").controller("UserCtrl", ["$rootScope", "$scope", "UserService", "DialogService", function ($rootScope, $scope, UserService, DialogService) {
        UserService.currentUser().then(function (response) {
            $rootScope.loggedUser = response.data;
        });

        $scope.login = function () {
            console.log($scope.user);
            UserService.login($scope.user).then(function (response) {
                var data = response.data;
                if (data) {
                    DialogService.sendPositiveNotification("LOGIN_OK");
                    $rootScope.loggedUser = data;
                } else DialogService.sendNegativeNotification("LOGIN_FAILED");
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
            scope: { data: '=' },
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

                    var valueMin = scope.data[0].value;
                    var valueMax = scope.data[0].value;
                    for (var key in scope.data) {
                        if (scope.data.hasOwnProperty(key)) {
                            if (scope.data[key].value < valueMin) {
                                valueMin = scope.data[key].value;
                            } else if (scope.data[key].value > valueMax) {
                                valueMax = scope.data[key].value;
                            }
                        }
                    }

                    var first = scope.data[0];
                    var dataLength = scope.data.length;
                    var last = scope.data[dataLength - 1];
                    var dateInitial = first.dateInsert;
                    var dateEnd = last.dateInsert;
                    var dateRange = dateEnd - dateInitial;
                    var valueRange = valueMax - valueMin;
                    var stepX = width / dateRange;
                    var stepY = height * 0.9 / valueRange;
                    var points = "";

                    for (key in scope.data) {
                        if (scope.data.hasOwnProperty(key)) {
                            var d = scope.data[key];
                            var x = (d.dateInsert - dateInitial) * stepX;
                            var y = height - (d.value - valueMin) * stepY;
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
    angular.module('app').directive('modalDialog', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: { shown: '=', action: '=?', negativeAction: '=?', btns: '=?', outputObject: '=?' },
            templateUrl: 'idum-ui/app/js/directives/templates/modal-dialog.tmpl.html',
            link: function (scope, elem, attrs) {
                scope.dialogTexts = {};
                scope.dialogTexts.title = attrs.title;
                scope.dialogTexts.content = attrs.content;

                if (attrs.spinner) {
                    scope.spinner = true;
                    scope.preventClose = true;
                }

                if (!scope.btns && attrs.positiveLabel) {
                    scope.positiveBtn = {
                        label: attrs.positiveLabel,
                        class: attrs.positiveClass ? attrs.positiveClass : "positive"
                    };
                    if (attrs.negativeLabel) {
                        scope.negativeBtn = {
                            label: attrs.negativeLabel,
                            class: attrs.negativeClass ? attrs.negativeClass : "neutral"
                        };
                        scope.btns = [scope.negativeBtn, scope.positiveBtn];
                    } else {
                        scope.btns = [scope.positiveBtn];
                    }
                }

                if (!scope.preventClose) {
                    document.addEventListener('keydown', function (event) {
                        if (event.keyCode === 27) {
                            scope.shown = false;
                            scope.$apply();
                        }
                    });
                }

                scope.close = function () {
                    if (scope.preventClose) {
                        return;
                    }
                    scope.shown = false;
                };

                scope.$watch('action', function () {
                    var positiveBtn = scope.positiveBtn;
                    if (!positiveBtn) {
                        return;
                    }
                    positiveBtn.action = function () {
                        scope.shown = false;
                        if (scope.action) {
                            scope.action();
                        }
                    };
                });

                scope.$watch('negativeAction', function () {
                    var negativeBtn = scope.negativeBtn;
                    if (!negativeBtn) {
                        return;
                    }
                    negativeBtn.action = function () {
                        scope.shown = false;
                        if (scope.negativeAction) {
                            scope.negativeAction();
                        }
                    };
                });
            }
        };
    });
})(angular);
(function (angular) {
    angular.module('app').directive('notificationDialog', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: { shown: '=' },
            templateUrl: 'idum-ui/app/js/directives/templates/notification-dialog.tmpl.html',
            link: function (scope, elem, attrs) {
                scope.title = attrs.title;

                if (!scope.preventClose) {
                    document.addEventListener('keydown', function (event) {
                        if (event.keyCode === 27) {
                            scope.shown = false;
                            scope.$apply();
                        }
                    });
                }

                scope.close = function () {
                    if (scope.preventClose) {
                        return;
                    }
                    scope.shown = false;
                };
            }
        };
    });
})(angular);
(function (angular) {
    angular.module("app").service("DialogService", ["$rootScope", function ($rootScope) {
        var dialogs = [];
        var flashNotifications = [];

        function addFlashNotification(flashNotification, timeout) {
            if (!timeout) {
                timeout = 10000;
            }
            flashNotifications.forEach(function (flashNotification) {
                flashNotification.shown = false;
            });
            flashNotification.shown = true;

            setTimeout(function () {
                flashNotification.shown = false;
                $rootScope.$apply();
            }, timeout);

            flashNotifications.push(flashNotification);
            $rootScope.$broadcast("newFlashNotification");

            return flashNotification;
        }

        function createDialog(dialog) {
            dialogs.forEach(function (dialog) {
                dialog.shown = false;
            });

            dialog.shown = true;
            dialogs.push(dialog);

            $rootScope.$broadcast("newDialog");

            return dialog;
        }

        function sendPositiveNotification(title, timeout) {
            return addFlashNotification({ title: title, type: 'positive' }, timeout);
        }

        function sendNegativeNotification(title, timeout) {
            return addFlashNotification({ title: title, type: 'negative' }, timeout);
        }

        function sendNeutralNotification(title, timeout) {
            return addFlashNotification({ title: title, type: 'neutral' }, timeout);
        }

        function sendInfoNotification(title, timeout) {
            return addFlashNotification({ title: title, type: 'primary' }, timeout);
        }

        function createLoadingDialog(title) {
            var dialog = { title: title, spinner: true };
            return createDialog(dialog);
        }

        function createConfirmDialog(title, content, action, positiveLabel, negativeLabel, positiveClass, negativeClass) {
            var dialog = {
                title: title,
                content: content,
                action: action,
                positiveLabel: positiveLabel,
                negativeLabel: negativeLabel,
                positiveClass: positiveClass,
                negativeClass: negativeClass
            };
            return createDialog(dialog);
        }

        function createDecisionDialog(title, content, positiveAction, negativeAction, positiveLabel, negativeLabel, positiveClass, negativeClass) {
            var dialog = {
                title: title,
                content: content,
                action: positiveAction,
                negativeAction: negativeAction,
                positiveLabel: positiveLabel,
                negativeLabel: negativeLabel,
                positiveClass: positiveClass,
                negativeClass: negativeClass
            };
            return createDialog(dialog);
        }

        return {
            sendPositiveNotification: sendPositiveNotification,
            sendNeutralNotification: sendNeutralNotification,
            sendNegativeNotification: sendNegativeNotification,
            sendInfoNotification: sendInfoNotification,
            createLoadingDialog: createLoadingDialog,
            createConfirmDialog: createConfirmDialog,
            createDecisionDialog: createDecisionDialog,
            flashNotifications: flashNotifications,
            dialogs: dialogs
        };
    }]);
})(angular);
(function (angular) {
    var app = angular.module("app");
    app.service("ProjectService", ["restUrlPrefix", "$http", function (restUrlPrefix, $http) {
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
    }]);
})(angular);
(function (angular) {
    var app = angular.module("app");
    app.service("SensorDataService", ["restUrlPrefix", "$http", function (restUrlPrefix, $http) {
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
    }]);
})(angular);
(function (angular) {
    var app = angular.module("app");
    app.service("SensorService", ["restUrlPrefix", "$http", function (restUrlPrefix, $http) {
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
            currentUser: function () {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'login.php'
                });
            }
        };
    }]);
})(angular);
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("idum/login.tmpl.html","<form class=\"login\" data-ng-submit=\"login()\">\n    <input type=\"text\" required data-ng-model=\"user.username\">\n\n    <input type=\"password\" required data-ng-model=\"user.password\">\n\n    <button type=\"submit\">\n        Log in\n    </button>\n</form>\n");
$templateCache.put("idum/new-project.tmpl.html","<h1>\r\n    Nový projekt\r\n</h1>\r\n<form data-ng-submit=\"createProject()\">\r\n    <div class=\"form-group\">\r\n        <label for=\"projectName\">\r\n            Název projektu\r\n        </label>\r\n        <input type=\"text\" id=\"projectName\" data-ng-model=\"project.projectName\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"projectDescription\">\r\n            Popis projektu\r\n        </label>\r\n        <textarea id=\"projectDescription\" rows=\"5\" data-ng-model=\"project.projectDescription\">\r\n        </textarea>\r\n    </div>\r\n    <div class=\"btns-bottom\">\r\n        <button type=\"submit\" class=\"btn positive large pull-right ico tick\">\r\n            Vytvořit\r\n        </button>\r\n    </div>\r\n</form>\r\n");
$templateCache.put("idum/project-detail.tmpl.html","<h1>\r\n    {{project.projectName}}\r\n</h1>\r\n<p>\r\n    {{project.projectDescription}}\r\n</p>\r\n<h2>\r\n    Senzory\r\n</h2>\r\n<ul>\r\n    <li data-ng-repeat=\"client in project.clients\">\r\n        <h3>{{client.clientName}}</h3>\r\n        <code>{{client.clientKey}}</code>\r\n        <ul>\r\n            <li data-ng-repeat=\"sensor in client.sensors\">\r\n                {{sensor.sensorName}} - {{sensor.lastValue.value ? sensor.lastValue.value : \"Neznámá hodnota\"}}\r\n                <a data-ng-click=\"getExtendedData(sensor)\">\r\n                    Podrobnosti\r\n                </a>\r\n                <div data-ng-show=\"sensor.showExtended\">\r\n                    <graph style=\"width: 100%;\" data=\"sensor.allValues\">\r\n                    </graph>\r\n                </div>\r\n            </li>\r\n        </ul>\r\n    </li>\r\n</ul>");
$templateCache.put("idum/projects.tmpl.html","<ul class=\"preview-list\">\r\n    <li data-ng-repeat=\"project in projects\">\r\n        <a data-ng-href=\"projects/{{project.projectId}}\">\r\n            {{project.projectName}}\r\n        </a>\r\n    </li>\r\n</ul>\r\n\r\n<a data-ng-href=\"new-project\">\r\n    Nový projekt\r\n</a>");
$templateCache.put("idum/register.tmpl.html","<form class=\"register\" data-ng-controller=\"UserCtrl\" data-ng-submit=\"register()\">\r\n    <h1>\r\n        Registrace nového uživatele\r\n    </h1>\r\n    <div class=\"form-group\">\r\n        <label for=\"name\">\r\n            Jméno\r\n        </label>\r\n        <input name=\"name\" id=\"name\" type=\"text\" required data-ng-model=\"user.name\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"username\">\r\n            Uživatelské jméno\r\n        </label>\r\n        <input name=\"username\" id=\"username\" type=\"text\" required data-ng-model=\"user.username\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"email\">\r\n            Email\r\n        </label>\r\n        <input name=\"email\" id=\"email\" type=\"email\" required data-ng-model=\"user.email\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"password\">\r\n            Heslo\r\n        </label>\r\n        <input name=\"password\" id=\"password\" type=\"password\" required data-ng-model=\"user.password\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <label for=\"passwordAgain\">\r\n            Heslo znovu\r\n        </label>\r\n        <input name=\"passwordAgain\" id=\"passwordAgain\" type=\"password\" required data-ng-model=\"passwordAgain\">\r\n    </div>\r\n    <div class=\"btns-bottom\">\r\n        <button type=\"submit\" class=\"btn positive ico tick large pull-right\">\r\n            Registrovat\r\n        </button>\r\n    </div>\r\n</form>");
$templateCache.put("idum/sensor.tmpl.html","<div data-ng-controller=\"SensorDataCtrl\">\r\n    <graph data=\"data\" style=\"width: 100%\"></graph>\r\n</div>");}]);