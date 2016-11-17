angular.module('interviewApp')
    .controller('booking', function($scope, $state) {
        $scope.cities = ["Chennai", "Kolkata", "Bangalore", "Delhi"];
        $scope.error = ""
        $scope.errorTrue = false;
        $scope.bookFlight = function() {
            console.log($scope.fromCity);
            console.log($scope.toCity);

            console.log($scope.cities.indexOf($scope.toCity));

            if ($scope.fromCity == $scope.toCity) {
                $scope.error = "Cannot have same destination and source";
                $scope.errorTrue = true;
            } else if ($scope.cities.indexOf($scope.toCity) < 0 || $scope.cities.indexOf($scope.fromCity) < 0) {
                $scope.error = "invalid cities";
                console.log("here");
                $scope.errorTrue = true;
            } else {
                $scope.error = ""
                $scope.errorTrue = false;
                var details = $scope.fromCity + "_" + $scope.toCity + "_" + $scope.noTicket
                    // $state.go('flights', {
                    //     bookingDetails: {
                    //         'source' : $scope.fromCity,
                    //         'destination' :$scope.toCity
                    //     }
                    // })
                $state.go('flights', {
                    bookingDetails: details
                })

            }

        }
    });
