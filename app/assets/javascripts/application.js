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
  channel.members.each(function(member) {
    $membersList.append('<li>' + member.info.email + '</li>');
  });
  $("#membersbox").html($membersList);
});

channel.bind('my-event', function(data) {
  $('#chat').append('<li>' + data.name + ': ' + data.message + '</li>');
  $('#chat').children().slice(0,-10).hide();
  $('#chatbox input[type="text"]').val("");
});
