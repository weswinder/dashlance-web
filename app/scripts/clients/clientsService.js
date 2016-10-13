angular.module('dashlance')
    .factory('Clients', function ($firebaseObject, $firebaseArray, FirebaseUrl) {
        var clientsRef = new Firebase(FirebaseUrl + 'clients/');
        var clients = $firebaseArray(clientsRef);

        var Clients = {
            getClient: function (uid, cid) {
                return $firebaseObject(clientsRef.child(uid + '/' + cid));
            },
            getUserClients: function (uid) {
                return $firebaseArray(clientsRef.child(uid));
            },
            createUserClient: function (uid, clientObject) {
                return clientsRef.child(uid).push(clientObject);
            },
            all: clients
        };

        return Clients;
    });