(function (angular) {
    angular.module("app")
        .controller("HeaderCtrl", function ($rootScope, $scope, $location, $filter) {

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
                items: [
                    {label: 'MY_PROFILES', url: 'my-profiles', shown: false},
                    {label: 'INSTITUTES', url: 'institutes', shown: true},
                    {label: 'COMPANIES', url: 'companies', shown: true}
                ]
            }, {
                label: 'PROJECTS',
                icon: 'search-assignment',
                expandable: true,
                shown: true,
                expanded: true,
                items: [
                    {
                        label: 'CREATE_FINISHED_PROJECT',
                        url: 'create-finished-assignment',
                        shown: true,
                        hasRole: 'ADMIN, REFERENT, TEAM_SUPERVISOR'
                    },
                    {label: 'FINISHED_PROJECTS', url: 'assignments/finished', shown: true},
                    {label: 'PUBLISHED_ARTICLES', url: 'articles', shown: true}
                ]
            }, {
                label: 'MANAGEMENT',
                icon: 'settings',
                expandable: true,
                shown: true,
                expanded: true,
                items: [
                    {label: 'CREATE_TEAM', url: 'create-team', shown: true},
                    {label: 'CREATE_COMPANY', url: 'create-company', shown: true, hasRole: 'ADMIN, REFERENT'},
                    {label: 'CREATE_INSTITUTE', url: 'create-institute', shown: true, hasRole: 'ADMIN'},
                    {label: 'FAKE_LOGIN', url: 'fake-login', shown: true, hasRole: 'ADMIN'}
                ]
            }];

            reloadMenuItems();

            function reloadMenuItems() {
                var currentPath = $location.path().slice(1);
                $scope.menuItems.forEach(function (item) {
                    item.active = (currentPath.indexOf(item.url) === 0);
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
        });
})(angular);