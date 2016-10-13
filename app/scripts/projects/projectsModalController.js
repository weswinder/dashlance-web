/**
 * ProjectsModalCtrl
 */
function ProjectsModalCtrl($scope, $uibModalInstance, project, auth, Clients) {
    
    $scope.results = {};
    $scope.clients = Clients.getUserClients(auth.uid);
    
    $scope.today = function () {
        $scope.results.dueDate = new Date();
    };

    if (project) {
        $scope.results = project;
        $scope.results.status = $scope.results.status.toString();
    } else {
        $scope.results = {
            status: "0"
        };
        $scope.today();
    }

    $scope.clear = function () {
        $scope.results.dueDate = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        placement: "top"
    };


    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };

    $scope.setDate = function (year, month, day) {
        $scope.results.dueDate = new Date(year, month, day);
    };

    $scope.formats = ['MM/dd/yy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
    },
        {
            date: afterTomorrow,
            status: 'partially'
    }
  ];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }

    $scope.ok = function () {
        $scope.results.status = parseInt($scope.results.status);
        $uibModalInstance.close($scope.results);
    };

    $scope.cancel = function () {
        $scope.results.status = parseInt($scope.results.status);
        $uibModalInstance.dismiss('cancel');
    };
}

angular
    .module('dashlance')
    .controller('ProjectsModalCtrl', ProjectsModalCtrl)