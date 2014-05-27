compApp.controller('CompCtrl', function($scope, $modal, $http, $route) {
    var competition = JSON.parse($("#competitionDetails").text().trim());
    $scope.columnCollection = [{
        label: 'Player',
        map: 'playerParticipating.name'
    }, {
        label: 'NRIC',
        map: 'playerParticipating.nric'
    }, {
        label: 'Date of Birth',
        map: 'playerParticipating.dob',
        formatFunction: 'date'
    }, {
        label: 'Mobile No',
        map: 'playerParticipating.mobileNo'
    }, {
        label: 'Categories',
        map: 'playerParticipating.categoriesJoined'
    }, {
        label: 'Edit',
        cellTemplateUrl: '/template/editentry.html'
    }];
    $scope.rowCollection = [];
    $scope.globalConfig = {
        isGlobalSearchActivated: true
    };
    $http.get("/api/competition/" + competition.id + "/registration").success(function(data, status) {
        for (var i = 0; i < data.length; i++) {
            $scope.rowCollection.push(data[i]);
        }
    });
    $scope.addEntry = function() {
        var entryModalInstance = $modal.open({
            templateUrl: '/template/entrymodal.html',
            controller: EntryModalInstanceCtrl,
            resolve: {
                registration: function() {
                    return null;
                },
                competition: function() {
                    return competition;
                }
            }
        });
        entryModalInstance.result.then(function(registration) {
            $http.post("/api/competition/" + competition.id + "/registration", registration).success(function(data, status) {
                console.log("status: " + status + " data: " + data);
            }).error(function(data, status, headers, config) {
                console.log("status: " + status + " data: " + data);
            });
            // location.reload();
            // $route.reload();
            // $scope.rowCollection.push(registration);
            // console.log(registration);
        }, function() {});
    };
    $scope.$on('editEntry', function(event, registration) {
        var entryModalInstance = $modal.open({
            templateUrl: '/template/entrymodal.html',
            controller: EntryModalInstanceCtrl,
            resolve: {
                registration: function() {
                    return registration;
                },
                competition: function() {
                    return competition;
                }
            }
        });

        entryModalInstance.result.then(function(registration) {
            if (registration.action && registration.action === "delete") {
                //                $http.delete("/api/competition/" + competition.id, competition).success(function(data, status) {
                //                    console.log("status: " + status + " data: " + data);
                //                }).error(function(data, status, headers, config) {
                //                    console.log("status: " + status + " data: " + data);
                //                });
                //                location.reload();
                //                $route.reload();
            } else {
                //                $http.put("/api/competition/" + competition.id, competition).success(function(data, status) {
                //                    console.log("status: " + status + " data: " + data);
                //                }).error(function(data, status, headers, config) {
                //                    console.log("status: " + status + " data: " + data);
                //                });
            }
        }, function() {});
    });
});
var EntryModalInstanceCtrl = function($scope, $modalInstance, registration, competition) {
    $scope.competition = competition;
    if (registration === null) {
        $scope.isEdit = false;
        $scope.title = "Add Entry";
        $scope.registration = {
            categoriesJoined: [{
                name: "Men Singles",
                sex: "male",
                selected: false
            }, {
                name: "Boys Under 18",
                sex: "male",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Boys Under 15",
                sex: "male",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Boys Under 12",
                sex: "male",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Boys Under 9",
                sex: "male",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Women Singles",
                sex: "female",
                selected: false
            }, {
                name: "Girls Under 18",
                sex: "female",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Girls Under 15",
                sex: "female",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Girls Under 12",
                sex: "female",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Girls Under 9",
                sex: "female",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: false
            }],
            playerParticipating: {
                name: null,
                nric: null,
                chineseName: null,
                mobileNo: null,
                homeNo: null,
                sex: null,
                dob: null,
                school: null,
                address: null,
                email: null,
                ranking: null,
                ratingPoints: null
            }
        };
    } else {
        $scope.title = "Edit Entry";
        $scope.isEdit = true;
        $scope.registration = registration;
        if (!$scope.registration.categoriesJoined) {
            $scope.registration.categoriesJoined = [{
                name: "Men Singles",
                sex: "male",
                selected: false
            }, {
                name: "Boys Under 18",
                sex: "male",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Boys Under 15",
                sex: "male",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Boys Under 12",
                sex: "male",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Boys Under 9",
                sex: "male",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Women Singles",
                sex: "female",
                selected: false
            }, {
                name: "Girls Under 18",
                sex: "female",
                dob: new Date("Jan 01, 1996"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Girls Under 15",
                sex: "female",
                dob: new Date("Jan 01, 1999"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Girls Under 12",
                sex: "female",
                dob: new Date("Jan 01, 2002"),
                beforeAfter: "after",
                selected: false
            }, {
                name: "Girls Under 9",
                sex: "female",
                dob: new Date("Jan 01, 2005"),
                beforeAfter: "after",
                selected: false
            }];
        }
    }

    $scope.clear = function() {
        $scope.registration.dob = null;
    };
    $scope.dt = {
        maxDate: new Date(),
        opened: false
    };
    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dt.opened = true;
    };
    $scope.ok = function() {
        for (var i = $scope.registration.categoriesJoined.length - 1; i >= 0; i--) {
            var category = $scope.registration.categoriesJoined[i];
            if (!category.selected) {
                $scope.registration.categoriesJoined.splice(i, 1);
            }
        }
        $modalInstance.close($scope.registration);
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

compApp.directive('editEntry', function() {
    return {
        restrict: 'E',
        //include smart table controller to use its API if needed
        require: '^smartTable',
        template: '<a href="#" ng-click="editEntry()">Edit' +
            '</a>',
        replace: true,
        link: function(scope, element, attrs, ctrl) {
            scope.editEntry = function() {
                scope.$emit('editEntry', scope.dataRow);
            };
        }
    };
});