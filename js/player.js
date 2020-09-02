'use strict';

var Player = (function() {
  
  // Globals
  var log, tv, screen, player;
  var playerUrl, oldUrl;

  var subtitles = false;

  return {
    play: function(url) {
      document.getElementById('av-player').className = "fullscreen";
      webapis.avplay.open(url);
      oldUrl = url;

      var listener = {
        onbufferingprogress: function(percent) {
          UI.buffering('Buffering: '+ percent+'%');
        },
        onbufferingcomplete: function() {
          UI.buffering('done');
        },
        onerror: function(eventType) {
          UI.banner('This stream is broken!');
          setTimeout(()=>{
            Player.exit();
          }, 3000)
        }
      };
      webapis.avplay.setListener(listener);
      webapis.avplay.setDisplayRect(0,0,1920,1080);
      webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
      webapis.avplay.setSilentSubtitle(false);
      webapis.avplay.prepareAsync(function() {
        webapis.avplay.play();
      });
    },
    exit: function(){
      document.getElementById('av-player').className = "hide";
      webapis.avplay.stop()
    },
    previousChannel: function(){

    },
    showInfo: function(data){
      UI.banner(data)
    }
  }
}());
