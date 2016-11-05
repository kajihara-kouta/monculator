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

app.controller('planCtrl', function($scope, $http, $state) {
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

app.controller('userCtrl', function($scope, $http, $state, $uibModal) {
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
    $scope.showModal = function(index) {
        console.log(index);
        console.log($scope.users[index]);
        var modalInstance = $uibModal.open({
            templateUrl: 'views/usermodal.html',
            controller: 'userModalCtrl',
            scope:$scope,
            resolve: {
                params: function() {
                    return {
                        _id: $scope.users[index]._id,
                        userid: $scope.users[index].userid,
                        name: $scope.users[index].name,
                        postalcd: $scope.users[index].postalcd,
                        sex: $scope.users[index].sex,
                        birthymd: $scope.users[index].birthymd,
                        address: $scope.users[index].address,
                        tel: $scope.users[index].tel,
                        bloodtype: $scope.users[index].bloodtype,
                        rhtype: $scope.users[index].rhtype
                    }
                }
            }
        });
        modalInstance.result.then(
            function(result) {
                console.log(result);
//                $http({
//                    method::'GET',
//                    url:'/apis/users/get/'
//                })
            }
        );

    };
});

app.controller('userModalCtrl', function($scope, $http, $uibModalInstance, params) {

    $scope.userid = params.userid;
    $scope.name = params.name;
    $scope.postalcd = params.postalcd;
    $scope.sex = params.sex;
    //生年月日を表示用に修正
    var viewYmd = params.birthymd.substring(0,4) + '年' + params.birthymd.substring(4,6) + '月' + params.birthymd.substring(6,8) + '日';
    $scope.birthymd = viewYmd;
    $scope.address = params.address;
    $scope.tel = params.tel;
    $scope.bloodtype = params.bloodtype + '型';
    $scope.rhtype = (params.rhtype == 'Positive')? '+' : '-';
    $scope.closeBtn = function() {
        $uibModalInstance.close('done');
    }
    $http({
        method:'GET',
        url:'/apis/emergencyContact/get/' + params.userid,
    }).success(function(data, status, headers, config) {
        $scope.emergencyContact = data;
    });
});
