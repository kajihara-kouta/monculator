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

app.controller('topCtrl', function($scope, $http, $state) {
    var vm = {};
    vm['paneltitle'] = 'ダッシュボード';
    $scope.vm = vm;
});

app.controller('planCtrl', function($rootScope, $scope, $http, $state) {
    $scope.$parent.vm.paneltitle = '登山計画書一覧';
    $http({
        method: 'GET',
        url: '/apis/mountain/get',
    }).success(function (data, status, headers, config) {
        $scope.mountains = data;
    });
    $http({
        method: 'GET',
        url:'/apis/plan/get',
    }).success(function(data, status, headers, config){
        for (i in data) {
            var count = data[i].parties.length + 1;
            data[i]['partyCount'] = count;
            var tmpfromdate = data[i].fromdate.substring(0,10);
            data[i].fromdate = tmpfromdate;
            var tmptodate = data[i].todate.substring(0,10);
            data[i].todate = tmptodate;
        }

        $scope.plans = data;
    })
});

app.controller('userCtrl', function($scope, $http, $state) {
    $scope.$parent.vm.paneltitle = 'ユーザー情報一覧';
    $http({
        method:'GET',
        url:'/apis/users/get',
    }).success(function(data,status, headers, config) {
        for (i in data) {
            var sex = data[i].sex;
            var sexViewVal;
            if (sex == 'Male') {
                sexViewVal = '男性';
            } else if (sex == 'Female') {
                sexViewVal = '女性';
            } else {
                sexViewVal = '';
            }
            data[i]['sex'] = sexViewVal;
        }
        $scope.users = data;
    });
});
