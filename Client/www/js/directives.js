'use strict';

/* Directives */


angular.module('starter.directives', ['starter.services'])
.directive('autoComplete', function(autoCompleteDataService,Tags) {
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
                    // elem is a jquery lite object if jquery is not present,
                    // but with jquery and jquery ui, it will be a full jquery object.
            elem.autocomplete({
                source: Tags.all(C), //from your service
                minLength: 2
            });
        }
    };
});
