angular.module('dashlance')
    .factory('Invoices', function ($firebaseObject, $firebaseArray, FirebaseUrl) {
        var invoicesRef = new Firebase(FirebaseUrl + 'invoices/');
        var invoices = $firebaseArray(invoicesRef);

        var Invoices = {
            getUserInvoice: function (uid, iid) {
                return $firebaseObject(invoicesRef.child(uid + '/' + iid));
            },
            getUserInvoices: function (uid) {
                return $firebaseArray(invoicesRef.child(uid));
            },
            createUserInvoice: function (uid, invoiceObject) {
                return invoicesRef.child(uid).push(invoiceObject);
            },
            all: invoices
        };

        return Invoices;
    });