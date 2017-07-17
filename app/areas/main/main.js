var chargePlan = require('./charge-plan/charge-plan'),
    chargeCombo = require('./charge-combo/charge-combo'),
    chargeAccount = require('./charge-account/charge-account'),
    accountDetails = require('./account-details/account-details'),
    statisticsConcurrent = require('./statistics-concurrent/statistics-concurrent');
    useCount = require('./use-count/use-count');

var main = module.exports = {};
main.name = 'areas.main';
main.ctrlName = '_' + Date.now() + Math.random() + 'Controller';


angular.module(main.name, [
    chargePlan.name,
    chargeCombo.name,
    chargeAccount.name,
    accountDetails.name,
    statisticsConcurrent.name,
    useCount.name
])
    .config([
        '$stateProvider',
        function ($stateProvider) {
            $stateProvider
                .state('main.statistics-concurrent',{
                    url:'/statistics-concurrent',
                    templateUrl:'tmpls/main/statistics-concurrent/statistics-concurrent.tmpl.html',
                    controller:statisticsConcurrent.ctrlName
                })
                .state('main.use-count',{
                    url:'/use-count',
                    templateUrl:'tmpls/main/use-count/use-count.tmpl.html',
                    controller:useCount.ctrlName
                })
                .state('main.charge-plan', {
                    url: '/charge-plan',
                    templateUrl: 'tmpls/main/charge-plan/charge-plan.tmpl.html',
                    controller: chargePlan.ctrlName
                })
                .state('main.charge-combo', {
                    url: '/charge-combo',
                    templateUrl: 'tmpls/main/charge-combo/charge-combo.tmpl.html',
                    controller: chargeCombo.ctrlName
                })
                .state('main.charge-account', {
                    url: '/charge-account/:page/:searchMeetingRoomNum/:organname',
                    templateUrl: 'tmpls/main/charge-account/charge-account.tmpl.html',
                    controller: chargeAccount.ctrlName
                })
                .state('main.account-details', {
                    url: '/account-details/:accountId/:schemeName/:meetingRoomNum/:orgName/:chargingType/:remainTime/:page/:searchMeetingRoomNum/:organname',
                    templateUrl: 'tmpls/main/account-details/account-details.tmpl.html',
                    controller: accountDetails.ctrlName
                })

        }
    ])
    .controller(main.ctrlName, [
        '$scope',
        function ($scope) {
            var data = $scope.data = {};
            var actions = $scope.actions = {};


        }
    ])
