angular.module('dashlance')
    .factory('Tasks', function ($firebaseArray, FirebaseUrl, firebaseCheckpointArray) {
        var tasksRef = new Firebase(FirebaseUrl + 'tasks/');
        var tasks = $firebaseArray(tasksRef);

        var Tasks = {
            getUserTasks: function (uid) {
                return $firebaseArray(tasksRef.child(uid));
            },
            getProjectTasksList: function (uid, pid, list) {
                return firebaseCheckpointArray(tasksRef.child(uid + '/' + pid + '/' + list));
            },
            removeProjectTasks: function(uid, pid) {
                return tasksRef.child(uid + '/' + pid).remove();
            },
            all: tasks
        };

        return Tasks;
    });