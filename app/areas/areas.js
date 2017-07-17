/**
 * Created by golde on 2016/11/8 0008.
 */

var main = require('./main/main');

var areas = module.exports = {};
areas.name = 'areas';
areas.ctrlName = '_' + Date.now() + Math.random() + 'Controller';
angular.module(areas.name, [
    main.name,
])
    .config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/main/charge-account///');  //此处由于新旧系统问题，跳转charge-account有问题，所以做了此操作
            $stateProvider
                .state('main', {
                    url: '/main',
                    templateUrl: './tmpls/main/main.tmpl.html',
                    controller: main.ctrlName
                })

        }
    ])