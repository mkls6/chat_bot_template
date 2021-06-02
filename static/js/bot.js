let user = {};
user.avatar = "/static/svg/user_avatar.svg"

let bot = {};
bot.avatar = "/static/svg/bot.svg"

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time) {
    if (time === undefined) {
        time = 0;
    }
    var control = "";
    var date = formatAMPM(new Date());

    if (who === "user") {

        control = '<li style="width:100%">' +
            '<div class="msj macro">' +
            '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + user.avatar + '" /></div>' +
            '<div class="text text-l">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '</div>' +
            '</li>';
    } else {
        control = '<li style="width:100%;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p>' + text + '</p>' +
            '<p><small>' + date + '</small></p>' +
            '</div>' +
            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' + bot.avatar + '" /></div>' +
            '</li>';
    }
    setTimeout(
        function () {
            $("ul").append(control);

        }, time);

}

function resetChat() {
    $("ul").empty();
}

let msg_input = document.getElementById('msg');

msg_input.addEventListener("keyup", function (e) {
    if (e.key === 'Enter') {
        var text = $(this).val();

        if (text !== "") {
            insertChat("user", text);
            $(this).val('');
            getBotAnswer(text);
        }
    }
});

function getBotAnswer(msg) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/bot', true);
    xhr.send(msg);

    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                console.log('got the answer:' + xhr.responseText);
                insertChat("bot", xhr.responseText, 0);
            }
        }
    }


}

//-- Clear Chat
resetChat();

//-- Print Messages
// insertChat("user", "Hello Tom...", 0);
// insertChat("you", "Hi, Pablo", 1500);
// insertChat("user", "What would you like to talk about today?", 3500);
// insertChat("you", "Tell user a joke", 7000);
// insertChat("user", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
// insertChat("you", "LOL", 12000);