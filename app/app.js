var areas = require('./areas/areas');
var common = require('./common/common');
var directives = require('./directives/directives');

angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ngAnimate',
    areas.name,
    common.name,
    directives.name
])
    .constant('Global', {


        // 服务器地址(来自vars)
        hostpath: url,
        // hostpath: url
        token: admin_token,
    });
