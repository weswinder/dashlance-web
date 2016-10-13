angular.module('dashlance')
    .controller('DashboardCtrl', function ($scope, $uibModal, $state, Auth, Users, Clients, Projects, Tasks, Timers, Invoices, auth) {
        var dashboardCtrl = this;

        dashboardCtrl.toDoLength = 0;
        dashboardCtrl.inProgressLength = 0;
        dashboardCtrl.completeLength = 0;
        dashboardCtrl.timersTotalSeconds = 0;
        dashboardCtrl.invoicesGrandTotal = 0;
        dashboardCtrl.invoicesTotalPayments = 0;

        dashboardCtrl.clients = Clients.getUserClients(auth.uid);
        dashboardCtrl.projects = Projects.getUserProjects(auth.uid);
        dashboardCtrl.tasks = Tasks.getUserTasks(auth.uid);
        dashboardCtrl.timers = Timers.getUserTimers(auth.uid);
        dashboardCtrl.invoices = Invoices.getUserInvoices(auth.uid);

        dashboardCtrl.clients.$loaded(function () {
            console.log(dashboardCtrl.clients);
        });

        dashboardCtrl.projects.$loaded(function () {
            console.log(dashboardCtrl.projects);
        });

        dashboardCtrl.tasks.$loaded(function (tasks) {
            for (i = 0; i < tasks.length; i++) {
                dashboardCtrl.toDoLength += (tasks[i].list1 == undefined) ? 0 : Object.keys(tasks[i].list1).length;
                dashboardCtrl.inProgressLength += (tasks[i].list2 == undefined) ? 0 : Object.keys(tasks[i].list2).length;
                dashboardCtrl.completeLength += (tasks[i].list3 == undefined) ? 0 : Object.keys(tasks[i].list3).length;
            }
        });

        dashboardCtrl.timers.$loaded(function (timers) {
            for (i = 0; i < timers.length; i++) {
                dashboardCtrl.timersTotalSeconds += timers[i].seconds;
            }
        });

        dashboardCtrl.invoices.$loaded(function (invoices) {
            for (i = 0; i < invoices.length; i++) {
                dashboardCtrl.invoicesGrandTotal += invoices[i].total;
                dashboardCtrl.invoicesTotalPayments += invoices[i].payment;
            }
        });

        return dashboardCtrl
    });