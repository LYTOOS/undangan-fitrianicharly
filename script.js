"use strict";

// --- KONFIGURASI DOM ---
const musicBtn = document.getElementById("musicControl");
const musik = document.getElementById("musik");
const intro = document.getElementById("intro");
const btnOpen = document.getElementById("btnOpen");

// --- 1. INISIALISASI AOS (ANIMASI) ---
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false
    });
});

// Pantun otomatis
const pantunList = [
"Pergi ke hulu mencari sepat, singgah sebentar di tepi paya. Jika niat sudah terpatri di hati, akad nikah jadi penyempurna cinta.",
"Songket disulam benang emas, dipakai raja di hari mulia. Restu orang tua doa terikhlas, rumah tangga bahagia selamanya.",
"Kalau berlayar ke Indragiri, jangan lupa membawa bekal. Bila akad telah diikrari, cinta halal jadi modal kekal."
];
document.getElementById("pantun").innerText = pantunList[Math.floor(Math.random()*pantunList.length)];

// --- 2. LOGIKA BUKA UNDANGAN ---
btnOpen.addEventListener("click", () => {
    window.scrollTo(0, 0);
    intro.classList.add("slide-up");
    document.body.classList.remove("lock");
    
    // Mainkan musik
    playMusic();
    
    setTimeout(() => {
        musicBtn.style.display = "flex";
        intro.style.display = "none";
        AOS.refresh();
    }, 1000);
});

// --- 3. KONTROL MUSIK ---
function playMusic() {
    musik.volume = 0.5;
    musik.play().then(() => {
        musicBtn.classList.remove("paused");
    }).catch((error) => {
        console.log("Autoplay blocked, waiting for interaction");
    });
}

function toggleMusic() {
    if (musik.paused) {
        musik.play();
        musicBtn.classList.remove("paused");
    } else {
        musik.pause();
        musicBtn.classList.add("paused");
    }
}

// --- 4. NAMA TAMU DARI URL ---
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
if (namaTamu) {
    document.getElementById("introNama").innerText = namaTamu.replace(/-/g, " ");
}

// --- 5. PANTUN ACAK ---
const pantunList = [
    "Pergi ke hulu mencari sepat, singgah sebentar di tepi paya. Jika niat sudah terpatri di hati, akad nikah jadi penyempurna cinta.",
    "Songket disulam benang emas, dipakai raja di hari mulia. Restu orang tua doa terikhlas, rumah tangga bahagia selamanya.",
    "Kalau berlayar ke Indragiri, jangan lupa membawa bekal. Bila akad telah diikrari, cinta halal jadi modal kekal."
];
const pantunEl = document.getElementById("pantun");
if (pantunEl) {
    pantunEl.innerText = pantunList[Math.floor(Math.random() * pantunList.length)];
}

// --- 6. HITUNG MUNDUR (COUNTDOWN) ---
const weddingDate = new Date("2026-02-15T07:00:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("d").innerText = "0";
        document.getElementById("h").innerText = "0";
        document.getElementById("m").innerText = "0";
        document.getElementById("s").innerText = "0";
        return;
    }
    document.getElementById("d").innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    document.getElementById("h").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById("m").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById("s").innerText = Math.floor((distance % (1000 * 60)) / 1000);
}, 1000);

// --- 7. FUNGSI COPY TEXT ---
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Berhasil disalin: " + text);
    }).catch(err => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Berhasil disalin: " + text);
    });
}

// --- 8. POPUP QRIS LOGIC ---
function openQris() {
    document.getElementById("qrisPopup").classList.add("active");
}
function closeQris() {
    document.getElementById("qrisPopup").classList.remove("active");
}
document.querySelector('.qris-content').addEventListener('click', function(e) {
    e.stopPropagation();
});

// --- 9. KIRIM UCAPAN (FRONTEND ONLY) ---
function kirimUcapan() {
    const nama = document.getElementById("namaPengirim").value;
    const pesan = document.getElementById("pesanUcapan").value;
    if (nama === "" || pesan === "") { alert("Harap isi nama dan ucapan."); return; }
    const list = document.getElementById("displayUcapan");
    const item = document.createElement("div");
    item.style.borderBottom = "1px solid #ddd"; item.style.padding = "10px 0"; item.style.textAlign = "left";
    item.innerHTML = `<strong>${nama}</strong><br><small>${pesan}</small>`;
    list.prepend(item);
    document.getElementById("namaPengirim").value = "";
    document.getElementById("pesanUcapan").value = "";
    alert("Terima kasih, ucapan Anda telah terkirim!");
}
