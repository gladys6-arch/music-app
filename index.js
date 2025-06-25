// getting elements by id
const audio=document.getElementById('audio');
const audioSource=document.getElementById('audio-source')
const playBtn=document.getElementById('play-btn');
const searchInput=document.getElementById('search-input');
const playlistElement=document.getElementById('playlist');
const currentTitle=document.getElementById('current-song-title');


let playlist= [];
let currentIndex = -1;

// fetch songs from JSON server
document.addEventListener("DOMContentLoaded",()=>{
const searchResultsContainer= document.getElementById('search-results');
  
fetch("http://localhost:3000/songs")
.then(res=>res.json())
.then(data=>{
  console.log("Songs loaded",data);
  allSongs =data;
  showSearchResults(data);
})
  .catch(error=>{
    console.error('Failed to load songs:', error);
  });



});

// adding event listers to search input

searchInput.addEventListener('input',()=>{
  const query= searchInput.value?.toLowerCase() || "";
  const results=allSongs.filter(song=>
    song.title?.toLowerCase().includes(query) ||
    song.artist?.toLowerCase().includes(query)
  );
  showSearchResults(results);
});



function showSearchResults(results){
  const container = document.getElementById('search-results');
  console.log('Search container:', container);
  if(!container)return;

  container.innerHTML = "";

  results.forEach(song => {
    const li =document.createElement('li');
    li.textContent = `${song.title} - ${song.artist}`;


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


function renderPlaylist(){
  playlistElement.innerHTML = "";

playlist.forEach((song,index)=>{
  const li= document.createElement('li');
  li.textContent = `${song.title} - ${song.artist}`;

  const removeBtn =document.createElement('button');
  removeBtn.textContent ="🗑️";
  removeBtn.onclick = () => removeFromPlaylist(index);


   li.onclick = () =>{
    currentIndex = index;
    playCurrentSong();
   };
   li.appendChild(removeBtn);
   playlistElement.appendChild(li);
});
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
    audio.src= song.url;
    audio.load();
    audio.play().catch(err=>{
      currentTitle.textContent = `Now Playing: ${song.title} by ${song.artist}`;
    })

  }
}

function togglePlay(){
  if(audio.src===""){
    playCurrentSong();

  }else if(audio.paused){
    audio.play();

  } else{
    audio.pause();
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