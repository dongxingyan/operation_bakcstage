/**
 * Created by Slane on 2016/11/18.
 */

var serv = module.exports = {};
serv.name = 'areas.main.charge-account-service';
serv.model = Date.now() + Math.random() + 'Service'

function WorkAccount(accountId, name, meetingRoomNum, organname, chargingType, remainTime) {
    this.accountId = accountId;
    this.name = name;
    this.meetingRoomNum = meetingRoomNum;
    this.organname = organname;
    this.chargingType = chargingType;
    this.remianTime = remainTime;
}

angular
    .module(serv.name, [])
    .factory(serv.model, [
        'Global',
        '$http',
        function (Global, $http) {
            var hostpath = Global.hostpath;
            var token = Global.token;
            return {
                dataList: {},
                getList: function (options, apiName ,callback) {
                    var api;
                    if(apiName == 'getAccountList'){
                        api = '/cloudpServer/v1/charging/getAccountList'
                    }else{
                        api = '/cloudpServer/v1/charging/getSearchAccount'
                    }
                    var that = this;
                    //POST SUCCEED
                    // dataList = res.list;
                    options.token = token;
                    // var url = 'https://angularjs.org/greet.php?callback=JSON_CALLBACK';
                    //
                    // var params = {
                    //     name: 'Slane'
                    // }

                    $http({
                        method: 'get',
                        url: hostpath+api,
                        params: options
                    })
                        .then(function (res) {
                            that.dataList.data = res.data.data.resultList;
                            that.dataList.count = res.data.data.totalSize;
                            console.log(res);

                            callback();
                        }, function (rej) {
                            console.log(rej);
                        })
                    // $http({
                    //     method: 'jsonp',
                    //     url: url,
                    //     params: params
                    // })
                    //     .then(function (res) {
                    //         console.log(res.data);
                    //     }, function (rej) {
                    //         console.log(rej);
                    //     })

                    /*var time = new Date().getTime();
                    var data = [
                        new WorkAccount(new Date().getTime(), '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount(new Date().getTime(), '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        new WorkAccount('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                        {
                            accountId: time,
                            name: time,
                            meetingRoomNum: time,
                            organname: time,
                            chargingType: time,
                            remianTime: time,
                        }
                    ];
                    this.dataList.count = new Date().getTime().toString().slice(11);
                    this.dataList.data = data;*/
                }
            }
        }
    ]);