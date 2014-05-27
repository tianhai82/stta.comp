sttaApp.controller('AdminCtrl', function($scope, $modal, $http, $route) {
    $scope.columnCollection = [{
        label: 'Competition',
        map: 'name',
        cellTemplateUrl: '/template/compurl.html'

    }, {
        label: 'Registration Deadline',
        map: 'registrationDeadline',
        formatFunction: 'date'
    }, {
        label: 'No. of Entries',
        map: 'noOfEntries'
    }, {
        label: 'Edit',
        cellTemplateUrl: '/template/custom.html'
    }];
    $scope.rowCollection = [];
    $http.get("/api/competition").success(function(data, status) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].femaleCategories) {
                for (var j = 0; j < data[i].femaleCategories.length; j++) {
                    data[i].femaleCategories[j].selected = true;
                }
            }
            if (data[i].maleCategories) {
                for (var j = 0; j < data[i].maleCategories.length; j++) {
                    data[i].maleCategories[j].selected = true;
                }
            }
            $scope.rowCollection.push(data[i]);
        }
    });
    $scope.globalConfig = {
        isGlobalSearchActivated: true
    };
    $scope.$on('editRow', function(event, competition) {
        var compModalInstance = $modal.open({
            templateUrl: '/template/compmodal.html',
            controller: CompModalInstanceCtrl,
            // size: 'lg',
            resolve: {
                competition: function() {
                    return competition;
                }
            }
        });

        compModalInstance.result.then(function(competition) {
            if (competition.action && competition.action === "delete") {
                $http.delete("/api/competition/" + competition.id, competition).success(function(data, status) {
                    console.log("status: " + status + " data: " + data);
                }).error(function(data, status, headers, config) {
                    console.log("status: " + status + " data: " + data);
                });
                location.reload();
                $route.reload();
            } else {
                $http.put("/api/competition/" + competition.id, competition).success(function(data, status) {
                    console.log("status: " + status + " data: " + data);
                }).error(function(data, status, headers, config) {
                    console.log("status: " + status + " data: " + data);
                });
            }
        }, function() {});
    });
    $scope.addCompetition = function() {
        var compModalInstance = $modal.open({
            templateUrl: '/template/compmodal.html',
            controller: CompModalInstanceCtrl,
            //            size: 'lg',
            resolve: {
                competition: function() {
                    return null;
                }
            }
        });

        compModalInstance.result.then(function(competition) {
            $http.post("/api/competition", competition).success(function(data, status) {
                console.log("status: " + status + " data: " + data);
            }).error(function(data, status, headers, config) {
                console.log("status: " + status + " data: " + data);
            });
            location.reload();
            $route.reload();
            //            $scope.rowCollection.push(competition);
            console.log(competition);
        }, function() {});
    };
});

var CompModalInstanceCtrl = function($scope, $modalInstance, competition) {
    if (competition === null) {
        $scope.isEdit = false;
        $scope.title = "Add Competition";
        $scope.competition = {
            maleCategories: [{
                name: "Men Singles",
                sex: "male",
                selected: true
            }, {
                name: "Boys Under 18",
                sex: "male",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Boys Under 15",
                sex: "male",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Boys Under 12",
                sex: "male",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Boys Under 9",
                sex: "male",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: true
            }],
            femaleCategories: [{
                name: "Women Singles",
                sex: "female",
                selected: true
            }, {
                name: "Girls Under 18",
                sex: "female",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Girls Under 15",
                sex: "female",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Girls Under 12",
                sex: "female",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Girls Under 9",
                sex: "female",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: true
            }],
            admins: []
        };
    } else {
        $scope.title = "Edit Competition";
        $scope.isEdit = true;
        $scope.competition = competition;
        if (!$scope.competition.maleCategories) {
            $scope.competition.maleCategories = [{
                name: "Men Singles",
                sex: "male",
                selected: true
            }, {
                name: "Boys Under 18",
                sex: "male",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Boys Under 15",
                sex: "male",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Boys Under 12",
                sex: "male",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Boys Under 9",
                sex: "male",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: true
            }];
        }
        if (!$scope.competition.femaleCategories) {
            $scope.competition.femaleCategories = [{
                name: "Women Singles",
                sex: "female",
                selected: true
            }, {
                name: "Girls Under 18",
                sex: "female",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Girls Under 15",
                sex: "female",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Girls Under 12",
                sex: "female",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: true
            }, {
                name: "Girls Under 9",
                sex: "female",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: true
            }];
        }
        if (!$scope.competition.admins)
            $scope.competition.admins = [];
    }
    $scope.newCat = {
        sex: null,
        dob: null,
        beforeAfter: null,
        name: null,
        selected: true
    };
    $scope.newAdmin = {
        name: null,
        email: null
    };
    $scope.addCat = function() {
        if ($scope.newCat.sex === "female") {
            $scope.competition.femaleCategories.push($scope.newCat);
        } else if ($scope.newCat.sex === "male") {
            $scope.competition.maleCategories.push($scope.newCat);
        }
    };
    $scope.removeAdmin = function($index) {
        if ($scope.competition.admins) {
            //            var index = $scope.competition.admins.indexOf(newAdmin);
            $scope.competition.admins.splice($index, 1);
        }
    };
    $scope.addAdmin = function() {
        $scope.competition.admins.push({
            name: $scope.newAdmin.name,
            email: $scope.newAdmin.email
        });
        $scope.newAdmin = {
            name: null,
            email: null
        };
    };
    $scope.clear = function() {
        $scope.competition.registrationDeadline = null;
    };
    $scope.dt = {
        minDate: new Date(),
        opened: false
    };

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dt.opened = true;
    };

    $scope.ok = function() {
        for (var i = $scope.competition.maleCategories.length - 1; i >= 0; i--) {
            var category = $scope.competition.maleCategories[i];
            if (!category.selected) {
                $scope.competition.maleCategories.splice(i, 1);
            }
        }
        for (var i = $scope.competition.femaleCategories.length - 1; i >= 0; i--) {
            var category = $scope.competition.femaleCategories[i];
            if (!category.selected) {
                $scope.competition.femaleCategories.splice(i, 1);
            }
        }
        $modalInstance.close($scope.competition);
    };

    $scope.delete = function() {
        var r = confirm("Confirm delete " + $scope.title);
        if (r === true) {
            $modalInstance.close({
                action: "delete",
                id: $scope.competition.id
            });
        }
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

sttaApp.directive('editComp', function() {
    return {
        restrict: 'E',
        //include smart table controller to use its API if needed
        require: '^smartTable',
        template: '<a href="#" ng-click="editRow()">Edit' +
            '</a>',
        replace: true,
        link: function(scope, element, attrs, ctrl) {
            scope.editRow = function() {
                scope.$emit('editRow', scope.dataRow);
            };
        }
    };
});

sttaApp.directive('compUrl', function() {
    return {
        restrict: 'E',
        //include smart table controller to use its API if needed
        require: '^smartTable',
        template: '<a ng-href="{{comp.url}}" target="_blank">{{comp.name}}</a>',
        replace: true,
        link: function(scope, element, attrs, ctrl) {
            scope.comp = {
                url: "/competition/" + scope.dataRow.id,
                name: scope.dataRow.name
            };
        }
    };
});