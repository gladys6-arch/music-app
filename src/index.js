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
fetch()

function togglePlay(){
  if(audio.src===""){
    playSong(currentIndex);

  }else if(audio.paused){
    audio.play();

  } else{
    audio.paused();
  }
}

audio.addEventListener('play',()=>{
  playBtn.textContent ="⏸️";
});

audio.addEventListener('pause',()=>{
  playBtn.textContent ="▶️";
});