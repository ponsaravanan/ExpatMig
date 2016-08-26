﻿var IsPhotoUploaderLoaded = true;
$(document).ready(function () {
    //alert('test-0');
    //if (ProfilePic != undefined) {
    //    $('.MultiplePhotoUpload #imgPhoto').html("<img style='margin:15%;border-radius:15px;' src='/utils/photohandler.ashx?Width=150&frompath=" + ProfilePic + "'/>")

    //}
    //alert('test');
    var OnPhotoUploaded = function (ImagePath) {
        var data = {
            "Description": "With attachment [attachment]",
            "AttachmentURL": ImagePath,
            "ThreadID": $('#hidSelectedThreadID').val()
        }

        //alert($('#hidSelectedThreadID').val());

        $.ajax({
            type: "POST",
            url: "/api/Topics/UploadPhoto/",
            dataType: "json",
            data: data,
            success: function (result) {
                //$('.MultiplePhotoUpload #imgPhoto').html("<img style='margin:15%;border-radius:15px;' src='/utils/photohandler.ashx?Width=150&frompath=" + ImagePath + "'/>")


                
                angular.element(document.getElementById('divChatController')).scope().GetLatest();


                console.log("done uploading ", result);
            },
            error: function (e) {
                console.log("error while uploading", e);

            }
        });

    };


    $('.DropBox').AttachImage({
        OnPhotoUploaded: OnPhotoUploaded
    });

});