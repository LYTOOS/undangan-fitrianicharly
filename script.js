"use strict";

const firebaseConfig = {
  apiKey: "AIzaSyCr2VF6hZ3pLWU5eORdrtdM1c5L_AcLVH4",
  authDomain: "undangan-pernikahan-f6d5e.firebaseapp.com",
  databaseURL: "https://undangan-pernikahan-f6d5e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "undangan-pernikahan-f6d5e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- DEVICE & IP HARDEN ---
const deviceId = localStorage.device || 
  ("dev-" + Math.random().toString(36).substr(2,9));
localStorage.device = deviceId;

fetch("https://api.ipify.org?format=json")
  .then(r => r.json())
  .then(d => localStorage.ip = d.ip)
  .catch(()=>{});

// --- KONFIGURASI DOM ---
const btnOpen = document.getElementById("btnOpen");
const cover = document.querySelector(".book-cover");
const introBook = document.querySelector(".intro-book");
const audio = document.getElementById("musik");
const musicBtn = document.getElementById("musicControl");

// --- 1. INISIALISASI AOS (ANIMASI) ---
document.addEventListener("DOMContentLoaded", () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false
    });
});

// --- 2. LOGIKA BUKA UNDANGAN ---
btnOpen.addEventListener("click", () => {
  cover.classList.add("open");

  setTimeout(() => {
    introBook.style.display = "none";
    document.body.classList.remove("lock");

    audio.play().catch(()=>{});
    musicBtn.style.display = "flex";

    AOS.init({ once:true });
  }, 1500);
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

// --- KIRIM UCAPAN (LIMIT 1X) ---
function kirimUcapan(){
  const nama = document.getElementById("namaPengirim").value.trim();
  const pesan = document.getElementById("pesanUcapan").value.trim();

  if(nama.length < 3 || pesan.length < 5){
    alert("Nama & ucapan belum lengkap");
    return;
  }

  const lastSend = localStorage.lastSend || 0;
  if(Date.now() - lastSend < 24*60*60*1000){
    alert("Ucapan hanya dapat dikirim 1 kali 🙏");
    return;
  }

  fetch("https://api.ipify.org?format=json")
    .then(r=>r.json())
    .then(d=>localStorage.ip=d.ip)
    .catch(()=>{});

  const ip = localStorage.ip || "unknown";

  try{
    db.ref("ucapan").push({
      nama,
      pesan,
      waktu: Date.now(),
      ip
    });

    localStorage.lastSend = Date.now();

    alert("Terima kasih, ucapan Anda terkirim 🤍");

    document.getElementById("namaPengirim").value="";
    document.getElementById("pesanUcapan").value="";

  }catch(e){
    console.error(e);
    alert("Gagal mengirim ucapan");
  }
}

// --- AUTO LOAD UCAPAN (REALTIME) ---
const list = document.getElementById("displayUcapan");

db.ref("ucapan")
  .limitToLast(50)
  .on("child_added", snap => {
    const d = snap.val();
    if(!d || !list) return;

    const div = document.createElement("div");
    div.className = "ucapan-item";
    div.innerHTML = `
      <strong>${d.nama}</strong>
      <small>${new Date(d.waktu).toLocaleString("id-ID")}</small>
      <p>${d.pesan}</p>
    `;

    list.prepend(div);
  });
