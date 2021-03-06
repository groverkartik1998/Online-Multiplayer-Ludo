var name="";
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    name = profile.getName();
    $(".data").css("display", "block");
    var inputF = document.getElementById("playerName");
    inputF.value = name; 
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log(provider);
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
    });
}

function validate() {
    var newText = "";

    jQuery.ajax({
        url: baseUrl + "rest/playerExists",
        type: "POST",
        data: JSON.stringify({"playerName": $("#playerName").val()}),

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            if (!resultData.success) $("#nicknameError").text(resultData.message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 100000,
    });

    if ($("#playerName").val().length > 16) newText = "Name max length is 16 charaters.";
    if ($("#playerName").val().length < 3) newText = "Name must be at least 3 charaters.";

    $("#nicknameError").text(newText);

    $("#createNickname").attr("disabled", (newText != ""));
}

function submit() {
    jQuery.ajax({
        url: baseUrl + "rest/regPlayer",
        type: "POST",
        data: JSON.stringify({"playerName": $("#playerName").val()}),

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            if (resultData.success) {
                localStorage.token = resultData.token;
                localStorage.playerId = resultData.playerId;
                window.location.href = "lobby";
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
        },

        timeout: 100000,
    });
}

function validateToken(next) {
    jQuery.ajax({
        url: baseUrl + "rest/login/?token=" + localStorage.token,
        type: "GET",

        contentType: 'application/json; charset=utf-8',
        success: function (resultData) {
            next(resultData.valid);
        },
        timeout: 100000,
    });
}

$(document).ready(function () {
    $("#playerName").on("change keyup", function (event) {
        validate();
        if (event.keyCode === 13) {
            submit();
        }
    });

    $("#createNickname").click(function () {
        submit();
    });



    validateToken(function (valid) {
        if (valid) window.location.href = baseUrl + "lobby";
    });
});
