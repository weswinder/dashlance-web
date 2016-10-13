/**
 * ClientsModalCtrl
 */
function ClientsModalCtrl($scope, $uibModalInstance, client) {

    $scope.results = {};

    if (client) {
        $scope.results = client;
    } else {
        $scope.results = {
            companyName: '',
            fullName: '',
            emailAddress: '',
            phoneNumber: '',
            website: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        };
    }

    $scope.ok = function () {
        $scope.results.createdAt = moment().format('x');
        $uibModalInstance.close($scope.results);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

angular
    .module('dashlance')
    .controller('ClientsModalCtrl', ClientsModalCtrl)