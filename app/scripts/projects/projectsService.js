angular.module('dashlance')
    .factory('Projects', function ($firebaseObject, $firebaseArray, FirebaseUrl) {
        var projectsRef = new Firebase(FirebaseUrl + 'projects/');
        var projects = $firebaseArray(projectsRef);

        var Projects = {
            getProject: function (uid, pid) {
                return $firebaseObject(projectsRef.child(uid + '/' + pid));
            },
            getUserProjects: function (uid) {
                return $firebaseArray(projectsRef.child(uid));
            },
            createUserProject: function (uid, projectObject) {
                return projectsRef.child(uid).push(projectObject);
            },
            all: projects
        };

        return Projects;
    });