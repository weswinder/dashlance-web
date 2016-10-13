/**
 * Dashlance - App config
 *
 * Uses AngularUI Router to manage routing and views
 * Each view is defined as state.
 * Initially there are written states for all views in theme.
 *
 */
function config($stateProvider, $urlRouterProvider) {
    var showTrialOver = false;
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        .state('app', {
            abstract: true,
            url: "",
            controller: "MainCtrl as main",
            templateUrl: "views/common/content.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().catch(function () {
                        $state.go('login');
                    });
                },
                profile: function (Users, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        return Users.getProfile(auth.uid).$loaded();
                    });
                }
            }
        })
        .state('app.dashboard', {
            url: "/dashboard",
            controller: "DashboardCtrl as dashboardCtrl",
            templateUrl: "views/dashboard.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.timers', {
            url: "/timers",
            controller: "TimersCtrl as timersCtrl",
            templateUrl: "views/timers.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.clients', {
            url: "/clients",
            controller: "ClientsCtrl as clientsCtrl",
            templateUrl: "views/clients.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.projects', {
            url: "/projects",
            controller: "ProjectsCtrl as projectsCtrl",
            templateUrl: "views/projects.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.tasks', {
            url: "/tasks",
            controller: "TasksCtrl as tasksCtrl",
            templateUrl: "views/tasks.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.invoices', {
            abstract: true,
            url: "/invoices",
            template: '<ui-view/>',
            controller: "InvoicesCtrl as invoicesCtrl",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.invoices.list', {
            url: "",
            templateUrl: "views/invoices.html"
        })
        .state('app.invoices.edit', {
            url: "/edit/:invoiceId",
            templateUrl: "views/edit_invoice.html",
            controller: "InvoiceCtrl as invoiceCtrl"
        })
        .state('invoicePreview', {
            url: "/invoices/preview/:invoiceId",
            templateUrl: "views/preview_invoice.html",
            controller: "InvoiceCtrl as invoiceCtrl",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().catch(function () {
                        $state.go('login');
                    });
                },
                profile: function (Users, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        return Users.getProfile(auth.uid).$loaded();
                    });
                }
            }
        })
        .state('printInvoice', {
            url: "/invoices/print/:invoiceId",
            templateUrl: "views/print_invoice.html",
            controller: "InvoiceCtrl as invoiceCtrl",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().catch(function () {
                        //$state.go('login');
                    });
                },
                profile: function (Users, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        return Users.getProfile(auth.uid).$loaded();
                    });
                }
            }
        })
        .state('pdfInvoice', {
            url: "/invoices/pdf/:userId/:invoiceId",
            templateUrl: "views/print_invoice.html",
            controller: "InvoiceCtrl as invoiceCtrl",
            resolve: {
                auth: function () {
                    return null;
                }
            }
        })
        .state('app.notes', {
            url: "/notes",
            controller: "NotesCtrl as notesCtrl",
            templateUrl: "views/notes.html",
            resolve: {
                auth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        if (showTrialOver) {
                            $state.go('app.trialOver');
                        } else {
                            return auth;
                        }
                    });
                }
            }
        })
        .state('app.profile', {
            url: "/profile",
            controller: "ProfileCtrl as profileCtrl",
            templateUrl: "views/profile.html",
            resolve: {
                profile: function (Users, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        return Users.getProfile(auth.uid).$loaded();
                    });
                }
            }
        })
        .state('login', {
            url: '/login',
            controller: 'AuthCtrl as authCtrl',
            templateUrl: 'login.html',
            resolve: {
                requireNoAuth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        $state.go('app.dashboard');
                    }, function (error) {
                        return;
                    });
                }
            }
        })
        .state('register', {
            url: '/register',
            controller: 'AuthCtrl as authCtrl',
            templateUrl: 'register.html',
            resolve: {
                requireNoAuth: function ($state, Auth) {
                    return Auth.$requireAuth().then(function (auth) {
                        $state.go('app.dashboard');
                    }, function (error) {
                        return;
                    });
                }
            }
        })
        .state('app.trialOver', {
            url: '/trialover',
            templateUrl: 'views/trial_over.html'
        })
}
angular
    .module('dashlance')
    .config(config)
    .constant('FirebaseUrl', 'https://dashlance-beta.firebaseio.com/')
    .constant('moment', moment)
    .constant('numeral', numeral)
    .run(function ($rootScope, $state, editableOptions) {
        $rootScope.$state = $state;
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    });