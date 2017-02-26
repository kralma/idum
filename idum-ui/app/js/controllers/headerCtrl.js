(function (angular) {
    angular.module("app")
        .controller("HeaderCtrl", function ($rootScope, $scope, $location, $filter) {

            setContentMargin();
            window.onresize = function () {
                setContentMargin();
            };


            $scope.$on('$routeChangeStart', function (scope, next, current) {
            });

            function setContentMargin() {
                var header = angular.element(document.getElementById("mainHeader"));
                var headerHeight = header[0].clientHeight;
                document.getElementById("mainContent").style.marginTop = headerHeight + "px";
            }
        });
})(angular);