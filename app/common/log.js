
var log = module.exports = {}

log.name = 'pa.log';

var LOG_ALLOWS = [
    'debug',
    'conn'
];

angular.module(log.name, [])
    .factory('Log', function () {
        return function (logType) {
            return function (args) {
                var allow = ('&' + LOG_ALLOWS.join('&')).indexOf(logType) >= 0;
                if (allow) {
                    console.log.apply(console, arguments);
                }
            }
        }
    })