/**
 * MainCtrl - controller
 */
function MainCtrl($scope, $state, $uibModal, profile, auth, Auth, Users, Projects) {
    var mainCtrl = this;
    
    mainCtrl.projectList = [];

    mainCtrl.profile = profile;
    mainCtrl.profile.image = auth.password.profileImageURL;

    mainCtrl.logout = function () {
        Auth.$unauth();
        $state.go('login');
    };

    mainCtrl.fetchProjects = function () {
        $scope.projectsRaw = Projects.getUserProjects(auth.uid);
        $scope.projectsRaw.$loaded(function () {
            for (var i = 0; i < $scope.projectsRaw.length; i++) {
                var object = $scope.projectsRaw[i];
                mainCtrl.projectList.push(object);
                if (object.$id == mainCtrl.profile.defaultProjectId) mainCtrl.currentProject = object;
            }
        })
    }

    mainCtrl.switchCurrentProject = function (projectObject) {
        mainCtrl.profile.defaultProjectId = projectObject.$id;
        mainCtrl.profile.$save();
        mainCtrl.currentProject = projectObject;
        $state.transitionTo($state.current, $state.params, {
            reload: true,
            inherit: true,
            notify: true
        });
    }

    mainCtrl.activateSubscription = function () {
        var modalInstance = $uibModal.open({
            templateUrl: function () {
                return 'views/activate_subscription_modal.html?' + new Date();
            },
            controller: SubscriptionModalCtrl
        });

        modalInstance.result.then(function (results) {
            console.log(results);
        })
    }

    mainCtrl.fetchProjects();
};

/**
 * SubscriptionModalCtrl
 */
function SubscriptionModalCtrl($scope, $uibModalInstance) {

    $scope.card = {
    };

    $scope.cardPlaceholders = {
        name: 'Your Full Name',
        number: 'xxxx xxxx xxxx xxxx',
        expiry: 'MM/YY',
        cvc: 'xxx'
    };

    $scope.cardMessages = {
        validDate: 'valid\nthru',
        monthYear: 'MM/YYYY',
    };

    $scope.cardOptions = {
        debug: false,
        formatting: true
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.card);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

angular
    .module('dashlance')
    .controller('MainCtrl', MainCtrl)
    .controller('SubscriptionModalCtrl', SubscriptionModalCtrl)