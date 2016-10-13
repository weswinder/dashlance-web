angular.module('dashlance')
    .controller('TimersCtrl', function ($state, $uibModal, Auth, Users, Projects, Timers, Tasks, auth) {
        var timersCtrl = this;
        timersCtrl.loaded = false;
        timersCtrl.projects = null;
        timersCtrl.tasks = null;
        timersCtrl.timers = null;
        timersCtrl.allTasks = [];

        function init() {
            timersCtrl.projects = Projects.getUserProjects(auth.uid);
            timersCtrl.tasks = Tasks.getUserTasks(auth.uid);
            timersCtrl.timers = Timers.getUserTimers(auth.uid);

            timersCtrl.timers.$loaded().then(function (x) {
                timersCtrl.loaded = x === timersCtrl.timers;
            })

            timersCtrl.tasks.$loaded().then(function(tasks) {
                for(var i = 0; i < tasks.length; i++) {
                    for (var key in tasks[i].list1) {
                        if (tasks[i].list1.hasOwnProperty(key)) {
                            tasks[i].list1[key].$id = key;
                            timersCtrl.allTasks.push(tasks[i].list1[key]);
                        }
                    }
                    for (var key in tasks[i].list2) {
                        if (tasks[i].list2.hasOwnProperty(key)) {
                            tasks[i].list2[key].$id = key;
                            timersCtrl.allTasks.push(tasks[i].list2[key]);
                        }
                    }
                    for (var key in tasks[i].list3) {
                        if (tasks[i].list3.hasOwnProperty(key)) {
                            tasks[i].list3[key].$id = key;
                            timersCtrl.allTasks.push(tasks[i].list3[key]);
                        }
                    }
                }
            })
        }

        timersCtrl.getProjectTitle = function (timer) {
            for (var x = 0, lenx = timersCtrl.projects.length; x < lenx; x++) {
                if (timersCtrl.projects[x].$id == timer.projectId) {
                    return timersCtrl.projects[x].title;
                }
            }
            return null;
        };

        timersCtrl.getTaskTitle = function (timer) {
            for (var x = 0, lenx = timersCtrl.allTasks.length; x < lenx; x++) {
                if (timersCtrl.allTasks[x].$id == timer.taskId) {
                    return timersCtrl.allTasks[x].title;
                }
            }
            return '';
        };

        timersCtrl.editTimer = function (timer) {
            var oldStartDate = timer.startDate;
            var oldEndDate = timer.endDate;
            
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/edit_timer_modal.html?' + new Date();
                },
                controller: TimersModalCtrl,
                resolve: {
                    timer: function () {
                        return timer;
                    },
                    auth: function() {
                        return auth;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                //if (results.startDate) results.startDate = parseInt(moment(results.startDate).format('x'));
                //if (results.endDate) results.endDate = parseInt(moment(results.endDate).format('x'));
                if (results.startDate && results.endDate) results.seconds = moment(results.endDate, 'x').diff(moment(results.startDate, 'x'), 'seconds');
                timersCtrl.updateTimer(results);
            }, function() {
                timer.startDate = oldStartDate;
                timer.endDate = oldEndDate;
            });
        };

        timersCtrl.deleteTimer = function (timer) {
            if (confirm("Are you sure you would like to delete this timer?")) {
                timersCtrl.timers.$remove(timer);
            }
        }
        
        timersCtrl.updateTimer = function (timer) {
            timer.updatedAt = Firebase.ServerValue.TIMESTAMP;
            timersCtrl.timers.$save(timer);
        }

        timersCtrl.getStartDate = function (timer) {
            return moment(timer.startDate, "x").format("MM/D/YY h:mm:ss a");
        };
    
        timersCtrl.getEndDate = function (timer) {
            return moment(timer.endDate, "x").format("MM/D/YY h:mm:ss a");
        };

        timersCtrl.getTime = function (timer) {
            return moment().startOf('day').seconds(timer.seconds).format('HH:mm:ss');
        };

        init();

        return timersCtrl
    });