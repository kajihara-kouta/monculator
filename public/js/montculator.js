var app = angular.module('montculatorApp',['ngRoute','ngResource', 'ui.bootstrap', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/plans');
    $stateProvider.state('users', {
        url:'/users',
        templateUrl: 'views/user.html'
    }).state('plans', {
        url:'/plans',
        templateUrl: 'views/plan.html'
    })
});

app.controller('planCtrl', function($scope, $http, $state) {
    $http({
        method: 'GET',
        url:'/apis/plan/get',
    }).success(function(data, status, headers, config){
        for (i in data) {
            var tmpfromdate = data[i].fromdate.substring(0,10);
            data[i].fromdate = tmpfromdate;
            var tmptodate = data[i].todate.substring(0,10);
            data[i].todate = tmptodate;
        }

        $scope.plans = data;
    })
});
