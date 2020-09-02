  var App = (function() {

    // Globals
    var log, tv;
    // Remote control keys
    var usedKeys = [
      'Info', 'ChannelList', 'PreviousChannel', 'ChannelUp', 'ChannelDown',
      'MediaPause', 'MediaPlay',
      'MediaPlayPause', 'MediaStop',
      'MediaFastForward', 'MediaRewind' 
    ];

    tizen.tvinputdevice.registerKeyBatch(usedKeys);

    // Key events
    document.addEventListener('keydown', function(e) {
      var key = e.keyCode;
      switch (key) {
        case 10252: // MediaPlayPause
        case 415: // MediaPlay
        case 19: // MediaPause
        case 413: // MediaStop
        case 417: // MediaFastForward
        case 412: // MediaRewind
        case 10009: //Back
        Player.exit();
        break;
        case 38: // Up
        up();
        break;
        case 37: //Left
        left()
        break;
        case 39: //Right
        right()
        break;
        case 40: // Down
        down();
        break;
        case 13: // Enter
        Player.play(document.getElementsByClassName('channel')[selectedChannel].href)
        break;
        case 457: // Info
        Player.showInfo(document.getElementsByClassName('channel')[selectedChannel].innerText.replace('\n\n', ""));
        break;
        // case 10190: //PreviousChannel
        // Player.previousChannel();
        // break;
        // case 10073: //ChannelList
        // Player.inPlayerGuide();
        // break;
        case 427: // ChannelUp
        UI.nextPage();
        break;
        case 428: // ChannelDown
        UI.previousPage();
        break;
      }})
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/playlist.m3u8', true);
      xhr.send(null);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 0 || xhr.status == 200) {
            var channels = Parser.parse(xhr.responseText);
            UI.insertChannels(channels);
          }
        }
      };
      window.onload = function() {
        for(var i = 0; i < document.links.length; i++) {
            document.links[i].onclick = function() {
                return false;
            }
        }
    };
      var selectedChannel = 0;
      function up() {
        if(selectedChannel <= 4) return;
        document.getElementsByClassName('channel')[selectedChannel].className = "channel"
        selectedChannel = selectedChannel-5
        document.getElementsByClassName('channel')[selectedChannel].className = "channel selected"
      };
      function down() {
        if(selectedChannel >= document.getElementsByClassName('channel').length-5) return;
        document.getElementsByClassName('channel')[selectedChannel].className = "channel"
        selectedChannel = selectedChannel+5
        document.getElementsByClassName('channel')[selectedChannel].className = "channel selected"
      };
      function left() {
        if(!selectedChannel) {
          document.getElementsByClassName('channel')[selectedChannel].className = "channel";
          selectedChannel = document.getElementsByClassName('channel').length-1;
          return document.getElementsByClassName('channel')[selectedChannel].className = "channel selected";
        }
        document.getElementsByClassName('channel')[selectedChannel].className = "channel"
        selectedChannel = selectedChannel-1
        document.getElementsByClassName('channel')[selectedChannel].className = "channel selected"
      };
      function right() {
        if(selectedChannel == document.getElementsByClassName('channel').length-1) {
          document.getElementsByClassName('channel')[selectedChannel].className = "channel";
          selectedChannel = 0;
          return document.getElementsByClassName('channel')[selectedChannel].className = "channel selected";
        }
        document.getElementsByClassName('channel')[selectedChannel].className = "channel"
        selectedChannel = selectedChannel+1
        document.getElementsByClassName('channel')[selectedChannel].className = "channel selected"
      };
    return {};
  }());