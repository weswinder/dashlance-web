angular.module('dashlance')
    .controller('ClientsCtrl', function ($scope, $uibModal, $state, Auth, Users, Clients, auth) {
        var clientsCtrl = this;

        clientsCtrl.clients = Clients.getUserClients(auth.uid);

        clientsCtrl.newClient = function () {
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/new_client_modal.html?' + new Date();
                },
                controller: ClientsModalCtrl,
                resolve: {
                    client: function () {
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                results.createdAt = Firebase.ServerValue.TIMESTAMP;
                results.updatedAt = Firebase.ServerValue.TIMESTAMP;
                Clients.createUserClient(auth.uid, results);
            })
        }

        clientsCtrl.editClient = function (client) {
            var modalInstance = $uibModal.open({
                templateUrl: function () {
                    return 'views/edit_client_modal.html?' + new Date();
                },
                controller: ClientsModalCtrl,
                resolve: {
                    client: function () {
                        return client;
                    }
                }
            });

            modalInstance.result.then(function (results) {
                results.updatedAt = Firebase.ServerValue.TIMESTAMP;
                clientsCtrl.clients.$save(results);
            })
        };

        clientsCtrl.deleteClient = function (client) {
            if (confirm("Are you sure you would like to delete this client?")) {
                clientsCtrl.clients.$remove(client);
            }
        }

        clientsCtrl.activeClient = function (client) {
            $scope.activeClient = client;
        }

        return clientsCtrl
    });