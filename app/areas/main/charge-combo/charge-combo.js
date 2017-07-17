/**
 * Created by Slane on 2016/11/4.
 */
var serv = require('./charge-combo.serv');

var chargeCombo = module.exports = {};

chargeCombo.name = 'areas.main.charge-combo';
chargeCombo.ctrlName = '_' + Date.now() + Math.random() + 'Controller';
//弹出层控制器
chargeCombo.modalCtrlName = '_' + Date.now() + Math.random() + 'Controller';
//普通确认框控制器
chargeCombo.oneMessagectrlName = '_' + Date.now() + Math.random() + 'Controller';
angular.module(chargeCombo.name, [
    serv.name
])
//主控制器
    .factory('instance', function(){
        return {

        };
    })
    .filter('duration2Filter', function () {
        return function (duration) {
            if (duration) {
                if(duration<60){
                    return parseInt(duration)+'秒'
                }else if(duration<60*60){
                    return parseInt(duration/60)+'分钟'
                }else{
                    return (parseInt(duration/60/60)+'小时'+parseInt(duration/60%60)+'分钟');
                }
            }
        }
    })
    .controller(chargeCombo.ctrlName, [
        '$scope',
        '$uibModal',
        serv.model,
        '$timeout',
        '$q',
        'instance',
        function ($scope, $uibModal, model, $timeout, $q ,instance) {
            var data = $scope.data = {};
            var actions = $scope.actions = {};

            //初始化数据请求
            model.getList({'start':1,'size':10}, function () {
                console.log(model);
                $scope.data['list'] = model.dataList.data;
                 //分页组件
                data.pager = {
                    totalItems: model.dataList.count,
                    currentPage: 1,
                    maxSize: 5,
                    pageChanged: function () {
                        //请求
                        model.getList({'start':$scope.pager.currentPage,'size':10}, function () {
                            $scope.data['list'] = model.dataList.data;
                            $scope.pager.totalItems = model.dataList.count;
                        });
                        instance.currentPage = $scope.pager.currentPage;
                    }
                }
                $scope.pager = data.pager;

            });

            // 根据方案id 获取其计费类型
            actions.getChargingType = function (e) {
                console.warn('执行la', e.target.dataList.chargingType)
                var chargingType = e.target.dataList.chargingType
                $scope.chargingType = chargingType;
            };
            //删除套餐操作
            actions.deleteCombo = function (options) {
                var optionsDel = {
                    data:{},
                    index:''
                };
                optionsDel.data.id = options.id;
                optionsDel.index = data.list.indexOf(optionsDel);
                // 调起删除确认框
                var oneMessageModal = $uibModal.open({
                    templateUrl: 'oneMessageModal.html',
                    controller: chargeCombo.oneMessagectrlName,
                    resolve: {
                        optionsDel: function () {
                            return optionsDel;
                        }
                    }
                });
                //点击删除框 确认按钮并发送请求后   更新scope上绑定的数据
                oneMessageModal.result.then(function () {
                    
                    model.getList({'start':$scope.pager.currentPage,'size':10}, function () {
                        $scope.data['list'] = model.dataList.data;
                        $scope.pager.totalItems = model.dataList.count;
                    });
                    

                    console.log('reslove');
                }, function () {
                    console.log('reject');
                })

            };

           
            //新建、编辑时 调出 弹出层  并实例化对应控制器
            $scope.actions.open = function (options) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'editModal.html',
                    controller: chargeCombo.modalCtrlName,
                    resolve: {
                        options: function () {
                            return options;
                        },
                        schemeList: function () {
                            var deferred = $q.defer();
                            model.getDropDownList(function (res) {
                                deferred.resolve(res.data.data);
                            });
                            return deferred.promise;
                        }
                    }
                });
                //点击删除框 确认按钮并发送请求后   更新scope上绑定的数据
                modalInstance.result.then(function () {
                    model.getList({'start':$scope.pager.currentPage,'size':10}, function () {
                        $scope.data['list'] = model.dataList.data;
                        $scope.pager.totalItems = model.dataList.count;
                    });
                    
                    console.log('reslove');
                }, function () {
                    console.log('reject');
                })

            }

        }])

    //新建，编辑  弹出层控制器
    .controller(chargeCombo.modalCtrlName, ['$scope', '$uibModalInstance', 'schemeList', 'options', serv.model, function ($scope, $uibModalInstance, schemeList, options, model) {
        var confirm, title, item = {};

        // 绑定resolve参数，   select选择框
        $scope.schemeList = schemeList;
        if (options.method == 'add') {

            // 新建套餐相关参数绑定
            title = '新建套餐';
            confirm = function () {
                if($scope.editModalForm.$valid){
                    model.addCombo($scope.item, function () {
                        $uibModalInstance.close('confirm');
                    });
                }else{
                    
                }
                
            }
        }
        else if (options.method == 'edit') {
            //编辑套餐相关参数绑定
            title = '修改套餐';
            //这里只能逐个复制，要不然会绑定作用域
            item = {
                schemeName: options.item.schemeName,
                id: options.item.id,
                schemeId: options.item.schemeId,
                price: options.item.price/100,
                duration: parseInt(options.item.duration/60),
                validPeriod: options.item.validPeriod
            }

            confirm = function () {
                if($scope.editModalForm.$valid){
                    model.editCombo(options.index, $scope.item, function () {
                        $uibModalInstance.close('confirm');
                    });
                }else{
                    
                }
            }
        }
        $scope.item = item;

        $scope.$watch('item.schemeId', function (value) {
            var $schemeList = $scope.schemeList;
            for (var i = 0; i < $schemeList.length; i++) {
                if ($schemeList[i].id == value) {
                    $scope.chargingType = $schemeList[i].chargingType;
                    return ;
                }
            }
        })
        if (options.method == 'add') {
            //新建套餐,默认选中第一个option
            console.warn('所有的方案：', $scope.schemeList)
            $scope.item.schemeId = $scope.schemeList[0].id + '';
            $scope.chargingType = $scope.schemeList[0].chargingType;
        }
        else if (options.method == 'edit') {
            //新建套餐,选中对应option
            $scope.item.schemeId = item.schemeId + '';
        }


        $scope.title = title;
        $scope.cancel = function () {
            //取消按钮事件
            $uibModalInstance.dismiss('cancel');
        }
        //确认按钮事件
        $scope.confirm = confirm;
    }])


    //普通确认框控制器
    .controller(chargeCombo.oneMessagectrlName, ['$scope', '$uibModalInstance', 'optionsDel','instance', serv.model, function ($scope, $uibModalInstance, optionsDel, instance ,model) {

        $scope.cancel = function () {
            //取消按钮事件
            $uibModalInstance.dismiss('cancel');
        }
        $scope.confirm = function () {
            //确认按钮事件
            model.deleteCombo(optionsDel.index, optionsDel.data, function () {
                $uibModalInstance.close('confirm');
            });

        }
    }])
