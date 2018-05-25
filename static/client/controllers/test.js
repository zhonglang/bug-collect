controllers.controller("test", ["$scope", "$rootScope","testService", "$modal","msgModal","confirmModal", "loading",function ($scope, $rootScope,testService, $modal,msgModal,confirmModal,loading) {
// $ajax({
//     url:'/get_bug_list',
//     type:'post',
//     data:{'data':'123'},
//     success:function () {
//         console.log(data)
//     }
//
// })
    $scope.data = []
    $scope.deleteuser = ""
    $scope.changeuser = ""
    //前台跟后台数据交互
    $scope.display_user = function () {
         loading.open()
        testService.test1({}, {}, function (data) {
            loading.close()
            $scope.data = data.user

        })

    }

    $scope.display_user()
    msgModal.open("success","用户信息加载成功")

    $rootScope.del=function(getid){

        confirmModal.open({
           text:"确认删除？",
            confirmClick: function () {
               testService.del_by_id({},{id:getid},function (data) {
            if(data.result){
                $scope.display_user()
                 msgModal.open("success","删除成功")
            }

        })
            }
        })


    }

    $scope.add = function () {
        var modalInstance = $modal.open({
            templateUrl: static_url + 'client/views/add_user.html',
            windowClass: 'dialog_custom',
            controller: 'add_user',
            backdrop: 'static',
            resolve: {
                objectItem: function () {
                    return {op: 'add'}
                }
            }

        });

        modalInstance.result.then(function (res) {

        }, function (res) {
            $scope.display_user()
        })

    }
//  修改用户的弹框
    $scope.modify = function (user_id) {
        // alert(userid)
        var modalInstance = $modal.open({
            templateUrl: static_url + 'client/views/change_user.html',
            windowClass: 'dialog_custom',
            controller: 'change_user',
            backdrop: 'static',
            resolve: {
                objectItem: function () {
                    return {id:user_id}
                }

            }

        });
        modalInstance.result.then(function (res) {

        }, function (res) {
            $scope.display_user()
            msgModal.open("success","修改成功")
        }
            )


    }



    $scope.data = [];//设置数据集为空
    $scope.PagingData = [];//设置分页数据集为空
    $scope.totalSerItems = 0;//设置数据总条数为空
    $scope.pagingOptions = {
        pageSize: "10",//默认一页最多显示10条
        pageSizes: [10, 50, 100],//可选设置一页最多显示10条，20条，50条数据
        currentPage: 1 //默认显示第一页
    };

    //填入表格的数据
    // $scope.data = [
    //     {"username": "小明", "mailbox": "xiaoming@canway.net", "when_created": "2017-01-01"},
    //     {"username": "小红", "mailbox": "xiaohong@canway.net", "when_created": "2017-01-01"}
    // ];

    //将数据进行分页
    $scope.getPagedDataAsync = function (pageSize, page) {
        $scope.setPagingData($scope.data ? $scope.data : [], pageSize, page);
    };
    $scope.setPagingData = function (data, pageSize, page) {
        $scope.PagingData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.totalSerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
    }, true);

    $scope.gridOption = {
        data: 'data',
        enablePaging: true,//true 开启分页, false 关闭分页
        showFooter: true,//ture 开启表格的底部菜单
        pagingOptions: $scope.pagingOptions,//页码下拉框
        totalServerItems: 'totalSerItems',//当前页/总页数
        //columnDefs表格的字段，其中 field:字段名，displayName：列名，width：列宽（可选），cellTemplate：自定义列模板（可选）
        columnDefs: [
            {field: 'name', displayName: '姓名'},
            {field: 'sex', displayName: '性别'},
            {field: 'age', displayName: '年龄'},
            {
                displayName: '操作', width: 310,
                cellTemplate: '<div style="width:100%;text-align: center;padding-top: 5px;z-index: 1">' +
                '<span  class="label label-info" style="min-width:50px;margin-left: 10px;cursor:pointer;" ng-click="modify(row.entity.id)">修改</span>' +
                '<span  class="label label-danger" style="min-width:50px;margin-left: 10px;cursor:pointer;" ng-click="del(row.entity.id)">删除</span>' +
                '</div>'
            }
        ]
    };

}]);
