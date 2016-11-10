function planBtnFunc() {
    var reqJson = {};
    reqJson['userid'] = 'bar';
    reqJson['planname'] = '山登りその10';
    reqJson['parties'] = {partyid:[]};
    reqJson['fromdate'] = '2016-11-10 06:00:00';
    reqJson['todate'] = '2016-11-10 12:00:00';
    reqJson['mountain'] = '80';
    reqJson['route'] = 'tsubakurodake-hard';
    var tempEquipments = [];
    tempEquipments.push({name:'ピッケル', quantity:2});
    tempEquipments.push({name:'寝袋', quantity:2});
    reqJson['equipments'] = tempEquipments;
    var tempfoods = [];
    tempfoods.push({foodtype:'morning', quantity:2});
    tempfoods.push({foodtype:'lunch', quantity:2});
    reqJson['foods'] = tempfoods;
    reqJson['remark'] = 'とくになし';
    reqJson['drink'] = 3;

    $.ajax({
        type:'POST',
        url:'apis/plan/insert',
        data: reqJson,
        success: function(data) {
        console.log(data);
        }});
};

