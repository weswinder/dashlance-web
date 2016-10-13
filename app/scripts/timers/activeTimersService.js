angular.module('dashlance')
    .factory('activeTimers', function ($firebaseObject, FirebaseUrl) {
        var activeTimersRef = new Firebase(FirebaseUrl + 'activeTimers/');

        var activeTimers = {
            getActiveTimer: function (uid) {
                return $firebaseObject(activeTimersRef.child(uid));;
            },
            setActiveTimer: function (uid, activeTimer) {
                return activeTimersRef.child(uid).$set(activeTimer);
            }
        };

        return activeTimers;
    });