/**
 * Created by Slane on 2016/11/4.
 */

var serv = require('./charge-plan.serv');
var chargePlan = module.exports = {};

chargePlan.name = 'areas.main.charge-plan';
chargePlan.ctrlName = '_' + Date.now() + Math.random() + 'Controller';

//弹出层控制器
chargePlan.modalCtrlName = '_' + Date.now() + Math.random() + 'Controller';

//普通确认框控制器
chargePlan.oneMessagectrlName = '_' + Date.now() + Math.random() + 'Controller';

angular.module(chargePlan.name, [  //areas.main.charge-plan
    serv.name
])
    .filter('planChargingTypeFilter', function () {
        //计费类型转换过滤器
        return function (planChargingType) {
                //计费类型转换
                switch (planChargingType) {
                    case 1:
                        planChargingType = '计时';
                        break;
                    case 2:
                        planChargingType = '包月';
                        break;
                    case 3:
                        planChargingType = '包年';
                        break;
                    case 4:
                        planChargingType = '按需';
                        break;
                }
                return planChargingType;
        }
    })
    .filter('chargingListTimeFilter', function () {
        //计费类型转换过滤器
        return function (freeTime,planChargingType) {
                var freeTimeMin = parseInt(freeTime/60);
                var freeTimeDay = parseInt(freeTime/60/60/24);
                //计费类型转换
                switch (planChargingType) {
                    case 1:
                        planChargingType = freeTimeMin+'分钟';
                        break;
                    case 2:
                        planChargingType = freeTimeDay+'天';
                        break;
                    case 3:
                        planChargingType = freeTimeDay+'天';
                        break;
                    case 4:
                        planChargingType = '---';
                        break;
                }
                return planChargingType;
        }
    })
    .filter('chargingUnitFilter', function () {
        return function (chargingUnit) {
                //计费类型转换
                switch (chargingUnit) {
                    case "1":
                        chargingUnit = ' 元/分/方';
                        break;
                    case "2":
                        chargingUnit = ' 元/方';
                        break;
                    case "3":
                        chargingUnit = ' 元/方';
                        break;
                    case "4":
                        chargingUnit = ' 元/日/方';
                        break;
                }
                return chargingUnit;
        }
    })
    .filter('chargingTimeFilter', function () {
        return function (chargingTime) {
                switch (chargingTime) {
                    case "1":
                        chargingTime = ' 分钟';
                        break;
                    case "2":
                        chargingTime = ' 天';
                        break;
                    case "3":
                        chargingTime = ' 天';
                        break;
                    case "4":
                        chargingTime = '';
                        break;
                }
                return chargingTime;
        }
    })
    .filter('chargingAccountTypeFilter', function () {
        //计费方式转换过滤器
        return function (chargingAccountType) {
                //计费方式转换
                switch (chargingAccountType) {
                    case 1:
                        chargingAccountType = '按会议室计费';
                        break;
                    case 2:
                        chargingAccountType = '按机构计费';
                        break;
                }
                return chargingAccountType;
        }
    })
    .filter('unitPriceFilter', function () {
        //计费类型转换过滤器
        return function (unitPrice,priceType) {
                //计费类型转换
                switch (priceType) {
                    case 1:
                        unitPrice = (unitPrice/100+'元/分/方');
                        break;
                    case 2:
                        unitPrice = (unitPrice/100+'元/方');
                        break;
                    case 3:
                        unitPrice = (unitPrice/100+'元/方');
                        break;
                    case 4:
                        unitPrice = (unitPrice/100+'元/日/方');
                        break;
                }
                return unitPrice;
        }
    })

    //主控制器
    .controller(chargePlan.ctrlName, [
        '$scope',
        '$uibModal',
        serv.model,
        '$q',
        function ($scope, $uibModal, model,$q) {
            var data = $scope.data = {};
            var actions = $scope.actions = {};

            //初始化数据
            model.getList({'start':1,'size':10}, function () {
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
                    }
                }
                $scope.pager = data.pager;
            });


            //删除方案
            actions.deletePlan = function (item) {
                //调用删除确认框
                var oneMessageModal = $uibModal.open({
                    templateUrl: 'oneMessageModal.html',
                    controller: chargePlan.oneMessagectrlName,
                    resolve: {
                        item: item,
                    }
                });
                //确认删除后更新scope 分页总数及数据
                oneMessageModal.result.then(function () {
                    model.getList({'start':$scope.pager.currentPage,'size':10}, function(){
                        $scope.data['list'] = model.dataList.data;
                        $scope.pager.totalItems = model.dataList.count;
                    });
                   
                }, function () {
                    console.log('reject');
                })

                // model.deletePlan(index, function () {
                //     $scope.data['list'] = model.dataList.data;
                //     $scope.pager.totalItems = model.dataList.count;
                // });
            };

            //分页
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
                        //instance.currentPage = $scope.pager.currentPage;
                    }
            }
            $scope.pager = data.pager;

            //新增方案，编辑方案  调用对应弹框
            $scope.actions.open = function (options) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'editModal.html',
                    controller: chargePlan.modalCtrlName,
                    resolve: {
                        options: function () {
                            // 传递参数给弹框
                            return options;
                        }
                        // schemeList: function () {
                        //     var deferred = $q.defer();
                        //     model.getDropDownList(function (res) {
                        //         deferred.resolve(res.data.data);
                        //     });
                        //     return deferred.promise;

                        // }
                    }
                })
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
    .controller(chargePlan.modalCtrlName, ['$scope', '$uibModalInstance', 'options', serv.model, function ($scope, $uibModalInstance, options, model) {
        var confirm, title, item = {};
        // debugger;
        // 绑定resolve参数，   select选择框
        // $scope.schemeList = schemeList;
        if (options.method == 'add') {
            // 新建方案时，绑定相关操作
            title = '新建方案';
            confirm = function () {
                //确认事件绑定
                // $scope.item.chargingType = $scope.item.chargingType.value;
                // $scope.item.chargingACcountType = $scope.item.chargingACcountType.value;
                if($scope.editModalForm.$valid){
                    model.addPlan($scope.item, function () {
                        $uibModalInstance.close('confirm');
                    });
                }else{

                }
            }
        }
        else if (options.method == 'edit') {
            // 修改方案时，绑定相关操作
            title = '修改方案';
            var freeTimeMin = parseInt(options.item.freeTime/60);
            var freeTimeDay = parseInt(options.item.freeTime/60/60/24);
            //这里只能逐个复制，要不然会绑定作用域
            item = {
                id: options.item.id,
                name: options.item.name,
                chargingType: options.item.chargingType,
                chargingAccountType: options.item.chargingAccountType,
                unitPrice: options.item.unitPrice/100,
                validPeriod: options.item.validPeriod
            }
            if(item.chargingType == 2 || item.chargingType == 3){
                item.freeTime = freeTimeDay;
            }else if(item.chargingType == 1){
                item.freeTime = freeTimeMin;
            }else{
                item.freeTime = 0;
            }
            confirm = function () {
                // $scope.item.chargingType = $scope.item.chargingType.value;
                // $scope.item.chargingACcountType = $scope.item.chargingACcountType.value;
                if($scope.editModalForm.$valid){
                    model.editPlan(options.index, $scope.item, function () {
                        $uibModalInstance.close('confirm');
                        clearInterval(time);
                    }); 
                }else{

                }
            }
        }
        $scope.title = title;
        $scope.item = item;

        //计费类型列表
        $scope.chargingTypeList = [
            {name: '计时', value: '1'},
            {name: '包月', value: '2'},
            {name: '包年', value: '3'},
            {name: '按需', value: '4'}
        ];
        //计费方式列表
        $scope.chargingAccountTypeList = [{name: '按会议室计费', value: '1'}, {name: '按机构计费', value: '2'}];

        if (options.method == 'edit')  {
            //编辑方案,选中对应  option
            $scope.item.chargingType = item.chargingType + '';
            $scope.item.chargingAccountType = item.chargingAccountType + '';
        } else if (options.method == 'add') {
            //新建方案,默认选中第一个option
            $scope.item.chargingType = $scope.chargingTypeList[0].value;
            $scope.item.chargingAccountType = $scope.chargingAccountTypeList[0].value;
        }


        $scope.cancel = function () {
            //取消按钮事件
            $uibModalInstance.dismiss('cancel');
        }
        //确认按钮事件
        $scope.confirm = confirm;
    }])



    //删除确认弹框 Ctrl
    .controller(chargePlan.oneMessagectrlName, ['$scope', '$uibModalInstance', 'item', serv.model, function ($scope, $uibModalInstance, item , model) {

        $scope.cancel = function () {
            //取消按钮事件
            $uibModalInstance.dismiss('cancel');
        }
        $scope.confirm = function () {
            //确认按钮事件，发送请求
            model.deletePlan( item, function () {
                $uibModalInstance.close('confirm');
            });

        }
    }])

