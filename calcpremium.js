module.exports = {
    calcBasePremium: function (age, startYmd, endYmd, mountainId) {
        //日数計算
        var period = Math.floor((new Date(endYmd).getTime() - new Date(startYmd).getTime())/(1000 * 60 * 60 * 24));
        if (period <= 0) {  //負の数を考慮して
            period = 1;
        }
        //体力度、難易度
        var physicalLevel;
        var difficultLevel;
        if (mountainId == "1") {    //燕岳
            physicalLevel = 4;
            difficultLevel = 2; //B
        } else if (mountainId == "2") {  //槍ヶ岳
            physicalLevel = 8;
            difficultLevel = 3; //C
        } else {    //その他の山を考慮して(default値)
            physicalLevel = 5;
            difficultLevel = 2;
        }
        //日額基準保険料
        var basePremiumPerDay = 200;
        //基準値
        var baseline = 10;
        //基準年齢
        var baseAge = 30;
        //保険料
        var premium = basePremiumPerDay * (physicalLevel * difficultLevel)* (age / baseAge) * period / baseline;
        return premium;
    }
}
