'use strict';

var Player = (function() {
  
  // Globals
  var log, tv, screen, player;
  var playerUrl;

  var is4k = false;
  var isFullscreen = false;

  var audioTrack = 1;

  // Retrun Player API
  return {
    init: function(data) {
      tv = data;
      player = UI.get('player');
      log = new Logger('player');
      this.updatePlayerScreen();
      log('ready');
    },
    updatePlayerScreen: function() {
      var playerBounds = player.getBoundingClientRect();
      // Set global screen
      screen = [
        playerBounds.left, playerBounds.top,
        playerBounds.width, playerBounds.height
      ];
      log('update player screen:', screen.join(', '));
      return screen;
    },
    next: function() {
      UI.next();
      if (isFullscreen) this.toggleFullscreen();
    },
    prev: function() {
      UI.prev();
      if (isFullscreen) this.toggleFullscreen();
    },
    enter: function() {
      var channel = UI.channel;
      if (channel.url == playerUrl && this.state == 'PLAYING') {
        this.toggleFullscreen();
      } else {
        this.play(channel.url);
      }
    },
    play: function(url) {
      if (!url) {
        log('play');
        UI.play();
        return webapis.avplay.play();
      }
      if (url == "http://focusLink") {
        document.getElementById('link').style.opacity = "100";
        document.getElementById('link').focus();
      }
      if (url == "http://placeholder") {};
      if (url == "http://loadPlaylist") {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (xhr.status == 0 || xhr.status == 200) {
              var channels = Parser.parse(xhr.responseText);
              UI.setChannels(channels);
              Player.init(tv);
            } else {
              log('Error loading playlist:', xhr.status);
            }
          }
        };
      }
      log('prepare and play:', url);
      playerUrl = url;
      audioTrack = 1;
      UI.playing(url);
      webapis.avplay.open(url);
      webapis.avplay.setListener({
        onbufferingstart: function() {
          log('buffering start');
        },
        onbufferingprogress: function(percent) {
          log('buffering progress:', percent);
          UI.buffering('progress', percent);
        },
        onbufferingcomplete: function() {
          log('buffering complete');
          UI.buffering('complete');
        },
        // oncurrentplaytime: function(time) {
        //   log('current playtime:', time);
        // },
        onevent: function (type, data) {
          log('event type:', type, 'data:', data);
        },
        onstreamcompleted: function() {
          log('stream compited');
          this.stop();
        }.bind(this),
        onerror: function (error) {
          log('event error:', error);
        }
      });
      webapis.avplay.setDisplayRect.apply(null, screen);
      webapis.avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_FULL_SCREEN');
      if (is4k) this.set4k(true);
      // webapis.avplay.prepare();
      webapis.avplay.prepareAsync(function() {
        webapis.avplay.play();
      });
    },
    playPause: function() {
      log('play/pause');
      return this.state == 'PLAYING' ? this.pause() : this.play();
    },
    pause: function() {
      log('pause');
      UI.pause();
      webapis.avplay.pause();
    },
    stop: function() {
      log('stop');
      UI.stop();
      webapis.avplay.stop();
    },
    foward: function(num) {
      num = num || 3000;
      log('foward:', num);
      webapis.avplay.jumpForward(num);
    },
    rewind: function(num) {
      num = num || 3000;
      log('rewind:', num);
      webapis.avplay.jumpBackward(num);
    },
    set4k: function(value) {
      log('set 4k:', value);
      webapis.avplay.setStreamingProperty('SET_MODE_4K', value);
    },
    setTrack: function(type, index) {
      log('set track:', type, index);
      webapis.avplay.setSelectTrack(type, index);
      UI.setAudio(index);
    },
    nextAudio: function() {
      var list = [];
      var trackList = this.getTracks();
      for (var i in trackList) {
        log('tracks:', trackList[i].type);
        if (trackList[i].type == 'AUDIO') list.push(trackList[i]);
      }
      var length = list.length;
      audioTrack++
      if (audioTrack > length) audioTrack = 1;
      log('set audio:', audioTrack);
      this.setTrack('AUDIO', audioTrack);
    },
    getTracks: function() {
      log('get tracks');
      return webapis.avplay.getTotalTrackInfo();
    },
    toggleFullscreen: function() {
      if (isFullscreen) {
        log('fullscreen off:', [screen[2], screen[3]].join('x'));
        UI.fullscreen(isFullscreen = false);
        webapis.avplay.setDisplayRect.apply(null, screen);
      } else {
        log('fullscreen on:', [tv.width, tv.height].join('x'));
        UI.fullscreen(isFullscreen = true);
        webapis.avplay.setDisplayRect(0, 0, tv.width, tv.height);
      }
    },
    get url() {
      return playerUrl;
    },
    get state() {
      return webapis.avplay.getState();
    }
  };

}());
