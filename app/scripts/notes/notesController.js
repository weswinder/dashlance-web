angular.module('dashlance')
    .controller('NotesCtrl', function ($uibModal, $state, Notes, Auth, auth) {
        var notesCtrl = this;

        notesCtrl.notes = Notes.getUserNotes(auth.uid);

        notesCtrl.saveNotes = function () {
            if (!notesCtrl.notes.createdAt) notesCtrl.notes.createdAt = Firebase.ServerValue.TIMESTAMP;
            notesCtrl.notes.updatedAt = Firebase.ServerValue.TIMESTAMP;
            notesCtrl.notes.$save()
        }

        return notesCtrl
    });