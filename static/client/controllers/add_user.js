controllers.controller("add_user", ["$scope", "testService","$modal","objectItem","$modalInstance",function ($scope,testService,$modal,objectItem,$modalInstance) {

    $scope.title = "添加用户";
    $scope.up={
        name:'',
        sex:'',
        age:'',

    }
    $scope.confirm=function () {
        testService.add({},$scope.up,function(data) {
            if(data.result){
                $modalInstance.dismiss("cancel")
            }

        })
    }


}]);