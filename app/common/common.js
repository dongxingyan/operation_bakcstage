var log = require('./log');
var local = require('./ngLocal');

var common = module.exports = {};
common.name = 'pa.common';
angular.module(common.name,[
    log.name,
    'ngLocal'
]);