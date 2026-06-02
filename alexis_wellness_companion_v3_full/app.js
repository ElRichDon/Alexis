const quotes = [
  "One step at a time, pretty girl. You’re doing better than you think.",
  "Taking care of yourself is productive.",
  "Progress, not perfection.",
  "Your future self is cheering for you.",
  "You deserve the same care you give others.",
  "Small habits create beautiful lives.",
  "Today’s goal: be gentle with yourself.",
  "You are stronger than this hard day."
];

const verses = [
  { text: "She is clothed with strength and dignity; she can laugh at the days to come.", ref: "Proverbs 31:25" },
  { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
  { text: "For I know the plans I have for you, declares the Lord.", ref: "Jeremiah 29:11" },
  { text: "Do not fear, for I am with you.", ref: "Isaiah 41:10" },
  { text: "God is within her, she will not fall.", ref: "Psalm 46:5" },
  { text: "Come to me, all who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
  { text: "Be strong and courageous. Do not be afraid.", ref: "Joshua 1:9" },
  { text: "All things work together for good to those who love God.", ref: "Romans 8:28" }
];

const loveNotes = [
  "I’m proud of you.",
  "Don’t forget how beautiful you are.",
  "Take your medicine, drink some water, and remember you are loved.",
  "You got this, Alexis.",
  "I love you more than yesterday.",
  "You are not alone today.",
  "Your health matters to me.",
  "Small steps, big blessings."
];

const selfCareTips = [
  "Drink a glass of water and take a slow breath.",
  "Stretch your shoulders and relax your jaw.",
  "Pause for one minute and thank God for one good thing.",
  "Take today one small step at a time.",
  "Rest is part of the process.",
  "You do not have to rush. You are still moving forward.",
  "Say one prayer and release one worry.",
  "Be gentle with yourself today."
];

const today = new Date();
const todayKey = today.toISOString().slice(0, 10);
const dayIndex = Math.floor(today.getTime() / 86400000);

const medList = document.getElementById("medList");
const addMedForm = document.getElementById("addMedForm");
const medName = document.getElementById("medName");
const medTime = document.getElementById("medTime");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const heroPercent = document.getElementById("heroPercent");
const streakCount = document.getElementById("streakCount");
const waterCount = document.getElementById("waterCount");
const waterGrid = document.getElementById("waterGrid");
const resetWater = document.getElementById("resetWater");
const moodGrid = document.getElementById("moodGrid");

const medsKey = `alexis-v3-meds-${todayKey}`;
const waterKey = `alexis-v3-water-${todayKey}`;
const moodKey = `alexis-v3-mood-${todayKey}`;
const streakKey = "alexis-v3-streak";
const lastCompleteKey = "alexis-v3-last-complete";

let meds = JSON.parse(localStorage.getItem(medsKey)) || [
  { name: "Morning medication", time: "08:00", done: false },
  { name: "Afternoon medication", time: "14:00", done: false },
  { name: "Night medication", time: "21:00", done: false }
];

let water = Number(localStorage.getItem(waterKey) || 0);

document.getElementById("todayDate").textContent = today.toLocaleDateString(undefined, { month: "short", day: "numeric" });
document.getElementById("dailyQuote").textContent = quotes[dayIndex % quotes.length];
document.getElementById("verseText").textContent = `“${verses[dayIndex % verses.length].text}”`;
document.getElementById("verseRef").textContent = verses[dayIndex % verses.length].ref;
document.getElementById("loveNote").textContent = loveNotes[Math.floor(Math.random() * loveNotes.length)];
document.getElementById("selfCareTip").textContent = selfCareTips[dayIndex % selfCareTips.length];

function setGreeting() {
  const hour = today.getHours();
  const greeting = hour < 12 ? "Good Morning, Alexis" : hour < 18 ? "Good Afternoon, Alexis" : "Good Evening, Alexis";
  document.getElementById("greeting").textContent = greeting;
}
setGreeting();

function saveMeds() {
  localStorage.setItem(medsKey, JSON.stringify(meds));
}

function renderMeds() {
  medList.innerHTML = "";
  meds.sort((a, b) => a.time.localeCompare(b.time));

  meds.forEach((med, index) => {
    const item = document.createElement("div");
    item.className = `med-item ${med.done ? "done" : ""}`;
    item.innerHTML = `
      <input type="checkbox" ${med.done ? "checked" : ""} aria-label="Mark ${escapeHtml(med.name)} as taken" />
      <div class="med-info">
        <strong>${escapeHtml(med.name)}</strong>
        <span>⏰ ${formatTime(med.time)}</span>
      </div>
      <button class="delete-btn" aria-label="Delete reminder">×</button>
    `;

    item.querySelector("input").addEventListener("change", () => {
      meds[index].done = !meds[index].done;
      if (meds[index].done) launchConfetti();
      saveMeds();
      renderMeds();
    });

    item.querySelector(".delete-btn").addEventListener("click", () => {
      meds.splice(index, 1);
      saveMeds();
      renderMeds();
    });

    medList.appendChild(item);
  });

  updateProgress();
}

function updateProgress() {
  if (meds.length === 0) {
    progressBar.style.width = "0%";
    progressText.textContent = "Add a reminder to start tracking.";
    heroPercent.textContent = "0%";
    return;
  }

  const complete = meds.filter(med => med.done).length;
  const percent = Math.round((complete / meds.length) * 100);

  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% complete today — ${complete} of ${meds.length} checked off`;
  heroPercent.textContent = `${percent}%`;

  if (percent === 100) updateStreak();
  renderStreak();
}

function updateStreak() {
  const lastComplete = localStorage.getItem(lastCompleteKey);
  if (lastComplete === todayKey) return;

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let streak = Number(localStorage.getItem(streakKey) || 0);

  streak = lastComplete === yesterday ? streak + 1 : 1;

  localStorage.setItem(streakKey, streak);
  localStorage.setItem(lastCompleteKey, todayKey);
}

function renderStreak() {
  streakCount.textContent = localStorage.getItem(streakKey) || "0";
}

function renderWater() {
  waterGrid.innerHTML = "";
  waterCount.textContent = `${water}/8`;

  for (let i = 1; i <= 8; i++) {
    const cup = document.createElement("button");
    cup.className = `water-cup ${i <= water ? "filled" : ""}`;
    cup.textContent = i <= water ? "💜" : "♡";
    cup.addEventListener("click", () => {
      water = i;
      localStorage.setItem(waterKey, water);
      renderWater();
    });
    waterGrid.appendChild(cup);
  }
}

resetWater.addEventListener("click", () => {
  water = 0;
  localStorage.setItem(waterKey, water);
  renderWater();
});

moodGrid.querySelectorAll("button").forEach(button => {
  button.addEventListener("click", () => {
    localStorage.setItem(moodKey, button.dataset.mood);
    renderMood();
  });
});

function renderMood() {
  const mood = localStorage.getItem(moodKey);
  moodGrid.querySelectorAll("button").forEach(button => {
    button.classList.toggle("active", button.dataset.mood === mood);
  });
  document.getElementById("moodText").textContent = mood ? `Today Alexis feels: ${mood}` : "No mood selected yet.";
}

addMedForm.addEventListener("submit", event => {
  event.preventDefault();
  meds.push({ name: medName.value.trim(), time: medTime.value, done: false });
  medName.value = "";
  medTime.value = "";
  saveMeds();
  renderMeds();
});

function formatTime(time) {
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function launchConfetti() {
  const confetti = document.getElementById("confetti");
  const symbols = ["♡", "✦", "✿", "💜", "🦋"];
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDelay = Math.random() * 0.4 + "s";
    confetti.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(() => {});
}

saveMeds();
renderMeds();
renderWater();
renderMood();
renderStreak();
