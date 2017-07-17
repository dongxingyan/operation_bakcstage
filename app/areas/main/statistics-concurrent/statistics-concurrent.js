/**
 * Created by Administrator on 2016/12/27.
 */
/**
 * 由 CrystalTea 创建于： 2016/12/14 0014.
 */


var statisticsConcurrent = module.exports = {};

statisticsConcurrent.name = 'areas.main.statisticsConcurrent';
//
statisticsConcurrent.ctrlName = '_' + Date.now() + Math.random() + 'Controller';

var echarts = require('echarts');
var $=require('jquery');

angular.module(statisticsConcurrent.name, [])
    .controller(statisticsConcurrent.ctrlName, [
        '$scope', '$http',
        function ($scope, $http) {
            var now = new Date();//获取当前的时间
            var today = new Date(now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate() + ' 0:0:0');//将当前的时间转换成零点的格式
            var data = $scope.data = {
                orgid: '0',
                startTime: new Date(today.getTime() - 24 * 60 * 60 * 1000),
                endTime: new Date(today.getTime() - 24 * 60 * 60 * 1000),
                startTimeOpened: false,
                endTimeOpened: false
            };

            $scope.actions = {
                //点击时间按钮输入框显示对应的时间
                setTimeTo: function (days) {
                    data.startTime = new Date(today.getTime() - days * 86400000);
                    data.endTime = new Date(today.getTime() - 86400000);
                    console.log('set time to '+days+ ' days before',data);
                    console.log(data.startTime);
                },
                download : function () {
                    var org_id = data.orgid;
                    var token = location.search.split('name=')[1];
                    var startTime = getDateStr(data.startTime) + '00:00:00';//开始时间从0点开始计算
                    var endTime = getDateStr(data.endTime) + '23:59:59';//结束时间从24点开始计算
                   $http({
                        method:'post',
                        url:url+'/cloudpServer/v1/orgs/simultaneous/document/' + org_id + '/?'
                        + 'token=' +  location.search.split('name=')[1],
                        data:{
                            startTime:startTime,
                            endTime:endTime
                        }

                    }).then(function (res) {
                       console.log(res.data);
                       var url1=res.data.url;
                       // console.log(url1);
                       // window.open=url1;
                       window.open(url1);
                   });

                }

            };
            //获取数据并进行渲染
            var dataTimeoutId = -1;
            function getDataThenRenderer() {
                clearTimeout(dataTimeoutId);
                dataTimeoutId = setTimeout(function () {
                    getRemoteData().then(function (res) {
                        render(res.data);
                    })
                }, 1000);
            }




            $scope.$watch('data.orgid', function (nv, ov) {
                getDataThenRenderer();
            });
            $scope.$watch('data.startTime', function (data) {
                getDataThenRenderer();
            });
            $scope.$watch('data.endTime', function (data) {
                getDataThenRenderer();
            });



            /**
             * 渲染数据
             */
            function render(data) {
                /**
                 organId:0
                 simultaneous:7613
                 time:"2016-07"
                 */
                console.log('!!!需要渲染数据:', data);

                if (data.data) {//如果请求的有数据，则进进行渲染
                    var chart = echarts.init(document.getElementById('graph'));
                    var temp = data.data.map(function (item) {
                        return {index: item.time, value: item.simultaneous}
                    });
                    console.log(temp);
                    var chartOption = {
                        title: {text: '并发信息-折线图'},
                        tooltip: {
                            trigger: 'axis'
                        },
                        toolbox: {
                            left: 'center',
                            feature: {
                                dataZoom: {
                                    yAxisIndex: 'none'
                                },
                                restore: {},
                                saveAsImage: {}
                            }
                        },
                        xAxis: {
                            data: temp.map(function (item) {
                                return item.index
                            })
                        },
                        yAxis: {},
                        dataZoom: [
                            {
                                startValue: temp[0].index
                            },
                            {
                                type: 'inside'
                            }],

                        series: [{//系列列表
                            name: '并发量',
                            type: 'line',
                            data: temp
                        }]
                    };

                        chart.setOption(chartOption)


                }
                else {
                    var graph=document.getElementById('graph');
                    graph.innerText='暂无数据';
                    graph.style.textAlign='center';
                    graph.style.lineHeight='600px';
                    console.log(graph)
                }

            }

            /**
             * 获取机构列表
             */
            $http.get(url + 'cloudpServer/v1/orgs/?token=' + location.search.split('name=')[1])
                .then(function (res) {
                    data.orgs = res.data.data;
                });
            function getDateStr(date) {
                function numFix(num) {
                    return ('000' + num).slice(-2);
                }

                return date.getFullYear() + '-' + numFix(date.getMonth() + 1) + '-' + numFix(date.getDate()) + ' ';
            }

            function getRemoteData() {
                var org_id = data.orgid;
                var token = location.search.split('name=')[1];
                var startTime = getDateStr(data.startTime) + '00:00:00';//开始时间从0点开始计算
                var endTime = getDateStr(data.endTime) + '23:59:59';//结束时间从24点开始计算
                var type = 'hour';
                var during = data.endTime.getTime() - data.startTime.getTime();
                /*时间节点：一天之内按小时算；一个月之内按天算；其他的都是按月来算*/
                if (during > 24 * 60 * 60 * 1000) {
                    type = 'day';
                }
                if (during > 30 * 24 * 60 * 60 * 1000) {
                    type = 'month';
                }
                console.log('即将发送请求，参数：', {
                    organId: org_id,
                    startTime: startTime,
                    endTime: endTime,
                    type: type,
                    token: token
                });
                return $http({
                    method: 'post',
                    url: url + 'cloudpServer/v1/orgs/simultaneous/' + org_id + '/?'
                    + 'token=' + token ,
                    data: {
                        organId: org_id,
                        startTime: startTime,
                        endTime: endTime,
                        type: type
                    }

                })
            }

        }]);