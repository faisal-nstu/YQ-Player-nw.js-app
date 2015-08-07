    var tag;
    var done = false;
    var index = 0;
    var urlList = [];
    var items;
    var player;

    // This code loads the IFrame Player API code asynchronously.
    function createPlayer() {
      tag = document.createElement('script');

      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];

      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    //  This function creates an <iframe> (and YouTube player)
    //  after the API code downloads.

    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        width: '100%',
        height: 320,
        videoId: GetUrl(index),
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    // The API will call this function when the video player is ready.
    function onPlayerReady(event) {
      event.target.playVideo();
    }

    function GetUrl(index) {
      done = false;
      return urlList[index];
    }

    // The API calls this function when the player's state changes.
    // The function indicates that when playing a video (state=1),
    // the player should play for six seconds and then stop.

    function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
        done = true;
      }
      if (event.data === YT.PlayerState.ENDED && done === true) {
        index++;
        if (index >= urlList.length) {
          index = 0;
        }
        PlayAnother(GetUrl(index));
      }
    }

    function PlayAnother(urll) {
      player.loadVideoById(urll, 0, "large");
      player.playVideo();
    }

    function stopVideo() {
      player.stopVideo();
    }

    function addClick() {
      // get url from form
      var x = document.getElementById("frm1");

      var text = "";
      for (var i = 0; i < x.length; i++) {
        text += x.elements[i].value;
      }

      var vidId = youtube_parser(text);

      if (vidId !== undefined) {
        urlList.push(vidId);
        addToPlayList(vidId);
        if(tag === undefined){
          createPlayer();
        }
      }
      x.reset();
    }
    // ==================================
    // GEXTRACT VIDEO ID FROM URL START
    function youtube_parser(url) {
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      if (match && match[7].length == 11) {
        return match[7];
      } else {
        alert("Wrong URL");
      }
    }

    // EXTRACT VIDEO ID FROM URL END
    // =================================

    function playNext() {
      player.stopVideo();
      if (index >= urlList.length) {
        index = 0;
      }
      PlayAnother(GetUrl(index));
      index++;
    }

    function playPrev() {
      player.stopVideo();
      index = index--;
      if (index < 0) {
        index = urlList.length - 1;
      }
      PlayAnother(GetUrl(index));
    }

    var addToPlayList = function addToList(id) {
      var node = document.createElement("LI");
      var track = document.createTextNode(id);
      node.appendChild(track);
      document.getElementById("playList").appendChild(node);
      items = document.querySelectorAll('li');
      [].forEach.call(items, function(item) {
        item.setAttribute('draggable', true);
        item.addEventListener('dragstart', dragstart, false);
        item.addEventListener('dragenter', dragenter, false);
      });
    };

    var pl = document.getElementById('playList');
    pl.onclick = function(clickedItem) {
      var target = getEventTarget(clickedItem);
      var vid = target.innerHTML;
      PlayAnother(vid);
    };

    function getEventTarget(e) {
      e = e || window.event;
      return e.target || e.srcElement;
    }

    // ======================================
    // DRAG AND DROP START

    var source;

    function isbefore(a, b) {
      if (a.parentNode == b.parentNode) {
        for (var cur = a; cur; cur = cur.previousSibling) {
          if (cur === b) {
            return true;
          }
        }
      }
      return false;
    }

    function dragenter(e) {
      if (isbefore(source, e.target)) {
        e.target.parentNode.insertBefore(source, e.target);
      } else {
        e.target.parentNode.insertBefore(source, e.target.nextSibling);
      }
    }

    function dragstart(e) {
      source = e.target;
      e.dataTransfer.effectAllowed = 'move';
    }
      // DRAG AND DROP END
      //=============================================

    // ===============================================
    // HIDE VIDEO START

    function hideVideo() {
      var e = document.getElementById("hider_div");
      if (e.style.display == 'block')
        e.style.display = 'none';
      else
        e.style.display = 'block';
    }

    // HIDE VIDEO END
    // ==================================================