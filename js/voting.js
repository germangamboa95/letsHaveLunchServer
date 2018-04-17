$(document).ready(function(){


    //Changed the way we grabbed the url to using the new URL object to avoid extra string manipulation
    let urlParams = window.location.href;
    let url = new URL(urlParams);
    let initiator = url.searchParams.get("initiator");
    // Converting string to bool.
    initiator = (initiator === "true");
    var sessionId = url.searchParams.get("session");

    (sessionId)? null : window.location.replace("/404.html");

    //Set the results link href
    $('#results-link').attr('href', './Results1.html?session='+sessionId);

    if (initiator){}
    else {
        $('#modal1').modal({
            dismissible: false
      })
        $('#modal1').modal('open')
    }




    var locationsURL = "https://cors-anywhere.herokuapp.com/https://letshavelunchserver.herokuapp.com/api/" + sessionId + "/load_location_data";
    var imagesURL = "https://cors-anywhere.herokuapp.com/https://letshavelunchserver.herokuapp.com/api/" + sessionId + "/load_images";
    var card;
    var cardImageDiv;
    var cardImage;
    var cardTitle;
    var titleString;
    var cardContent;
    var cardAddress;
    var cardAction;
    var upVote;
    var downVote;
    var ratingOuter;
    var ratingInner;
    var starsTotal=5;
    var eMail = null;
    var finalItem;
    var succsessCard=$("#successCard")

    $("#successCard").hide();


    $.ajax({
        url: locationsURL,
        method: "GET"
    }).then(function(locations){
        $.ajax({
            url: imagesURL,
            method: "GET"
        }).then(function(images){
            console.log(locations);
            console.log(images);

            for (var i=0; i<locations.length; i++){
                console.log(locations[i].place_id);
                card= $("<div class='card large' id='card"+i+"'>");
                cardImageDiv = $("<div class='card-image'>");
                cardImage= $("<img src='images/placeHolder.png' class='cardImg'>");
                cardTitle= $("<span class='card-title'>");
                titleString= locations[i].name;
                cardContent= $("<div class='card-content'>");
                ratingOuter= $("<div class='stars-outer'>");
                ratingInner= $("<div class='stars-inner'>");
                cardAddress= $("<p>"+locations[i].address+"</p>");
                cardAction= $("<div class='card-action'>")

                upVote= $("<a class='waves-effect waves-light btn right btn-large green voteBtn accent-4'id='"+locations[i].place_id+"'>  <i class='voteIcon material-icons'>thumb_up</i></a>");
                downVote= $("<a class='waves-effect waves-light btn left btn-large red voteBtn accent-4'id='"+locations[i].place_id+"'>  <i class='voteIcon material-icons'>thumb_down</i></a>");
                var starPercentage = (locations[i].rating/starsTotal) * 100;
                var starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
                console.log(starPercentageRounded);
                $("#resCol").prepend(card);
                $(card).append(cardImageDiv);
                $(cardImageDiv).append(cardImage);
                $(card).append(cardContent);
                $(cardContent).append(ratingOuter);
                $(ratingOuter).append(ratingInner);
                $(cardContent).append(cardAddress);
                $(card).append(cardAction);
                $(cardAction).append(upVote);
                $(cardAction).append(downVote);
                $(".stars-inner").css("width", starPercentageRounded);
                finalItem=locations[0].place_id;

                for (var j=0; j<images.length; j++){

                    var image =Object.keys(images[j]);
                    console.log(image);
                    console.log(images[j][image]);

                    if (image==locations[i].place_id && image != 'none'){

                        var cardImageReal=$("<img src='"+ images[j][image] +"' class='cardImg' style=max-height:300px>");
                        $(cardImage).remove();
                        $(cardImageDiv).append(cardImageReal);

                    }
                    else{

                    }

                }


                $(cardImageDiv).append(cardTitle);
                $(cardTitle).append(titleString);



            }
            greenInit();
            redInit();
        })

    })



// This function makes sure the event listener is added after the cards are created.
function greenInit(){

  $(".green").on("click",function(){



      var actionSection= $(this).parent();
      var card= $(actionSection).parent();
      var voteId= $(this).attr("id");
      var voteURL= "https://cors-anywhere.herokuapp.com/https://letshavelunchserver.herokuapp.com/api/" + sessionId + "/vote/" + voteId;
      $(card).slideUp();
      $.ajax({
        url:voteURL,
        method:"POST"
     }).then(function(response){
          console.log(response);
     })
     if (voteId==finalItem){

      var emailURL= "https://cors-anywhere.herokuapp.com/https://letshavelunchserver.herokuapp.com/api/" + sessionId + "/email_add";

      let foo = {
        email: eMail
      }
      fetch(emailURL, {
        method: 'post',
        headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
        body: JSON.stringify(foo)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        $(succsessCard).slideDown();

      });
     }
  });




}


function redInit(){

  $(".red").on("click",function(){
      var actionSection= $(this).parent();
      var card= $(actionSection).parent();
      var voteId= $(this).attr("id");
      $(card).slideUp();
     if (voteId==finalItem){
      var emailURL= "https://cors-anywhere.herokuapp.com/https://letshavelunchserver.herokuapp.com/api/" + sessionId + "/email_add";
      console.log(eMail);
      let foo = {
        email: eMail
      }
      fetch(emailURL, {
        method: 'post',
        headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
        body: JSON.stringify(foo)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        $(succsessCard).slideDown();

      });

     }
  })



}


            $("#eMailsubmit").on("click", function(){
                eMail=$("#email").val().trim();
                console.log(typeof eMail)
                console.log(eMail);
            })

            $("closeTab").on("click", function(){
                Window.close();
            })









});
