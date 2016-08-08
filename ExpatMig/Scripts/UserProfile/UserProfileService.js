﻿(function () {
    'use strict';

    angular.module('xMigApp').
        factory('UserProfileService', ['$resource', '$cacheFactory', function ($resource, $cacheFactory) {
            return {
                GetUserProfile: $resource('/api/userprofiles/:id')
            }

        }]);
})();