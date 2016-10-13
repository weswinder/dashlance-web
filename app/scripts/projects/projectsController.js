angular.module('dashlance')
    .controller('ProjectsCtrl', function ($scope, $uibModal, $state, Auth, Users, Projects, Tasks, Clients, auth) {
        var projectsCtrl = this;

        projectsCtrl.projects = Projects.getUserProjects(auth.uid);
        projectsCtrl.tasks = Tasks.getUserTasks(auth.uid);

        projectsCtrl.tasks.$loaded(function (tasks) {
            for (i=0;i<tasks.length;i++) {
                for (j=0;j<projectsCtrl.projects.length;j++) {
                    if (tasks[i].$id == projectsCtrl.projects[j].$id) {
                        var toDoLength = (tasks[i].list1 == undefined) ? 0 : Object.keys(tasks[i].list1).length;
                        var inProgressLength = (tasks[i].list2 == undefined) ? 0 : Object.keys(tasks[i].list2).length;
                        var completeLength = (tasks[i].list3 == undefined) ? 0 : Object.keys(tasks[i].list3).length;
                        projectsCtrl.projects[j].completion = (completeLength) ? Math.round((completeLength / (toDoLength + inProgressLength + completeLength))*100)/100:0;
                    }
                }
            }
        });

        projectsCtrl.newProject = function () {
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/new_project_modal.html?' + new Date();
                },
                controller: ProjectsModalCtrl,
                resolve: {
                    project: function () {
                        return null;
                    },
                    auth: function() {
                        return auth;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                if (results.dueDate) results.dueDate = parseInt(moment(results.dueDate).format('x'));
                results.createdAt = Firebase.ServerValue.TIMESTAMP;
                results.updatedAt = Firebase.ServerValue.TIMESTAMP;
                Projects.createUserProject(auth.uid, results).key();
            })
        }

        projectsCtrl.editProject = function (project) {
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/edit_project_modal.html?' + new Date();
                },
                controller: ProjectsModalCtrl,
                resolve: {
                    project: function () {
                        return project;
                    },
                    auth: function() {
                        return auth;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                if (results.dueDate) results.dueDate = parseInt(moment(results.dueDate).format('x'));
                projectsCtrl.updateProject(results);
                projectsCtrl.getClient(results);
            })
        };

        projectsCtrl.deleteProject = function (project) {
            if (confirm("Are you sure you would like to delete this project? This will also permanently delete any related tasks.")) {
                Tasks.removeProjectTasks(auth.uid, project.$id).then(function(){
                    projectsCtrl.projects.$remove(project);
                });
            }
        }
        
        projectsCtrl.updateProject = function (project) {
            project.updatedAt = Firebase.ServerValue.TIMESTAMP;
            projectsCtrl.projects.$save(project);
        }

        projectsCtrl.activeProject = function (project) {
            $scope.activeProject = project;
        }
        
        projectsCtrl.getClient = function (project) {
            project.client = Clients.getClient(auth.uid, project.clientId);
        }

        return projectsCtrl
    });