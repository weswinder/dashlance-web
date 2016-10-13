angular.module('dashlance')
    .factory('Invoice', function ($q) {
        var Invoice = {
            createPdf: createPdf,
            createBase64Pdf: createBase64Pdf
        };

        function createPdf(invoice) {
            var dd = createDocumentDefinition(invoice);
            return pdfMake.createPdf(dd);
        }
    
        function createBase64Pdf(invoice) {
            return $q(function (resolve, reject) {
                var dd = createDocumentDefinition(invoice);
                var pdf = pdfMake.createPdf(dd);

                pdf.getBase64(function (output) {
                    resolve(base64ToUint8Array(output));
                });
            });
        }

        return Invoice;
    });

function createDocumentDefinition(invoice) {
    //invoice.currency=='EUR' && '&euro;' || invoice.currency=='GBP' && '&pound;' || '$'}}
    var client = invoice.client ? [{ text: invoice.client.companyName || '', alignment: 'left'}, { text: invoice.client.address1 || '', alignment: 'left'}, { text: invoice.client.city + (invoice.client.city && invoice.client.state ? ', ' : '') + invoice.client.state + (invoice.client.state && invoice.client.zip ? ' ' : '') + invoice.client.zip, alignment:'left'}, { text: invoice.client.phoneNumber || '', alignment: 'left'}] : [];
    
    var items = invoice.lineItems ? invoice.lineItems.map(function(item) {
        return [ [item.title || '',{ text: (item.description || ''), color: 'gray', fontSize:9, margin: [1, 1, 0, 0]}], {text:(item.hours || 0).toString(),alignment:'center'}, {text:numeral(item.unitPrice || 0).format('$0,0.00'),alignment:'center'},{text:numeral((item.unitPrice || 0)*(item.hours || 0)).format('$0,0.00'),alignment:'center'} ];
    }) : [];
    
    var commentsTable = invoice.comments ? {
                table: {
                    widths: [65,'*'],
                    body: [
                        [
                            { text: 'Comments:', alignment:'left', bold: true, margin:[5,0,0,0] },
                            { text: invoice.comments, alignment:'left' },
                        ]
                    ]
                },
                margin:[0, 20, 0, 0],
                fillColor: '#EEE',
                layout: 'noBorders'
            } : {};
    
    return {
        footer: function(currentPage, pageCount) { return {columns: [{ width: '*', text: '' },{width: 'auto', text: ' Page ' + currentPage.toString() + ' of ' + pageCount},{ width: '*', text: '' }]};},
        content: [
            { text: 'INVOICE', style: 'header'},
            {
                style: 'infoTable',
                table: {
                    widths: ['*', 100, 110],
                    headerRows: 1,
                    body: [
                        [   '',
                            {text: 'Invoice Number: ', alignment:'right', bold: true},
                            { text: ("0000" + invoice.number).substr(-4,4), alignment:'left' },
                        ],
                        [
                            '',
                            {text: 'Invoice Date: ', alignment:'right', bold: true},
                            { text: invoice.invoiceDate || '', alignment:'left' },
                        ],
                        [
                            '',
                            {text: 'Payment Due: ', alignment:'right', bold: true},
                            { text: invoice.dueDate || '', alignment:'left' },
                        ],
                        [
                            '',
                            {text: 'Amount Due: ', alignment:'right', bold: true, fillColor: '#EEE'},
                            { text: numeral(invoice.total || 0).format('$0,0.00'), alignment:'left', fillColor: '#EEE'},
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
                style:'fromToTable',
                table: {
                    widths: [150, '*', 150],
                    body: [
                        [   
                            { text: 'From:', style: 'subheader'},
                            '',
                            { text: 'To:', style: 'subheader', alignment: 'left'}
                        ],
                        [
                            [{ text: invoice.user.companyName || '' }, { text: invoice.user.address1 || '' }, { text: invoice.user.city + (invoice.user.city && invoice.user.state ? ', ' : '') + invoice.user.state + (invoice.user.state && invoice.user.zip ? ' ' : '') + invoice.user.zip}, { text: invoice.user.phoneNumber || '' }],
                            '',
                            client
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            {
                style: 'itemsTable',
                table: {
                    widths: ['*', 60, 60, 80],
                    headerRows: 1,
                    body: [
                        [ 
                            { text: 'Items', style: 'itemsTableHeader' },
                            { text: 'Quantity', style: 'itemsTableHeader', alignment:'center' },
                            { text: 'Price', style: 'itemsTableHeader', alignment:'center' },
                            { text: 'Total', style: 'itemsTableHeader', alignment:'center' },
                        ]
                    ].concat(items)
                },
                layout: 'lightHorizontalLines'
            },
            {
                style: 'totalsTable',
                table: {
                    widths: ['*', 75, 80],
                    body: [
                        [   '',
                            { text: 'Subtotal:', alignment:'right', bold: true },
                            { text: numeral(invoice.subtotal || 0).format('$0,0.00'), alignment:'right' },
                        ],
                        [
                            '',
                            { text: 'Tax (' + (invoice.taxPercent || 0) + '%):', alignment:'right', bold: true },
                            { text: numeral(invoice.taxTotal || 0).format('$0,0.00'), alignment:'right' },
                        ],
                        [
                            '',
                            { text: 'Total (' + invoice.currency + '):', alignment:'right', bold: true},
                            { text: numeral(invoice.total || 0).format('$0,0.00'), alignment:'right', bold: true},
                        ]
                    ]
                },
                layout: 'noBorders'
            },
            commentsTable
        ],
        styles: {
            header: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 5],
                alignment: 'right'
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            itemsTable: {
                margin: [0, 5, 0, 15]
            },
            itemsTableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            totalsTable: {
                margin: [0, 30, 0, 0]
            },
            infoTable: {
                margin: [0, 10, 0, 10]
            },
            fromToTable: {
               margin: [0, 0, 0, 25] 
            }
        },
        defaultStyle: {
        }
    }
}

function base64ToUint8Array(base64) {  
    var raw = atob(base64);
    var uint8Array = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
}