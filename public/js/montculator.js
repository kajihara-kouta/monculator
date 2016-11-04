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
        $scope.plans = data;
    })
});
