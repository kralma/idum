(function (angular) {
    angular.module('app')
        .directive('modalDialog', function () {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {shown: '=', action: '=?', negativeAction: '=?', btns: '=?', outputObject: '=?'},
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
                            class: (attrs.positiveClass ? attrs.positiveClass : "positive")
                        };
                        if (attrs.negativeLabel) {
                            scope.negativeBtn = {
                                label: attrs.negativeLabel,
                                class: (attrs.negativeClass ? attrs.negativeClass : "neutral")
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