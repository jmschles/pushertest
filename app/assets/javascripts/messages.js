var pusher = new Pusher('942f40662c8b1236e58b');

var channel = pusher.subscribe('presence-channel');

// Enter the chatroom on login
channel.bind('pusher:subscription_succeeded', function() {
  console.log("Entered room");
  var $membersList = $('<ul>');
  $membersList.addClass('members');
  channel.members.each(function(member) {
    var $li = $('<li>');
    $li.attr('data-id', member.id);
    $li.html(member.info.email);

    $membersList.append($li);
  });
  $("#membersbox").html($membersList);
});

// Update the chatroom list when someone logs in
channel.bind('pusher:member_added', function (member) {
  var $membersList = $('.members');
  var $li = $('<li>');
  $li.attr('data-id', member.id);
  $li.html(member.info.email);
  $membersList.append($li);

  dedup();
});

// Remove logged out members from chatroom list
channel.bind('pusher:member_removed', function (member) {
  $(".members").find("[data-id='" + member.id + "']").remove();
});

// Sending messages
channel.bind('my-event', function(data) {
  var d = new Date();
  var time = d.getUTCHours() + ":" + ('0' + d.getUTCMinutes()).slice(-2);
  var timeSpan = $('<span>').html(time).addClass('time');

  var nameSpan = $('<span>').html(data.name).addClass('sender');
  var currentUserEmail = $("#current_user").html().replace(/\s+/g, '');

  if (currentUserEmail === data.name) {
    nameSpan.addClass('self');
  }

  var msgSpan = $('<span>').html(data.message).addClass('msg');
  var $li = $('<li>').html(timeSpan)
    .append(' ')
    .append(nameSpan)
    .append(': ')
    .append(msgSpan);

  $('#chat').append($li);
  // $('#chat').append('<li>' + time + ' ' + data.name + ': ' + data.message + '</li>');
  $('#chat').children().slice(0,-10).hide();
  $('#chatbox input[type="text"]').val("");
});

// Get rid of duplicates in chatroom list (refresh duping bug fix)
var dedup = function () {
  var seen = {};
  $('.members li').each(function () {
    var txt = $(this).text();
    if (seen[txt]) {
      $(this).remove();
    } else {
      seen[txt] = true;
    }
  });
}