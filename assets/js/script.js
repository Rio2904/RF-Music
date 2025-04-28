let audio = new Audio();
//let boxAudio = document.querySelectorAll('.box');

// next prev play btn
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

const prevMainBtn = document.getElementById('prev-main');
const nextMainBtn = document.getElementById('next-main');

let playPauseBtn = document.querySelector(".play-pause-container");
let playPauseSvg = playPauseBtn.querySelectorAll(".play-pause");

let playPauseMainBtn = document.querySelector(".play-pause-main-container");
let playPauseMainSvg = playPauseMainBtn.querySelectorAll(".play-pause-main");





// Audio Player detail
const thumbAudioPlayer = document.querySelector('.thumb-audio-player');
const titleAudioPlayer = document.querySelector('.title .judulAP');
const artisAudioPlayer = document.querySelector('.title .artisAP');
const audioPlayerDetail = document.querySelector(".audio-player .detail")

// audio player main detail
const playerContainerMain = document.querySelector(".player-container-main");
const thumbAudioPlayerMain = document.querySelector('.album-cover-main img');
const titleAudioPlayerMain = document.querySelector('.song-info-main .title-main');
const artisAudioPlayerMain = document.querySelector('.song-info-main .artist-main');
const backBtn = document.getElementById("back-main");

let lyricsToggle = document.querySelector(".lyrics-toggle");
let lyricsMain = document.querySelector(".lyrics-main");

// Audio player Seek Slider
let audioDuration = document.querySelector('.duration');
let audioCurrTime = document.querySelector('.currTime')
const seekSlider = document.getElementById('seekslider');

let audioDurationMain = document.getElementById('duration-main');
let audioCurrTimeMain = document.getElementById('current-time-main');
const seekSliderMain = document.getElementById('seekSlider-main');

// search input
let searchInput = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");




// id song 
let idSong;




// get random song
getRecomendedSong(randomSong(), 1);
getRecomendedSong(randomSong2(), 2);


// when input search enter
searchInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    getSongsSearch(searchInput.value);
  }
});

// search songs
searchBtn.addEventListener("click", function () {
  getSongsSearch(searchInput.value);
})

// close audio player main
backBtn.addEventListener("click", () => {
  playerContainerMain.classList.remove("active");
})
// show audio player main 
audioPlayerDetail.addEventListener("click", () => {
  playerContainerMain.classList.add("active");
})

// show lyrics
lyricsToggle.addEventListener("click", handleSongLyrics);




// ===== Asycn Function =====
// =========================

// get search song func
// ===================
async function getSongsSearch(search) {
  const url = `https://jiosavan-api2.vercel.app/api/search/songs?query=${search}`;
  //const url = `https://saavn.dev/api/search/songs?query=${search}`;
  document.querySelectorAll('.container-box-song')[0].innerHTML = `<span class="loader mx-auto"></span>`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    let data = result.data.results;
    displaySearchSongs(data);

    // get all element box audio when asycn done
    let boxAudio = document.querySelectorAll('.box.mini');

    boxAudio.forEach(function (box, index) {
      // pilih box lagu
      box.addEventListener("click", function () {
        // cek isNew Song
        if (idSong != this.dataset.id) {
          idSong = this.dataset.id;
          handleBoxClicked(index, boxAudio);
        } else {
          playerContainerMain.classList.add("active");
        }

      });

    });

  } catch (error) {
    alert(error);
  }
}
// dislplay search songs
function displaySearchSongs(data) {
  let box = ``;
  data.forEach(function (e, i) {
    box += `<div class="box mini" data-url="${e.downloadUrl[3].url}" data-id="${e.id}" >
        <div class="thumb mini"><img src="${e.image[1].url}"/></div>
        <div class="text mini">
          <p class="judul mini">${e.name}</p>
          <p class="artis mini">${e.artists.primary[0].name}</p>
        </div>
      </div>`;
  })
  let container = document.querySelectorAll('.container-box-song');
  container[0].innerHTML = box;
}

// get recomended song
//====================
async function getRecomendedSong(artist, section) {
  const url = `https://jiosavan-api2.vercel.app/api/search/songs?query=${artist}`;
  document.querySelectorAll('.container-box-song')[section].innerHTML = `<span class="loader mx-auto"></span>`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    let data = result.data.results;
    displayRecomendedSongs(data, section);

    // get all element box audio when asycn done
    let boxRecomendedSong = document.querySelectorAll('.box');

    boxRecomendedSong.forEach(function (box, index) {
      // pilih box lagu
      box.addEventListener("click", function () {
        // cek isNew Song
        if (idSong != this.dataset.id) {
          handleBoxClicked(index, boxRecomendedSong);
        } else {
          playerContainerMain.classList.add("active");
        }

      });

    });

  } catch (error) {
    alert(error);
  }
}

// dislplay search songs
function displayRecomendedSongs(data, section) {
  // Literal
  let box = ``;
  data.forEach(function (e, i) {
    box += `<div class="box" data-url="${e.downloadUrl[3].url}" data-id="${e.id}" >
        <div class="thumb"><img src="${e.image[1].url}"/></div>
        <div class="text">
          <p class="judul">${e.name}</p>
          <p class="artis">${e.artists.primary[0].name}</p>
        </div>
      </div>`;
    // push box song
  })
  let container = document.querySelectorAll('.container-box-song');
  container[section].innerHTML = box;
}

// get song's lyrics func
// ======================
async function getSongLyrics(idSong) {
  const url = `https://jiosavan-api2.vercel.app/api/songs/${idSong}/lyrics`;
  lyricsMain.innerHTML = `<span class="loader mx-auto"></span>`;
  try {
    const response = await fetch(url);
    const result = await response.json();
    let data = result.data;
    if (data) {
      let lyricsResult = data.lyrics.split(/(?<=\s)(?=[A-Z])/);
      displayLyrics(lyricsResult);

    } else {
      lyricsMain.innerHTML = "Maaf lirik tidak tersedia";
    }

  } catch (error) {
    alert(error);
  }
}
// display song's lyrics
function displayLyrics(lyrics) {
  let str = ``;
  lyrics.forEach(function (baris) {
    str += `<p>${baris}</p>`;
  });
  lyricsMain.innerHTML = str;
}

















// ==== Function Handle ====
// =========================

// handle func when song picked
function handleBoxClicked(index, boxAudio) {

  // play current picked song
  playCurrentAudio(index, boxAudio);
  // show audio player main
  playerContainerMain.classList.add("active");
  // play pause lagu
  playPauseBtn.onclick = handlePlayPauseAudio;
  playPauseMainBtn.onclick = handlePlayPauseAudio;
  // play next lagu
  nextMainBtn.onclick = handleNextSong;
  nextBtn.onclick = handleNextSong
  // play prev lagu
  prevMainBtn.onclick = handlePrevSong;
  prevBtn.onclick = handlePrevSong;
  // auto play next song
  audio.addEventListener("ended", handleNextSong);

  function handleNextSong() {
    index = index < boxAudio.length - 1 ? index += 1 : index = 0;
    audio.pause();
    playCurrentAudio(index, boxAudio);
  }

  function handlePrevSong() {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      index = index > 0 ? index -= 1 : index = boxAudio.length - 1;
      audio.pause();
      playCurrentAudio(index, boxAudio);
    }
  }

}

// Play lagu sesuai index
function playCurrentAudio(index, boxAudio) {
  idSong = boxAudio[index].dataset.id;
  let currentAudioSrc = boxAudio[index].getAttribute("data-url");
  audio.src = currentAudioSrc;
  audio.removeEventListener("timeupdate", handleUpdateProgress);
  lyricsMain.classList.remove("active");
  lyricsMain.innerHTML = "";
  boxAudioStyle(index, boxAudio);

  audio.addEventListener("loadedmetadata", () => {

    getTotalDurationSong();

    audio.play();
    // ubah audio player detail
    changeAudioPlayerDetail(index, boxAudio);
    audio.addEventListener("timeupdate", handleUpdateProgress);

  });

}


// Play & Pause lagu
function handlePlayPauseAudio() {
  if (audio.paused && audio.src != "") {
    audio.play()
    playPauseSvg[1].classList.add("active");
    playPauseSvg[0].classList.remove("active");
    playPauseMainSvg[1].classList.add("active");
    playPauseMainSvg[0].classList.remove("active");

  } else if (audio.src != "") {
    audio.pause()
    playPauseSvg[0].classList.add("active");
    playPauseSvg[1].classList.remove("active");
    playPauseMainSvg[0].classList.add("active");
    playPauseMainSvg[1].classList.remove("active");
  }
}


// event saat lagu onplay atau onpause
audio.onplay = () => {
  playPauseSvg[1].classList.add("active");
  playPauseSvg[0].classList.remove("active");
  playPauseMainSvg[1].classList.add("active");
  playPauseMainSvg[0].classList.remove("active");
  thumbAudioPlayerMain.style.animation = "playRotate 6s infinite forwards linear";
};
audio.onpause = () => {
  playPauseSvg[0].classList.add("active");
  playPauseSvg[1].classList.remove("active");
  playPauseMainSvg[0].classList.add("active");
  playPauseMainSvg[1].classList.remove("active");
  thumbAudioPlayerMain.style.animation = "none";
}

// get random artist
function randomSong() {
  const artist = ["Justin Bieber", "Coldplay", "Green Day", "One Direction", "Cigarettes after sex", "Linkin Park"];
  const random = Math.floor(Math.random() * artist.length);
  return artist[random];
}

// get random artist
function randomSong2() {
  const artist = ["Blackpink", "Zara Larsson", "Calvin Harris", "Maroon 5", "Keane", "Imagine Dragons"];
  const random = Math.floor(Math.random() * artist.length);
  return artist[random];
}

// handle func song's lyrics 
function handleSongLyrics() {
  if (lyricsMain.textContent == "") {
    getSongLyrics(idSong);
    lyricsMain.classList.add("active");
  } else if (lyricsMain.textContent != "") {
    lyricsMain.classList.toggle("active")
  }
}

// style current audio 
function boxAudioStyle(index, boxAudio) {
  for (let j = 0; j < boxAudio.length; j++) {
    boxAudio[j].style.color = "#a7a7a7";
    boxAudio[j].style.backgroundColor = "#121212";
    boxAudio[j].querySelector('img').style.opacity = "1";
  }

  boxAudio[index].style.color = "white";
  boxAudio[index].style.backgroundColor = "#242424";
  boxAudio[index].querySelector('img').style.opacity = "0.5";
}


// ubah Audio Player Detail
function changeAudioPlayerDetail(index, boxAudio) {
  // audio player
  titleAudioPlayer.innerText = boxAudio[index].querySelector('.judul').textContent;
  thumbAudioPlayer.src = boxAudio[index].querySelector('.thumb img').src;
  artisAudioPlayer.innerText = boxAudio[index].querySelector('.artis').textContent;
  // audio player main
  titleAudioPlayerMain.innerText = boxAudio[index].querySelector('.judul').textContent;
  thumbAudioPlayerMain.src = boxAudio[index].querySelector('.thumb img').src;
  artisAudioPlayerMain.innerText = boxAudio[index].querySelector('.artis').textContent;
}


// get slider input
seekSlider.addEventListener('input', () => {
  if (audio.src != "") {
    let seekTo = audio.duration * (seekSlider.value / 100);
    audio.currentTime = seekTo;
  }
});

seekSliderMain.addEventListener('input', () => {
  if (audio.src != "") {
    let seekToMain = audio.duration * (seekSliderMain.value / 100);
    audio.currentTime = seekToMain;
  }
});


// handle func update slider
function handleUpdateProgress() {
  // set slider value
  let value = (100 / audio.duration) * audio.currentTime;
  seekSlider.value = value;
  seekSliderMain.value = value;

  // get currentTime 
  let menit = Math.floor(audio.currentTime / 60)
  let detik = Math.floor(audio.currentTime % 60)
  if (detik < 10) { detik = `0${detik}` }
  let CurrTime = `${menit}:${detik}`;
  audioCurrTime.innerHTML = CurrTime;
  audioCurrTimeMain.innerHTML = CurrTime;

}


function getTotalDurationSong() {
  // Total Duration
  let menit = Math.floor(audio.duration / 60);
  let detik = Math.floor(audio.duration % 60);
  if (detik < 10) { detik = `0${detik}` }
  let durationTotal = `${menit}:${detik}`;
  audioDuration.innerHTML = durationTotal;
  audioDurationMain.innerHTML = durationTotal;
}