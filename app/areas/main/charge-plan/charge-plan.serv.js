/**
 * Created by Slane on 2016/11/18.
 */

var serv = module.exports = {};
serv.name = 'areas.main.charge-plan-service';
serv.model = Date.now() + Math.random() + 'Service'

function WorkOrganizationAccount(id, name, chargingType, chargingAccountType, unitPrice, frreTime) {


    this.id = id;
    this.name = name;
    this.chargingType = chargingType;
    this.chargingAccountType = chargingAccountType;
    this.unitPrice = unitPrice;
    this.frreTime = frreTime;
}

angular
    .module(serv.name, [])
    .factory(serv.model, [
        'Global','$http',
        function (Global , $http) {
            
            var hostpath = Global.hostpath;
            var token = Global.token;
            return {
                //数据储存对象
                dataList: {},
                // getDropDownList:function(callback){
                //     var options = {};
                //     options.token = token;
                //     $http({
                //         method: 'get',
                //         url: hostpath+'/cloudpServer/v1/charging/getDropDownList',
                //         params: options
                //     })
                //         .then(function (res) {
                //             callback(res);
                //         }, function (rej) {
                //             console.log(rej);
                //         })
                // },
                getList: function (options, callback) {
                    // 请求方案列表操作
                    //POST SUCCEED
                    // dataList = res.list;
                   var that = this;
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'/cloudpServer/v1/charging/getSchemeList',
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
                    return callback();
                },
                addPlan: function (options, callback) {
                     // 新增套餐操作
                    var that = this;
                    var freeTimeDay = options.freeTime*60*60*24;
                    var freeTimeMin = options.freeTime*60;
                    //价格变成分传输
                    options.unitPrice = options.unitPrice*100;
                    //时间变成秒传输
                    if(options.chargingType == 2 || options.chargingType == 3){
                        options.freeTime = freeTimeDay;
                    }else if(options.chargingType == 1){
                        options.freeTime = freeTimeMin;
                    }else{
                        options.freeTime = 0;
                    }
                    $http({
                        method: 'POST',
                        url: hostpath+'/cloudpServer/v1/charging/addScheme?token='+token,
                        data: options

                    })
                        .then(function (res) {
                            // that.dataList.data = res.data.data.resultList;
                            // that.dataList.count = res.data.data.totalSize;
                            // this.dataList.data.unshift(options);
                            callback();
                        }, function (rej) {
                            console.log(rej);
                        })
                },
                editPlan: function (index, item, callback) {
                    //编辑套餐操作
                    var options = {};
                    options = item;
                    var optionsSend = angular.merge({},options);
                    var freeTimeDay = optionsSend.freeTime*60*60*24;
                    var freeTimeMin = optionsSend.freeTime*60;
                    //价格变成分传输
                    optionsSend.unitPrice = options.unitPrice*100;
                    //时间变成秒传输
                    if(optionsSend.chargingType == 2 || optionsSend.chargingType == 3){
                        optionsSend.freeTime = freeTimeDay;
                    }else if(optionsSend.chargingType == 1){
                        optionsSend.freeTime = freeTimeMin;
                    }else{
                        optionsSend.freeTime = 0;
                    }
                    optionsSend.chargingAccountType = parseInt(optionsSend.chargingAccountType);

                    $http({
                        method: 'put',
                        url: hostpath+'/cloudpServer/v1/charging/updateScheme?token='+token,
                        data: optionsSend
                    })
                        .then(function (res) {
                            //this.dataList.data.splice(index, 1, item)
                            callback();
                        }, function (rej) {
                            console.log(rej);
                        })
                },
                deletePlan: function (item , callback) {
                    var options = {};
                    options.id = item.id;
                    options.token = token;
                    $http({
                        method: 'put',
                        url: hostpath+'/cloudpServer/v1/charging/delScheme',
                        params: options
                    })
                        .then(function (res) {
                            
                            callback();
                        }, function (rej) {
                            console.log(rej);
                        })


                }
            };
        }
    ]);