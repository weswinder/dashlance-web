angular.module('dashlance')
    .controller('ProfileCtrl', function ($state, md5, auth, profile, Auth, FirebaseUrl) {
        var ref = new Firebase(FirebaseUrl);
        var profileCtrl = this;

        profileCtrl.profile = profile;

        profileCtrl.login = {
            oldEmail: profileCtrl.profile.email
        };

        profileCtrl.updateProfile = function () {
            profileCtrl.profile.$save();
        };

        profileCtrl.updateEmail = function () {
            if ((profileCtrl.login.email != profileCtrl.login.newEmail) && profileCtrl.login.password) {
                ref.changeEmail({
                    oldEmail: profileCtrl.login.oldEmail,
                    newEmail: profileCtrl.login.newEmail,
                    password: profileCtrl.login.password
                }, function (error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_PASSWORD":
                                console.log("The specified user account password is incorrect.");
                                break;
                            case "INVALID_USER":
                                console.log("The specified 'Old Email' does not exist.");
                                break;
                            default:
                                console.log("Error creating user:", error);
                        }
                    } else {
                        console.log("User email changed successfully!");
                        profileCtrl.profile.emailHash = md5.createHash(profileCtrl.login.newEmail);
                        profileCtrl.profile.email = profileCtrl.login.newEmail;
                        profileCtrl.login.oldEmail = profileCtrl.login.newEmail;
                        profileCtrl.login.newEmail = null;
                        profileCtrl.login.password = null;
                        profileCtrl.updateProfile();
                    }
                });
            }
        };

        profileCtrl.updatePassword = function () {
            if ((profileCtrl.login.oldPassword != profileCtrl.login.newPassword) && profileCtrl.login.oldEmail) {
                ref.changePassword({
                    email: profileCtrl.login.oldEmail,
                    oldPassword: profileCtrl.login.oldPassword,
                    newPassword: profileCtrl.login.newPassword
                }, function (error) {
                    if (error) {
                        switch (error.code) {
                            case "INVALID_PASSWORD":
                                console.log("The specified user account password is incorrect.");
                                break;
                            case "INVALID_USER":
                                console.log("The specified email does not exist.");
                                break;
                            default:
                                console.log("Error creating user:", error);
                        }
                    } else {
                        console.log("User password changed successfully!");
                        profileCtrl.login.oldPassword = null;
                        profileCtrl.login.newPassword = null;
                    }
                });
            }
        };
    });