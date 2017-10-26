$(document).ready(function(){
    
    var $chirperList = $('#chirperList');
    var $user = $('#user');
    var $timeStamp = $('#timeStamp');
    var $message = $('#message');
  
    getTweets();
    
    function getTweets()    {
        $.ajax({
            method: "GET",
            url: "/api/chirps",
            contentType: "application/json",
            success: function(chirps) {
                //created the table and a list, needed to use [0] to only use the table
                $.each(chirps[0], function(i, chirp){
                    //$chirperList.append('<li>' + chirp.user + ' @ ' + chirp.timestamp + ': ' + chirp.message + "<br /><button class= 'deleteBtn' id= " + chirp.id + '>Delete</button></li>');
                    $('#chirperDiv').append("<div class= 'chirp'>" + chirp.user + ' @ ' + chirp.timestamp + ': ' + chirp.message + "<br /><button class= 'deleteBtn' id= " + chirp.id + '>Delete</button></div>');    
                    $('.deleteBtn').unbind().on('click', function(){
                        deleteTweet(this.id);
                    })  //<button class= 'updateBtn' id= " + chirp.id + ">Update</button>
                    // $('.updateBtn').unbind().on('click', function(){
                    //     //console.log(this.id + " " + $message.val());
                    //     if($message.val().length > 0){
                    //         console.log('We got it!');
                    //         updateTweet(this.id);
                    //     } else {
                    //         alert('There is no text')
                    //     };
                    // })
                });
            } 
        });
           
    };    

    function postTweet() {
        var date = new Date();
        var chirps = {
            user: $user.val(),
            message: $message.val(),
        };
        $.ajax({
            method: "POST",
            url: "/api/chirps",
            contentType: "application/json",
            data: JSON.stringify(chirps)
        }).then(function() {
            $('#chirperDiv').empty();
            getTweets();
        });
    }


    function deleteTweet(ajaxId) {
        var id = {ajaxId};
        $.ajax({
            method: "POST",
            url: "/api/chirps/:id",
            contentType: "application/json",
            data: JSON.stringify(id)
        }).then(function(){
            $('#chirperDiv').empty();
            getTweets();
        })
    };


    // function updateTweet(updateId){
    //     var update = {
    //         id: updateId,
    //         message: $message.val()
    //     };
    //     console.log(update);
    //     $.ajax({
    //         method: "POST",
    //         url: "/api/chirps/update",
    //         contentType: "application/json",
    //         data: JSON.stringify(update)
    //     }).then(function(){
    //         $('#chirperDiv').empty();
    //         getTweets();
    //     })
    // };



    $('#btnText').on('click', function(){
        if($message.val().length > 0){
            postTweet();
        } else {
            alert('There is no Username or Message')
        };
    });
})