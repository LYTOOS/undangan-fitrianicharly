AOS.init({duration:1200,once:true});
const firebaseConfig={
apiKey:"AIzaSyCr2VF6hZ3pLWU5eORdrtdM1c5L_AcLVH4",
authDomain:"undangan-pernikahan-f6d5e.firebaseapp.com",
databaseURL:"https://undangan-pernikahan-f6d5e-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId:"undangan-pernikahan-f6d5e"
};
firebase.initializeApp(firebaseConfig);
const db=firebase.database();

// Countdown
const target = new Date("2026-02-15T07:00:00").getTime();
const section = document.querySelector(".countdown-pro");

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
window.addEventListener("scroll",()=>{
  const rect = section.getBoundingClientRect();
  if(rect.top < window.innerHeight * 0.8){
    section.classList.add("show");
  }
});
  
let ticking=false;
window.addEventListener("scroll",()=>{
  if(!ticking){
    requestAnimationFrame(()=>{
      const sc=window.scrollY;
      document.querySelectorAll(".songket-bg").forEach(el=>{
        el.style.backgroundPosition=`center ${sc*0.4}px`;
      });
      ticking=false;
    });
    ticking=true;
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

<!-- MUSIC FADE IN (LEVEL 4 IMPERIAL) -->
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

let lastScroll=0;
window.addEventListener("scroll",()=>{
  const sc=window.scrollY;
  if(Math.abs(sc-lastScroll)>8){
    document.querySelector(".songket-melayu")
      .style.backgroundPosition = `center ${sc*0.35}px`;
    lastScroll=sc;
  }
});

const motionEls = document.querySelectorAll(".motion");

window.addEventListener("scroll",()=>{
  motionEls.forEach(el=>{
    const r = el.getBoundingClientRect();
    if(r.top < window.innerHeight*0.85){
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }
  });
});

const intro = document.getElementById("intro");
const btnOpen = document.getElementById("btnOpen");
const musik = document.getElementById("musik");

btnOpen.onclick = ()=>{
  intro.classList.add("hide-intro");
  musik.play();
  setTimeout(()=>intro.remove(),1000);
};

// Nama tamu dari URL
const q = new URLSearchParams(location.search);
if(q.get("to")){
  document.getElementById("introNama").innerText =
    "Yth. " + q.get("to").replace(/-/g," ");
}
