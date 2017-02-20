(function (angular) {
    angular.module("app").controller("UserCtrl", function ($rootScope, $scope, UserService, DialogService) {
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
                } else
                    DialogService.sendNegativeNotification("LOGIN_FAILED");
            });
        };

        $scope.register = function () {
            UserService.register($scope.user).then(function (response) {
                console.log(response.data);
            });
        };
    });
})(angular);
