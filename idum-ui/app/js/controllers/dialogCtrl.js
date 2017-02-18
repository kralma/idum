(function (angular) {
    angular.module("app")
        .controller("DialogsCtrl", function ($scope, $rootScope, DialogService) {

            $rootScope.$on("newFlashNotification", function () {
                $scope.flashNotifications = DialogService.flashNotifications;
            });

            $rootScope.$on("newDialog", function () {
                $scope.dialogs = DialogService.dialogs;
            });

        });
})(angular);