angular.module('interviewApp')
    .controller('flights', function($stateParams, $scope, $state, $http) {
        $scope.flightData = [];
        $scope.renderData = [];
        $scope.airlines = [];
        $scope.selectedAirlines = [];
        $scope.minDuration = 1441;
        $scope.maxDuration = 0;
        $scope.minPrice = Number.MAX_VALUE;
        $scope.maxPrice = 0;


        var date = new Date()
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        $scope.maxArrival = date;
        $scope.maxDeparture = date;

        var date = new Date()
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        $scope.minDeparture = date;
        $scope.minArrival = date;

        $scope.selectedDuration = [];
        $scope.durationArray = [];

        $scope.selectedArrival = [];
        $scope.ArrivalArray = [];
        $scope.selectedDeparture = [];
        $scope.DepartureArray = [];



        if ($state.params.bookingDetails == null || $state.params.bookingDetails == "") {
            $state.go('bookings');
        } else {
            var details = $state.params.bookingDetails.split("_"); //check later for responses;
            $http.get("http://localhost:8000/data.json").then(function(response) {
                for (data in response.data) {
                    if (response.data[data].From.toLowerCase() == details[0].toLowerCase() &&
                        response.data[data].To.toLowerCase() == details[1].toLowerCase() &&
                        parseInt(response.data[data]["Seats Available"]) >= details[2].toLowerCase()) {
                        response.data[data]["Price"] = parseInt(response.data[data]["Price"]);
                        $scope.maxPrice = Math.max($scope.maxPrice, response.data[data]["Price"]);
                        $scope.minPrice = Math.min($scope.minPrice, response.data[data]["Price"]);
                        response.data[data]["SeatsAvailable"] = parseInt(response.data[data]["Seats Available"]);
                        var minutes = parseInt(response.data[data]["Duration"].split(" ")[0]) * 60;
                        if (response.data[data]["Duration"].split(" ")[2] != null) {
                            minutes = minutes + parseInt(response.data[data]["Duration"].split(" ")[2])
                        }

                        var timeArr = response.data[data].Departure.split(":");
                        var date = new Date()
                        date.setHours(timeArr[0]);
                        date.setMinutes(timeArr[1]);
                        date.setSeconds(0);

                        response.data[data]["Departure"] = date;
                        if ($scope.minDeparture > date)
                            $scope.minDeparture = date;
                        if ($scope.maxDeparture < date)
                            $scope.maxDeparture = date;

                        var timeArr = response.data[data].Arrival.split(":");
                        var date = new Date()
                        date.setHours(timeArr[0]);
                        date.setMinutes(timeArr[1]);
                        date.setSeconds(0);
                        response.data[data]["Arrival"] = date;

                        if ($scope.minArrival > date)
                            $scope.minArrival = date;
                        if ($scope.maxArrival < date)
                            $scope.maxArrival = date;

                        response.data[data]["DurationMinute"] = minutes;
                        $scope.minDuration = Math.min($scope.minDuration, minutes);
                        $scope.maxDuration = Math.max($scope.minDuration, minutes);
                        $scope.flightData.push(response.data[data]);
                        $scope.renderData.push(response.data[data]);
                        var airline = response.data[data].Airline;
                        if ($scope.airlines.indexOf(airline) < 0) {
                            $scope.airlines.push(airline);
                            $scope.selectedAirlines.push(airline);
                        }
                    }
                }

                for (i = Math.ceil($scope.minDuration / 60); i <= Math.ceil($scope.maxDuration / 60); i++) {
                    $scope.durationArray.push(i);
                    $scope.selectedDuration.push(i);
                }

                var maxHr = $scope.maxArrival.getHours();
                if ($scope.maxArrival.getMinutes() > 0) {
                    maxHr = maxHr + 1;
                }
                for (d = $scope.minArrival.getHours(); d <= maxHr + 3; d = d + 3) {
                    var date = new Date();
                    date.setHours(d);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    $scope.ArrivalArray.push(date);
                    $scope.selectedArrival.push(date);
                }

                var maxHr = $scope.maxDeparture.getHours();
                if ($scope.maxDeparture.getMinutes() > 0) {
                    maxHr = maxHr + 1;
                }
                for (d = $scope.minDeparture.getHours(); d <= maxHr + 3; d = d + 3) {
                    var date = new Date();
                    date.setHours(d);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    $scope.DepartureArray.push(date);
                    $scope.selectedDeparture.push(date);

                }

                $scope.slider = {
                    min: $scope.minPrice,
                    max: $scope.maxPrice,
                    options: {
                        floor: $scope.minPrice,
                        ceil: $scope.maxPrice,
                        onChange: $scope.render,
                        minRange: 1
                    }
                };

            });
        }
        $scope.orderByList = [];
        $scope.Sort = function(filter) {
            if ($scope.orderByList.indexOf(filter) > -1) {
                var index = $scope.orderByList.indexOf(filter);
                $scope.orderByList.splice(index, 1);
                $scope.orderByList.unshift("-" + filter);
            } else if ($scope.orderByList.indexOf(("-" + filter)) > -1) {
                var index = $scope.orderByList.indexOf(("-" + filter));
                $scope.orderByList.splice(index, 1);
                $scope.orderByList.unshift(filter);
            } else {
                $scope.orderByList.unshift(filter)
            }
        }
        $scope.render = function() {
            $scope.renderData = [];
            for (data in $scope.flightData) {
                if ($scope.selectedAirlines.indexOf($scope.flightData[data]['Airline']) > -1 &&
                    $scope.flightData[data]['Price'] >= $scope.slider.min &&
                    $scope.flightData[data]['Price'] <= $scope.slider.max &&
                    $scope.selectedDuration.indexOf(Math.ceil($scope.flightData[data]['DurationMinute'] / 60)) > -1) {
                    $scope.renderData.push($scope.flightData[data]);
                }
            }

            var length = $scope.renderData.length;
            for (data = 0; data < length; data++) {
                var arrLength = $scope.selectedArrival.length;
                var present = false;
                for (var i = 0; i < arrLength; i++) {

                    var nextDate = new Date();
                    nextDate.setHours($scope.selectedArrival[i].getHours() + 3);
                    nextDate.setMinutes(0);
                    nextDate.setSeconds(0);
                    if($scope.renderData[data].Arrival >= $scope.selectedArrival[i] && $scope.renderData[data].Arrival < nextDate )
                    {
                      present = true;
                    }
                }
                if (present == false) {
                    $scope.renderData.splice(data, 1);
                    data = data - 1;
                    length = length - 1;
                }
            }

            var length = $scope.renderData.length;
            for (data = 0; data < length; data++) {
                var arrLength = $scope.selectedDeparture.length;
                var present = false;
                for (var i = 0; i < arrLength; i++) {

                    var nextDate = new Date();
                    nextDate.setHours($scope.selectedDeparture[i].getHours() + 3);
                    nextDate.setMinutes(0);
                    nextDate.setSeconds(0);
                    if($scope.renderData[data].Departure >= $scope.selectedDeparture[i] && $scope.renderData[data].Departure < nextDate )
                    {
                      present = true;
                    }
                }
                if (present == false) {
                    $scope.renderData.splice(data, 1);
                    data = data - 1;
                    length = length - 1;
                }
            }
        }

        $scope.AirlineFilter = function(airline) {
            var index = $scope.selectedAirlines.indexOf(airline);
            if (index > -1) {
                $scope.selectedAirlines.splice(index, 1);
            } else {
                $scope.selectedAirlines.push(airline);
            }
            $scope.render();
        }

        $scope.durationFilter = function(hr) {
            var index = $scope.selectedDuration.indexOf(hr);
            if (index > -1) {
                $scope.selectedDuration.splice(index, 1);
            } else {
                $scope.selectedDuration.push(hr);
            }
            $scope.render();
        }

        $scope.arrivalFilter = function(arrival) {
            var index = $scope.selectedArrival.indexOf(arrival);
            if (index > -1) {
                $scope.selectedArrival.splice(index, 1);
            } else {
                $scope.selectedArrival.push(arrival);
            }
            $scope.render();
        }

        $scope.departureFilter = function(departure) {
            var index = $scope.selectedDeparture.indexOf(departure);
            if (index > -1) {
                $scope.selectedDeparture.splice(index, 1);
            } else {
                $scope.selectedDeparture.push(departure);
            }
            $scope.render();
        }

    });
