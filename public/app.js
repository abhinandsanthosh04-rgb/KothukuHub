// KothukuHub 2.0 Core Logic - Kerala Swamp Theme & Parody Engine
// Supports Dual Mode: Live Express REST API & Standalone Offline Execution

let activeTab = 'dashboard';
let isSoundOn = false;
let audioCtx = null;
let buzzOscillator = null;
let buzzGain = null;
let currentProfiles = [];
let activeGenderFilter = 'all';
let currentChatProfile = null;
let allBloodData = [];
let allComplaintsData = [];
let allObituariesData = [];
let toastTimer = null;

const API_BASE = '/api';

// Comprehensive Embedded Mock Dataset
const embeddedData = {
  stats: {
    totalSwarmMembers: "1,420,690",
    bloodDrunkLiters: 1245.8,
    batsDodgedToday: 89420,
    humanSlapsEvaded: 450120,
    threatLevel: "HIGH ALERT (GoodKnight Smoke detected in Ernakulam Kakkanad)"
  },
  bloodBank: [
    { district: "Kozhikode", code: "CLT", bloodGroup: "O+", flavor: "Kozhikodan Halwa Infused", stockPercent: 98, rating: "5.0", note: "Super sweet, zero alcohol taste!" },
    { district: "Alappuzha", code: "ALP", bloodGroup: "B+", flavor: "Karimeen Pollichathu Infused", stockPercent: 92, rating: "4.9", note: "Spicy backwater blood, highly recommended!" },
    { district: "Thrissur", code: "TCR", bloodGroup: "A+", flavor: "Poorami High-Energy Blood", stockPercent: 88, rating: "4.8", note: "Contains 200% adrenaline from chenda melam." },
    { district: "Ernakulam", code: "EKM", bloodGroup: "AB+", flavor: "IT Techie Espresso Infused", stockPercent: 85, rating: "4.7", note: "High caffeine content. Will keep you flying till 6 AM!" },
    { district: "Trivandrum", code: "TVM", bloodGroup: "O-", flavor: "Secretariat Royal Blood", stockPercent: 95, rating: "5.0", note: "Rich in bureaucracy power & VIP taste." },
    { district: "Kottayam", code: "KTM", bloodGroup: "B-", flavor: "Rubber Latex Thick Blood", stockPercent: 79, rating: "4.5", note: "Thick consistency, great for monsoon storage." },
    { district: "Malappuram", code: "MPM", bloodGroup: "A-", flavor: "Sulaimani Tea Infused", stockPercent: 91, rating: "4.9", note: "Warm aroma with subtle cardamom notes." },
    { district: "Wayanad", code: "WYD", bloodGroup: "AB-", flavor: "Wild Pepper Spice Blood", stockPercent: 84, rating: "4.6", note: "Cool climate blood, leaves a pleasant tingle!" },
    { district: "Kollam", code: "KLM", bloodGroup: "O+", flavor: "Cashew Nut Infused", stockPercent: 89, rating: "4.7", note: "Nutty and smooth on proboscis." },
    { district: "Kannur", code: "KNR", bloodGroup: "B+", flavor: "Theyyam Fire Energy", stockPercent: 86, rating: "4.8", note: "High spice and vigorous flavor." }
  ],
  datingProfiles: [
    {
      id: "p1",
      name: "Kothuk Mone",
      age: "25 days",
      gender: "male",
      species: "Anopheles Agent",
      location: "Pathanamthitta",
      bloodGroup: "O+ (Universal)",
      tag: "Night Shift Specialist",
      badge: "Verified Buzz ✔️",
      bio: "Chill guy. Love long flights and silent landings on sleeping uncles.",
      avatar: "images/kothuk_mone_007.jpg",
      wing: "6.5mm, stealth black",
      diet: "O+ (Universal) Preferred",
      family: "Rubber Estate Stagnant Puddle Dynasty",
      looking: "Chill buzzmate who appreciates silent night flights",
      cringeConversations: [
        { sender: "them", text: "Silent landings is my specialty, baby. 🕶️" },
        { sender: "me", text: "Aiyo, ninne kandal flight mode-il aakum!" },
        { sender: "them", text: "Pathanamthitta rubber estate-il date pokaam vaa! 🌴" },
        { sender: "me", text: "No coil smoke allowed though! 😂" }
      ]
    },
    {
      id: "p2",
      name: "Dhasan Kothuku",
      age: "27 days",
      gender: "male",
      species: "Culex Muscle",
      location: "Alappuzha",
      bloodGroup: "B+",
      tag: "Gym & Fly",
      badge: "Verified Buzz ✔️",
      bio: "Fitness freak. Hit blood, hit gym, no drama. Biceps built on pure O+ proteins.",
      avatar: "images/buzz_boy.jpg",
      wing: "7.2mm, muscular frame",
      diet: "B+ High Protein Blood",
      family: "Houseboat Canal Iron Gym Syndicate",
      looking: "Fitness-oriented kothuki for joint 2 AM cardio sorties",
      cringeConversations: [
        { sender: "them", text: "Blood is life! 50 pushups done before biting! 💪" },
        { sender: "me", text: "Bat dodge speed ethraya bro?" },
        { sender: "them", text: "2000V electric bat enikku morning warmup aanu! ⚡" },
        { sender: "me", text: "Enkil O+ve protein shake date-inu polaam! 🩸" }
      ]
    },
    {
      id: "p3",
      name: "Kothuk Raja",
      age: "29 days",
      gender: "male",
      species: "Culex Royalty",
      location: "Kottayam",
      bloodGroup: "AB+",
      tag: "CEO of Biting",
      badge: "Verified Buzz ✔️",
      bio: "I don't bite everyone, only the best VIP blood. Thug life gold chain included.",
      avatar: "images/kothuk_king.jpg",
      wing: "7.8mm, gold-edged",
      diet: "AB+ VIP Executive Reserve",
      family: "Rubber Board Stagnant Tank Royalty",
      looking: "Queen kothuki worthy of ruling the rubber estate",
      cringeConversations: [
        { sender: "them", text: "King has entered the bedroom. 👑" },
        { sender: "me", text: "Aaha! Pixel glasses kollalo!" },
        { sender: "them", text: "Swag kothuku aanu njan. All-Out coil enikku perfume aanu." },
        { sender: "me", text: "VIP dining reservation locked! 🔒" }
      ]
    },
    {
      id: "p4",
      name: "kothuk molama",
      age: "24 days",
      gender: "male",
      species: "Aedes Stealth",
      location: "Thiruvalla",
      bloodGroup: "O+",
      tag: "Stealth Expert",
      badge: "Verified Buzz ✔️",
      bio: "You won't see me. But you'll feel me 😎. Ninja hood equipped for silent operations.",
      avatar: "images/shadow_buzz.jpg",
      wing: "6.0mm, matte shadow",
      diet: "O+ Sweet Blood",
      family: "Ancient Thiruvalla Attic Ninja Clan",
      looking: "Silent partner for clandestine bedroom raids",
      cringeConversations: [
        { sender: "them", text: "I extinguish burning coils with my wingtips. 🥷" },
        { sender: "me", text: "True shadow warrior!" },
        { sender: "them", text: "Meet me behind the wardrobe at 2:45 AM sharp." }
      ]
    },
    {
      id: "p5",
      name: "kothuku mini",
      age: "22 days",
      gender: "female",
      species: "Aedes Cute",
      location: "Kottayam",
      bloodGroup: "O+",
      tag: "Sweet & Silent",
      badge: "Verified Buzz ✔️",
      bio: "Soft heart, tiny bite. Looking for caring human and a romantic buzzmate ❤️",
      avatar: "images/kothuki_kutty.jpg",
      wing: "5.4mm, pink luster",
      diet: "O+ Strawberry-sweet Blood",
      family: "Rose Garden Water Tank Aristocracy",
      looking: "Gentle male mosquito who shares strawberry milkshakes",
      cringeConversations: [
        { sender: "them", text: "Hi da... Enne kothaan varumo tto? 🍓🎀" },
        { sender: "me", text: "Aiyyo, pink milkshake enikkum tharumo?" },
        { sender: "them", text: "Sure! Soft bite only, no big swelling! 💕" },
        { sender: "me", text: "Match locked! Duet buzz in human ear tonight!" }
      ]
    },
    {
      id: "p6",
      name: "Maya buzz",
      age: "23 days",
      gender: "female",
      species: "Anopheles Rain",
      location: "Alappuzha",
      bloodGroup: "B+",
      tag: "Rain Lover",
      badge: "Verified Buzz ✔️",
      bio: "Love rain, puddles and late night parties. Monsoon is my runway ☔",
      avatar: "images/maya_buzz.jpg",
      wing: "5.7mm, raindrop patterned",
      diet: "B+ Spiced Blood",
      family: "Vembanad Lake Water Lily Dynasty",
      looking: "Adventurous comrade who loves dancing in the drizzle",
      cringeConversations: [
        { sender: "them", text: "Mazha thudangi comrade! Puddle party ready aano? 🌧️" },
        { sender: "me", text: "Kuda pidichu vannolam njan!" },
        { sender: "them", text: "Ente umbrella-il oru seat vacancy undu tto!" }
      ]
    },
    {
      id: "p7",
      name: "Sarala Aedes",
      age: "26 days",
      gender: "female",
      species: "Aedes Fashionista",
      location: "Pathanamthitta",
      bloodGroup: "AB+",
      tag: "Princess Vibes",
      badge: "Verified Buzz ✔️",
      bio: "Not high maintenance. You just can't afford me 💅. Designer bag & pink shades.",
      avatar: "images/queen_kothuki.jpg",
      wing: "6.2mm, glitter-dusted",
      diet: "AB+ Organic Designer Blood",
      family: "Plantation Bungalow Rooftop Suite",
      looking: "Wealthy mosquito with his own coconut shell penthouse",
      cringeConversations: [
        { sender: "them", text: "You can't afford my luxury buzz standard, honey. 👛" },
        { sender: "me", text: "Njan 5 drops coconut shell penthouse owner aanu!" },
        { sender: "them", text: "Hmm, then you may take me on an O+ dinner date! 💅" }
      ]
    },
    {
      id: "p8",
      name: "Ammu Kothuk",
      age: "24 days",
      gender: "female",
      species: "Culex Cozy",
      location: "Thiruvalla",
      bloodGroup: "O+",
      tag: "Homebody",
      badge: "Verified Buzz ✔️",
      bio: "Love homemade blood, movie nights & gossip. Hair curlers & bathrobe always on.",
      avatar: "images/ammu_kothuki.jpg",
      wing: "5.5mm, comfy velvet",
      diet: "O+ Comfort Food Blood",
      family: "Living Room Curtains Ancestral Seat",
      looking: "Cozy partner to watch Malayalam serials behind the sofa",
      cringeConversations: [
        { sender: "them", text: "Hair curlers set cheythu kazhinju! Gossip time! ☕" },
        { sender: "me", text: "Soman uncle TV on aakkiyo?" },
        { sender: "them", text: "Yes! Serial climax-il bite cheyyan ready aano? 🎬" }
      ]
    }
  ],
  swamps: [
    { emoji: "🥥", name: "Soman Uncle's Forgotten Coconut Shell", loc: "Thrissur, near old well", price: "2 drops/night", rating: "4.8", tag: "Cozy", desc: "Clear stagnant rainwater, shaded by papaya leaves. Zero human interference." },
    { emoji: "🛞", name: "Tyre Dump Deluxe Suite", loc: "Kozhikode outskirts", price: "1 drop/night", rating: "4.6", tag: "Budget", desc: "Premium vulcanized rubber micro-climate with stagnant rain puddles." },
    { emoji: "🪴", name: "Terrace Flower Pot Villa", loc: "Kochi, Panampilly Nagar", price: "5 drops/night", rating: "4.9", tag: "Premium", desc: "Rich soil runoff with lush organic nutrients and warm humidity." },
    { emoji: "🚰", name: "Overhead Tank Penthouse", loc: "Thiruvananthapuram Secretariat", price: "6 drops/night", rating: "5.0", tag: "Luxury", desc: "Highest elevation in town, dark covered lid, VIP political proximity." },
    { emoji: "🌾", name: "Paddy Field Commune", loc: "Alappuzha, Kuttanad", price: "1 drop/night", rating: "4.4", tag: "Community Stay", desc: "Vast calm waters surrounded by lotus leaves and gentle night breezes." },
    { emoji: "🪟", name: "Leaky Gutter Studio", loc: "Kannur Town", price: "2 drops/night", rating: "4.2", tag: "Compact", desc: "Consistent slow drip with warm drainage minerals." }
  ],
  complaints: [
    {
      weapon: "⚡ Electric Bat Ambush",
      type: "Electric bat ambush",
      district: "Ernakulam",
      threatLevel: "EXTREME CRITICAL",
      severity: "high",
      humanTactic: "Was resting peacefully near the tube light at 2 AM. Blue spark swung with zero warning.",
      recommendedShield: "🛡️ Wear Rubber Insulated Jacket & Deploy Decoy Frequencies!",
      survivalTip: "Fly low near floor level. Bats are usually swung at human ear height!",
      time: "22m ago"
    },
    {
      weapon: "🌀 Coil / Kothuku-thiri Deployment",
      type: "Coil deployment",
      district: "Thrissur",
      threatLevel: "HIGH SMOKE THREAT",
      severity: "high",
      humanTactic: "Entire family lit three coils at once during dinner. Excessive chemical force!",
      recommendedShield: "🥽 Kothuku Force-Field Heat & Oxygen Gas Mask",
      survivalTip: "Hide behind the ceiling fan blades where airflow dilutes smoke.",
      time: "2h ago"
    },
    {
      weapon: "🔌 Plug-in Liquid Vaporizer Raid",
      type: "Liquid Vaporizer raid",
      district: "Kozhikode",
      threatLevel: "MEDIUM PARALYSIS",
      severity: "med",
      humanTactic: "Plugged into wall socket near bed, releasing silent odorless paralytic vapor.",
      recommendedShield: "⚡ Proboscis Filter & High Velocity Wing Thrusters",
      survivalTip: "Bite humans on ankles under blanket where vapor concentration is lowest.",
      time: "4h ago"
    },
    {
      weapon: "🕸️ Mosquito Net (Unsporting)",
      type: "Mosquito net",
      district: "Alappuzha",
      threatLevel: "DEFENSIVE FORTRESS",
      severity: "low",
      humanTactic: "Grandmother tucked in 4-corner net overnight without prior notice to the colony.",
      recommendedShield: "📍 Micro-Proboscis Wedge & Patient Waiting Tactic",
      survivalTip: "Wait near the foot corner gap where humans inevitably stick a toe out at 3 AM.",
      time: "1d ago"
    },
    {
      weapon: "🧴 Chemical Repellent Cream",
      type: "Repellent cream",
      district: "Kottayam",
      threatLevel: "CHEMICAL BLOCKADE",
      severity: "med",
      humanTactic: "Entire arm coated in pungent green cream. Ruined evening dining plans.",
      recommendedShield: "👃 Citronella-Resistant Antennae Wrap",
      survivalTip: "Target forehead or neck hairline where cream wasn't applied evenly.",
      time: "1d ago"
    }
  ],
  news: [
    {
      id: 1,
      cat: "Weather",
      title: "Monsoon extended by two weeks: colony morale at all-time high 🌧️",
      body: "Meteorologists confirm ideal breeding conditions across Kuttanad and Vembanad backwaters through next month. Larval reserves hit record peaks.",
      time: "10 mins ago"
    },
    {
      id: 2,
      cat: "Politics",
      title: "Ceiling fan lobby demands 'unfair speed advantage' inquiry 🌀",
      body: "Colony elders allege ceiling fans running on Speed 5 give humans an unfair aerodynamic advantage during peak 2 AM biting hours.",
      time: "1 hour ago"
    },
    {
      id: 3,
      cat: "Gourmet",
      title: "Kozhikode kothuku sets state record: 6.1ml blood in one sitting! 🩸",
      body: "Officials reviewed video footage after witnesses questioned whether a second comrade joined the feast. Blood sample was certified Biryani-infused.",
      time: "3 hours ago"
    },
    {
      id: 4,
      cat: "Culture",
      title: "Onam sadya season declared 'Great Ankle Festival' by field swarms 🌴",
      body: "Extended family gatherings mean more exposed ankles under wooden dining tables than at any other time of year.",
      time: "5 hours ago"
    },
    {
      id: 5,
      cat: "Tech & Gear",
      title: "New Rubber Exoskeleton Jacket cuts bat strike shock by 40% 🛡️",
      body: "Field-tested across three districts, the lightweight non-conductive wrap is now recommended standard issue for night sorties.",
      time: "8 hours ago"
    }
  ],
  obituaries: [
    {
      id: "o1",
      name: "Shaji Culex",
      age: "3 days old",
      location: "Thrissur Town",
      avatar: "images/obit_shaji_culex.jpg",
      causeOfDeath: "Clapped by a Mammootty fan at 2:15 AM while trying to bite during movie climax scene.",
      wordsOfRemembrance: "He died doing what he loved most: buzzing in ears.",
      candles: 1421
    },
    {
      id: "o2",
      name: "Puppy Aedes",
      age: "5 days old",
      location: "Kochi Marine Drive",
      avatar: "images/obit_puppy_aedes.jpg",
      causeOfDeath: "Thought electric racket spark was a disco strobe light and flew straight into 2000V.",
      wordsOfRemembrance: "A bright mosquito who shined too bright for a fraction of a second. RIP.",
      candles: 981
    },
    {
      id: "o3",
      name: "Thankachan Mosquito",
      age: "2 days old",
      location: "Kottayam Town",
      avatar: "images/obit_thankachan.jpg",
      causeOfDeath: "Overdosed on 100% alcohol-infused blood from a Beverly uncle on a Friday night.",
      wordsOfRemembrance: "Flew in zig-zags before crashing into a GoodKnight coil. Absolute legend.",
      candles: 3101
    },
    {
      id: "o4",
      name: "Suma Anopheles",
      age: "4 days old",
      location: "Wayanad Ghats",
      avatar: "images/obit_suma_anopheles.jpg",
      causeOfDeath: "Trapped inside a closed helmet of a biker speeding at 80 km/h on Wayanad hairpin bends.",
      wordsOfRemembrance: "Fastest flying mosquito in recorded Kerala history.",
      candles: 852
    }
  ],
  leaderboard: [
    { rank: 1, name: "Vaidyanathan Culex", loc: "Kochi Marine Drive", amt: "41.2 ml", batDodges: 1240, badge: "🩸 Blood King" },
    { rank: 2, name: "Kunjootan Kothuku", loc: "Alappuzha Backwaters", amt: "38.7 ml", batDodges: 1100, badge: "⚡ Bat Dodger" },
    { rank: 3, name: "Devika Aedes", loc: "Thrissur Town", amt: "35.1 ml", batDodges: 980, badge: "🌸 Dengue Queen" },
    { rank: 4, name: "Ravi Anopheles", loc: "Kozhikode Beach", amt: "31.9 ml", batDodges: 850, badge: "🌊 Drain Maestro" },
    { rank: 5, name: "Remya Anopheles", loc: "Kuttanad Paddy", amt: "29.4 ml", batDodges: 790, badge: "🌾 Swamp Aristocrat" },
    { rank: 6, name: "Suni Culex", loc: "Kollam Port", amt: "27.8 ml", batDodges: 720, badge: "⚓ Port Biter" },
    { rank: 7, name: "Ambili Aedes", loc: "Kannur Theyyam", amt: "24.6 ml", batDodges: 650, badge: "🔥 Fire Dodger" },
    { rank: 8, name: "Manoharan Mosquito", loc: "Trivandrum Secretariat", amt: "22.0 ml", batDodges: 580, badge: "🏛️ VIP Biter" }
  ]
};

// Tab Definitions
const tabDefs = [
  { id: "dashboard", label: "Dashboard" },
  { id: "blood", label: "Blood Bank" },
  { id: "matrimony", label: "Matrimony" },
  { id: "swamp", label: "SwampFinder" },
  { id: "complaints", label: "Complaints" },
  { id: "news", label: "BuzzNews" },
  { id: "obituaries", label: "Aadhraanjalikal 🕊️" },
  { id: "leaderboard", label: "Leaderboard" }
];

/* ---------------- INITIALIZATION ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initMosquitoCanvas();
  buildTabs();
  setupSoundSynth();

  // Load backend data with graceful fallback
  fetchAllData();

  // ZIP download listener
  const zipBtn = document.getElementById('downloadZipBtn');
  if (zipBtn) {
    zipBtn.addEventListener('click', downloadProjectZip);
  }
});

/* ---------------- LOGIN & LOGOUT ---------------- */
function doLogin(role) {
  const username = role || document.getElementById('loginId').value.trim() || 'Culex Sasi v2.0';
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  switchTab('dashboard');
  animateCounters();
  showToast(`സ്വാഗതം! Welcome back, comrade ${username} 🦟`);
}

function doLogout() {
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  stopBuzzingSound();
  showToast("Swarm session ended. Stay clear of coils! 🕊️");
}

function scanBeakBiometrics() {
  const widget = document.getElementById('proboscisWidget');
  const status = document.getElementById('beakStatus');
  const sub = document.getElementById('beakSub');
  const icon = document.getElementById('beakIcon');

  icon.innerText = "⚡";
  status.innerText = "Scanning Beak Sharpness...";
  sub.innerText = "Analyzing 2000V Bat Resistance & O+ve affinity";

  if (navigator.vibrate) navigator.vibrate(150);

  setTimeout(() => {
    widget.classList.add('scanned');
    icon.innerText = "✅";
    status.innerText = "Beak Verified: Grade-A Proboscis";
    sub.innerText = "Exoskeleton armor active • Ready to buzz";
    showToast("Proboscis verified! Pure Kerala Swamp Bloodline 🦟");
  }, 900);
}

/* ---------------- TABS NAVIGATION ---------------- */
function buildTabs() {
  const tabsEl = document.getElementById('tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = tabDefs.map((t, i) => `
    <button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${t.id}" onclick="switchTab('${t.id}')">
      ${t.label}
    </button>
  `).join('');
}

function switchTab(id) {
  activeTab = id;
  tabDefs.forEach(t => {
    const el = document.getElementById('tab-' + t.id);
    if (el) el.classList.toggle('hidden', t.id !== id);
  });
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- NUMBER COUNTER ANIMATIONS ---------------- */
function animateCounters() {
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    let cur = 0;
    const step = Math.max(1, Math.round(target / 60));
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(iv);
      }
      if (el.id === 'statBlood') {
        el.textContent = cur.toLocaleString() + ' L';
      } else {
        el.textContent = cur.toLocaleString();
      }
    }, 20);
  });
}

/* ---------------- API DATA FETCHING ---------------- */
async function fetchAllData() {
  await Promise.allSettled([
    fetchDashboardStats(),
    fetchBloodBankData(),
    fetchMatrimonyProfiles(),
    fetchSwampData(),
    fetchComplaintsData(),
    fetchNewsData(),
    fetchObituariesData(),
    fetchLeaderboardData()
  ]);
}

async function fetchDashboardStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const json = await res.json();
    if (json.success && json.data) {
      applyStats(json.data);
      return;
    }
  } catch (err) { }
  applyStats(embeddedData.stats);
}

function applyStats(data) {
  const m = document.getElementById('statMembers');
  const b = document.getElementById('statBlood');
  const bt = document.getElementById('statBats');
  const sl = document.getElementById('statSlaps');
  const desc = document.getElementById('threatAlertDesc');

  if (m) {
    m.dataset.count = parseInt(String(data.totalSwarmMembers).replace(/,/g, ''), 10) || 1420690;
    m.textContent = data.totalSwarmMembers;
  }
  if (b) {
    b.dataset.count = Math.round(data.bloodDrunkLiters) || 1245;
    b.textContent = `${data.bloodDrunkLiters} L`;
  }
  if (bt) {
    bt.dataset.count = data.batsDodgedToday || 89420;
    bt.textContent = Number(data.batsDodgedToday).toLocaleString();
  }
  if (sl) {
    sl.dataset.count = data.humanSlapsEvaded || 450120;
    sl.textContent = Number(data.humanSlapsEvaded).toLocaleString();
  }
  if (desc && data.threatLevel) {
    desc.textContent = data.threatLevel;
  }
}

/* ---------------- BLOOD BANK ---------------- */
async function fetchBloodBankData() {
  try {
    const res = await fetch(`${API_BASE}/bloodbank`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      allBloodData = json.data;
      renderBloodBankTable(allBloodData);
      return;
    }
  } catch (err) { }
  allBloodData = embeddedData.bloodBank;
  renderBloodBankTable(allBloodData);
}

function renderBloodBankTable(items) {
  const table = document.getElementById('bloodTable');
  if (!table) return;

  let rows = `<tr><th>District</th><th>Group</th><th style="width:130px;">Stock Level</th></tr>`;
  items.forEach(r => {
    const groupName = r.bloodGroup || r.group || 'O+';
    const percent = r.stockPercent || r.level || 85;
    const note = r.flavor || r.note || 'Deluxe Kerala Dining';
    rows += `
      <tr>
        <td>
          <strong>${r.district}</strong>
          <div class="flavor-note">🍰 ${note}</div>
        </td>
        <td><span class="tag red">${groupName}</span></td>
        <td>
          <div style="font-size:0.74rem; opacity:0.75; font-weight:600;">${percent}% Available</div>
          <div class="stock-bar">
            <div class="stock-fill" style="width: ${percent}%;"></div>
          </div>
        </td>
      </tr>
    `;
  });
  table.innerHTML = rows;
}

function filterBloodBank(district) {
  if (district === 'all') {
    renderBloodBankTable(allBloodData);
  } else {
    const filtered = allBloodData.filter(b => b.district.toLowerCase() === district.toLowerCase());
    renderBloodBankTable(filtered.length ? filtered : allBloodData);
  }
}

/* ---------------- MATRIMONY ---------------- */
async function fetchMatrimonyProfiles() {
  try {
    const res = await fetch(`${API_BASE}/matrimony`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      currentProfiles = json.data;
      renderMatrimonyList(currentProfiles);
      return;
    }
  } catch (err) { }
  currentProfiles = embeddedData.datingProfiles;
  renderMatrimonyList(currentProfiles);
}

function filterMatrimony(category) {
  activeGenderFilter = category;
  const btnAll = document.getElementById('matFilterAll');
  const btnMale = document.getElementById('matFilterMale');
  const btnFemale = document.getElementById('matFilterFemale');

  if (btnAll) btnAll.classList.toggle('active', category === 'all');
  if (btnMale) btnMale.classList.toggle('active', category === 'male');
  if (btnFemale) btnFemale.classList.toggle('active', category === 'female');

  if (category === 'all') {
    renderMatrimonyList(currentProfiles);
  } else {
    const filtered = currentProfiles.filter(p => p.gender === category);
    renderMatrimonyList(filtered);
  }
}

function renderMatrimonyList(profiles) {
  const el = document.getElementById('matrimonyList');
  if (!el) return;

  el.innerHTML = profiles.map((p, idx) => {
    const isFemale = p.gender === 'female';
    const checkmarkColor = isFemale ? '#ff85a2' : '#00d2ff';
    const genderBadge = isFemale
      ? `<span class="tag red" style="padding:1px 8px; font-size:0.66rem;">♀️ Female</span>`
      : `<span class="tag green" style="padding:1px 8px; font-size:0.66rem;">♂️ Male</span>`;

    return `
      <div class="card profile-card">
        <div class="profile-top">
          <div class="avatar" style="cursor: pointer;" onclick="openChatByIndex(${idx})" title="Click to view full profile photo">
            <img src="${p.avatar}" alt="${p.name}" onerror="this.src='images/kothuk_mone_007.jpg'">
          </div>
          <div style="flex:1;">
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <h3 class="profile-name" style="margin:0;">${p.name}</h3>
              <span style="color: ${checkmarkColor}; font-size: 0.9rem; font-weight: 800;" title="Species Verified">✔️</span>
              ${genderBadge}
            </div>
            <p class="profile-sub" style="margin: 2px 0 4px;">
              ${p.age} · 📍 ${p.location || p.loc} · <span class="tag" style="padding:1px 7px; font-size:0.68rem;">${p.bloodGroup || p.diet || 'O+'}</span>
            </p>
            <div>
              <span class="tag ${isFemale ? 'red' : ''}" style="font-size:0.7rem; padding: 2px 8px;">
                ⭐ ${p.tag || p.species || 'Night Shift Specialist'}
              </span>
            </div>
          </div>
        </div>

        <div class="profile-facts">
          <div><span>Wingspan</span>${p.wing || '6.0mm, aerodynamic'}</div>
          <div><span>Diet</span>${p.diet || 'O+ Universal Gourmet'}</div>
          <div><span>Family Background</span>${p.family || 'Ancestral Stagnant Water Dynasty'}</div>
          <div><span>Looking For</span>${p.looking || 'Comrade who dodges bats & shares O+ blood'}</div>
        </div>

        <div class="profile-bio">
          "${p.bio || 'Seeking a romantic buzzmate to sing 2 AM melodies into sleeping human ears.'}"
        </div>

        <div class="profile-actions">
          <button class="btn gold btn-sm" style="flex:1;" onclick="sendProposal('${p.name.replace(/'/g, "\\'")}', '${p.id}')">
            💍 Send Proposal
          </button>
          <button class="btn ghost btn-sm" style="flex:1;" onclick="openChatByIndex(${idx})">
            💬 Buzz Chat
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function sendProposal(name, id) {
  showToast(`💍 Proposal sent to ${name}! Astrological wing-alignment matches 98%! 🪐`);
  try {
    fetch(`${API_BASE}/matrimony/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId: id })
    });
  } catch (e) { }
}

function openChatByIndex(index) {
  const profile = currentProfiles[index] || embeddedData.datingProfiles[0];
  openChatModal(profile);
}

/* ---------------- CHAT SIMULATOR MODAL ---------------- */
function openChatModal(profile) {
  currentChatProfile = profile;
  const avatarEl = document.getElementById('chatAvatar');
  const nameEl = document.getElementById('chatName');
  const chatBody = document.getElementById('chatBody');

  if (avatarEl) avatarEl.src = profile.avatar || 'images/kothuk_mone_007.jpg';
  if (nameEl) nameEl.textContent = profile.name;

  const msgs = profile.cringeConversations || [
    { sender: "them", text: "Hi da! Cheviyil buzz cheyyan thalparyam undo? 🦟❤️" },
    { sender: "me", text: "Pinne! Njan 2 AM human slap dodge master aanu!" }
  ];

  if (chatBody) {
    chatBody.innerHTML = msgs.map(m => `
      <div class="chat-bubble ${m.sender}">${m.text}</div>
    `).join('');
    setTimeout(() => { chatBody.scrollTop = chatBody.scrollHeight; }, 50);
  }

  const modal = document.getElementById('chatModal');
  if (modal) modal.classList.add('active');
}

function closeChatModal() {
  const modal = document.getElementById('chatModal');
  if (modal) modal.classList.remove('active');
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const chatBody = document.getElementById('chatBody');
  chatBody.innerHTML += `<div class="chat-bubble me">${text}</div>`;
  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  // Parody response
  setTimeout(() => {
    const replies = [
      "Aiyaa! Ninakk GoodKnight coil smell undo? Njan pure drainage baby aanu! 🦟❤️",
      "Enne kothaan varumo tto? Njan Alappuzha canal-il waiting aanu!",
      "Cha! Njan electric bat spark-il ninnu rakshapetta superhero aanu! ⚡",
      "O+ve blood dinner date-inu polaam? My treat! 🩸",
      "2 AM uncle ear buzzing challenge complete cheyaam vaa! 🎶",
      "Ente chirakil rubber jacket undu tto. Bat strike enikku matter alla! 🛡️",
      "Soft bite only tto! Human awake aavalle! 🤫"
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    chatBody.innerHTML += `<div class="chat-bubble them">${reply}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 800);
}

function handleChatEnter(e) {
  if (e.key === 'Enter') sendChatMessage();
}

/* ---------------- SWAMPFINDER ---------------- */
async function fetchSwampData() {
  try {
    const res = await fetch(`${API_BASE}/swampfinder`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      renderSwamps(json.data);
      return;
    }
  } catch (err) { }
  renderSwamps(embeddedData.swamps);
}

function renderSwamps(items) {
  const el = document.getElementById('swampList');
  if (!el) return;

  el.innerHTML = items.map(s => `
    <div class="card swamp-card">
      <div class="swamp-emoji">${s.emoji || s.icon || '🥥'}</div>
      <div style="flex: 1;">
        <h3 class="swamp-name">${s.name}</h3>
        <p class="swamp-loc">📍 ${s.loc || s.location}</p>
        <p class="swamp-desc">${s.desc || s.description || 'Deluxe Kerala stagnant water paradise.'}</p>
        <div class="swamp-meta">
          <span class="tag green">${s.tag || 'Certified Stagnant'}</span>
          <span class="tag">⭐ ${s.rating || '5.0'}</span>
          <span class="tag red">${s.price || s.capacity || '2 drops/night'}</span>
          <button class="btn gold btn-sm" style="margin-left: auto; width: auto;" onclick="bookSwamp('${s.name.replace(/'/g, "\\'")}')">
            Book Stay
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function bookSwamp(name) {
  showToast(`🏨 Reserved larval nursery at "${name}"! Check-in: Tonight at dusk 🦟`);
}

/* ---------------- COMPLAINTS & THREAT PORTAL ---------------- */
async function fetchComplaintsData() {
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      allComplaintsData = json.data;
      renderComplaints(allComplaintsData);
      return;
    }
  } catch (err) { }
  allComplaintsData = embeddedData.complaints;
  renderComplaints(allComplaintsData);
}

function renderComplaints(items) {
  const el = document.getElementById('complaintList');
  if (!el) return;

  el.innerHTML = items.map(c => {
    const sev = c.severity || (c.threatLevel && c.threatLevel.includes('CRITICAL') ? 'high' : 'med');
    const weaponTitle = c.weapon || c.type || 'Hostile Human Tactic';
    const tactic = c.humanTactic || c.text || 'Human spotted aggressively swinging repellent equipment.';
    const shield = c.recommendedShield || '🛡️ Deploy Rubber Insulated Jacket & Evade';
    const tip = c.survivalTip || 'Retreat to nearest dark corner till threat subsides.';
    const time = c.time || 'recently';

    return `
      <div class="card complaint-item">
        <div class="complaint-top">
          <h3>${weaponTitle}</h3>
          <span class="severity ${sev}">${sev.toUpperCase()}</span>
        </div>
        <p class="complaint-body">${tactic}</p>
        <div class="threat-gear">
          <strong>Recommended Gear:</strong> ${shield}
        </div>
        <div class="survival-tip">💡 Tip: ${tip}</div>
        <div class="feed-time" style="margin-top: 6px;">Reported: ${time}</div>
      </div>
    `;
  }).join('');
}

async function submitThreatComplaint() {
  const weapon = document.getElementById('complaintWeapon').value;
  const district = document.getElementById('complaintDistrict').value.trim() || 'Ernakulam';
  const note = document.getElementById('complaintText').value.trim();

  if (!note) {
    showToast("Describe the incident before filing, comrade 🦟");
    return;
  }

  const newThreat = {
    weapon: `🚨 ${weapon} (${district})`,
    type: weapon,
    district: district,
    threatLevel: "EMERGENCY ALERT",
    severity: "high",
    humanTactic: note,
    recommendedShield: "🛡️ Wear Rubber Insulated Jacket & Deploy Decoy Buzz!",
    survivalTip: "Retreat to nearest drainage till human goes back to sleep.",
    time: "just now"
  };

  allComplaintsData.unshift(newThreat);
  renderComplaints(allComplaintsData);

  document.getElementById('complaintText').value = '';
  document.getElementById('complaintDistrict').value = '';

  showToast("🚨 Complaint filed! Reported to Kerala Swarm Council!");

  try {
    fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weapon, district, note })
    });
  } catch (e) { }
}

/* ---------------- BUZZNEWS ---------------- */
async function fetchNewsData() {
  try {
    const res = await fetch(`${API_BASE}/news`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      renderNews(json.data);
      updateLiveTicker(json.data);
      return;
    }
  } catch (err) { }
  renderNews(embeddedData.news);
  updateLiveTicker(embeddedData.news);
}

function renderNews(items) {
  const el = document.getElementById('newsList');
  if (!el) return;

  el.innerHTML = items.map(n => `
    <div class="card news-card">
      <span class="news-cat">${n.cat || n.category || 'Swarm Update'}</span>
      <h3 class="news-title">${n.title}</h3>
      <p class="news-body">${n.body || n.snippet || ''}</p>
      <div class="feed-time" style="margin-top: 6px;">${n.time || 'Today'}</div>
    </div>
  `).join('');
}

function updateLiveTicker(newsItems) {
  const ticker = document.getElementById('liveTickerText');
  if (!ticker) return;
  const headlines = newsItems.map(n => `📢 [${n.cat || n.category || 'Alert'}] ${n.title}`).join('  •  ');
  ticker.textContent = headlines;
}

/* ---------------- OBITUARIES (AADHRAANJALIKAL 🕊️) ---------------- */
async function fetchObituariesData() {
  try {
    const res = await fetch(`${API_BASE}/obituaries`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      allObituariesData = json.data;
      renderObituaries(allObituariesData);
      return;
    }
  } catch (err) { }
  allObituariesData = embeddedData.obituaries;
  renderObituaries(allObituariesData);
}

function renderObituaries(items) {
  const el = document.getElementById('obituaryList');
  if (!el) return;

  el.innerHTML = items.map(o => `
    <div class="card obit-card">
      <div class="obit-top">
        <div class="obit-avatar" title="${o.name}">
          <img src="${o.avatar}" alt="${o.name}" onerror="this.src='images/obit_shaji_culex.jpg'">
        </div>
        <div style="flex:1;">
          <h3 class="obit-name" style="margin:0;">${o.name} 🕊️</h3>
          <p class="obit-meta" style="margin:2px 0 0;">🕯️ ${o.age || '3 days old'} · 📍 ${o.location || 'Kerala'}</p>
        </div>
      </div>
      <div class="obit-cod">💀 <strong>Cause of Death:</strong> ${o.causeOfDeath}</div>
      <div class="obit-quote">"${o.wordsOfRemembrance || 'May his buzzing rest in peace.'}"</div>
      <button class="candle-btn" onclick="lightCandle('${o.id}', this)">
        🕯️ Homage Candles: <span class="candle-count">${o.candles || 1}</span>
      </button>
    </div>
  `).join('');
}

function lightCandle(id, btnElement) {
  const countSpan = btnElement.querySelector('.candle-count');
  if (countSpan) {
    const cur = parseInt(countSpan.textContent, 10) || 0;
    countSpan.textContent = cur + 1;
  }
  btnElement.style.background = 'rgba(232, 184, 75, 0.4)';
  btnElement.style.boxShadow = '0 0 25px rgba(232, 184, 75, 0.8)';
  showToast("🕯️ Candle lit in loving memory of our fallen comrade 🕊️");

  try {
    fetch(`${API_BASE}/obituaries/${id}/candle`, { method: 'POST' });
  } catch (e) { }
}

function openObituaryModal() {
  const modal = document.getElementById('obituaryModal');
  if (modal) modal.classList.add('active');
}

function closeObituaryModal() {
  const modal = document.getElementById('obituaryModal');
  if (modal) modal.classList.remove('active');
}

function submitObituaryForm() {
  const name = document.getElementById('obitName').value.trim();
  const meta = document.getElementById('obitMeta').value.trim();
  const cod = document.getElementById('obitCOD').value.trim();
  const words = document.getElementById('obitWords').value.trim();

  if (!name || !cod) {
    showToast("Please enter Name and Cause of Death 🕊️");
    return;
  }

  const newObit = {
    id: "o_" + Date.now(),
    name: name,
    age: meta || "2 days old",
    location: "Kerala",
    avatar: "images/obit_shaji_culex.jpg",
    causeOfDeath: cod,
    wordsOfRemembrance: words || "May his buzzing rest in peace.",
    candles: 1
  };

  allObituariesData.unshift(newObit);
  renderObituaries(allObituariesData);
  closeObituaryModal();

  document.getElementById('obitName').value = '';
  document.getElementById('obitMeta').value = '';
  document.getElementById('obitCOD').value = '';
  document.getElementById('obitWords').value = '';

  showToast("🕊️ Aadhraanjali post published to Kerala swarm!");

  try {
    fetch(`${API_BASE}/obituaries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newObit)
    });
  } catch (e) { }
}

/* ---------------- LEADERBOARD ---------------- */
async function fetchLeaderboardData() {
  try {
    const res = await fetch(`${API_BASE}/leaderboard`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      renderLeaderboard(json.data);
      return;
    }
  } catch (err) { }
  renderLeaderboard(embeddedData.leaderboard);
}

function renderLeaderboard(items) {
  const el = document.getElementById('lbList');
  if (!el) return;

  el.innerHTML = items.map((l, i) => `
    <div class="lb-row">
      <div class="lb-rank">${i + 1}</div>
      <div>
        <div class="lb-name">${l.name}</div>
        <div class="lb-loc">📍 ${l.loc || l.district || 'Kerala'} · ${l.badge || 'Blood Gatherer'}</div>
      </div>
      <div class="lb-amt">${l.amt || l.bloodMl || '30.0 ml'}</div>
    </div>
  `).join('');
}

/* ---------------- WEB AUDIO MOSQUITO BUZZ SYNTH ---------------- */
function setupSoundSynth() {
  const soundBtn = document.getElementById('soundBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    const statusSpan = document.getElementById('soundStatus');
    if (statusSpan) statusSpan.textContent = isSoundOn ? 'ON 🔊' : 'OFF';

    soundBtn.classList.toggle('active', isSoundOn);

    if (isSoundOn) {
      startBuzzingSound();
      showToast("Mosquito 440Hz Ear Buzz Synthesizer: ON 🦟🎵");
    } else {
      stopBuzzingSound();
      showToast("Buzz sound muted 🔇");
    }
  });
}

function startBuzzingSound() {
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    buzzOscillator = audioCtx.createOscillator();
    buzzGain = audioCtx.createGain();

    buzzOscillator.type = 'sawtooth';
    buzzOscillator.frequency.setValueAtTime(460, audioCtx.currentTime);

    // Subtle realistic wobble
    setInterval(() => {
      if (buzzOscillator && isSoundOn && audioCtx) {
        buzzOscillator.frequency.setValueAtTime(450 + Math.random() * 35, audioCtx.currentTime);
      }
    }, 120);

    buzzGain.gain.setValueAtTime(0.035, audioCtx.currentTime);
    buzzOscillator.connect(buzzGain);
    buzzGain.connect(audioCtx.destination);
    buzzOscillator.start();
  } catch (err) {
    console.warn("Audio Context error:", err);
  }
}

function stopBuzzingSound() {
  try {
    if (buzzOscillator) {
      buzzOscillator.stop();
      buzzOscillator.disconnect();
      buzzOscillator = null;
    }
  } catch (err) { }
}

/* ---------------- RADAR PULSE ---------------- */
function triggerRadarPulse() {
  showToast("📡 Radar Sweep Active: GoodKnight vapor detected in Kakkanad! Insulated vests advised! ⚡");
}

/* ---------------- ZIP DOWNLOAD ---------------- */
function downloadProjectZip() {
  showToast("📦 Preparing KothukuHub_2.0.zip download...");
  window.location.href = '/api/download-zip';
}

/* ---------------- TOAST NOTIFICATIONS ---------------- */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 2600);
}

/* ---------------- FLYING MOSQUITO CANVAS OVERLAY ---------------- */
let canvas, ctx;
const mosquito = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  vx: 1.8,
  vy: 1.2,
  wingAngle: 0,
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight / 2
};

function initMosquitoCanvas() {
  canvas = document.getElementById('mosquitoCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mosquito.targetX = e.clientX;
    mosquito.targetY = e.clientY;
  });

  setInterval(() => {
    if (Math.random() < 0.45) {
      mosquito.targetX = Math.random() * window.innerWidth;
      mosquito.targetY = Math.random() * window.innerHeight;
    }
  }, 3500);

  requestAnimationFrame(renderMosquitoCanvas);
}

function renderMosquitoCanvas() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dx = mosquito.targetX - mosquito.x;
  const dy = mosquito.targetY - mosquito.y;
  mosquito.vx += dx * 0.0018 + (Math.random() - 0.5) * 0.6;
  mosquito.vy += dy * 0.0018 + (Math.random() - 0.5) * 0.6;

  const speed = Math.sqrt(mosquito.vx * mosquito.vx + mosquito.vy * mosquito.vy);
  if (speed > 3.5) {
    mosquito.vx = (mosquito.vx / speed) * 3.5;
    mosquito.vy = (mosquito.vy / speed) * 3.5;
  }

  mosquito.x += mosquito.vx;
  mosquito.y += mosquito.vy;
  mosquito.wingAngle += 0.45;

  ctx.save();
  ctx.translate(mosquito.x, mosquito.y);

  const angle = Math.atan2(mosquito.vy, mosquito.vx);
  ctx.rotate(angle);

  // Fluttering translucent wings
  ctx.fillStyle = 'rgba(246, 239, 221, 0.35)';
  ctx.beginPath();
  ctx.ellipse(0, -5, 10, Math.abs(Math.sin(mosquito.wingAngle)) * 7 + 2, Math.PI / 4, 0, Math.PI * 2);
  ctx.ellipse(0, 5, 10, Math.abs(Math.sin(mosquito.wingAngle)) * 7 + 2, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Slender dark body
  ctx.fillStyle = '#E8B84B';
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red abdomen blood hint
  ctx.fillStyle = '#B3181F';
  ctx.beginPath();
  ctx.arc(-4, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Beak / Proboscis needle
  ctx.strokeStyle = '#6CB584';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.lineTo(14, 0);
  ctx.stroke();

  ctx.restore();

  requestAnimationFrame(renderMosquitoCanvas);
}
