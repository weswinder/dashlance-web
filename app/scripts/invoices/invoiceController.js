angular.module('dashlance')
    .controller('InvoiceCtrl', function ($uibModal, $state, $scope, Users, Projects, Invoices, Clients, auth, Invoice) {
        var invoiceCtrl = this;

        invoiceCtrl.isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

        setDefaultsForPdfViewer($scope);

        if ($state.params.userId) {
            invoiceCtrl.invoice = Invoices.getUserInvoice($state.params.userId, $state.params.invoiceId);
            invoiceCtrl.clients = Clients.getUserClients($state.params.userId);
        } else {
            invoiceCtrl.invoice = Invoices.getUserInvoice(auth.uid, $state.params.invoiceId);
            invoiceCtrl.clients = Clients.getUserClients(auth.uid);
        }
    
        invoiceCtrl.invoice.$loaded(function() {
            invoiceCtrl.createInvoice();
        });

        invoiceCtrl.setSubtotal = function () {
            var subtotal = 0;
            if (invoiceCtrl.invoice.lineItems) {
                for (var i = 0; i < invoiceCtrl.invoice.lineItems.length; i++) {
                    var line = invoiceCtrl.invoice.lineItems[i];
                    if (line.hours && line.unitPrice) {
                        subtotal += (line.hours * line.unitPrice);
                    }
                }
            }
            invoiceCtrl.invoice.subtotal = subtotal;
        }

        invoiceCtrl.setTotal = function () {
            if (invoiceCtrl.invoice.taxPercent) {
                invoiceCtrl.invoice.total = invoiceCtrl.invoice.subtotal + (invoiceCtrl.invoice.subtotal * (invoiceCtrl.invoice.taxPercent / 100));
            } else {
                invoiceCtrl.invoice.total = invoiceCtrl.invoice.subtotal;
            }
        }
        
        invoiceCtrl.setItemTotal = function (item) {
            if (item.hours && item.unitPrice) {
                item.total = item.unitPrice * item.hours;
            } else {
                item.total = 0;
            }
        }

        invoiceCtrl.setTaxTotal = function () {
            if (invoiceCtrl.invoice.taxPercent) {
                invoiceCtrl.invoice.taxTotal = invoiceCtrl.invoice.subtotal * (invoiceCtrl.invoice.taxPercent / 100);
            } else {
                invoiceCtrl.invoice.taxTotal = 0;
            }
        }

        invoiceCtrl.addItem = function () {
            invoiceCtrl.invoice.lineItems ? invoiceCtrl.invoice.lineItems.push({}) : invoiceCtrl.invoice.lineItems = [{}];
        }

        invoiceCtrl.setInvoiceClient = function () {
            for (var i = 0; i < invoiceCtrl.clients.length; i++) {
                if (invoiceCtrl.clients[i].$id == invoiceCtrl.invoice.client.id) {
                    invoiceCtrl.invoice.client = invoiceCtrl.clients[i];
                    invoiceCtrl.invoice.client.id = invoiceCtrl.clients[i].$id;
                    invoiceCtrl.invoice.$save();
                }
            }
        }

        invoiceCtrl.lineItemsChange = function () {
            invoiceCtrl.setSubtotal();
            if (!isNaN(invoiceCtrl.invoice.subtotal)) {
                invoiceCtrl.setTotal();
                invoiceCtrl.setTaxTotal();
            }
            invoiceCtrl.invoice.$save();
        }

        invoiceCtrl.downloadInvoice = function () {
            Invoice.createPdf(invoiceCtrl.invoice).download('invoice' + invoiceCtrl.invoice.number + '.pdf');
        }

        invoiceCtrl.printInvoice = function () {
            Invoice.createPdf(invoiceCtrl.invoice).print();
        }

        invoiceCtrl.createInvoice = function () {
            Invoice.createBase64Pdf(invoiceCtrl.invoice)
                .then(function (pdf) {
                    var blob = new Blob([pdf], {
                        type: 'application/pdf'
                    });
                    $scope.pdfUrl = URL.createObjectURL(blob);
                });
        };
    
        invoiceCtrl.updateInvoice = function () {
            invoiceCtrl.invoice.updatedAt = Firebase.ServerValue.TIMESTAMP;
            invoiceCtrl.invoice.$save();
        }

        invoiceCtrl.contentLoaded = true;

        return invoiceCtrl
    });

function setDefaultsForPdfViewer($scope) {
    $scope.scroll = 0;
    $scope.loading = 'loading';

    $scope.onError = function (error) {
        console.error(error);
    };

    $scope.onLoad = function () {
        $scope.loading = '';
    };

    $scope.onProgress = function (progress) {
        console.log(progress);
    };
}