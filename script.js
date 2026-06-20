function playVideo(wrapperId, videoId, start) {
    const url = start && start !== '0'
        ? `https://www.youtube.com/watch?v=${videoId}&t=${start}s`
        : `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
}

// ===== MÜZİK ÇALAR =====
const playlist = [
    {
        title: 'Cehennem Beat - BABA',
        artist: 'Gustavo Santaolalla',
        album: 'Cehennem Beat',
        src: 'assets/baba.mp3'
    },
    {
        title: 'discipline - Slowed',
        artist: 'HELLBLADE',
        album: 'discipline',
        src: 'assets/discipline.mp3'
    },
    {
        title: 'AXEGAO (Hardtekk - Super Slowed)',
        artist: 'AXEGAO',
        album: 'AXEGAO',
        src: 'assets/axegao.mp3'
    },
    {
        title: 'LONOWN - AVANGARD (SLOWED)',
        artist: 'LONOWN',
        album: 'AVANGARD',
        src: 'assets/lonown.mp3'
    }
];

let currentIndex = 0;
let isShuffled = false;
let isRepeating = false;
let isPlaying = false;

const audio = document.getElementById('audio-player');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackAlbum = document.getElementById('track-album');
const progressBar = document.getElementById('progress-bar');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');
const btnPlay = document.getElementById('btn-play');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnShuffle = document.getElementById('btn-shuffle');
const btnRepeat = document.getElementById('btn-repeat');

function formatTime(sec) {
    if (isNaN(sec)) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    trackAlbum.textContent = track.album;
    progressBar.value = 0;
    timeCurrent.textContent = '00:00';
    timeTotal.textContent = '00:00';
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        btnPlay.textContent = '▶';
        isPlaying = false;
    } else {
        audio.play().catch(() => {});
        btnPlay.textContent = '⏸';
        isPlaying = true;
    }
}

function nextTrack() {
    if (isShuffled) {
        currentIndex = Math.floor(Math.random() * playlist.length);
    } else {
        currentIndex = (currentIndex + 1) % playlist.length;
    }
    loadTrack(currentIndex);
    if (isPlaying) audio.play().catch(() => {});
}

function prevTrack() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
    } else {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentIndex);
        if (isPlaying) audio.play().catch(() => {});
    }
}

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        timeCurrent.textContent = formatTime(audio.currentTime);
        timeTotal.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener('ended', () => {
    if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    } else {
        nextTrack();
    }
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration)) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

btnPlay.addEventListener('click', togglePlay);
btnNext.addEventListener('click', nextTrack);
btnPrev.addEventListener('click', prevTrack);

btnShuffle.addEventListener('click', () => {
    isShuffled = !isShuffled;
    btnShuffle.style.color = isShuffled ? '#1db954' : '';
});

btnRepeat.addEventListener('click', () => {
    isRepeating = !isRepeating;
    btnRepeat.style.color = isRepeating ? '#1db954' : '#b3b3b3';
    btnRepeat.classList.toggle('active-repeat', isRepeating);
});

loadTrack(currentIndex);

const snowContainer = document.getElementById('snow-container');

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    
    // Boyutu daha belirgin kıldık
    const size = Math.random() * 4 + 1.5; 
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    
    // Yatayda rastgele bir noktadan başlama
    snowflake.style.left = Math.random() * 100 + 'vw';
    
    // --- HIZLANDIRILDI ---
    // Kar artık ekrandan 4 ile 10 saniye arasında düşüyor (Önceden çok daha yavaştı)
    const duration = Math.random() * 6 + 4; 
    snowflake.style.animation = `fallSway ${duration}s linear infinite`;
    
    // Gerçekçi Alan Derinliği (3D Focus Efekti)
    if (size < 2.5) {
        // Arkadaki küçük karlar flu ve daha az parlak
        snowflake.style.filter = `blur(${Math.random() * 2 + 1}px)`;
        snowflake.style.opacity = Math.random() * 0.4 + 0.2;
        snowflake.style.zIndex = 0;
    } else {
        // Öndeki büyük karlar net ve çok parlak
        snowflake.style.filter = `blur(${Math.random() * 0.5}px)`;
        snowflake.style.opacity = Math.random() * 0.6 + 0.4;
        snowflake.style.zIndex = 5;
    }
    
    snowContainer.appendChild(snowflake);
    
    // Ekranda birikmeyi ve donmayı engellemek için elementi silme
    setTimeout(() => { snowflake.remove(); }, duration * 1000);
}

// --- YOĞUNLAŞTIRILDI ---
// Her 40 milisaniyede bir kar tanesi üretilir (Önceden 100ms idi)
setInterval(createSnowflake, 40);

// Sayfa ilk açıldığında boş olmaması için hızlıca 150 adet kar tanesi önyüklemesi
for(let i = 0; i < 150; i++) {
    setTimeout(createSnowflake, Math.random() * 3000);
}