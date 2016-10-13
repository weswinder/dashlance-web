/**
 * TimersModalCtrl
 */
function TimersModalCtrl($scope, $uibModalInstance, timer, auth, Projects, Tasks) {
    $scope.isOpen1 = false;
    $scope.results = {};

    if (timer) {
        $scope.results = timer;
    }

    $scope.openCalendar1 = function (e) {
        e.preventDefault();
        e.stopPropagation();

        $scope.isOpen1 = true;
    };

    $scope.isOpen2 = false;

    $scope.openCalendar2 = function (e) {
        e.preventDefault();
        e.stopPropagation();

        $scope.isOpen2 = true;
    };

    $scope.unixToDate = function (number) {
        return moment(number, "x").toDate()
    }

    $scope.dateToUnix = function (date) {
        return parseInt(moment(date).format('x'));
    }

    function fetchProjects() {
        $scope.projectsRaw = Projects.getUserProjects(auth.uid);
        $scope.projectsRaw.$watch(function () {
            $scope.projects = [];
            for (var i = 0, len = $scope.projectsRaw.length; i < len; i++) {
                var _id = $scope.projectsRaw[i].$id;
                var _title = $scope.projectsRaw[i].title;
                $scope.projects.push({
                    id: _id,
                    title: _title
                });
            };
        });
    }

    function fetchTasks() {

        $scope.tasks = [];
        $scope.tasksRaw = [];
        $scope.toDoTasks = Tasks.getProjectTasksList(auth.uid, $scope.results.projectId, "list1");
        $scope.inProgressTasks = Tasks.getProjectTasksList(auth.uid, $scope.results.projectId, "list2");

        $scope.toDoTasks.$watch(function () {
            $scope.tasksRaw = [];
            $scope.tasksRaw = $scope.tasksRaw.concat($scope.toDoTasks);
            $scope.tasksRaw = $scope.tasksRaw.concat($scope.inProgressTasks);
        });

        $scope.inProgressTasks.$watch(function () {
            $scope.tasksRaw = [];
            $scope.tasksRaw = $scope.tasksRaw.concat($scope.toDoTasks);
            $scope.tasksRaw = $scope.tasksRaw.concat($scope.inProgressTasks);
        });

        $scope.$watch('tasksRaw', function () {
            $scope.tasks = [];
            for (var i = 0, len = $scope.tasksRaw.length; i < len; i++) {
                var _id = $scope.tasksRaw[i].$id;
                var _title = $scope.tasksRaw[i].title;
                $scope.tasks.push({
                    id: _id,
                    title: _title
                });
            };
        });
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.results);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    fetchProjects();
    fetchTasks();
    
    $scope.fetchProjects = fetchProjects;
    $scope.fetchTasks = fetchTasks;
}

angular
    .module('dashlance')
    .controller('TimersModalCtrl', TimersModalCtrl)