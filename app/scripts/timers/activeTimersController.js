(function () {

    var ActiveTimersController = function ($scope, Timers, activeTimers, Projects, Tasks, $interval, Auth) {
        $scope.loaded = false;
        $scope.counter = null;
        $scope.activeTimer = null;
        $scope.projectsRaw = null;
        $scope.projectsConverted = null;
        $scope.tasksRaw = [];
        $scope.tasksConverted = null;
        $scope.notes = "";
        var _intervalId;

        function fetchProjects () {
            $scope.projectsRaw = Projects.getUserProjects(Auth.$getAuth().uid);
            $scope.projectsRaw.$watch(function () {
                $scope.projectsConverted = [];
                for (var i = 0, len = $scope.projectsRaw.length; i < len; i++) {
                    var _id = $scope.projectsRaw[i].$id;
                    var _title = $scope.projectsRaw[i].title;
                    $scope.projectsConverted.push({
                        id: _id,
                        title: _title
                    });
                };
            });
        }

        function fetchTasks () {

            $scope.tasksConverted = [];
            $scope.tasksRaw = [];
            $scope.toDoTasks = Tasks.getProjectTasksList(Auth.$getAuth().uid, $scope.activeTimer.activeProjectId, "list1");
            $scope.inProgressTasks = Tasks.getProjectTasksList(Auth.$getAuth().uid, $scope.activeTimer.activeProjectId, "list2");
            
            $scope.toDoTasks.$watch(function() {
                $scope.tasksRaw = [];
                $scope.tasksRaw = $scope.tasksRaw.concat($scope.toDoTasks);
                $scope.tasksRaw = $scope.tasksRaw.concat($scope.inProgressTasks);
            });
            
            $scope.inProgressTasks.$watch(function() {
                $scope.tasksRaw = [];
                $scope.tasksRaw = $scope.tasksRaw.concat($scope.toDoTasks);
                $scope.tasksRaw = $scope.tasksRaw.concat($scope.inProgressTasks);
            });

            $scope.$watch('tasksRaw', function () {
                $scope.tasksConverted = [];
                for (var i = 0, len = $scope.tasksRaw.length; i < len; i++) {
                    var _id = $scope.tasksRaw[i].$id;
                    var _title = $scope.tasksRaw[i].title;
                    $scope.tasksConverted.push({
                        id: _id,
                        title: _title
                    });
                };
            });
        }

        function fetchActiveTimer() {
            $scope.activeTimer = activeTimers.getActiveTimer(Auth.$getAuth().uid);

            $scope.activeTimer.$watch(function () {
                if (!$scope.activeTimer.activeProjectId) {
                    $scope.activeTimer.activeProjectId = "";
                }

                if (!$scope.activeTimer.activeTaskId) {
                    $scope.activeTimer.activeTaskId = "";
                }

                if (!$scope.activeTimer.notes) {
                    $scope.activeTimer.notes = "";
                }

                if ($scope.activeTimer.active) {
                    console.log("active");
                    // Watch runs multiple times, so we make sure _intervalId is only assigned once
                    if (!_intervalId) _intervalId = $interval(updateTime, 1000);
                } else {
                    stopTime();
                }
            });

            $scope.activeTimer.$loaded(function () {
                $scope.loaded = true;
            });
        }

        function init() {
            $scope.counter = "00:00:00";
            fetchProjects();
            fetchActiveTimer();

            $scope.activeTimer.$watch(function () {
                fetchTasks();
            });
        }

        function updateTime() {
            var seconds = moment().diff(moment($scope.activeTimer.startDate, 'x'), 'seconds');
            var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
            $scope.counter = elapsed;
        }

        function stopTime() {
            $interval.cancel(_intervalId);
            $scope.counter = "00:00:00";
            _intervalId = null;
        }

        $scope.startTracker = function () {
            if ($scope.activeTimer.activeProjectId) {
                $scope.activeTimer.startDate = moment().format('x');
                $scope.activeTimer.active = true;
                $scope.activeTimer.$save();
            }
        };

        $scope.stopTracker = function () {
            stopTime();

            $scope.activeTimer.active = false;
            if (!!$scope.activeTimer.startDate) {
                var seconds = moment().diff(moment($scope.activeTimer.startDate, 'x'), 'seconds');
                if (seconds > 0) {
                    Timers.createUserTimer(Auth.$getAuth().uid, {
                        "projectId": $scope.activeTimer.activeProjectId,
                        "taskId": $scope.activeTimer.activeTaskId,
                        "startDate": $scope.activeTimer.startDate,
                        "endDate": Firebase.ServerValue.TIMESTAMP,
                        "seconds": seconds,
                        "notes": $scope.activeTimer.notes,
                        "billed": false
                    });
                }
            }
            $scope.activeTimer.$save();
        };

        init();
    };

    ActiveTimersController.$inject = ['$scope', 'Timers', 'activeTimers', 'Projects', 'Tasks', '$interval', 'Auth'];

    angular.module('dashlance').controller('ActiveTimersController', ActiveTimersController);

}());