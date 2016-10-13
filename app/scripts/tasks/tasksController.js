angular.module('dashlance')
    .controller('TasksCtrl', function ($scope, $uibModal, $state, $filter, Auth, Users, Projects, Tasks, auth, profile) {
        var tasksCtrl = this;
        tasksCtrl.currentProject = profile.defaultProjectId;

        tasksCtrl.newTask = function () {
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/new_task_modal.html?' + new Date();
                },
                controller: TasksModalCtrl,
                resolve: {
                    task: function () {
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                results.createdAt = Firebase.ServerValue.TIMESTAMP;
                results.updatedAt = Firebase.ServerValue.TIMESTAMP;
                results.type = parseInt(results.type);
                if (results.type == 1) {
                    results.statusClass = "danger";
                } else if (results.type == 2) {
                    results.statusClass = "info";
                } else {
                    results.statusClass = "warning";
                }
                tasksCtrl.todoList.unshift(results);
                tasksCtrl.todoList.saveChanges();
                tasksCtrl.todoList.checkpoint();
            })
        }

        tasksCtrl.editTask = function (task, list) {
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/edit_task_modal.html?' + new Date();
                },
                controller: TasksModalCtrl,
                resolve: {
                    task: function () {
                        return task;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                results.updatedAt = Firebase.ServerValue.TIMESTAMP;
                results.type = parseInt(results.type);
                if (results.type == 1) {
                    results.statusClass = "danger";
                } else if (results.type == 2) {
                    results.statusClass = "info";
                } else {
                    results.statusClass = "warning";
                }
                list.$save(results);
                list.saveChanges();
                list.checkpoint();
            })
        };

        tasksCtrl.deleteTask = function (task, list) {
            if (confirm("Are you sure you would like to delete this task?")) {
                list.$remove(task);
                list.saveChanges();
                list.checkpoint();
            }
        }

        tasksCtrl.fetchTasks = function () {
            // We need to properly check for the case where there are no tasks for a project
            var project = $filter('filter')($scope.projectList, {
                id: tasksCtrl.currentProject
            })[0];

            if (project) {
                tasksCtrl.todoList = Tasks.getProjectTasksList(auth.uid, project.id, "list1");
                tasksCtrl.inProgressList = Tasks.getProjectTasksList(auth.uid, project.id, "list2");
                tasksCtrl.completedList = Tasks.getProjectTasksList(auth.uid, project.id, "list3");
                
                tasksCtrl.todoList.$loaded().then(function () {
                    // add a checkpoint to track sorting changes
                    tasksCtrl.todoList.checkpoint();
                });

                tasksCtrl.inProgressList.$loaded().then(function () {
                    // add a checkpoint to track sorting changes
                    tasksCtrl.inProgressList.checkpoint();
                });

                tasksCtrl.completedList.$loaded().then(function () {
                    // add a checkpoint to track sorting changes
                    tasksCtrl.completedList.checkpoint();
                });
            }
        }

        tasksCtrl.fetchProjects = function () {
            $scope.projectsRaw = Projects.getUserProjects(auth.uid);

            $scope.projectsRaw.$watch(function () {
                $scope.projectList = [];
                for (var i = 0; i < $scope.projectsRaw.length; i++) {
                    var _id = $scope.projectsRaw[i].$id;
                    var _title = $scope.projectsRaw[i].title;
                    $scope.projectList.push({
                        id: _id,
                        title: _title
                    });
                }
                tasksCtrl.fetchTasks();
            })
        }

        $scope.$watch('tasksCtrl.currentProject', function () {
            profile.defaultProjectId = tasksCtrl.currentProject;
            profile.$save();
        });

        $scope.sortableOptions = {
            connectWith: ".connectList",
            scroll: true,
            stop: function (e, ui) {
                tasksCtrl.todoList.saveChanges();
                tasksCtrl.todoList.checkpoint();
                tasksCtrl.inProgressList.saveChanges();
                tasksCtrl.inProgressList.checkpoint();
                tasksCtrl.completedList.saveChanges();
                tasksCtrl.completedList.checkpoint();
            }
        }

        tasksCtrl.fetchProjects();

        return tasksCtrl
    });