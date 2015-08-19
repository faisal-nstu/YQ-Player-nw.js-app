var tag;
var done = false;
var index = 0;
var urlList = [];
//var urlList = ["bHQqvYy5KYo"];
var items;
var player;

// 2. This code loads the IFrame Player API code asynchronously.
function createPlayer() {
  tag = document.createElement('script');

  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];

  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.

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

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.


function GetUrl(index) {
  done = false;
  return urlList[index];
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    //setTimeout(stopVideo, 9000);
    done = true;
  }
  //'bHQqvYy5KYo'
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
  ChangeTrackStyle(urll);
}

function ChangeTrackStyle(trackId){
  [].forEach.call(items, function(item) {
    if(item.innerHTML === trackId){
      item.id = "playlist-itemsSelected";
    }else{
      item.id = "playlist-items";
    }
  });
  
}

function stopVideo() {
  player.stopVideo();
}

// get url from form
function addClick() {
  var x = document.getElementById("frm1");

  var text = "";
  //var i;
  for (var i = 0; i < x.length; i++) {
    text += x.elements[i].value;
  }  
  addUrlToPlayList(text);
  x.reset();

}

function addUrlToPlayList(text){
  
  var vidId = youtube_parser(text);
  
  if (vidId !== undefined) {
    urlList.push(vidId);
    addToPlayList(vidId);
    if(tag === undefined){
      createPlayer();
      ChangeTrackStyle(vidId);
    }
  }
}

function youtube_parser(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[7].length == 11) {
    return match[7];
  } else {
    alert("Wrong URL");
  }
}

function playNext() {
  player.stopVideo();
  index++;
  if (index >= urlList.length) {
    index = 0;
  }
  PlayAnother(GetUrl(index));
}

function playPrev() {
  player.stopVideo();
  index = index--;
  if (index < 0) {
    index = urlList.length - 1;
  }
  PlayAnother(GetUrl(index));
}

var addToPlayList = function(id) {
  var node = document.createElement("LI");
//   node.innerHTML = "<div id=\"cross\">x</div>";
  node.id = 'playlist-items';
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
  if(vid === 'x'){
    removeTrack(target);
  }
  else{
   PlayAnother(vid.replace('<div id=\"cross\">x</div>','')); 
  }
};

 var removeTrack = function(elem){
  var vidId = elem.nextSibling.textContent;
  
};


function getEventTarget(e) {
  e = e || window.event;
  return e.target || e.srcElement;
}

// ======================================
// drag N drop

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
    e.dataTransfer.setData('Text/html', ev.target.id);
  }

  // drag N drop
  //=============================================

// ===============================================
// HIDE VIDEO

function hideVideo() {
  var e = document.getElementById("hider_div");
  if (e.style.display == 'block')
    e.style.display = 'none';
  else
    e.style.display = 'block';
}
//==========================================================
// TOGGLE PLAYLIST
function togglePlaylist(){
  
  var pl = document.getElementById('playlist_cont');
  if(pl.style.display === 'block'){
    pl.style.display = 'none';
    parent.postMessage("hide-playlist", "*");
  }
  else{
    pl.style.display = 'block';
    parent.postMessage("show-playlist", "*");
  }
}
// TOGGLE PLAYLIST
//==========================================================

//=======================================================
// CONTEXT MENU
window.addEventListener("contextmenu", function(e) { 
  
  var menu = document.getElementById('contextMenu');
  var posx = e.clientX + 'px';
  var posy = e.clientY + 'px'; 
  menu.style.left = posx;
  menu.style.top = posy;
  if(e.target.nodeName == 'LI') {
    selectedTrack = e.target.innerHTML;
    menu.style.display = 'block';
  }
  else {
    menu.style.display = 'none';
  }
}, false);

window.addEventListener("click", function(e) { 
  if(e.target.id !== 'contextMenuItem'){
    document.getElementById('contextMenu').style.display = 'none';
  }
}, false);

// ===================================================

// ===============================================
// REMOVE TRACK

function removeTrackFromPlaylist(){
  var vidIndex = urlList.indexOf(selectedTrack);
  urlList.splice(vidIndex, 1);
  var playListView = document.getElementById("playList");
  playListView.removeChild(playListView.childNodes[vidIndex]);
  document.getElementById('contextMenu').style.display = 'none';
}

// ==============================================
// DROP LINK
function checkIfInPlaylist(value) {
//   alert('url: >>>>>>>>>>>>' + value);
  return urlList.indexOf(value) > -1;
}

function allowDrop(ev) {
        ev.preventDefault();
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
          
          var iid  = ev.target.innerHTML;
//           alert('url: '+data+'item: '+iid);
          if(data === ''){
//             alert('nope : ' + data);
          }
          else{
           addUrlToPlayList(data); 
          }
        }


// https://www.youtube.com/watch?v=bHQqvYy5KYo
// https://www.youtube.com/watch?v=BEUs4520Pj0
// https://www.youtube.com/watch?v=sh0ROXHQ0B8
// https://www.youtube.com/watch?v=JEnLbPiQ-WM
// http://i.imgur.com/2E7zcyM.gif