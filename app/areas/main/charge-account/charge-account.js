/**
 * Created by Slane on 2016/11/4.
 */
var serv = require('./charge-account.serv');

var chargeAccount = module.exports = {};

chargeAccount.name = 'areas.main.charge-account';
chargeAccount.ctrlName = '_' + Date.now() + Math.random() + 'Controller';
angular.module(chargeAccount.name, [
    serv.name
])
    .filter('durationFilter', function () {
        //计费类型转换过滤器
        return function (duration) {
            if (duration || duration === 0) {
                return Math.ceil(duration / 60) + '分钟'
            }
        }
    })
    .filter('meetingRoomNumFilter', function () {
        //会议室号转换过滤器
        return function (meetingRoomNumFilter) {


            if (/^\d+$/.test(meetingRoomNumFilter)) {
                return meetingRoomNumFilter
            } else {
                return "－－－－"
            }
        }
    })
    .filter('chargingAccount1TypeFilter', function () {
        //计费类型转换过滤器
        return function (chargingAccountType) {
            if (chargingAccountType) {
                //计费类型转换
                switch (chargingAccountType) {
                    case 1:
                        chargingAccountType = '计时';
                        break;
                    case 2:
                        chargingAccountType = '包月';
                        break;
                    case 3:
                        chargingAccountType = '包年';
                        break;
                    case 4:
                        chargingAccountType = '按需';
                        break;
                }
                return chargingAccountType;
            }
        }
    })
    .controller(chargeAccount.ctrlName, [
        '$scope',
        '$state',
        serv.model,
        '$stateParams',
        '$uibModal',
        function ($scope, $state, model, $stateParams, $uibModal) {
            var data = $scope.data = {};
            var actions = $scope.actions = {};
            data.backPage = $stateParams.page || 1;
            data.organname = $stateParams.organname;
            data.meetingRoomNum = $stateParams.searchMeetingRoomNum;

            data.backNum = 1;

            // 初始化数据
            model.getList({
                meetingRoomNum: $scope.data.meetingRoomNum,
                orgName: $scope.data.organname,
                start: data.backPage,
                size: 10
            }, 'getSearchAccount', function (res) {
                $scope.data['list'] = model.dataList.data;
                $scope.pager.totalItems = model.dataList.count;
                $scope.pager.currentPage = data.backPage;
            });

            // 增加时长
            actions.increaseTime = function () {
                var increaseModal = $uibModal.open({
                    templateUrl: 'increase-time.html',
                    controller: ['$scope', '$uibModalInstance', 'Global', '$http',
                        function ($scope, $uibModalInstance, Global, $http) {
                            $scope.title = '增加时长';
                            var search = $scope.search = {accountId: undefined};
                            var increase = $scope.increase = {increase: 0};
                            var hostpath = Global.hostpath;
                            var token = Global.token;
                            $scope.searchByAccountId = function () {
                                var options = {
                                    token: token,
                                    accountId: search.accountId
                                };
                                var api = 'cloudpServer/v1/charging/SearchByAccountId';
                                console.log('increase time search:', options, hostpath + api);
                                $http({
                                    method: 'GET',
                                    url: hostpath + api,
                                    params: options
                                })
                                    .then(function (res) {
                                        $scope.data = res.data.data[0];
                                        console.log(res.data.data[0]);
                                    }, function (rej) {
                                        console.log(rej);
                                    })
                            };
                            $scope.increase = function () {
                                var api = 'cloudpServer/v1/charging/addRemainTime ';
                                var addTime = ($scope.increase.increase - 0) * 60;
                                $http({
                                    method: 'PUT',
                                    url: hostpath + api,
                                    params: {
                                        //校验码
                                        token: Global.token,
                                        //计费账号
                                        accountId: $scope.data.accountId,
                                        //原来的剩余时间
                                        oldTime: $scope.data.remainTime,
                                        //添加的时间
                                        addTime: addTime,
                                        //有效期
                                        validPeriod: $scope.increase.validPeriod
                                    }
                                })
                                    .then(function (res) {
                                        window.location.reload();
                                        // 应该不需要
                                        $uibModalInstance.dismiss('cancel');
                                    }, function (rej) {
                                        console.log(rej);
                                    })
                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            }
                        }]
                });
                increaseModal.result.then(function () {
                    console.log('increase modal closed')
                })
            };
            // 搜索操作
            actions.search = function () {
                model.getList({
                    meetingRoomNum: $scope.data.meetingRoomNum,
                    orgName: $scope.data.organname,
                    start: 1,
                    size: 10
                }, 'getSearchAccount', function (res) {
                    // 更新数据
                    $scope.data['list'] = model.dataList.data;
                    $scope.pager.totalItems = model.dataList.count;
                    $scope.pager.currentPage = 1;
                })
            };

            //分页
            data.pager = {
                totalItems: model.dataList.count,
                currentPage: 1,
                maxSize: 5,
                pageChanged: function () {
                    //请求
                    model.getList({
                        meetingRoomNum: $scope.data.meetingRoomNum,
                        orgName: $scope.data.organname,
                        start: $scope.pager.currentPage,
                        size: 10
                    }, 'getSearchAccount', function (res) {
                        $scope.data['list'] = model.dataList.data;
                        $scope.pager.totalItems = model.dataList.count;
                    })
                }
            };
            $scope.pager = data.pager;
        }]);

