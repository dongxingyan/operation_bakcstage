/**
 * Created by Slane on 2016/11/22.
 */

var serv = module.exports = {};
serv.name = 'areas.main.account-details-service';
serv.model = Date.now() + Math.random() + 'Service'

function AccountDetails(meetingRoomNum, meetingName, startTime, endTime, count, duration) {
    this.meetingRoomNum = meetingRoomNum;
    this.meetingName = meetingName;
    this.startTime = startTime;
    this.endTime = endTime;
    this.count = count;
    this.duration = duration;
}

angular
    .module(serv.name, [])
    .factory(serv.model, [
        'Global','$http',
        function (Global,$http) {
            return {

                dataList:{},
                getList: function (options, callback) {
                    var that = this;
                    var hostpath = Global.hostpath;
                    var token = Global.token;
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'/cloudpServer/v1/charging/getAccountDetail',
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

                        // token:校验码
                        // start:第几页
                        // size:每页数据条数
                        // accountId:计费账号
                    //POST SUCCEED
                    // dataList = res.list;
                    // var time = new Date().getTime();
                    // var data = [
                    //     new AccountDetails(new Date().getTime(), '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails(new Date().getTime(), '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     new AccountDetails('100233', '会议室计费', '800012', '电信通', '时长', '4000分钟'),
                    //     {
                    //         meetingRoomNum: time,
                    //         meetingName: time,
                    //         startTime: time,
                    //         endTime: time,
                    //         count: time,
                    //         duration: time,
                    //     }
                    // ];
                    // this.dataList.count = new Date().getTime().toString().slice(11);
                    // this.dataList.data = data;
                    return callback();
                }
            }
        }
    ]);