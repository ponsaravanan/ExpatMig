﻿(function () {
    'use strict';

    angular.module('xMigApp').
        factory('ChatService', ['$resource', '$cacheFactory', function ($resource, $cacheFactory) {
            return {
                ListChats: $resource('/api/topics/AllTopicsForThisThread/:id/:PageIndex'),
                GetLatest: $resource('/api/topics/getlatest/:id'),
                SearchChat: $resource('/api/topics/search:SearchInput','@SearchInput' ,{ 'Search': {method:'POST',isArray:true}}),
                ListContextualTopics: $resource('/api/topics/listcontextualtopics/:id'),
                PostChat: $resource('/api/topics'),
                GetThreads: $resource('/api/Threads/GetThreadsByGroupID/:id'),
                PostThread: $resource('/api/Threads'),
                ListSubscriptions: $resource('/api/ThreadSubscriptions/GetHisThreads/:id'),
                RequestSubscriptions: $resource('/api/ThreadSubscriptions/PostThreadSubscriptions'),
                ListGroups: $resource('/api/Groups/All'),
                PostGroup: $resource('/api/Groups')
            }

        }]).
        factory('BridgeService', function () {
            return {
                //Bridge: {},
                //BridgeTextFilters: {} 

            }

        });
})();