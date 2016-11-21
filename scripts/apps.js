var app = angular.module('interviewApp', ['ui.router', 'rzModule']);
// app.config(['$routeProvider', function($routeProvider) {
//     $routeProvider
//         .when('/', {
//             templateUrl: 'views/home.html'
//         })
//         .when('/bookings', {
//             templateUrl: 'views/booking.html',
//             // controller :
//         })
//         .when('/flights', {
//             templateUrl: 'views/flights.html',
//             // controller :
//         })
//         .otherwise({
//             redirectTo: '/'
//         });
// }]);
app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/bookings');

    $stateProvider
        .state('bookings', {
            url: "/bookings",
            templateUrl: 'views/booking.html',
            controller: 'booking'
        })
        .state('flights', {
            url: "/flights/:bookingDetails",
            templateUrl: 'views/flights.html',
            controller: 'flights'
            // params: {
            //     bookingDetails: null,
            // }
        });
});
