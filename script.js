"use strict";

function $(id){
  return document.getElementById(id);
}

AOS.init({duration:1200,once:true});

const firebaseConfig={
apiKey:"AIzaSyCr2VF6hZ3pLWU5eORdrtdM1c5L_AcLVH4",
authDomain:"undangan-pernikahan-f6d5e.firebaseapp.com",
databaseURL:"https://undangan-pernikahan-f6d5e-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId:"undangan-pernikahan-f6d5e"
};

// Pantun otomatis
const pantunList = [
  "Pergi ke hulu mencari sepat, singgah sebentar di tepi paya. Jika niat sudah terpatri di hati, akad nikah jadi penyempurna cinta.",
  "Songket disulam benang emas, dipakai raja di hari mulia. Restu orang tua doa terikhlas, rumah tangga bahagia selamanya.",
  "Kalau berlayar ke Indragiri, jangan lupa membawa bekal. Bila akad telah diikrari, cinta halal jadi modal kekal."
];

const pantunEl = document.getElementById("pantun");
if (pantunEl) {
  pantunEl.innerText =
    pantunList[Math.floor(Math.random() * pantunList.length)];
}

const tamuEl = document.getElementById("tamu");
if (tamuEl) {
  const q = new URLSearchParams(location.search);
  if (q.get("to")) {
    tamuEl.innerText = "Yth. " + q.get("to").replace(/-/g, " ");
  }
}

const popupEl = document.getElementById("popup");
function popup(show) {
  if (!popupEl) return;
  popupEl.style.display = show ? "flex" : "none";
}

const WA_NUMBER="6282261467360";
const WA_APIKEY="APIKEY_KAMU";

const device = localStorage.device || ("dev-"+Math.random().toString(36).substr(2,9));
localStorage.device = device;

function play(){document.getElementById("musik").play()}
function popup(show){document.getElementById("popup").style.display = show ? "flex" : "none";}
function copy(t){navigator.clipboard.writeText(t);alert("Disalin")}

// Kirim ucapan dengan limit 1 per device
function kirim() {
  if (localStorage.ucapanTerkirim) {
    alert("Ucapan sudah terkirim 🙏");
    return;
  }

  const nama = document.getElementById("nama");
  const pesan = document.getElementById("pesan");

  if (!nama || !pesan) return;

  const n = nama.value.trim();
  const p = pesan.value.trim();

  if (n.length < 3 || p.length < 5) {
    alert("Nama & ucapan belum lengkap");
    return;
  }

  const last = localStorage.lastSend || 0;
  if (Date.now() - last < 60000) {
    alert("Tunggu 1 menit sebelum mengirim lagi 🙏");
    return;
  }
  localStorage.lastSend = Date.now();

  try {
    db.ref("ucapan").push({
      nama: n,
      pesan: p,
      waktu: Date.now()
    });

    localStorage.ucapanTerkirim = "1";
    pesan.value = "";

    fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${WA_NUMBER}&text=Ucapan%20baru%20dari%20${encodeURIComponent(
        n
      )}&apikey=${WA_APIKEY}`
    ).catch(() => {});
  } catch (e) {
    console.error("Firebase error:", e);
    alert("Maaf, gagal mengirim ucapan 🙏");
  }
}

const musik = $("musik");
const musicBtn = document.querySelector(".music-btn");

function toggleMusic(){
  if(!musik) return;

  if(musik.paused){
    musik.play().catch(()=>{});
    musicBtn?.classList.remove("muted");
  }else{
    musik.pause();
    musicBtn?.classList.add("muted");
  }
}

const n = nama.value.trim();
const p = pesan.value.trim();

if(n.length < 3 || p.length < 5){
  alert("Nama & ucapan belum lengkap");
  return;
}

const deviceID =
  localStorage.deviceID ||
  (localStorage.deviceID = "dev-" + crypto.randomUUID());

const now = Date.now();

const last = localStorage.lastSend || 0;
if(Date.now() - last < 60000){
  alert("Tunggu 1 menit sebelum mengirim lagi 🙏");
  return;
}
localStorage.lastSend = Date.now();

db.ref("ucapan").push({
  nama: n,
  pesan: p,
  waktu: now,
  device: device
});

localStorage.ucapanTerkirim = "1";

// WhatsApp notif
fetch(
  `https://api.callmebot.com/whatsapp.php?phone=${WA_NUMBER}&text=Ucapan%20baru%20dari%20${encodeURIComponent(n)}&apikey=${WA_APIKEY}`
);

pesan.value = "";
}

db.ref("ucapan").on("child_added", s => {
  const d = s.val();
  const div = document.createElement("div");
  div.className = "ucapan";
  div.innerText = `${d.nama}\n${d.pesan}`;
  listUcapan.prepend(div);
});

const urlParams = new URLSearchParams(location.search);
const namaTamu = urlParams.get("to");

if(namaTamu){
  document.getElementById("tamu").innerText = "Yth. " + namaTamu.replace(/\+/g," ");

// Admin Mode
const isAdmin = location.hash === "#admin-rahasia-2026";
if(isAdmin){document.body.style.outline="5px dashed gold"; console.log("ADMIN MODE AKTIF");}

const gateTamu = document.getElementById("gateTamu");
if(gateTamu){
  gateTamu.innerHTML = ...
}

function toggleMusic(){
  if(musik.paused){
    musik.play();
  }else{
    musik.pause();
  }
}

// Countdown
const target = new Date("2026-02-15T07:00:00").getTime();
const section = document.querySelector(".countdown-pro");

const d = document.getElementById("d");
const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");

setInterval(()=>{
  const now = Date.now();
  let diff = target - now;
  if(diff < 0) diff = 0;

  d.innerText = Math.floor(diff/86400000);
  h.innerText = Math.floor(diff%86400000/3600000);
  m.innerText = Math.floor(diff%3600000/60000);
  s.innerText = Math.floor(diff%60000/1000);
},1000);

// Animasi masuk
let ticking = false;

window.addEventListener("scroll",()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      const sc = window.scrollY;

      document.querySelectorAll(".songket-bg,.songket-melayu")
        .forEach(el=>{
          el.style.backgroundPosition = `center ${sc*0.35}px`;
        });

      ticking = false;
    });
    ticking = true;
  }
});  

const slider=document.querySelector(".slider");
let scrollPos=0;
setInterval(()=>{
  if(!slider) return;
  scrollPos+=300;
  if(scrollPos>=slider.scrollWidth) scrollPos=0;
  slider.scrollTo({left:scrollPos,behavior:"smooth"});
},3500);

// MUSIC FADE IN (LEVEL 4 IMPERIAL)
document.addEventListener("DOMContentLoaded",()=>{
  if(!musik) return;

  musik.volume = 0;
  let v = 0;
  const fadeAudio = setInterval(()=>{
    if(v < 0.6){
      v += 0.02;
      musik.volume = v;
    }else{
      clearInterval(fadeAudio);
    }
  },200);
});

document.querySelector(".qris-protect").onclick=()=>{
  document.querySelector(".qris-protect").classList.toggle("open");
}

const qrisBox = document.querySelector(".qris-protect");
if(qrisBox){
  qrisBox.addEventListener("click",()=>{
    qrisBox.classList.toggle("open");
  });
}

document.addEventListener("keyup",e=>{
  if(e.key === "PrintScreen"){
    alert("QRIS dilindungi sistem undangan 🔒");
  }
});

setInterval(()=>{
  if(!musik.paused){
    const pulse = 0.9 + Math.random()*0.15;
    document.querySelectorAll(".royal-title").forEach(t=>{
      t.style.transform = `scale(${pulse})`;
    });
  }
},1200);

document.addEventListener("keyup",e=>{
 if(e.key==="PrintScreen"){
  alert("QRIS dilindungi keamanan undangan")
 }
});

const toggle = document.getElementById("audioToggle");
toggle.onclick = ()=>{
  if(musik.paused){
    musik.play();
    toggle.innerText = "🔊";
  }else{
    musik.pause();
    toggle.innerText = "🔇";
  }
};

setTimeout(()=>{
  const cine = document.getElementById("cinematic");
  if(cine) cine.remove();
},6000);

const motionEls = document.querySelectorAll(".motion");

// Nama tamu dari URL
const q = new URLSearchParams(location.search);
if(q.get("to")){
  document.getElementById("introNama").innerText =
    "Yth. " + q.get("to").replace(/-/g," ");
}

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const btnOpen = document.getElementById("btnOpen");
  const musik = document.getElementById("musik");

  if (btnOpen && intro) {
    btnOpen.addEventListener("click", () => {
      intro.classList.add("hide-intro");

      if (musik) {
        musik.play().catch(() => {});
      }

      setTimeout(() => {
        intro.remove();
      }, 1200);
    });
  }
});
