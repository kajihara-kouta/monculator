function planBtnFunc() {
    var reqJson = {};
    reqJson['userid'] = 'hogehoge';
    reqJson['planname'] = '山登りその3';
    reqJson['parties'] = {partyid:['fugafuga', 'barabar']};
    reqJson['fromdate'] = '2016-11-02';
    reqJson['todate'] = '2016-11-03';
    reqJson['mountain'] = 'tsubakurodake';
    reqJson['route'] = 'tsubakurodake-hard';
    var tempEquipments = [];
    tempEquipments.push({name:'ピッケル', quantity:2});
    tempEquipments.push({name:'その他装備', quantity:2});
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

