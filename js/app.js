'use strict';

var App = (function() {

  // Globals
  var log, tv;

  // Remote control keys
  var usedKeys = [
    'Info', 'Minus', 'PreviousChannel',
    'MediaPause', 'MediaPlay',
    'MediaPlayPause', 'MediaStop',
    'MediaFastForward', 'MediaRewind',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  // Register keys
  usedKeys.forEach(function(key) {
    tizen.tvinputdevice.registerKey(key);
  });

  // Key events
  document.addEventListener('keydown', function(e) {
    var key = e.keyCode;
    switch (key) {
      case 10252: // MediaPlayPause
      case 415: // MediaPlay
        log('key: play/pause');
        Player.playPause();
        break;
      case 19: // MediaPause
        log('key: pause');
        Player.pause();
        break;
      case 413: // MediaStop
        log('key: stop');
        Player.stop();
        break;
      case 417: // MediaFastForward
        Player.foward();
        break;
      case 412: // MediaRewind
        Player.rewind();
        break;
      case 38: // Up
        log('key: up');
        Player.prev();
        break;
      case 40: // Down
        log('key: down');
        Player.next();
        break;
      case 13: // Enter
        log('key: enter');
        Player.enter();
        break;
      case 457: // Info
        log('video state:', Player.state);
        Player.nextAudio();
        break;
      case 10190: //PreviousChannel
        log('loading fluxus');
        loadFluxus();
        break;
      case 189:
        log('loading stratus');
        loadStratus();
        break;
      case 48: // Key 0
        log('loading iptvEngNoNSFW');
        loadIPTVorg();
        break;
      case 49: // Key 1
        Player.set4k(true)
        break;
      case 50: // Key 2
        Player.set4k(false)
        break;
      case 51: // Key 3
      case 52: // Key 4
      case 53: // Key 5
        UI.get('log').classList.toggle('hide');
        break;
      case 54: // Key 6
      case 55: // Key 7
      case 56: // Key 8
      case 57: // Key 9
        log('loading local');
        loadLocal()
        break;
      // default:
        log('key:', key);
        break;
    }
  });

  function loadFluxus() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://pastebin.com/raw/ZzGTySZE', true);
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
  };
  function loadStratus() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://pastebin.com/raw/4cQ9mj8X', true);
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
  };
  function loadIPTVorg() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/iptv-org-eng.m3u8', true);
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
  };
  function loadLocal() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/playlist.m3u8 ', true);
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
  };
  // On DOM loaded
  function onLoad() {

    // Load info dom elements
    var cpu = document.querySelector('.cpu');
    var build = document.querySelector('.build');

    // Set app logger
    log = new Logger('app');
    log('DOM loaded');

    // Get build
    tizen.systeminfo.getPropertyValue('BUILD', function(data) {
      log(
        'BUILD:', data.buildVersion,
        'MODEL:', data.model, '(' + data.manufacturer + ')'
      );
      build.innerHTML = data.buildVersion + ' - ' + data.model;
    });

    // Update cpu
    setInterval(function() {
      // Get cpu usage
      tizen.systeminfo.getPropertyValue('CPU', function(data) {
        cpu.innerHTML = data.load;
      });
    }, 1000);

    // Set UI
    UI.init();

    // Get display and load playlist
    tizen.systeminfo.getPropertyValue('DISPLAY', function(data) {
      tv = {
        width: data.resolutionWidth,
        height: data.resolutionHeight
      };
      // Load playlist
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'data/playlist.m3u8', true);
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
    });

  }

  // Events
  document.addEventListener('DOMContentLoaded', onLoad);

  // Return App API
  return {};

}());
