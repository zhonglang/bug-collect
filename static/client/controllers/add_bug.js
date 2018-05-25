controllers.controller('add_bug', ["$scope", "sysService", "objectItem", "$modalInstance", "loading", "errorModal", function ($scope, sysService, objectItem, $modalInstance, loading, errorModal) {
    $scope.title = "添加";
    $scope.up = {
        bug_type: '',
        bug_content: '',
        bug_title: '',
        bug_state: '',
        bug_resolvent: '',
        bug_content_type: '',
        customer: '',
    }
    console.log(objectItem)
    if (objectItem.op == 'modify') {
        $scope.title = '修改'
        sysService.search_bug({}, {id: objectItem.id}, function (res) {
            if (res.result) {
                $scope.up = res.data
            }
        })
    }
    $scope.cancel = function () {
        $modalInstance.dismiss("cancel");
    };
    $scope.confirm = function () {
        if($scope.up.bug_type==''){
            alert('请选择类型')
            return
        }
        if (objectItem.op == 'modify') {
            sysService.modify_bug({}, $scope.up, function (res) {
                if (res.result) {
                    $modalInstance.close();
                }else {
                    alert(res.error)
                }
            })
        } else {
            sysService.up_bug({}, $scope.up, function (res) {
                if (res.result) {
                    $modalInstance.close();
                }else{
                    alert(res.error)
                }
            })
        }
    }
}]);