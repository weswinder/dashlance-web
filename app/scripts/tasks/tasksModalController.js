/**
 * TasksModalCtrl
 */
function TasksModalCtrl($scope, $uibModalInstance, task) {

    $scope.results = {};

    if (task) {
        $scope.results = task;
        $scope.results.type = $scope.results.type.toString();
    } else {
        $scope.results = {
            type: "0"
        };
    }

    $scope.ok = function () {
        $scope.results.type = parseInt($scope.results.type);
        $uibModalInstance.close($scope.results);
    };

    $scope.cancel = function () {
        $scope.results.type = parseInt($scope.results.type);
        $uibModalInstance.dismiss('cancel');
    };
}

angular
    .module('dashlance')
    .controller('TasksModalCtrl', TasksModalCtrl)