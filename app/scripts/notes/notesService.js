angular.module('dashlance')
    .factory('Notes', function ($firebaseObject, $firebaseArray, FirebaseUrl) {
        var notesRef = new Firebase(FirebaseUrl + 'notes/');

        var Notes = {
            getUserNotes: function (uid) {
                return $firebaseObject(notesRef.child(uid));
            }
        };

        return Notes;
    });