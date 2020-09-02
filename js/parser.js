'use strict';

var Parser = (function() {
  var logo;
  return {
    // Very unsimple m3u parser
    parse: function(data) {
      //shoutout to danktrain :)
      var dat = data;
      data = [];
      dat = dat.split('group-title="');
      dat.shift();
      for (let i = 0; i < dat.length; i++) {
          data.push(dat[i].split('\n')[0]+"\n"+dat[i].split('\n')[1]);
      }
      data.forEach((elem, index)=>{
          if(elem.includes('LABEL')) return data.splice(index, 1);
      })
      data = "#EXTM3U\n#EXTINF:-1,"+data.join("\n#EXTINF:-1,").replace(/",/g, " ~ ");
      var lastName;
      var channels = {};
      var num = 0;
      data = data.split('\n');
      for (var i in data) {
        num++;
        if(data[i].startsWith(''))
        var line = data[i];
        if (line.indexOf('#EXTINF:') != -1) {
          var set = line.split(':')[1].split(',');
          var category = line.split(' ~ ')[0].split(',')[1];
          var name = set[1].split(' ~ ')[1]; 
          channels[name] = {name: name, category: category};
          lastName = name;
        } else if (!line.startsWith('#EXTM3U') && line.indexOf('http') != -1 && lastName) {
          channels[lastName].url = line;
          lastName = null;
        }
      }
      return channels;
    }
  };
}());
