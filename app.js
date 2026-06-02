const quotes = [
  "You are stronger than this moment.",
  "One step at a time, pretty girl.",
  "Taking care of yourself is productive.",
  "You deserve the same care you give others.",
  "Small habits create beautiful lives.",
  "Your future self is cheering for you."
];

const verses = [
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", ref: "Proverbs 31:25" },
  { text: "Do not fear, for I am with you.", ref: "Isaiah 41:10" },
  { text: "God is within her, she will not fall.", ref: "Psalm 46:5" },
  { text: "Be strong and courageous. Do not be afraid.", ref: "Joshua 1:9" }
];

const loveNotes = [
  "I’m so proud of you. Keep going, baby. I love you always.",
  "You got this, Alexis. I believe in you.",
  "Take your meds, drink your water, and remember you are loved.",
  "You are beautiful, strong, and never alone.",
  "Small steps, big blessings. I’m proud of you."
];

const today = new Date();
const todayKey = today.toISOString().slice(0, 10);
const dayIndex = Math.floor(today.getTime() / 86400000);

const richardPhone = "6466219577";

const keys = {
  meds: `alexis-princess-meds-${todayKey}`,
  water: `alexis-princess-water-${todayKey}`,
  mood: `alexis-princess-mood-${todayKey}`,
  streak: "alexis-princess-streak",
  lastComplete: "alexis-princess-last-complete"
};

let meds = JSON.parse(localStorage.getItem(keys.meds)) || [
  { name: "Sertraline (Zoloft)", dose: "50mg", time: "08:00", category: "Morning", done: false },
  { name: "Hydroxyzine", dose: "25mg", time: "09:00", category: "Morning", done: false },
  { name: "Vitamin D3", dose: "1000 IU", time: "10:00", category: "Afternoon", done: false },
  { name: "Magnesium", dose: "250mg", time: "22:00", category: "Night", done: false }
];

let filter = "all";
let water = Number(localStorage.getItem(keys.water) || 0);

document.getElementById("todayDate").textContent = today.toLocaleDateString(undefined, { month:"long", day:"numeric", year:"numeric" });
document.getElementById("dailyQuote").textContent = quotes[dayIndex % quotes.length];
document.getElementById("verseText").textContent = `“${verses[dayIndex % verses.length].text}”`;
document.getElementById("verseRef").textContent = verses[dayIndex % verses.length].ref;
document.getElementById("bottomVerse").textContent = `${verses[1].text} — ${verses[1].ref}`;
document.getElementById("loveNote").textContent = loveNotes[Math.floor(Math.random() * loveNotes.length)];

function updateClock(){
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString([], { hour:"numeric", minute:"2-digit" });
  const h = now.getHours();
  document.getElementById("timeGreeting").textContent = h < 12 ? "Good Morning," : h < 18 ? "Good Afternoon," : "Good Evening,";
}
updateClock();
setInterval(updateClock, 1000);

document.getElementById("showAddForm").onclick = () => {
  document.getElementById("addMedForm").classList.toggle("hidden");
};

document.querySelectorAll(".tab").forEach(tab => {
  tab.onclick = () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    filter = tab.dataset.filter;
    renderMeds();
  };
});

function saveMeds(){ localStorage.setItem(keys.meds, JSON.stringify(meds)); }

function renderMeds(){
  const medList = document.getElementById("medList");
  medList.innerHTML = "";

  const shown = meds
    .map((m,i)=>({...m, originalIndex:i}))
    .filter(m => filter === "all" || m.category === filter)
    .sort((a,b)=>a.time.localeCompare(b.time));

  shown.forEach(med => {
    const row = document.createElement("div");
    row.className = "med-item";
    row.innerHTML = `
      <input type="checkbox" ${med.done ? "checked" : ""}>
      <div><strong>${escapeHtml(med.name)}</strong><small>${escapeHtml(med.dose || "")}</small></div>
      <div class="med-time">🕘 ${formatTime(med.time)}</div>
      <div class="med-pill ${med.category}">${med.category}</div>
      <button class="delete">♡</button>
    `;
    row.querySelector("input").onchange = () => {
      meds[med.originalIndex].done = !meds[med.originalIndex].done;
      if (meds[med.originalIndex].done) launchConfetti();
      saveMeds();
      renderMeds();
    };
    row.querySelector(".delete").onclick = () => {
      meds.splice(med.originalIndex, 1);
      saveMeds();
      renderMeds();
    };
    medList.appendChild(row);
  });

  updateMedsProgress();
}

document.getElementById("addMedForm").onsubmit = e => {
  e.preventDefault();
  meds.push({
    name: document.getElementById("medName").value.trim(),
    dose: document.getElementById("medDose").value.trim(),
    time: document.getElementById("medTime").value,
    category: document.getElementById("medCategory").value,
    done: false
  });
  e.target.reset();
  saveMeds();
  renderMeds();
};

function updateMedsProgress(){
  const total = meds.length;
  const done = meds.filter(m => m.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.querySelector(".mini-message").innerHTML = total ? `${pct}% complete today — You've got this, Alexis! 💗 <span>👑</span>` : "Add medications to begin 💗";
  document.querySelector(".hero-grid strong").textContent = `${pct}%`;

  if (pct === 100 && total > 0) updateStreak();
  renderStreak();
}

function updateStreak(){
  const last = localStorage.getItem(keys.lastComplete);
  if (last === todayKey) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  let streak = Number(localStorage.getItem(keys.streak) || 0);
  streak = last === yesterday ? streak + 1 : 1;
  localStorage.setItem(keys.streak, streak);
  localStorage.setItem(keys.lastComplete, todayKey);
}

function renderStreak(){
  const streak = Number(localStorage.getItem(keys.streak) || 0);
  document.getElementById("streakCount").textContent = streak;
  document.getElementById("sevenBadge").classList.toggle("active", streak >= 7);
  document.getElementById("thirtyBadge").classList.toggle("active", streak >= 30);
  document.getElementById("hundredBadge").classList.toggle("active", streak >= 100);
}

function renderWater(){
  const grid = document.getElementById("waterGrid");
  grid.innerHTML = "";
  for(let i=1; i<=8; i++){
    const cup = document.createElement("button");
    cup.className = `cup ${i <= water ? "filled" : ""}`;
    cup.textContent = i <= water ? "♡" : "";
    cup.onclick = () => {
      water = i;
      localStorage.setItem(keys.water, water);
      renderWater();
    };
    grid.appendChild(cup);
  }
  document.getElementById("waterText").textContent = `${water * 8} oz • ${water === 8 ? "Goal complete! 🎉" : "Keep going, Queen 💜"}`;
  document.getElementById("waterProgress").style.width = `${(water / 8) * 100}%`;
  document.getElementById("waterCount").textContent = `${water}/8`;
}

document.getElementById("resetWater").onclick = () => {
  water = 0;
  localStorage.setItem(keys.water, water);
  renderWater();
};

document.querySelectorAll("#moodGrid button").forEach(btn => {
  btn.onclick = () => {
    localStorage.setItem(keys.mood, btn.dataset.mood);
    renderMood();
  };
});

function renderMood(){
  const mood = localStorage.getItem(keys.mood);
  document.querySelectorAll("#moodGrid button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mood === mood);
  });

  const moodText = document.getElementById("moodText");
  const sendMoodBtn = document.getElementById("sendMoodBtn");

  if (mood) {
    moodText.textContent = `Alexis feels: ${mood} today 💜`;
    const message = `Hi Richard, today I am feeling ${mood}. 💜`;
    sendMoodBtn.href = `sms:${richardPhone}?&body=${encodeURIComponent(message)}`;
    sendMoodBtn.classList.remove("disabled");
    sendMoodBtn.setAttribute("aria-disabled", "false");
  } else {
    moodText.textContent = "No mood selected yet.";
    sendMoodBtn.href = "#";
    sendMoodBtn.classList.add("disabled");
    sendMoodBtn.setAttribute("aria-disabled", "true");
  }
}

function formatTime(time){
  const [h,m] = time.split(":");
  const d = new Date();
  d.setHours(h,m);
  return d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
}

function escapeHtml(text){
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function launchConfetti(){
  const holder = document.getElementById("confetti");
  const symbols = ["♡","💜","🦋","✦","👑","✿"];
  for(let i=0; i<30; i++){
    const p = document.createElement("div");
    p.className = "confetti-piece";
    p.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    p.style.left = Math.random()*100 + "vw";
    p.style.animationDelay = Math.random()*0.5 + "s";
    holder.appendChild(p);
    setTimeout(()=>p.remove(),2200);
  }
}

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js").catch(()=>{});
}

saveMeds();
renderMeds();
renderWater();
renderMood();
renderStreak();
