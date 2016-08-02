﻿(function () {
    'use strict';

    angular
        .module('xMigApp')
            .controller('ChatController', ['$scope', 'ChatService', '$http', 'BridgeService', '$filter', function ($scope, ChatService, $http, BridgeService, $filter) {
                var TopicPageIndex = 0;
                var HasReachedTop = false;
                $scope.AllTopics = [];
                try {

                    function FormatViewModal(Topics) {
                        Topics.forEach(function (EachItem, index, theArray) {
                            theArray[index] = FormatTopic(EachItem);
                        });
                        return Topics;
                    }
                    function FormatTopic(Topic) {
                        Topic.Color = iBoltzColorGen.GetMyColor(Topic.UserName, Topic.CreatedBy);
                        if (IsDateToday(Topic.CreatedDate)) {
                            Topic.CreatedDateString = $filter('date')(Topic.CreatedDate, "hh:mm a");
                        } else {
                            Topic.CreatedDateString = $filter('date')(Topic.CreatedDate, "dd-MMM-yy hh:mm");
                        }
                        return Topic;
                    }
                    function ListChatPaged(SelectedThreadID, PageIndex) {
                        var FullList = ChatService.ListChats.query({ id: SelectedThreadID, PageIndex: PageIndex }, function (result) {
                            //ScrollToLastMessage();
                            var Formated = FormatViewModal(result);
                            if (Formated.length <= 0)
                            {
                                HasReachedTop = true;
                                alert('No more new messges');
                                return;
                            }
                            console.log(" Existing data in memory " + $scope.AllTopics.length)
                            
                            $scope.AllTopics = Formated.concat($scope.AllTopics);
                            
                            return $scope.AllTopics;

                        });

                       // $scope.AllTopics = FullList;

                        console.log(FullList);
                    };
                    $scope.SelectedGroup = "Select Group";
                    $scope.SelectedThreadID = 0;
                    $scope.LoadMoreTopics = function () {
                        TopicPageIndex += 1;
                        console.log(" fetching page " + TopicPageIndex)
                        if (HasReachedTop) return;
                        ListChatPaged($scope.SelectedThreadID, TopicPageIndex);

                    };
                    $scope.GetLatest = function () {
                        console.log('Fetching data');
                        var MaxID = $($scope.AllTopics).max(function () { return this.TopicID });
                        MaxID = isNaN(MaxID) || !isFinite(MaxID) ? 0 : MaxID;

                        ChatService.GetLatest.query({ id: MaxID }, function (result) {

                            $scope.AllTopics = FormatViewModal($scope.AllTopics.concat(result));


                            console.log(FullList);
                            return result;
                        });
                    };
                    $scope.ListChat = ListChatPaged;
                    $scope.AllGroups = ChatService.ListGroups.query(function (result) {
                        return result;
                    });
                    $scope.ListThreadsForGroup = function (SelectedGroup) {
                        $scope.SelectedGroup = SelectedGroup.Description;
                        $scope.SelectedGroupID = SelectedGroup.GroupID;
                        $scope.AllThreads = ChatService.GetThreads.query({ id: $scope.SelectedGroupID }, function (result) {
                            return result;
                        });
                    }
                    $scope.ListTopicsForThread = function (SelectedID) {
                        $scope.SelectedThreadID = SelectedID;
                        $scope.AllTopics = [];
                        $scope.ListChat(SelectedID, TopicPageIndex);
                    }

                    /*****************  Last Item Loaded  ********************/
                    $scope.OnLastGroupLoaded = function (element) {
                        //self.alert("loaded");
                        //$('#ddlGroups').selectpicker('refresh');
                        if ($scope.AllGroups.length > 0) {
                            $scope.SelectedGroup = $scope.AllGroups[0].Description;
                            $scope.ListThreadsForGroup($scope.AllGroups[0]);
                        }
                    };

                    $scope.OnLastThreadLoaded = function (element) {
                        if ($scope.AllThreads.length > 0) {

                            $scope.SelectedThreadID = $scope.AllThreads[0].ThreadID;
                            $scope.ListChat($scope.SelectedThreadID, TopicPageIndex);
                        }
                    };

                    $scope.OnLastTopicLoaded = function (element) {
                        ScrollToLastMessage();
                    };


                    /*****************  Save routines   ********************/
                    $scope.OnEnterPress = function (keyEvent) {
                        if (keyEvent.which === 13) $scope.SaveChanges();
                    }

                    $scope.SaveThread = function () {
                        if ($scope.SelectedGroupID == undefined) {
                            alert('Please select group first');
                            return;
                        }
                        if ($scope.ThreadName == undefined) {
                            alert('Please type new thread name!!');
                            return;
                        }

                        var ThreadToSave = {
                            "GroupID": $scope.SelectedGroupID,
                            "Description": $scope.ThreadName,
                            "Slug": null, "IsActive": true, "SeqNo": 1, "CreatedBy": 1, "CreatedDate": "2016-07-25T12:48:59.607", "ModifiedBy": 1, "ModifiedDate": "2016-07-25T12:48:59.607", "MyThread": null

                        }
                        ChatService.PostThread.save(ThreadToSave, function () {
                            $scope.AllThreads = ChatService.GetThreads.query({ id: $scope.SelectedGroupID }, function (result) {
                                return result;
                            });
                            //  $scope.AllThreads.push(ThreadToSave);
                        })
                    };
                    $scope.SaveChanges = function () {
                        if ($scope.Message == undefined) {
                            alert('Type your message !!');
                            return;
                        }
                        if ($scope.SelectedThreadID == null) { return }
                        var TopicToSave = {
                            "TopicID": 2,
                            "ThreadID": $scope.SelectedThreadID,
                            "Description": $scope.Message,
                            "Slug": null, "IsActive": true,
                            "SeqNo": 1, "CreatedBy": CurrentUserID,
                            "CreatedDate": new Date()
                        }
                        var MaxID = $($scope.AllTopics).max(function () { return this.TopicID });
                        MaxID = isNaN(MaxID) || !isFinite(MaxID) ? 0 : MaxID;
                        var TopicToPush = {
                            "UserName": CurrentUserName,
                            "TopicID": MaxID + 1,
                            "ThreadID": $scope.SelectedThreadID,
                            "Description": $scope.Message,
                            "CreatedBy": CurrentUserID,
                            "CreatedDate": new Date()
                        };
                        //alert(new Date());
                        //MaxID + 1 for tentative calcuation to avoid wrongly fetching data
                        console.log("TopicToPush :- ", TopicToPush);

                        ChatService.PostChat.save(TopicToSave, function () {

                            $scope.AllTopics.push(FormatTopic(TopicToPush));

                            $scope.Message = "";
                            angular.element('#txtMessage').trigger('focus');
                            ScrollToLastMessage();
                        })
                    };
                    $scope.SaveGroup = function () {
                        if ($scope.GroupName == undefined) {
                            alert('Please type new group name!!');
                            return;
                        }
                        var GroupToSave = {
                            "Description": $scope.GroupName,
                            "Slug": null, "IsActive": true, "SeqNo": 1, "CreatedBy": 1, "CreatedDate": "2016-07-25T12:48:59.607", "ModifiedBy": 1, "ModifiedDate": "2016-07-25T12:48:59.607", "MyThread": null

                        }
                        ChatService.PostGroup.save(GroupToSave, function () {
                            $scope.AllGroups = ChatService.ListGroups.query(function (result) {
                                return result;
                            });
                            //  $scope.AllGroups.push(GroupToSave);
                        })
                    };

                    /*****************  direct calls  ********************/


                    ///  console.log('Call ListChat');
                    // $scope.ListChat();
                }
                catch (ex) {
                    console.log("ChatController", ex);
                }
            }]);

})();
