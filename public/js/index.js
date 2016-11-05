function planBtnFunc() {
    var reqJson = {};
    reqJson['userid'] = 'hoge';
    reqJson['planname'] = '山登りその4';
    reqJson['parties'] = {partyid:['fuga', 'bar']};
    reqJson['fromdate'] = '2016-11-03';
    reqJson['todate'] = '2016-11-04';
    reqJson['mountain'] = '1';
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

