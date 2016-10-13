angular.module('dashlance')
    .factory('Timers', function ($firebaseArray, FirebaseUrl) {
        var timersRef = new Firebase(FirebaseUrl + 'timers/');
        var timers = $firebaseArray(timersRef);

        var Timers = {
            getTimer: function (tid) {
                return $firebaseObject(timersRef.child(uid + '/' + tid));
            },
            getUserTimers: function (uid) {
                return $firebaseArray(timersRef.child(uid));
            },
            createUserTimer: function (uid, timer) {
                return timersRef.child(uid).push(timer);
            },
            all: timers
        };

        return Timers;
    });