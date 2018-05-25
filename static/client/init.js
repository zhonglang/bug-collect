var app = angular.module("myApp", ['myController', 'utilServices', 'myDirective', 'ui.bootstrap', 'ui.router', 'webApiService','cwLeftMenu','ngGrid']);
var controllers = angular.module("myController", []);
var directives = angular.module("myDirective", []);


app.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.defaults.headers.post['X-CSRFToken'] = $("#csrf").val();
    $urlRouterProvider.otherwise("/business");//默认展示页面
    $stateProvider.state('home', {
        url: "/home",
        controller: "home",
        templateUrl: static_url + "client/views/home.html"
    })
   .state('test', {
        url: "/test",
        controller: "test",
        templateUrl: static_url + "client/views/test.html"
    })
   .state('business', {
        url: "/business",
        controller: "business",
        templateUrl: static_url + "client/views/business.html"
    })
     .state('operationLog', {
        url: "/operationLog",
        controller: "operationLogCtrl",
        templateUrl: static_url + "client/views/sysManagement/operationLog.html"
    })
    .state('mailManagement', {
        url: "/mailManagement",
        controller: "mailManagementCtrl",
        templateUrl: static_url + "client/views/sysManagement/mailManagement.html"
    })
    .state('taskList', {
        url: "/taskList",
        controller: "taskListCtrl",
        templateUrl: static_url + "client/views/taskManagement/taskList.html"
    })
    .state('taskReport', {
        url: "/taskReport",
        controller: "taskReportCtrl",
        templateUrl: static_url + "client/views/taskManagement/taskReport.html"
    })
    .state('taskReportDetail', {
        url: "/taskReportDetail",
        controller: "taskReportDetailCtrl",
        templateUrl: static_url + "client/views/taskManagement/taskReportDetail.html"
    })
    .state('taskServerDetail', {
        url: "/taskServerDetail",
        controller: "taskServerDetailCtrl",
        templateUrl: static_url + "client/views/taskManagement/taskServerDetail.html"
    })
    .state('dnsServerManagement', {
        url: "/dnsServerManagement",
        controller: "dnsServerManagementCtrl",
        templateUrl: static_url + "client/views/sysManagement/dnsServerManagement.html"
    })
}]);
