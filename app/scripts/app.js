/**
 * Dashlance - App init
 *
 */
(function () {
    angular.module('dashlance', [
        'ui.router',                    // Routing
        'ui.bootstrap',                 // Bootstrap
        'ui.bootstrap.datetimepicker',  // Datetimepicker
        'ui.sortable',                 	// Sortable
        'firebase',						// Firebase
        'angular-md5',					// MD5
        'firebase.checkpointArray',     // firebaseCheckpointArray()
        'xeditable',					// Xeditable
        'gavruk.card',                  // Card
        'pdf',                          // Angular PDF,
        'truncate'                      // Angular Truncate
    ])
})();