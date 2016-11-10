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

//親コントローラー
app.controller('topCtrl', function($scope, $http, $state) {
    $scope.menu = {
        userinfo: 1,
        mountainstatus: 2
    };
    $scope.currentMenu = $scope.menu.mountainstatus;
    var vm = {};
    vm['paneltitle'] = 'ダッシュボード';
    $scope.vm = vm;
    $scope.changeMenu = function(id) {
        this.currentMenu = id;
    };
});

//登山計画書一覧コントローラー
app.controller('planCtrl', function($scope, $http, $state, $uibModal) {
    $scope.$parent.vm.paneltitle = '登山計画書一覧';
    $scope.plans = [];
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
            //人数
            var count = data[i].parties.length + 1;
            data[i]['partyCount'] = count;
            //日付処理
            var tmpfromdate = data[i].fromdate.substring(0,10);
            data[i].fromdate = tmpfromdate;
            var tmptodate = data[i].todate.substring(0,10);
            data[i].todate = tmptodate;
            //ステータス情報
            var planstatus = data[i].planstatus;
            if (planstatus.length != 0) {
                var status = planstatus[0].status;
                if (status == 'Entering') {
                    data[i].status = '入山';
                } else if(status == 'Descending') {
                    data[i].status = '下山';
                } else {
                    data[i].status = '−';
                }
            }
        }
        $scope.plans = data;
    });

    $scope.limit= 8;
    $scope.begin = 0;
    $scope.itemsPerPage = 8;
    $scope.page = function(page) {
        $scope.begin = (page - 1) * $scope.limit;
    }
    $scope.range = function() {
        $scope.maxPage = Math.ceil($scope.plans.length/$scope.itemsPerPage);
        var ret = [];
        for (var i = 1; i <= $scope.maxPage; i++) {
            ret.push(i);
        }
        return ret;
    }
    $scope.showModal = function(index) {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/planmodal.html',
            controller: 'planModalCtrl',
            scope: $scope,
            resolve: {
                params: function() {
                    return {
                        fromdate: $scope.plans[index].fromdate,
                        todate: $scope.plans[index].todate,
                        mountainid: $scope.plans[index].mountain,
                        user: $scope.plans[index].userid,
                        parties:$scope.plans[index].parties,
                        equipments: $scope.plans[index].equipments,
                        foods: $scope.plans[index].foods,
                        planstatus: $scope.plans[index].planstatus
                    }
                }
            }
        });
    }
});

//登山計画書詳細モーダルコントローラー
app.controller('planModalCtrl', function($scope, $http, $uibModalInstance, params) {
    console.log(params.parties);
    //装備
    $scope.equipments = params.equipments;
    //食料
    $scope.foods = params.foods;
    //入山日、下山日
    $scope.fromdate = params.fromdate;
    $scope.todate = params.todate;
    //ステータス情報
    var planstatus = params.planstatus;
    for (i in planstatus) {
        var status = planstatus[i].status;
        if (status == 'Entering') {
            planstatus[i].status = '入山';
        } else if(status == 'Descending') {
            planstatus[i].status = '下山';
        } else {
            planstatus[i].status = '−';
        }
    }
    if (planstatus.length != 0) {
        $scope.mainplanstatus = planstatus[0];
        console.log('hogehoge');
        console.log(planstatus[0]);
    }
    //閉じるボタン
    $scope.closeBtn = function() {
        $uibModalInstance.close('done');
    }
    //山の名称取得
    $http({
        method: 'GET',
        url: '/apis/mountain/get/byid/' + params.mountainid
    }).success(function(data, status, headers, config) {
        $scope.mountainname = data.mountainName;
    });
    //代表者ユーザーID
    var userid = params.user;
    //代表者情報取得
    $http({
        method: 'GET',
        url: '/apis/users/get/' + userid,

    }).success(function(data, status, headers, config) {
        $scope.username = data.name;
    });
    //パーティ情報取得
    $http({
        method: 'POST',
        url: '/apis/users/get/specifyusers',
        headers: {'Content-Type': 'application/json'},
        data: {parties : params.parties}
    }).success(function(data, status, headers, config) {
        console.log(data);
        var setdata = '';
        for (i in data) {
            var partyname = data[i].name;
            setdata = setdata + partyname + ',';
        }
        $scope.partiesname = setdata.substr(0, setdata.length - 1);
    });
})

//ユーザー情報一覧コントローラー
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
    $scope.limit= 8;
    $scope.begin = 0;
    $scope.itemsPerPage = 8;
    $scope.page = function(page) {
        $scope.begin = (page - 1) * $scope.limit;
    }
    $scope.range = function() {
        $scope.maxPage = Math.ceil($scope.users.length/$scope.itemsPerPage);
        var ret = [];
        for (var i = 1; i <= $scope.maxPage; i++) {
            ret.push(i);
        }
        return ret;
    }
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
//ユーザー情報詳細コントローラー
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
