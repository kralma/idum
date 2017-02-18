(function (angular) {
    angular.module('app')
        .directive('notificationDialog', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {shown: '='},
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