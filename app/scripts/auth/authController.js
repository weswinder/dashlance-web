angular.module('dashlance')
    .controller('AuthCtrl', function (Auth, Users, $state, md5) {
        var authCtrl = this;

        authCtrl.user = {
            email: '',
            password: '',
            name: ''
        };

        authCtrl.login = function () {
            Auth.$authWithPassword(authCtrl.user).then(function (auth) {
                $state.go('app.dashboard');
            }, function (error) {
                authCtrl.error = error;
            });
        };

        authCtrl.register = function () {
            Auth.$createUser(authCtrl.user).then(function (user) {
                Auth.$authWithPassword(authCtrl.user).then(function (auth) {
                    Users.getProfile(auth.uid).$loaded().then(function (profile) {
                        profile.emailHash = md5.createHash(auth.password.email);
                        profile.email = authCtrl.user.email;
                        profile.fullName = authCtrl.user.name;
                        profile.$save();
                        $state.go('app.dashboard');
                    })
                }, function (error) {
                    authCtrl.error = error;
                });
                //authCtrl.login();
            }, function (error) {
                authCtrl.error = error;
            });
        };
    });