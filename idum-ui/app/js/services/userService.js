
(function (angular) {
    var app = angular.module("app");
    app.service("UserService", function (restUrlPrefix, $http) {
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
            },
            logout: function () {
                return $http({
                    method: 'GET',
                    url: restUrlPrefix + 'logout.php'
                });
            }
        };
    });
})(angular);
