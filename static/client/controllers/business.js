controllers.controller("business", ["$scope", "$filter","loading", "businessService","$interval",function ($scope,  $filter,loading,businessService,$interval) {
     $scope.memory_info=""
    $scope.test_select2='2';
    $scope.testList=[
        // {text:'a',id:2},
        // {text:'b',id:3}
        ];
    $scope.app_data = [];
    $scope.host_list=[]

    $scope.text_text ={text:""};
    $scope.selectOptions2 = {
        data: "testList",
        multiple: false,
        modelData: "test_select2"
    };
        //弹出选中项的id

    //显示业务下的主机
    $scope.confirm = function () {

        $scope.memory_info=""
        loading.open();
        businessService.search_host({}, {h_id: $scope.test_select2}, function (res) {
            loading.close();
            if (res.result) {
                $scope.host_list = res.host_list
            }
            else {
                alert('服务器出错，请联系管理员')
            }
        })

    };
    //显示每台主机的内存信息
    $scope.display_memory=function(id,ip){
         loading.open();
        businessService.get_mem_info({}, {"id":id,"ip":ip}, function (data) {
            if (data.result) {
                loading.close()
               $scope.memory_info=data.memory_info


            } else {
                alert('服务器出错，请联系管理员')
            }
        })

    }
    //获取业务与ID
    $scope.display_business=function () {

        businessService.show_business({}, {}, function (data) {
            if (data.result) {
                $scope.app_data = data.business_list;
                for (var i = 0; i < $scope.app_data.length; i++) {
                    $scope.dict = {};
                    $scope.dict["id"] = $scope.app_data[i]["ApplicationID"];
                    $scope.dict["text"] = $scope.app_data[i]["ApplicationName"];
                    $scope.testList[i] = $scope.dict;
                }
                // alert(JSON.stringify($scope.testList))
            } else {
                alert('服务器出错，请联系管理员')
            }
        })
    }
    $scope.display_business()
    $interval(function(){$scope.confirm()},60*1000);

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
        data: 'host_list',
        enablePaging: true,//true 开启分页, false 关闭分页
        showFooter: true,//ture 开启表格的底部菜单
        pagingOptions: $scope.pagingOptions,//页码下拉框
        totalServerItems: 'totalSerItems',//当前页/总页数
        //columnDefs表格的字段，其中 field:字段名，displayName：列名，width：列宽（可选），cellTemplate：自定义列模板（可选）
        columnDefs: [
            {field: 'app_id', displayName: '业务ID'},
            {field: 'app', displayName: '业务名称'},
            {field: 'hostname', displayName: '主机名'},
            {field: 'os_name', displayName: '主机系统'},
            {field: 'ip', displayName: 'IP'},
            // {
            //     displayName: '内存', width: 310,
            //     cellTemplate: '<div style="width:100%;text-align: center;padding-top: 5px;z-index: 1">' +
            //     '<span  class="label label-info" style="min-width:50px;cursor:pointer;" ng-click="display_memory(row.entity.ApplicationID,row.entity.InnerIP)">内存使用详细信息</span>' +
            //     '</div>'
            // }
            {field: 'memory', displayName: '内存使用率'},

        ]
    };

}]);


