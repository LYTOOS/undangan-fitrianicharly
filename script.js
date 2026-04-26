"use strict";

const firebaseConfig = {
  apiKey: "AIzaSyCAxuBGwkoHDJfPYqfr2Ho_g0pc0i-rDDU",
  authDomain: "undangan-charlyfitriani.firebaseapp.com",
  databaseURL: "https://undangan-charlyfitriani-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "undangan-charlyfitriani"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let sending = false;

function clean(str){
  return str
    .replace(/[<>]/g, "")
    .replace(/script/gi, "")
    .trim();
}

function resetButton(btn){
  if(btn){
    btn.disabled = false;
    btn.innerHTML = "Kirim Ucapan";
  }
}

// --- DEVICE & IP HARDEN ---
const deviceId = localStorage.device || 
  ("dev-" + Date.now() + Math.random().toString(36).slice(2,7));
localStorage.device = deviceId;

fetch("https://api.ipify.org?format=json")
  .then(r => r.json())
  .then(d => localStorage.ip = d.ip)
  .catch(()=>{});

// --- KONFIGURASI DOM ---
const btnOpen = document.getElementById("btnOpen");
const cover = document.querySelector(".book-cover");
const introBook = document.querySelector(".intro-book");
const musik = document.getElementById("musik");
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
if(btnOpen){
  btnOpen.onclick = () => {
    document.querySelector(".book").classList.add("open");

    setTimeout(()=>{
      document.querySelector(".intro-book").style.display="none";
      document.body.classList.remove("lock");
      
      if(musik){
        musik.volume = 0;
        musik.play().catch(()=>{});
      }
    
      if(musik){
        let vol = 0;
        const fade = setInterval(()=>{
          if(vol < 0.5){
            vol += 0.02;
            musik.volume = vol;
          }else{
            clearInterval(fade);
          }
        },100);
      }
    
      if(musicBtn){
        musicBtn.style.display = "flex";
      }
    
      AOS.init({ once:true });
    
    },1800);
  };
}

// --- 3. KONTROL MUSIK ---
function playMusic() {
    if(!musik) return;

    musik.volume = 0.5;
    musik.play().then(() => {
    if(musicBtn){
      musicBtn.classList.remove("paused");
    }
    }).catch((error) => {
        console.log("Autoplay blocked, waiting for interaction");
    });
}

function toggleMusic() {
    if (!musik) return;

    if (musik.paused) {
        musik.play();
        if(musicBtn){
          musicBtn.classList.remove("paused");
        }
    } else {
        musik.pause();
        if(musicBtn){
          musicBtn.classList.add("paused");
        }
    }
}

// --- 4. NAMA TAMU DARI URL ---
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
const introNama = document.getElementById("introNama");
if (namaTamu && introNama) {
    introNama.innerText = namaTamu.replace(/-/g, " ");
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
const weddingDate = new Date("2027-03-20T07:00:00").getTime();
setInterval(() => {
    const dEl = document.getElementById("d");
    const hEl = document.getElementById("h");
    const mEl = document.getElementById("m");
    const sEl = document.getElementById("s");

    if(!dEl || !hEl || !mEl || !sEl) return;

    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        dEl.innerText = "0";
        hEl.innerText = "0";
        mEl.innerText = "0";
        sEl.innerText = "0";
        return;
    }

    dEl.innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
    hEl.innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    mEl.innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    sEl.innerText = Math.floor((distance % (1000 * 60)) / 1000);
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

let walletTimer;

function openWallet(type){
  const popup = document.getElementById("walletPopup");
  const title = document.getElementById("walletTitle");
  const content = document.getElementById("walletContent");

  let html = "";

  if(type === "bri"){
  title.innerText = "Bank BRI";
  html = `
    <p>017501078299507</p>
    <button class="btn-copy" onclick="copyText('017501078299507')">
      Salin Nomor
    </button>
  `;
}

  if(type === "dana"){
  title.innerText = "DANA";
  html = `
    <p>082261467360</p>
    <button class="btn-copy" onclick="copyText('082261467360')">
      Salin Nomor
    </button>
  `;
}

  if(type === "gopay"){
  title.innerText = "GoPay";
  html = `
    <p>082287179255</p>
    <button class="btn-copy" onclick="copyText('082287179255')">
      Salin Nomor
    </button>
  `;
}

  if(type === "seabank"){
  title.innerText = "SeaBank";
  html = `
    <p>901519817032</p>
    <button class="btn-copy" onclick="copyText('901519817032')">
      Salin Nomor
    </button>
  `;
}

  content.innerHTML = html;
  popup.classList.add("active");

  walletTimer = setTimeout(()=>{
    closeWallet();
  },10000);
}

function closeWallet(){
  const popup = document.getElementById("walletPopup");
  popup.classList.remove("active");
  clearTimeout(walletTimer);
}

function openEnvelope(){
  const el = document.querySelector(".envelope");
  el.classList.add("open");

  setTimeout(()=>{
    const target = document.querySelector(".wallet-category");
    if(target){
      target.scrollIntoView({ 
        behavior:"smooth",
        block:"center"
      });
    }
  },800);
}

// --- KIRIM UCAPAN (LIMIT 1X) ---
function kirimUcapan(){

  if(sending) return;
  sending = true;

  const btn = document.getElementById("btnKirim");
  if(btn){
    btn.disabled = true;
    btn.innerHTML = "<span class='spinner'></span> Mengirim...";
  }
  
  const nama = clean(document.getElementById("namaPengirim").value);
  const pesan = clean(document.getElementById("pesanUcapan").value);
  const status = document.querySelector('input[name="rsvp"]:checked');
  const jumlah = parseInt(document.getElementById("jumlahTamu").value) || 0;

  if(jumlah < 0){
    alert("Jumlah tamu tidak valid");
    sending = false;
    resetButton(btn);
    return;
  }

  if(nama.length < 3 || pesan.length < 5 || !status){
    alert("Nama, status kehadiran & ucapan wajib diisi 🙏");
    sending = false;
    resetButton(btn);
    return;
  }

  if(nama.length > 30 || pesan.length > 300){
    alert("Terlalu panjang 🙏");
    sending = false;
    resetButton(btn);
    return;
  }

  if(!/^[\p{L}0-9\s.,'-]+$/u.test(nama)){
    showToast("Nama tidak valid");
    sending = false;
    resetButton(btn);
    return;
  }

  const lowerPesan = pesan.toLowerCase().replace(/\s/g,'');

  if(lowerPesan.includes("http") || lowerPesan.includes("www")){
    alert("Pesan tidak boleh mengandung link");
    sending = false;
    resetButton(btn);
    return;
  }

  if(jumlah > 10){
    alert("Jumlah tamu terlalu banyak");
    sending = false;
    resetButton(btn);
    return;
  }

  const lastSend = localStorage.lastSend || 0;
  
  if(Date.now() - lastSend < 5000){
    alert("Tunggu sebentar sebelum kirim lagi");
    sending = false;
    resetButton(btn);
    return;
  }

  if(Date.now() - lastSend < 24*60*60*1000){
    alert("Ucapan hanya dapat dikirim 1 kali 🙏");
    sending = false;
    resetButton(btn);
    return;
  }

  const finalStatus = status.value === "Hadir"
  ? `Hadir (${jumlah} orang)`
  : status.value;

  const ip = localStorage.ip || "unknown";
  
    db.ref("ucapan").push({
      nama,
      pesan,
      status: finalStatus,
      waktu: Date.now(),
      ip,
      deviceId
    })
    .then(()=>{
      localStorage.lastSend = Date.now();
    
      showToast("Terima kasih, ucapan Anda terkirim 🤍");
    
      document.getElementById("namaPengirim").value="";
      document.getElementById("pesanUcapan").value="";
      document.getElementById("jumlahTamu").value="";

      sending = false;
      
      setTimeout(() => {
        resetButton(btn);
      }, 1500);
    })
    .catch(e=>{
      console.error(e);
      showToast("Gagal mengirim, coba lagi nanti 🙏");

      sending = false;
      resetButton(btn);
    });
    
    }

function toggleGuestInput(show){
  document.getElementById("guestCountBox").style.display = show ? "block" : "none";
}

function showToast(msg){
  const toast = document.getElementById("toast");
  if(!toast) return;

  toast.innerText = msg;
  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },3000);
}

// --- AUTO LOAD UCAPAN (REALTIME) ---
const list = document.getElementById("displayUcapan");

if(list){
  db.ref("ucapan")
    .limitToLast(50)
    .on("child_added", snap => {
      const d = snap.val();
      if(!d) return;

      const statusText = d.status || "Belum Pasti";

      const div = document.createElement("div");
      div.className = "ucapan-item";

      div.innerHTML = `
        <div class="ucapan-card">
          
          <div class="ucapan-avatar">
            ${d.nama.charAt(0).toUpperCase()}
          </div>
      
          <div class="ucapan-content">
            
            <div class="ucapan-header">
              <span class="nama">${d.nama}</span>
              <span class="status ${statusText.replace(/\s/g,'')}">${statusText}</span>
            </div>
      
            <div class="ucapan-text">
              ${d.pesan}
            </div>
      
            <div class="ucapan-footer">
              ${new Date(d.waktu).toLocaleString("id-ID")}
            </div>
      
          </div>
      
        </div>
      `;

      list.prepend(div);

      setTimeout(() => {
        div.classList.add("show");
      }, Math.random() * 200);
    });
}

db.ref("ucapan").on("value", snap=>{
  let hadir=0, tidak=0, ragu=0;

  snap.forEach(child=>{
    const s = (child.val() && child.val().status) || "";
    if(s.includes("Hadir")) hadir++;
    else if(s.includes("Tidak")) tidak++;
    else ragu++;
  });

  document.getElementById("hadirCount").innerText = hadir;
  document.getElementById("tidakCount").innerText = tidak;
  document.getElementById("raguCount").innerText = ragu;
});

// --- FIX POPUP CLICK ---
document.addEventListener("DOMContentLoaded", function () {
  const box = document.querySelector(".wallet-box");
  if (box) {
    box.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }
});

const slider = document.getElementById("gallerySlider");
const dotsContainer = document.getElementById("galleryDots");

if(slider){

  const images = slider.querySelectorAll("img");

  // buat dots
  images.forEach((_, i)=>{
    const dot = document.createElement("span");
    if(i===0) dot.classList.add("active");
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  let index = 0;

  function updateSlider(){
    const width = slider.clientWidth;

    slider.scrollTo({
      left: width * index,
      behavior:"smooth"
    });

    dots.forEach(d=>d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  // AUTO SLIDE
  setInterval(()=>{
    index++;
    if(index >= images.length) index = 0;
    updateSlider();
  },4000);

  // SCROLL DETECT (biar sinkron)
  slider.addEventListener("scroll", ()=>{
    const width = slider.clientWidth;
    index = Math.round(slider.scrollLeft / width);

    dots.forEach(d=>d.classList.remove("active"));
    if(dots[index]) dots[index].classList.add("active");
  });
}
