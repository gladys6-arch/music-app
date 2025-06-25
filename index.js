// getting elements by id
const audio=document.getElementById('audio');
const audioSource=document.getElementById('audio-source')
const playBtn=document.getElementById('play-btn');
const searchInput=document.getElementById('search-input');
const playlistElement=document.getElementById('playlist');
const currentTitle=document.getElementById('current-song-title');

let allSongs = [];
let playlist= [];
let currentIndex = -1;

// fetch songs from JSON server
fetch("http://localhost:3000/songs")
.then(res=>res.json())
.then(data=>{
  allSongs = data;
  console.log("Songs loaded",allSongs)
});

// adding event listers to search input
window.addEventListener("DOMContentLoaded", () =>{
searchInput.addEventListener('input',()=>{
  const query= searchInput.Value?.toLowerCase() || "";
  const results=allSongs.filter(song=>
    song.title?.toLowerCase().includes(query) ||
    song.artist?.toLowerCase().includes(query)
  );
  showSearchResults(results);
});

});



function showSearchResults(){
  const container = document.getElementById('search-resuits');
  console.log('Search container:', container);
  container.innerHTML = "";

  results.forEach(song => {
    const li =document.createElement('li');
    li.textContent = '${song.title} - ${song.artist}';

    const addBtn = document.createElement('button');
    addBtn.textContent = "➕";
    addBtn.onclick = () =>addToPlaylist(song);

    li.appendChild(addBtn)
    container.appendChild(li)
    
  });
  
}

// add song to playlist
function addToPlaylist(song){
  playlist.push(song);
  renderPlaylist();
}

function removeFromPlaylist(index){
  if(index === currentIndex){
    audio.pause();
    currentTitle.textContent = "No song playing";
     
  }
  playlist.splice(index,1);

  if(currentIndex > index) currentIndex--;
  if(currentIndex >= playlist.length) currentIndex = 0;

  renderPlaylist();
}


function playCurrentSong(){
  if(currentIndex >= 0 && currentIndex < playlist.length){
    const song = playlist[currentIndex];
    audioSource.src= song.url;
    audio.load();
    audio.play();
    currentTitle.textContent = 'Now Playing: ${song.title} by ${song.artist}';

  }
}

function togglePlay(){
  if(audio.src===""){
    playSong(currentIndex);

  }else if(audio.paused){
    audio.play();

  } else{
    audio.paused();
  }
}


function nextSong(){
  if(playlist.length === 0) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  playCurrentSong();
}

function prevSong(){
  if(playlist.length === 0)return;
  currentIndex=(currentIndex - 1 + playlist.length)% playlist.length;
  playCurrentSong();
}
 // auto play the next song
audio.addEventListener('ended', nextSong);


audio.addEventListener('play',()=>{
  playBtn.textContent ="⏸️";
});

audio.addEventListener('pause',()=>{
  playBtn.textContent ="▶️";
});