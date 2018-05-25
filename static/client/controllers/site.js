controllers.controller("site", ["$scope",  function ($scope) {
    $scope.menuList = [
        {
            displayName: "首页", iconClass: "fa fa-home fa-lg", url: "#/home"
        },
        {
            displayName: "巡检管理", iconClass: "fa fa-th-large fa-lg",
            children: [
                {displayName: "DNS服务器管理", url: "#/dnsServerManagement"},
                {displayName: "巡检任务配置", url: "#/taskList"},
                {displayName: "历史巡检报告", url: "#/taskReport"}
            ]
        },
        {
            displayName: "系统管理", iconClass: "fa fa-cog fa-lg",
            children: [
                // {displayName: "巡检标准配置", url: "#/checkContentConfig"},
                {displayName: "邮箱管理", url: "#/mailManagement"},
                {displayName: "操作日志", url: "#/operationLog"}
            ]
        }
    ];


    $scope.menuOption = {
        data: 'menuList',
        locationPlaceHolder: '#locationPlaceHolder',
        adaptBodyHeight: CWApp.HeaderHeight + CWApp.FooterHeight
    };

}]);