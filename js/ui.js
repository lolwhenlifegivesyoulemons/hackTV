'use strict';

var UI = (function() {
	var pageNum = 0,
	tempPages = [],
	pages = [],
	channels;
	return {
		insertChannels: function(channels) {
			function splitArray(array, chunkSize) { //https://stackoverflow.com/a/45006755
		      return Array(Math.ceil(array.length/chunkSize)).fill().map(function(_,i) {
		        return array.slice(i * chunkSize, i * chunkSize + chunkSize);
		      });
		    };
			document.getElementById('channelList').innerHTML = "";
			for(var channel in channels) {
				tempPages.push(channels[channel]);
			}
			pages = splitArray(tempPages, 20);
			channels = pages[pageNum]
			channels.forEach(channel=>{
				var useMarquee = false;
				if (!channel.category) channel.category = "No category provided"
				if (channel.name.length >= 10) {
					useMarquee = true;
				}
				var channelDiv = document.createElement('div');
				channelDiv.className = "channel";
				channelDiv.href = channel.url
				channelDiv.innerHTML = `<h1 href="${channel.url}" style="display: flex;">${(useMarquee) ? "<marquee>"+channel.name+"</marquee>" : channel.name}</h1><p>${channel.category}</p></div>`
				document.getElementById('channelList').appendChild(channelDiv)
			});
			document.getElementsByClassName('channel')[0].className = "channel selected";
		},
		nextPage: function(){
			if (pageNum+1 == pages.length) pageNum = -1;
			var index = [...document.getElementsByClassName('channel')].findIndex(channel=>channel.className == "channel selected");
			document.getElementById('channelList').innerHTML = "";
			pageNum++
			channels = pages[pageNum]
			channels.forEach(channel=>{
				var useMarquee = false;
				if (!channel.category) channel.category = "No category provided"
				if (channel.name.length >= 10) {
					useMarquee = true;
				}
				var channelDiv = document.createElement('div');
				channelDiv.className = "channel";
				channelDiv.href = channel.url
				channelDiv.innerHTML = `<h1 href="${channel.url}" style="display: flex;">${(useMarquee) ? "<marquee>"+channel.name+"</marquee>" : channel.name}</h1><p>${channel.category}</p></div>`
				document.getElementById('channelList').appendChild(channelDiv)
			});
			document.getElementsByClassName('channel')[index].className = "channel selected";
			},
		previousPage: function(){
			if (pageNum-1 == -1) pageNum = pages.length
			var index = [...document.getElementsByClassName('channel')].findIndex(channel=>channel.className == "channel selected");
			document.getElementById('channelList').innerHTML = "";
			pageNum--
			channels = pages[pageNum]
			channels.forEach(channel=>{
				var useMarquee = false;
				if (!channel.category) channel.category = "No category provided"
				if (channel.name.length >= 10) {
					useMarquee = true;
				}
				var channelDiv = document.createElement('div');
				channelDiv.className = "channel";
				channelDiv.href = channel.url
				channelDiv.innerHTML = `<h1 href="${channel.url}" style="display: flex;">${(useMarquee) ? "<marquee>"+channel.name+"</marquee>" : channel.name}</h1><p>${channel.category}</p></div>`
				document.getElementById('channelList').appendChild(channelDiv)
			});
			document.getElementsByClassName('channel')[index].className = "channel selected";
		}, 
		banner: function(data){
			document.getElementById('banner').className = "";
			document.getElementById('banner').innerText = data;
			setTimeout(()=>{
				document.getElementById('banner').className = "hide";
				document.getElementById('banner').innerText = "";
			}, 3000);
		},
		buffering: function(state) {
			if(state == "done") {
				document.getElementById('banner').className = "hide";
				return document.getElementById('banner').innerText = "";
			}
			document.getElementById('banner').className = "";
			document.getElementById('banner').innerText = state;
		}
	}
}())