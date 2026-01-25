"use strict";

/* =============================
   GLOBAL SAFE
============================= */
const $ = id => document.getElementById(id);
const musik = $("musik");
const musicBtn = document.querySelector(".music-btn");
const intro = $("intro");
const btnOpen = $("btnOpen");

/* =============================
   LOCK PAGE BEFORE OPEN
============================= */
document.body.classList.add("lock");
if (musicBtn) musicBtn.style.display = "none";

/* =============================
   OPEN INVITATION
============================= */
btnOpen.addEventListener("click", () => {
  intro.classList.add("hide");

  setTimeout(() => {
    intro.style.display = "none";
    document.body.classList.remove("lock");

    musik.volume = 0.6;
    musik.play().catch(()=>{});
    musicBtn.style.display = "flex";

    window.scrollTo(0, 0);
  }, 900);
});

/* =============================
   MUSIC TOGGLE
============================= */
function toggleMusic(){
  if (musik.paused){
    musik.play();
    musicBtn.classList.remove("muted");
  } else {
    musik.pause();
    musicBtn.classList.add("muted");
  }
}

/* =============================
   PANTUN
============================= */
const pantunList = [
  "Pergi ke hulu mencari sepat, singgah sebentar di tepi paya. Jika niat sudah terpatri di hati, akad nikah jadi penyempurna cinta.",
  "Songket disulam benang emas, dipakai raja di hari mulia. Restu orang tua doa terikhlas, rumah tangga bahagia selamanya.",
  "Kalau berlayar ke Indragiri, jangan lupa membawa bekal. Bila akad telah diikrari, cinta halal jadi modal kekal."
];
const pantun = $("pantun");
if (pantun) pantun.innerText = pantunList[Math.floor(Math.random()*pantunList.length)];

/* =============================
   TAMU DARI URL
============================= */
const q = new URLSearchParams(location.search);
if (q.get("to")) {
  $("introNama").innerText = "Yth. " + q.get("to").replace(/-/g," ");
  $("tamu").innerText = "Yth. " + q.get("to").replace(/-/g," ");
}

/* =============================
   COUNTDOWN
============================= */
const target = new Date("2026-02-15T07:00:00").getTime();
setInterval(()=>{
  const now = Date.now();
  let diff = target - now;
  if(diff < 0) diff = 0;

  $("d").innerText = Math.floor(diff/86400000);
  $("h").innerText = Math.floor(diff%86400000/3600000);
  $("m").innerText = Math.floor(diff%3600000/60000);
  $("s").innerText = Math.floor(diff%60000/1000);
},1000);

/* =============================
   QRIS OPEN
============================= */
const qris = document.querySelector(".qris-protect");
if(qris){
  qris.addEventListener("click",()=> qris.classList.toggle("open"));
}

/* =============================
   AOS
============================= */
AOS.init({
  duration: 1200,
  once: true,
  easing: "ease-out-cubic"
});
