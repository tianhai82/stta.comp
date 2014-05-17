var sttaApp = angular.module('SttaApp', ['ui.bootstrap', 'smartTable.table']);

sttaApp.controller('SttaCtrl', function($scope) {
    $scope.columnCollection = [
        {label: 'Competition', map: 'competition'},
        {label: 'Registration Deadline', map: 'registrationDeadline', formatFunction: 'date'},
        {label: 'No. of Entries', map: 'noOfEntries'},
        {label: 'Edit', cellTemplateUrl: '/template/custom.html'}
    ];
    $scope.rowCollection = [
        {competition: "Dr Ng", registrationDeadline: "1987-05-21", noOfEntries: 20},
        {competition: "Dr Ng", registrationDeadline: "1987-05-21", noOfEntries: 20},
        {competition: "Dr Ng", registrationDeadline: "1987-05-21", noOfEntries: 20},
        {competition: "Dr Ng", registrationDeadline: "1987-05-21", noOfEntries: 20}
    ];
    $scope.globalConfig = {
        isGlobalSearchActivated: true
    };
    $scope.doAction = function() {
        alert("test");
    };
});
sttaApp.directive('editRow', function () {
    return {
        restrict: 'E',
        //include smart table controller to use its API if needed
        require: '^smartTable',
        template: '<a href="#" ng-click="editRow()">Edit' +
                '</a>',
        replace: true,
        link: function (scope, element, attrs, ctrl) {
            scope.editRow = function(){
              alert(JSON.stringify(scope.dataRow));
            };
        }
    };
});