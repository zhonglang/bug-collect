controllers.controller("home", ["msgModal", "$scope", "loading", "sysService", "$modal", "$filter","confirmModal", function (msgModal, $scope, loading, sysService, $modal, $filter,confirmModal) {
    $scope.bug_list = [];
    var dateStart = new Date();
    var dateEnd = new Date();
    $scope.DateStart = dateStart.setDate(dateStart.getDate() - 89);
    $scope.DateEnd = dateEnd.setDate(dateEnd.getDate() + 1);
    $scope.filter = {
        bug_key:"",
        bug_type: "",
        bug_state: "",
        create_by: "",
        whenStart: $filter('date')($scope.DateStart, 'yyyy-MM-dd'),
        whenEnd: $filter('date')($scope.DateEnd, 'yyyy-MM-dd')
    };
    $scope.rgoption = {
        bottom: 40,
        data: 'bug_list',
        title: [
            {'title': '序号', 'rghtml':'<span>{{i.rgtable_index+1}}</span>','rgwidth':'50px'},
            {'title': '类型', 'enname': 'bug_type'},
            {'title': '客户', 'enname': 'customer'},
            {'title': '问题标题', 'enname': 'bug_title','rgwidth':'100px'},
            {'title': '问题内容', 'enname': 'bug_content','rgwidth':'200px'},
            {'title': '类型说明', 'enname': 'bug_content_type','rgwidth':'200px'},
            {'title': '状态', 'enname': 'bug_state'},
            {'title': '解决方法', 'enname': 'bug_resolvent','rgwidth':'200px'},
            {'title': '创建者', 'enname': 'create_by'},
            {'title': '提交时间', 'enname': 'when_create'},
            {'title': '操作', 'rghtml':"<div style='width:100%;padding-top: 5px;text-align:center'>" +
                "<span title='修改' ng-click='modify(i)' class='king-btn king-info king-btn-mini'>修改</span>&nbsp;" +
                "&nbsp;&nbsp;&nbsp;&nbsp;<span title='查看' ng-click='detail(i)' class='king-btn king-info king-btn-mini'>查看</span>" +
                "</div>"},
        ]
    };
    $scope.search = function () {
        loading.open();
        sysService.get_bug_list({}, $scope.filter, function (res) {
            loading.close();
            if (res.result) {
                $scope.bug_list = res.data
            } else {
                alert(res.error)
            }
        })
    };

    $scope.detail_data = {};
    $scope.detail = function (row) {
        $scope.detail_data = row;
        $scope.show_detail = true;
        setTimeout(function () {
            $('.bg_box').addClass('action')
        }, 200)
    }
    $scope.show_detail = false
    $scope.hidde = function (e) {
        if ($(e.target).hasClass('bg')) {
            $('.bg_box').removeClass('action')
            setTimeout(function () {
                $scope.show_detail = false
                $scope.$apply()
            }, 500)
        }
    }

    $scope.search()
    $scope.add = function () {
        var modalInstance = $modal.open({
            templateUrl: static_url + 'client/views/add_bug.html',
            windowClass: 'dialog_custom',
            controller: 'add_bug',
            backdrop: 'static',
            resolve: {
                objectItem: function () {
                    return {op: 'add'}
                }
            }
        });
        modalInstance.result.then(function (res) {
            $scope.search()
        })
    }
    $scope.modify = function (row) {
        var modalInstance = $modal.open({
            templateUrl: static_url + 'client/views/add_bug.html',
            windowClass: 'dialog_custom',
            controller: 'add_bug',
            backdrop: 'static',
            resolve: {
                objectItem: function () {
                    return {op: 'modify', id: row.id}
                }
            }
        });
        modalInstance.result.then(function (res) {
            $scope.search()
        })
    };

    $scope.filter = {
        bug_key:"",
        bug_type: "",
        bug_state: "",
        create_by: "",
        whenStart: $filter('date')($scope.DateStart, 'yyyy-MM-dd'),
        whenEnd: $filter('date')($scope.DateEnd, 'yyyy-MM-dd')
    };
    $scope.updown = function () {
        confirmModal.open({
            text: '是否导出Excel？',
            confirmClick: function () {
                var url = 'down_excel?bug_type=' + $scope.filter.bug_type
                    + '&bug_state=' + $scope.filter.bug_state
                    +'&create_by='+ $scope.filter.create_by
                    +'&whenStart='+ $scope.filter.whenStart
                    +'&bug_key='+ $scope.filter.bug_key
                    +'&whenEnd='+ $scope.filter.whenEnd;
                window.open(url);
            }
        })
    };


}]);
