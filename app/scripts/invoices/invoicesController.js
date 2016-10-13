angular.module('dashlance')
    .controller('InvoicesCtrl', function ($uibModal, $state, Auth, Users, Projects, Invoices, auth, profile, Invoice) {
        var invoicesCtrl = this;

        invoicesCtrl.isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

        invoicesCtrl.invoices = Invoices.getUserInvoices(auth.uid);

        invoicesCtrl.newInvoice = function () {
            var invoiceKey = Invoices.createUserInvoice(auth.uid, {
                status: "Draft",
                number: 1,
                invoiceDate: moment().format('MMMM D, YYYY'),
                dueDate: moment().format('MMMM D, YYYY'),
                subtotal: 0,
                total: 0,
                payment: 0,
                lineItems: [],
                user: {
                    companyName: profile.companyName ? profile.companyName : '',
                    address1: profile.address1 ? profile.address1 : '',
                    address2: profile.address2 ? profile.address2 : '',
                    city: profile.city ? profile.city : '',
                    state: profile.state ? profile.state : '',
                    zip: profile.zip ? profile.zip : '',
                    phoneNumber: profile.phoneNumber ? profile.phoneNumber : '',
                },
                client: {
                    companyName: '',
                    fullName: '',
                    emailAddress: '',
                    phoneNumber: '',
                    website: '',
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: ''
                },
                taxPercent: 0,
                taxTotal: 0,
                currency: 'USD',
                comments: '',
                createdAt: Firebase.ServerValue.TIMESTAMP,
                updatedAt: Firebase.ServerValue.TIMESTAMP
            }).key();
            $state.go('app.invoices.edit', {
                invoiceId: invoiceKey
            });
        }

        invoicesCtrl.deleteInvoice = function (invoice) {
            if (confirm("Are you sure you would like to delete this invoice?")) {
                invoicesCtrl.invoices.$remove(invoice);
            }
        }
        
        invoicesCtrl.downloadInvoice = function (invoice) {
            Invoice.createPdf(invoice).download('invoice' + invoice.number + '.pdf');
        }

        invoicesCtrl.printInvoice = function (invoice) {
            Invoice.createPdf(invoice).print();
        }

        invoicesCtrl.contentLoaded = true;

        return invoicesCtrl
    });