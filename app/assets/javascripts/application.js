// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

var pusher = new Pusher('942f40662c8b1236e58b');

var channel = pusher.subscribe('presence-channel');

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

channel.bind('pusher:member_added', function (member) {
  var $membersList = $('.members');
  var $li = $('<li>');
  $li.attr('data-id', member.id);
  $li.html(member.info.email);
  $membersList.append($li);

  dedup();
});

channel.bind('pusher:member_removed', function (member) {
  $(".members").find("[data-id='" + member.id + "']").remove();
});

channel.bind('my-event', function(data) {
  $('#chat').append('<li>' + data.name + ': ' + data.message + '</li>');
  $('#chat').children().slice(0,-10).hide();
  $('#chatbox input[type="text"]').val("");
});

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
