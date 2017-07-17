var serv = require('./use-count.serv');
var useCount = module.exports = {};

useCount.name = 'areas.main.use-count';
//
useCount.ctrlName = '_' + Date.now() + Math.random() + 'Controller';

var echarts = require('echarts');
require('echarts/lib/chart/line');
require('echarts/lib/chart/bar');
var $=require('jquery');

angular.module(useCount.name, [serv.name])
    .controller(useCount.ctrlName, [
        '$scope', '$http', serv.model, 'Global',
        function ($scope, $http, model, Global) {
            $scope.data = {
                organization: null,
                isSelectedOfWeek: true,
                isSelectedOfMonth: false,
                isSelectedOfYear: false,
                meetingTimesData: null,
                concurrentData: null,
                meetingUseTimes: echarts.init(document.getElementById('meeting-use-times')),
                meetingTimes: echarts.init(document.getElementById('meeting-times')),
                meetingConcurrent: echarts.init(document.getElementById('meeting-concurrent')),
                $meetingUseTimeContainer: $('#meeting-use-times'),
                $meetingConcurrentContainer: $('#meeting-concurrent'),
                $meetingTimesContainer: $('#meeting-times')
            };
            $scope.utils = {
                /* 封装一个用于警告消息提示的模态框 */
                warnInfoTipModal: function (msg) {
                    var $warnModal = $('#J-warn-modal');
                    $('#J-warn-tip-text').text(msg);
                    $warnModal.removeClass('hide').children('div').removeClass('hide');
                    // $warnModal.fadeIn(1000);
                    setTimeout(function () {
                        // $warnModal.fadeOut(1000)
                        $warnModal.addClass('hide').children('div').addClass('hide');
                    }, 1500);
                },
                /* 封装open 方法 用于解决窗口被拦截的问题 */
                openWindow: function (url) {
                    var a = document.createElement("a");
                    a.setAttribute("href", url);
                    a.setAttribute("target", "_blank");
                    a.setAttribute("id", "open-window");
                    document.body.appendChild(a);
                    a.click();
                }
            };
            $scope.init = function () {
                $scope.actions.clickOfNearlyWeek();
                $scope.actions.meetingTimesChartClick();
                $scope.actions.concurrentChartClick();
            };
            $scope.actions = {
                /* 执行搜索操作 */
                searchCountData: function (startTime, endTime, orgStr) {
                    if (!startTime) {
                        $scope.utils.warnInfoTipModal('请选择开始时间');
                        return ;
                    }
                    if (!endTime) {
                        $scope.utils.warnInfoTipModal('请选择结束时间');
                        return ;
                    }
                    if (startTime >= endTime) {
                        $scope.utils.warnInfoTipModal('开始时间不能大于或等于结束时间');
                        return ;
                    }
                    var startTimeOfDate = new Date(startTime);
                    var endTimeOfDate = new Date(endTime);
                    startTime = startTimeOfDate.getFullYear() + '-' + (startTimeOfDate.getMonth() + 1) + '-' + startTimeOfDate.getDate();
                    endTime = endTimeOfDate.getFullYear() + '-' + (endTimeOfDate.getMonth() + 1) + '-' + endTimeOfDate.getDate();

                    $scope.data.meetingUseTimes.showLoading();
                    $scope.data.meetingTimes.showLoading();
                    $scope.data.meetingConcurrent.showLoading();
                    $scope.actions.getCountData(startTime, endTime, orgStr);
                    // that.successInfoTipModal('操作成功');
                },
                /* 获取统计的数据 */
                getCountData: function (startTime, endTime, orgStr) {
                    var requestData = null;
                    if (!orgStr) {
                        requestData = {
                            'startTime': startTime + ' 00:00:00',
                            'endTime': endTime + ' 23:59:59',
                        }
                    } else {
                        requestData = {
                            'startTime': startTime + ' 00:00:00',
                            'endTime': endTime + ' 23:59:59',
                            'orgList': orgStr
                        }
                    }
                    model.getConferenceData(requestData, function (res) {
                        if (res.code === '0') {
                            $scope.actions.renderMeetingTimesChart(res.data.timeline);
                            $scope.data.meetingTimesData = res.data.orgDetail;
                        } else {
                            $scope.utils.warnInfoTipModal(res.message);
                            $scope.data.$meetingUseTimeContainer.text('暂无数据');
                        }
                    });
                    model.getConcurrentData(requestData, function (res) {
                        if (res.code === '0') {
                            $scope.actions.renderConcurrentChart(res.data.timeline);
                            $scope.data.concurrentData = res.data.orgDetail;
                        } else {
                            $scope.utils.warnInfoTipModal(res.message);
                            $scope.data.$meetingUseTimeContainer.text('暂无数据');
                        }
                    });
                    model.getDurationData(requestData, function (res) {
                        if (res.code === '0') {
                            $scope.actions.renderMeetingDurationChart(res.data);
                        } else {
                            $scope.utils.warnInfoTipModal(res.message);
                            $scope.data.$meetingTimesContainer.text('暂无数据');
                        }
                    })
                },
                /* 渲染会议次数图表 */
                renderMeetingTimesChart: function (data) {
                    var option = {
                        color:  [
                            '#169bd5'
                        ],
                        toolbox: {
                            show : true,
                            right: '30px',
                            feature : {
                                magicType : {show: true, type: ['line', 'bar']}
                            }
                        },
                        title: {
                            text: '会议室使用次数',
                            x: 'center'
                        },
                        tooltip: {
                            show: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : data.map(function (item) {
                                    return item.time;
                                })
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                "name": "次数",
                                "type": "bar",
                                "label": {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                "barMaxWidth": '50px',
                                "data": data.map(function (item) {
                                    return item.totalCount;
                                })
                            }
                        ]
                    };
                    $scope.data.meetingUseTimes.hideLoading();
                    $scope.data.meetingUseTimes.setOption(option);
                },
                /* 渲染最高并发图表 */
                renderConcurrentChart: function (data) {
                    var concurrentOption = {
                        color:  [
                            '#169bd5'
                        ],
                        toolbox: {
                            show : true,
                            right: '30px',
                            feature : {
                                magicType : {show: true, type: ['line', 'bar']}
                            }
                        },
                        title: {
                            text: '最高并发',
                            x: 'center'
                        },
                        tooltip: {
                            show: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : data.map(function (item) {
                                    return item.time;
                                })
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                "size": ['60%', '60%'],
                                "name": "并发数",
                                "type": "bar",
                                "label": {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                "barMaxWidth": '50px',
                                "data": data.map(function (item) {
                                    return item.simultaneous;
                                })
                            }
                        ]
                    };
                    $scope.data.meetingConcurrent.hideLoading();
                    $scope.data.meetingConcurrent.setOption(concurrentOption);
                },
                /* 渲染会议时长图表 */
                renderMeetingDurationChart: function (data) {
                    var meetingTimesOption = {
                        title : {
                            text: '会议时长（小时）'
                        },
                        tooltip : {
                            trigger: 'axis'
                        },
                        legend: {
                            data:['会议室时长','参会总时长']
                        },
                        toolbox: {
                            show : true,
                            right: '30px',
                            feature : {
                                dataView: {
                                    show: true
                                },
                                magicType : {show: true, type: ['line', 'bar']},
                            }
                        },

                        calculable : true,
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : data.conference.map(function (item) {
                                    return item.time;
                                }),
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel : {
                                    formatter: '{value} 小时'
                                }
                            }
                        ],
                        series : [
                            {
                                name:'参会总时长',
                                type:'line',
                                "label": {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                "barMaxWidth": '50px',
                                data: data.participant.map(function (item) {
                                    return (Math.ceil(item.duration / 60) / 60).toFixed(1);
                                }),
                            },
                            {
                                name:'会议室时长',
                                type:'line',
                                "label": {
                                    normal: {
                                        show: true,
                                        position: 'top'
                                    }
                                },
                                "barMaxWidth": '50px',
                                data: data.conference.map(function (item) {
                                    return (Math.ceil(item.duration / 60) / 60).toFixed(1);
                                }),
                            }
                        ]
                    };
                    $scope.data.meetingTimes.hideLoading();
                    $scope.data.meetingTimes.setOption(meetingTimesOption);
                },
                /* 获取近一周点击事件*/
                clickOfNearlyWeek: function () {
                    $scope.data.isSelectedOfWeek = true;
                    $scope.data.isSelectedOfMonth = false;
                    $scope.data.isSelectedOfYear = false;
                    $scope.actions.getOneWeekData();
                },
                /* 获取近一周的数据 */
                getOneWeekData: function () {
                    var preWeekTimeStamp = new Date().getTime();
                    var preWeekOfDate = new Date(preWeekTimeStamp - 7 * 24 * 3600 * 1000);
                    var nowDate = new Date();
                    // 先把时间字符串转换称日期格式
                    var preWeekOfYear = preWeekOfDate.getFullYear() + '';
                    var nowYear = nowDate.getFullYear() + '';

                    var preWeekOfMonth = (preWeekOfDate.getMonth() + 1) + '';
                    var nowMonth = (nowDate.getMonth() + 1) + '';

                    var preWeekOfDay = preWeekOfDate.getDate() + '';
                    var date = nowDate.getDate() + '';

                    // 格式化每个日期节点的个数
                    if (preWeekOfMonth.length === 1) preWeekOfMonth = '0' + preWeekOfMonth;
                    if (nowMonth.length === 1) nowMonth = '0' + nowMonth;

                    if (preWeekOfDay.length === 1) preWeekOfDay = '0' + preWeekOfDay;
                    if (date.length === 1) date = '0' + date;

                    // 开始时间、结束时间（前一周的时间作为开始时间，现在的时间作为结束时间）
                    var preOneWeek = preWeekOfYear + '-' + preWeekOfMonth + '-' + preWeekOfDay;
                    nowDate = nowYear + '-' + nowMonth + '-' + date;

                    $scope.data.startTime = new Date(preOneWeek);
                    $scope.data.endTime = new Date(nowDate);

                    // 会议室
                    $scope.actions.getCountData(preOneWeek, nowDate, $scope.data.organization);
                },
                /* 获取近一年的数据 */
                getOneYearData: function () {
                    $scope.data.meetingUseTimes.showLoading();
                    $scope.data.meetingTimes.showLoading();
                    $scope.data.meetingConcurrent.showLoading();

                    $scope.data.isSelectedOfWeek = false;
                    $scope.data.isSelectedOfMonth = false;
                    $scope.data.isSelectedOfYear = true;

                    var nowDate = new Date();
                    // 先把时间字符串转换称日期格式
                    var prevYear = nowDate.getFullYear() - 1 + '';
                    var nowYear = nowDate.getFullYear() + '';
                    var month = (nowDate.getMonth() + 1) + '';
                    var date = nowDate.getDate() + '';

                    // 格式化每个日期节点的个数
                    if (month.length === 1) month = '0' + month;
                    if (date.length === 1) date = '0' + date;

                    // 开始时间、结束时间（前一年的时间作为开始时间，现在的时间作为结束时间）
                    var preOneYear = prevYear + '-' + month + '-' + date;
                    nowDate = nowYear + '-' + month + '-' + date;

                    $scope.data.startTime = new Date(preOneYear);
                    $scope.data.endTime = new Date(nowDate);

                    $scope.actions.getCountData(preOneYear, nowDate, $scope.data.organization);
                },
                /* 获取近一月的数据 */
                getOneMonthData: function () {
                    $scope.data.meetingUseTimes.showLoading();
                    $scope.data.meetingTimes.showLoading();
                    $scope.data.meetingConcurrent.showLoading();

                    $scope.data.isSelectedOfWeek = false;
                    $scope.data.isSelectedOfMonth = true;
                    $scope.data.isSelectedOfYear = false;

                    var nowDate = new Date();
                    // 先把时间字符串转换称日期格式
                    // 如果是某年的一月份 则前一个月为上一年的12月
                    var nowYear = nowDate.getFullYear();
                    var preMonth = nowDate.getMonth();
                    if(!preMonth) {
                        preMonth = 12 + '';
                        nowYear = (nowYear - 1) + '';
                    } else {
                        preMonth = preMonth + '';
                        nowYear = nowYear + '';
                    }
                    var nowMonth = (nowDate.getMonth() + 1) + '';
                    var date = nowDate.getDate() + '';

                    // 格式化每个日期节点的个数
                    if (preMonth.length === 1) preMonth = '0' + preMonth;
                    if (nowMonth.length === 1) nowMonth = '0' + nowMonth;
                    if (date.length === 1) date = '0' + date;

                    // 开始时间、结束时间（前一月的时间作为开始时间，现在的时间作为结束时间）
                    var preOneMonth = nowYear + '-' + preMonth + '-' + date;
                    nowDate = nowYear + '-' + nowMonth + '-' + date;

                    $scope.data.startTime = new Date(preOneMonth);
                    $scope.data.endTime = new Date(nowDate);

                    $scope.actions.getCountData(preOneMonth, nowDate, $scope.data.organization);
                },
                /* 点击会议次数图表的某一项，触发的事件 */
                meetingTimesChartClick: function () {
                    $scope.data.meetingUseTimes.on('click', function (params) {
                        var startTime = '';
                        var endTime = '';
                        var paramsName = params.name;   // 获取横坐标
                        var requestData = null;
                        if (paramsName.length <= 7) {
                            startTime = paramsName + '-01 00:00:00';
                            var currentYear = paramsName.substring(0, 4);
                            var currentMonth = paramsName.substring(5);
                            if (currentMonth == '12') {
                                // 如果当前月是12月
                                endTime = paramsName + '-31 23:59:59';
                            } else if (currentMonth < '12'){
                                // 否则的话(不是12月)
                                endTime = currentYear + '-' + (Number(currentMonth) + 1) + '-01 00:00:00';
                            }
                        } else {
                            startTime = paramsName + ' 00:00:00';
                            endTime = paramsName + ' 23:59:59';
                        }
                        if (!$scope.data.organization) {
                            requestData = {
                                'startTime': startTime,
                                'endTime': endTime,
                            }
                        } else {
                            requestData = {
                                'startTime': startTime,
                                'endTime': endTime,
                                'orgList': $scope.data.organization
                            }
                        }
                        model.getConferenceData(requestData, function (res) {
                            if (res.code === '0') {
                                $scope.data.meetingTimesData = res.data.orgDetail;
                            } else {
                                $scope.utils.warnInfoTipModal(res.message);
                            }
                        })
                    })
                },
                /* 点击最高并发数图表的某一项，触发的事件*/
                concurrentChartClick: function () {
                    $scope.data.meetingConcurrent.on('click', function (params) {
                        var startTime = '';
                        var endTime = '';
                        var paramsName = params.name;   // 获取横坐标
                        var requestData = null;
                        if (paramsName.length <= 7) {
                            startTime = paramsName + '-01 00:00:00';
                            var currentYear = paramsName.substring(0, 4);
                            var currentMonth = paramsName.substring(5);
                            if (currentMonth == '12') {
                                // 如果当前月是12月
                                endTime = paramsName + '-31 23:59:59';
                            } else if (currentMonth < '12'){
                                // 否则的话(不是12月)
                                endTime = currentYear + '-' + (Number(currentMonth) + 1) + '-01 00:00:00';
                            }
                        } else {
                            startTime = paramsName + ' 00:00:00';
                            endTime = paramsName + ' 23:59:59';
                        }
                        if (!$scope.data.organization) {
                            requestData = {
                                'startTime': startTime,
                                'endTime': endTime,
                            }
                        } else {
                            requestData = {
                                'startTime': startTime,
                                'endTime': endTime,
                                'orgList': $scope.data.organization
                            }
                        }
                        model.getConcurrentData(requestData, function (res) {
                            if (res.code === '0') {
                                $scope.data.concurrentData = res.data.orgDetail;
                            } else {
                                $scope.utils.warnInfoTipModal(res.message);
                            }
                        })
                    })
                },
                /* 导出数据 */
                download : function () {
                    var newWindow = window.open();
                    var startTime = new Date($scope.data.startTime);
                    var endTime = new Date($scope.data.endTime);

                    if (!$scope.data.organization) {
                        requestData = {
                            'startTime': startTime.getFullYear() + '-' + (startTime.getMonth() + 1) +  '-' + startTime.getDate() +  ' 00:00:00',
                            'endTime': endTime.getFullYear() + '-' + (endTime.getMonth() + 1) +  '-' + endTime.getDate() + ' 23:59:59'
                        }
                    } else {
                        requestData = {
                            'startTime': startTime.getFullYear() + '-' + (startTime.getMonth() + 1) +  '-' + startTime.getDate() +  ' 00:00:00',
                            'endTime': endTime.getFullYear() + '-' + (endTime.getMonth() + 1) +  '-' + endTime.getDate() + ' 23:59:59',
                            'orgList': $scope.data.organization
                        }
                    }
                    model.getOutputURL(requestData, function (res) {
                        if (res.code === '0') {
                            var downloadURL = Global.hostpath + res.data.url;
                            newWindow.location.href = downloadURL;
                        } else {
                            $scope.utils.warnInfoTipModal(res.msg);
                        }
                    })
                }
            };
            $scope.init();
        }]);