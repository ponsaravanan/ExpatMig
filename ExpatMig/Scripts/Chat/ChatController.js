﻿(function () {
    'use strict';

    angular
        .module('xMigApp')
            .controller('ChatController', ['$scope', 'ChatService', '$http', 'BridgeService', '$filter', '$sce',
                function ($scope, ChatService, $http, BridgeService, $filter, $sce) {

                    var TopicPageIndex = 0;
                    var HasReachedTop = false;
                    var FirstTopicItem = null;
                    var LoadedItems = 0;
                    var PageSize = 15;
                    var FreshLoad = true;
                    $scope.AllTopics = [];


                    try {

                        function FormatViewModal(Topics) {
                            Topics.forEach(function (EachItem, index, theArray) {
                                theArray[index] = FormatTopic(EachItem);
                            });
                            return Topics;
                        }
                        function FormatTopic(Topic) {
                            var CreatedDate = new Date(Topic.CreatedDate);

                            Topic.Color = iBoltzColorGen.GetMyColor(Topic.UserName, Topic.CreatedBy);
                            if (IsDateToday(Topic.CreatedDate)) {
                                Topic.CreatedDateString = $filter('date')(CreatedDate, "hh:mm a");
                            } else {
                                Topic.CreatedDateString = $filter('date')(CreatedDate, "dd-MMM-yy hh:mm");
                            }

                            Topic.OwnerAlignLeft = Topic.CreatedBy == CurrentUserID ? '18%' : '2%';

                            return Topic;
                        }
                        $scope.RenderWithEmoji = function (Description) {
                            return $sce.trustAsHtml(emojione.toImage(Description));
                        }
                        function ListChatPaged(SelectedThreadID, PageIndex) {

                            $('#ChatHistory').ShowLoadingPanel();
                            $scope.SelectedThreadID = SelectedThreadID;
                            var FullList = ChatService.ListChats.query({ id: SelectedThreadID, PageIndex: PageIndex }, function (result) {
                               
                                // alert('PageIndex ' + PageIndex);
                                // alert('SelectedThreadID ' + SelectedThreadID);
                                var Formated = FormatViewModal(result);
                                if (Formated.length <= 0 && PageIndex > 1) {
                                    HasReachedTop = true;
                                    ShowToast('no more new messges');
                                    $('#ChatHistory').HideLoadingPanel();
                                    return;
                                }
                                //console.log(" Existing data in memory " + $scope.AllTopics.length)

                                if (TopicPageIndex == 0) {
                                    $scope.AllTopics = Formated;//fresh load if pageindex=0;
                                } else {
                                    $scope.AllTopics = Formated.concat($scope.AllTopics);
                                }
                                ScrollToLastMessage();
                                return $scope.AllTopics;

                            });

                            // $scope.AllTopics = FullList;

                            //console.log(FullList);
                        };

                        $scope.MySubscriptions = ChatService.ListSubscriptions.query({ id: CurrentUserID }, function (result) {
                            console.log("Subscriptions", result);
                            return result;
                        });


                        $scope.ListContextualTopics = function (TopicID) {
                            $scope.ContextualTopics = ChatService.ListContextualTopics.query({ id: TopicID }, function (result) {
                                $scope.AllTopics = FormatViewModal(result);

                            });
                        };




                        $scope.SelectedGroup = "Select Group";
                        $scope.SelectedThreadID = -1;
                        $scope.LoadMoreTopics = function () {
                            if ($('.SearchResults li').length > 0) {
                                //since during the search no need of pagination
                                return;
                            }

                            //console.log("In LoadMoreTopics", FreshLoad)
                            FreshLoad = false;
                            TopicPageIndex += 1;
                            //console.log(" fetching page " + TopicPageIndex)
                            if (HasReachedTop) return;
                            ListChatPaged($scope.SelectedThreadID, TopicPageIndex);


                        };
                        $scope.GetLatest = function () {
                            //console.log('Fetching data');
                            var MaxID = $($scope.AllTopics).max(function () { return this.TopicID });
                            MaxID = isNaN(MaxID) || !isFinite(MaxID) ? 0 : MaxID;
                            //console.log('test');
                            ChatService.GetLatest.query({ id: MaxID }, function (result) {

                                $scope.AllTopics = FormatViewModal($scope.AllTopics.concat(result));

                                //console.log(FullList);
                                return result;
                            });
                        };

                        $scope.SearchNow = function () {
                            $scope.SearchResults = ChatService.SearchChat.Search({
                                ThreadID: $scope.SelectedThreadID, SearchText: "'" + $scope.SearchText + "'"
                            }, function (result) {
                                if (result.length == 0) {
                                    ShowToast('no records found');

                                }

                                //console.log('result', result.length)
                                return result;
                            });
                        };


                        $scope.ListChat = ListChatPaged;
                        $scope.AllGroups = ChatService.ListGroups.query(function (result) {
                            //console.log("Groups", result);
                            return result;
                        });

                        $scope.ListThreadsForGroup = function (SelectedGroup) {
                            $scope.SelectedGroup = SelectedGroup.Description;
                            $scope.SelectedGroupID = SelectedGroup.GroupID;
                            $scope.AllThreads = ChatService.GetThreads.query({
                                id: $scope.SelectedGroupID
                            }, function (result) {
                                var Threads = [];
                                result.forEach(function (item, index) {
                                    item.Subscribed = ($scope.MySubscriptions.indexOf(item.ThreadID) > -1);
                                    Threads.push(item);
                                });
                                return Threads;
                            });
                        }
                        $scope.ListTopicsForThread = function (SelectedID) {
                            $scope.SearchResults = [];
                            $scope.SelectedThreadID = SelectedID;
                            //$scope.AllTopics = [];
                            TopicPageIndex = 0;
                            HasReachedTop = 0;
                            FreshLoad = true;
                            //alert($scope.MySubscriptions.indexOf(SelectedID));
                            if ($scope.MySubscriptions.indexOf(SelectedID) > -1) {
                                $scope.ListChat(SelectedID, TopicPageIndex);
                                $('.chat-panel').removeClass('hidden');
                                $('#divRequest').addClass('hidden');
                            }
                            else {
                                $('.chat-panel').addClass('hidden');
                                $('#divRequest').removeClass('hidden');
                            }
                        }


                        $scope.OnItemDatabound = function (element) {
                            //

                            if (FreshLoad) return;
                            //console.log('LoadedItems', LoadedItems);
                            //console.log('PageSize ', PageSize);
                            if (LoadedItems >= PageSize - 1) {
                                LoadedItems = 0;
                                //console.log('Entered', FirstTopicItem);
                                //all items loaded irrespective inserts, push, replace array
                                FirstTopicItem = $('#ChatHistory li').first();

                                if (FirstTopicItem != null) {
                                    //console.log($(FirstTopicItem).text());

                                    $('#ChatHistory').animate({
                                        scrollTop: FirstTopicItem.offset().top + 100
                                    }, 0);
                                    $('#ChatHistory').HideLoadingPanel();
                                }


                            } else {
                                LoadedItems += 1;
                            }

                        };

                        $scope.ShowUserPrfile = function (UserID) {
                            BridgeService.BridgeUserProfile(UserID);
                        };

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
                                  
                             //   $scope.SelectedThreadID = $scope.AllThreads[0].ThreadID;
                               // alert("" + $scope.SelectedThreadID);


                                $.each($scope.AllThreads, function (key, value) {
                                 //   alert("" + value);
                                    if (value.Subscribed) {
                                        $scope.SelectedThreadID = value.ThreadID;
                                          $scope.ListChat($scope.SelectedThreadID, TopicPageIndex);
                                        return false;

                                    }
                                });
                              
                             //   alert("" + $scope.SelectedThreadID);
                                RegisterThreadsClick();
                            }
                        };

                        $scope.OnLastTopicLoadedRendered = function (element) {
                            //alert('done');
                            ScrollToLastMessage();
                            $('#ChatHistory').HideLoadingPanel();
                        };

                        $scope.OnLastSearchResultLoaded = function (element) {
                            RegisterSearchResultClick();
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
                                $scope.AllThreads = ChatService.GetThreads.query({
                                    id: $scope.SelectedGroupID
                                }, function (result) {
                                    $('#pnlNewThread').modal('toggle');
                                    return result;
                                });
                                //  $scope.AllThreads.push(ThreadToSave);
                            })
                        };

                        $scope.RequestAccess = function () {
                            //alert($scope.SelectedThreadID);
                            var SubscriptionRequest = {
                                "ThreadID": $scope.SelectedThreadID,
                                "UserID": CurrentUserID,
                                "CreatedDate": GetUtcDateString(new Date())
                            };

                            //console.log("request", SubscriptionRequest);

                            ChatService.RequestSubscriptions.save(SubscriptionRequest, function (result) {
                                console.log('RequestSubscriptions-result', result)
                                ShowToast("request sent successfully!")


                            }, function (error) {
                                console.log('Error', error)
                                alert('error');
                            });




                        };
                        $scope.SaveChanges = function () {
                            if ($scope.Message == undefined) {
                                alert('Type your message !!');
                                return;
                            }
                            if ($scope.SelectedThreadID == null) {
                                return
                            }
                            $('#txtMessage').ShowLoadingPanel();
                            var UserDeviceID = -1;

                            if (typeof (RegisteredUserDeviceID) != undefined) {
                                UserDeviceID = RegisteredUserDeviceID;
                                //   alert(UserDeviceID);
                            }


                            var TopicToSave = {
                                "TopicID": 2,
                                "ThreadID": $scope.SelectedThreadID,
                                "Description": $scope.Message,
                                "Slug": null, "IsActive": true,
                                "SeqNo": 1, "CreatedBy": CurrentUserID,
                                "CreatedDate": GetUtcDateString(new Date()),
                                "UserDeviceID": UserDeviceID
                            }
                            //console.log("Current Time is", new Date());

                            var MaxID = $($scope.AllTopics).max(function () {
                                return this.TopicID
                            });
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
                            //console.log("TopicToPush :- ", TopicToPush);

                            ChatService.PostChat.save(TopicToSave, function () {
                                $('#txtMessage').HideLoadingPanel();
                                $scope.AllTopics.push(FormatTopic(TopicToPush));

                                $scope.Message = "";
                                $(".emojionearea-editor").html("");
                                $(".emojionearea-editor").trigger('focus');
                                //angular.element('#txtMessage').trigger('focus');
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
