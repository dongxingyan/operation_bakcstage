/**
 * 由 CrystalTea 创建于： 2016/12/14 0014.
 */
var serv = module.exports = {};
serv.name = 'areas.main.statistics-concurrent-service';
serv.ServName = '_' + Date.now() + '' + Math.random() + 'Service';
/**
 * 服务器地址
 * @type {urlInputType}
 */
var serviceUrl = url;
//https://api-dev.cloudp.cc/cloudpServer/v1/orgs/?token=20161214034757197j55Ue4k9687K6107SRdpH44386Ga1818E7ACC398ACEAFFC3C9B9E76BCCF857A9
angular.module(serv.name,[])
.factory(serv.ServName,[
    '$http',
    function ($http) {
        return {

        }
    }
]);