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

        $scope.$on('$routeChangeStart', function (scope, next, current) {
            $scope.menuVisible = false;
            reloadMenuItems();
        });

        $scope.menuItems = [{
            label: 'HOME',
            icon: 'home',
            url: 'home',
            expandable: false,
            shown: true
        }, {
            label: 'PROFILES',
            icon: 'profiles',
            expandable: true,
            shown: true,
            expanded: true,
            items: [{ label: 'MY_PROFILES', url: 'my-profiles', shown: false }, { label: 'INSTITUTES', url: 'institutes', shown: true }, { label: 'COMPANIES', url: 'companies', shown: true }]
        }, {
            label: 'PROJECTS',
            icon: 'search-assignment',
            expandable: true,
            shown: true,
            expanded: true,
            items: [{
                label: 'CREATE_FINISHED_PROJECT',
                url: 'create-finished-assignment',
                shown: true,
                hasRole: 'ADMIN, REFERENT, TEAM_SUPERVISOR'
            }, { label: 'FINISHED_PROJECTS', url: 'assignments/finished', shown: true }, { label: 'PUBLISHED_ARTICLES', url: 'articles', shown: true }]
        }, {
            label: 'MANAGEMENT',
            icon: 'settings',
            expandable: true,
            shown: true,
            expanded: true,
            items: [{ label: 'CREATE_TEAM', url: 'create-team', shown: true }, { label: 'CREATE_COMPANY', url: 'create-company', shown: true, hasRole: 'ADMIN, REFERENT' }, { label: 'CREATE_INSTITUTE', url: 'create-institute', shown: true, hasRole: 'ADMIN' }, { label: 'FAKE_LOGIN', url: 'fake-login', shown: true, hasRole: 'ADMIN' }]
        }];

        reloadMenuItems();

        function reloadMenuItems() {
            var currentPath = $location.path().slice(1);
            $scope.menuItems.forEach(function (item) {
                item.active = currentPath.indexOf(item.url) === 0;
                if (item.items != null) {
                    item.items.forEach(function (subitem) {
                        if (currentPath.indexOf(subitem.url) === 0) {
                            subitem.active = true;
                            item.active = false;
                        } else {
                            subitem.active = false;
                        }
                    });
                }
            });
        }

        //var menuItemElements = document.getElementsByClassName('expandable');
        //console.log(menuItemElements[0]);
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
        $scope.login = function () {
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

                    var valueMin = scope.data[0].val;
                    var valueMax = scope.data[0].val;
                    for (var key in scope.data) {
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
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("idum/login.tmpl.html","<form class=\"login\" data-ng-submit=\"login()\">\n    <input type=\"text\" required data-ng-model=\"user.username\">\n\n    <input type=\"password\" required data-ng-model=\"user.password\">\n\n    <button type=\"submit\">\n        Log in\n    </button>\n</form>\n");
$templateCache.put("idum/register.tmpl.html","<form class=\"register\" data-ng-controller=\"UserCtrl\" data-ng-submit=\"register()\">\r\n    <input type=\"text\" required data-ng-model=\"user.name\">\r\n    <input type=\"text\" required data-ng-model=\"user.username\">\r\n    <input type=\"email\" required data-ng-model=\"user.email\">\r\n    <input type=\"password\" required data-ng-model=\"user.password\">\r\n    <input type=\"password\" required data-ng-model=\"passwordAgain\">\r\n    <button type=\"submit\">\r\n        Sign in\r\n    </button>\r\n</form>");
$templateCache.put("idum/sensor.tmpl.html","<div data-ng-controller=\"SensorDataCtrl\">\r\n    <graph data=\"data\" style=\"width: 100%\"></graph>\r\n</div>");}]);