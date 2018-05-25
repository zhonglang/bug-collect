services = angular.module('webApiService', ['ngResource', 'utilServices']);

//生产代码
var POST = "POST";
var GET = "GET";

//测试代码
//var sourceRoute = "./Client/MockData";
//var fileType = ".html";
//var POST = "GET";
//var GET = "GET";
services.factory('sysService', ['$resource', function ($resource) {
    return $resource(site_url + ':actionName/', {},
        {
            get_bug_list: {method: POST, params: {actionName: 'get_bug_list'}, isArray: false},
            up_bug: {method: POST, params: {actionName: 'up_bug'}, isArray: false},
            modify_bug: {method: POST, params: {actionName: 'modify_bug'}, isArray: false},
            search_bug: {method: POST, params: {actionName: 'search_bug'}, isArray: false},

        });
}])
services.factory('testService', ['$resource', function ($resource) {
    return $resource(site_url + ':actionName/', {},
        {
            test1: {method: POST, params: {actionName: 'test3'}, isArray: false},
            add: {method: POST, params: {actionName: 'add'}, isArray: false},
            del_by_id: {method: POST, params: {actionName: 'del_by_id'}, isArray: false},
            get_detail: {method: POST, params: {actionName: 'get_detail'}, isArray: false},
            change_user: {method: POST, params: {actionName: 'change_user'}, isArray: false},
        });
}])
services.factory('businessService', ['$resource', function ($resource) {
    return $resource(site_url + ':actionName/', {},
        {
            show_business: {method: POST, params: {actionName: 'show_business'}, isArray: false},
            search_host: {method: POST, params: {actionName: 'search_host'}, isArray: false},
            get_mem_info: {method: POST, params: {actionName: 'get_mem_info'}, isArray: false},

        });
}])
;//这是结束符，请勿删除