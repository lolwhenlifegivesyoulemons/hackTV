'use strict';

var Parser = (function() {
  return {
    // Very simple m3u parser
    parse: function(data) {
        //shoutout to danktrain :)
        dat = data;
        data = [];
        dat = dat.split('group-title="');
        dat.shift();
        for (let i = 0; i < dat.length; i++) {
            data.push(dat[i].split('\n')[0]+"\n"+dat[i].split('\n')[1]);
        }
        dat.forEach((elem, index)=>{
            if(elem.includes('LABEL')) return dat.splice(index, 1);
        })
        dat = "#EXTM3U\n#EXTINF:-1,"+dat.join("\n#EXTINF:-1,").replace("\",", " ~ ");
        data = dat;
      var lastName;
      var channels = {};
      data = data.split('\n');
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
