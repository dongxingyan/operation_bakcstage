var serv = module.exports = {};
serv.name = 'areas.main.use-count-service';
serv.model = Date.now() + Math.random() + 'Service'

function WorkOrganizationAccount(id, name, chargingType, chargingAccountType, unitPrice, frreTime) {
    this.id = id;
    this.name = name;
    this.chargingType = chargingType;
    this.chargingAccountType = chargingAccountType;
    this.unitPrice = unitPrice;
    this.frreTime = frreTime;
}

angular
    .module(serv.name, [])
    .factory(serv.model, [
        'Global','$http',
        function (Global , $http) {
            var hostpath = Global.hostpath;
            var token = Global.token;
            return {
                getConferenceData: function (options, callback) {
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'cloudpServer/v1/stats/admin/conferenceCount',
                        params: options
                    })
                    .then(function (res) {
                        callback(res.data);
                    }, function (rej) {
                        console.log(rej);
                    })
                },
                getConcurrentData: function (options, callback) {
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'cloudpServer/v1/stats/admin/simultaneous',
                        params: options
                    })
                    .then(function (res) {
                        callback(res.data);
                    }, function (rej) {
                        console.log(rej);
                    })
                },
                getDurationData: function (options, callback) {
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'cloudpServer/v1/stats/admin/duration',
                        params: options
                    })
                    .then(function (res) {
                        callback(res.data);
                    }, function (rej) {
                        console.log(rej);
                    })
                },
                getOutputURL: function (options, callback) {
                    options.token = token;
                    $http({
                        method: 'get',
                        url: hostpath+'cloudpServer/v1/stats/admin/exportConferenceData',
                        params: options
                    })
                    .then(function (res) {
                        callback(res.data);
                    }, function (rej) {
                        console.log(rej);
                    })
                }
            };
        }
    ]);