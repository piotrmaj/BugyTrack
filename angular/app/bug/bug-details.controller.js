'use strict';

angular.module('myApp.bug-details', ['ngAnimate'])
    .controller('BugDetailsCtrl',['$scope','$stateParams', '$log', function($scope, $stateParams, $log) {
        $log.debug('asda');

        $scope.bug = {
                id: '72ada242-bb84-466c-8d78-517e84182be3',
                groupId: '081e105e-a66f-4e71-be06-c8acc7bd7601',
                assignedToId: '6bfcd9f5-137e-400d-85ce-11080766b7b6',
                severity: '1',
                status: 'new',
                creationTimestamp: new Date(),
                DeltaTimestamp: new Date(),
                shortDesc: 'short desc',
                operationSystemId: 'osfcd9f5-137e-400d-85ce-11080766b7b6',
                priority: '1',
                productId: '1',
                repPlatformId: '1'
            };

    }]);