// getting elements by id
const audio=document.getElementById('audio');
const audioSource=document.getElementById('audio-source')
const playBtn=document.getElementById('play-btn');
const searchInput=document.getElementById('search-input');
const playlistElement=document.getElementById('playlist');
const currentTitle=document.getElementById('current-song-title');
const searchResults = document.getElementById('search-results');


let playlist= [];
let currentIndex = -1;

// adding event listers to search input

searchInput.addEventListener('input',async()=>{
  const query= searchInput.value.trim();
  
   if(!query){
    searchResults. innerHTML = '';
    return;
   }
     searchResults.innerHTML= '<li>Searching...</li>';


   try{
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=10`);
    const data = await response.json();

    if(data.results.length=== 0){
      searchResults.innerHTML = '<li>No results found.</li>';
    }else{
      showSearchResults(data.results);
    }

   } catch(error){
    searchResults.innerHTML =  '<li>Error fetching songs. Please check your internet connection.</li>';
    console.error('Search failed:',  error);
   }

   
});

// show search results

function showSearchResults(results){
  searchResults.innerHTML='';
  results.forEach(song=>{
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${song.artworkUrl60}" alt="Cover">
      ${song.trackName} - ${song.artistName}
    `;
  })
    
  };
  


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