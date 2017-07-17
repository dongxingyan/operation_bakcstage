/**
 * Created by Slane on 2016/11/22.
 */
var serv = require('./account-details.serv');

var accountDetails = module.exports = {};

accountDetails.name = 'areas.main.account-details';
accountDetails.ctrlName = '_' + Date.now() + Math.random() + 'Controller';
angular.module(accountDetails.name, [
    serv.name
])
.filter('detailsDurationFilter', function () {
        return function (detailsDuration) {
            if (detailsDuration || detailsDuration === 0) {
                if(detailsDuration<=0){
                    return parseInt(detailsDuration/60)+'分钟'
                }else if(detailsDuration<60){
                    return parseInt(detailsDuration)+'秒';
                }else{
                    return parseInt(detailsDuration/60)+'分钟';
                }
            }
        }
    })
.filter('formatTimeFilter', function () {
    return function (UTCTime) {
        // 获取当前时区差值
        var timeOffset = new Date().getTimezoneOffset() * 60000;
        // 得到接口返回的时间戳
        var timeStamp = new Date(UTCTime).getTime();
        // 二者做差 得到本地时间
        var localTime = timeStamp - timeOffset;
        // 把计算完的时间戳转换成标准时间
        var formatTimeString = new Date(localTime);

        // 先把时间字符串转换称日期格式
        var year = formatTimeString.getFullYear() + '';
        var month = (formatTimeString.getMonth() + 1) + '';
        var date = formatTimeString.getDate() + '';
        var hours = formatTimeString.getHours() + '';
        var minutes = formatTimeString.getMinutes() + '';
        var seconds = formatTimeString.getSeconds() + '';

        // 格式化每个日期节点的个数
        if (month.length === 1) month = '0' + month;
        if (date.length === 1) date = '0' + date;
        if (hours.length === 1) hours = '0' + hours;
        if (minutes.length === 1) minutes = '0' + minutes;
        if (seconds.length === 1) seconds = '0' + seconds;

        // 拼接称最终返回的时间
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    }
})
.filter('chargingTypeFilter', function () {
        //计费类型转换过滤器
        return function (chargingType) {
            if (chargingType) {
                //计费类型转换
                switch (chargingType) {
                    case "1":
                        chargingType = '计时';
                        break;
                    case "2":
                        chargingType = '包月';
                        break;
                    case "3":
                        chargingType = '包年';
                        break;
                    case "4":
                        chargingType = '按需';
                        break;
                }
                return chargingType;
            }
        }
    })
    .controller(accountDetails.ctrlName, [
        '$scope',
        '$stateParams',
        serv.model,


        function ($scope, $stateParams, model) {

            var data = $scope.data = {};
            var actions = $scope.actions = {};
            // :page/meetingRoomNum/:organname
            // 获取列表页面传参
            data.params = $stateParams;
            // start:第几页
            // size:每页数据条数
            // accountId:计费账号

            //初始化数据请求
            model.getList({start:1,size:10,accountId:data.params.accountId}, function () {
                console.log(model);
                $scope.data['list'] = model.dataList.data;
                 //分页组件
                data.pager = {
                    totalItems: model.dataList.count,
                    currentPage: 1,
                    maxSize: 5,
                    pageChanged: function () {
                        //请求
                        model.getList({start:$scope.pager.currentPage,size:10,accountId:data.params.accountId}, function () {
                            $scope.data['list'] = model.dataList.data;
                            $scope.pager.totalItems = model.dataList.count;
                        })
                    }
                }
                $scope.pager = data.pager;

            });

           
        }])