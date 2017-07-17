/**
 * Created by Slane on 2016/11/18.
 */

var serv = module.exports = {};
serv.name = 'areas.main.charge-combo-service';
serv.model = Date.now() + Math.random() + 'Service'

angular
    .module(serv.name, [])
    .factory(serv.model, [
        '$q',
        '$http',
        '$timeout',
        'Global',
        function ($q, $http, $timeout,Global) {
            var hostpath = Global.hostpath;
            var token = Global.token;
            return {
                //数据储存对象
                dataList: {},
                getDropDownList:function(callback){
                    var options = {};
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'/cloudpServer/v1/charging/getDropDownList',
                        params: options
                    })
                        .then(function (res) {
                            console.log(res);
                            callback(res);
                        }, function (rej) {
                            console.log(rej);
                        })
                },
                getList: function (options, callback) {
                    // 请求套餐列表操作

                    //POST SUCCEED
                    // dataList = res.list;
                    var that = this;
                    options.token = token;
                    //获取下来列表
                    $http({
                        method: 'get',
                        url: hostpath+'/cloudpServer/v1/charging/getPackageList',
                        params: options
                    })
                        .then(function (res) {
                            that.dataList.data = res.data.data.resultList;
                            that.dataList.count = res.data.data.totalSize;
                            callback();
                        }, function (rej) {
                            console.log(rej);
                        })
                    return callback();
                },
                addCombo: function (options, callback) {
                    // 新增套餐操作
                        var that = this;
                        options.price = options.price*100;
                        options.duration = options.duration*60;
                        $http({
                            method: 'POST',
                            url: hostpath+'/cloudpServer/v1/charging/addPackage?token='+token,
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
                editCombo: function (index, item, callback) {
                    //编辑套餐操作
                    var that = this;
                    var options = {};
                    options = item;
                    var optionsSend = angular.merge({},options);
                    optionsSend.price = options.price*100;
                    optionsSend.duration = optionsSend.duration*60;
                    $http({
                        method: 'put',
                        url: hostpath+'/cloudpServer/v1/charging/updatePackage?token='+token,
                        data: optionsSend
                    })
                        .then(function (res) {
                            that.dataList.data.splice(index, 1, item);

                            callback();
                        }, function (rej) {
                            console.log(rej);
                        })
                   
                },
                deleteCombo: function (index, item , callback) {

                    var options = item;
                    options.token = token;
                    $http({
                        method: 'delete',
                        url: hostpath+'/cloudpServer/v1/charging/delPackage',
                        params: options
                    })
                        .then(function (res) {

                            callback();

                        }, function (rej) {
                            console.log(rej);
                        })
                }
            }
        }
    ]);