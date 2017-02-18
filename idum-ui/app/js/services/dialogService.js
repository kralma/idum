(function (angular) {
    angular.module("app")
        .service("DialogService", function ($rootScope) {
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
                return addFlashNotification({title: title, type: 'positive'}, timeout);
            }

            function sendNegativeNotification(title, timeout) {
                return addFlashNotification({title: title, type: 'negative'}, timeout);
            }

            function sendNeutralNotification(title, timeout) {
                return addFlashNotification({title: title, type: 'neutral'}, timeout);
            }

            function sendInfoNotification(title, timeout) {
                return addFlashNotification({title: title, type: 'primary'}, timeout);
            }

            function createLoadingDialog(title) {
                var dialog = {title: title, spinner: true};
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
        });
})(angular);