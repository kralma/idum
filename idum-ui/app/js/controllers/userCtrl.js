(function (angular) {
    angular.module("app").controller("UserCtrl", function ($rootScope, $scope, UserService, DialogService) {
        UserService.currentUser().then(function (response) {
            $rootScope.loggedUser = response.data;
        });

        $scope.login = function () {
            UserService.login($scope.user).then(function (response) {
                var data = response.data;
                if (data) {
                    DialogService.sendPositiveNotification("Přihlášení proběhlo v pořádku");
                    $rootScope.loggedUser = data;
                    $scope.detailsBoxShown = false;
                } else {
                    DialogService.sendNegativeNotification("Chybné přihlašovací údaje");
                }
            });
        };

        $scope.register = function () {
            UserService.register($scope.user).then(function (response) {
                console.log(response.data);
            });
        };

        $scope.logout = function () {
            UserService.logout().then(function (response) {
                $rootScope.loggedUser = response.data;
                DialogService.sendPositiveNotification("Odhlášení proběhlo v pořádku");
                $scope.detailsBoxShown = false;
            });
        }
    });
})(angular);
