'use strict';

var Parser = (function() {
  return {
    // Very simple m3u parser
    parse: function(data) {
      if (data.includes('tvg')) {
        //i hate tvgs and group stuff :(
        data = data.split(' ');
        data.forEach((elem, index)=>{
          if(elem.includes('tvg-')) data.splice(index, 1);
        });
        data.forEach((elem, index)=>{
          if(elem.includes('tvg-logo')) data.splice(index, 1);
        });
        data.forEach((elem, index)=>{
          if(!elem.split('"')[1]) return;
          if(elem.includes('24/7')) data[index] = "" //patch out undefined if channel includes 24/7
          if(elem.startsWith('group')) data[index] = ","+elem.split('"')[1]+" ~ "+elem.split('"')[2].replace(',', '');
        })
        data = data.join(' ').replace(/1 ,/g, '1,');
      }
      var lastName;
      var channels = {};
      data = data.split('\r\n');
      for (var i in data) {
        var line = data[i];
        if (line.indexOf('#EXTINF:') != -1) {
          var set = line.split(':')[1].split(',');
          var name = set[1];
          channels[name] = { no: set[0], name: name };
          lastName = name;
        } else if (line.indexOf('http') != -1 && lastName) {
          channels[lastName].url = line;
          lastName = null;
        }
      }
      return channels;
    }
  };
}());
