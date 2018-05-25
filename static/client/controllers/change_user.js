controllers.controller("change_user", ["$scope", "testService", "$modal", "objectItem", "$modalInstance", function ($scope, testService, $modal, objectItem, $modalInstance) {
$scope.title="修改信息"
    $scope.person={
    name:'',
    sex:'',
    age:'',

}

    //alert(objectItem.id);
    testService.get_detail({},objectItem,function (data) {
        if(data.result){
            $scope.person=data.person
            // alert($scope.person)
        }
        
    })
    $scope.change=function () {
        testService.change_user({},$scope.person,function(data) {
            if(data.result){
                $modalInstance.dismiss("cancel")
            }

        })
    }



}]);