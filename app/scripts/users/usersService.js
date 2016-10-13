angular.module('dashlance')
    .factory('Users', function ($firebaseArray, $firebaseObject, FirebaseUrl) {
        var usersRef = new Firebase(FirebaseUrl + 'users');
        var users = $firebaseArray(usersRef);

        var Users = {
            getProfile: function (uid) {
                return $firebaseObject(usersRef.child(uid));
            },
            getFullName: function (uid) {
                return users.$getRecord(uid).fullName;
            },
            getDefaultProjectId: function(uid) {
                return users.$getRecord(uid).defaultProjectId;
            },
            getGravatar: function (uid) {
                return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
            },
            all: users
        };

        return Users;
    });