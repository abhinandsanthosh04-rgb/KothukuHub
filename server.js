const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const mockData = require('./data/mockData');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory dynamic data state
let dataState = JSON.parse(JSON.stringify(mockData));

// --- API ENDPOINTS ---

// 1. Dashboard Stats
app.get('/api/stats', (req, res) => {
  res.json({ success: true, data: dataState.stats });
});

// 2. Blood Bank
app.get('/api/bloodbank', (req, res) => {
  const { district } = req.query;
  if (district) {
    const filtered = dataState.bloodBank.filter(b => b.district.toLowerCase() === district.toLowerCase());
    return res.json({ success: true, data: filtered });
  }
  res.json({ success: true, data: dataState.bloodBank });
});

// 3. Matrimony / Dating Profiles
app.get('/api/matrimony', (req, res) => {
  res.json({ success: true, data: dataState.datingProfiles });
});

app.post('/api/matrimony/like', (req, res) => {
  const { profileId } = req.body;
  const profile = dataState.datingProfiles.find(p => p.id === profileId);
  if (profile) {
    return res.json({
      success: true,
      matched: true,
      message: `🎉 Match Super Buzz! ${profile.name} liked you back!`,
      conversations: profile.cringeConversations
    });
  }
  res.status(404).json({ success: false, message: "Profile not found" });
});

// 4. SwampFinder Kerala Locations
app.get('/api/swampfinder', (req, res) => {
  res.json({ success: true, data: dataState.swampFinder });
});

// 5. Human Threats & Defense Gear
app.get('/api/complaints', (req, res) => {
  res.json({ success: true, data: dataState.humanComplaints });
});

app.post('/api/complaints', (req, res) => {
  const { weapon, district, note } = req.body;
  if (!weapon || !district) {
    return res.status(400).json({ success: false, message: "Missing weapon or district" });
  }
  const newThreat = {
    weapon: `🚨 ${weapon} Alert (${district})`,
    threatLevel: "EMERGENCY ALERT",
    humanTactic: note || "Human actively swinging or spraying in area!",
    recommendedShield: "🛡️ Wear Rubber Insulated Jacket & Deploy Decoy Frequencies!",
    survivalTip: "Retreat to nearest drainage till human goes back to sleep."
  };
  dataState.humanComplaints.unshift(newThreat);
  res.json({ success: true, message: "Threat reported to state mosquito swarm!", data: newThreat });
});

// 6. BuzzNews
app.get('/api/news', (req, res) => {
  res.json({ success: true, data: dataState.buzzNews });
});

// 7. Obituaries (Aadhraanjalikal 🕯️)
app.get('/api/obituaries', (req, res) => {
  res.json({ success: true, data: dataState.obituaries });
});

app.post('/api/obituaries/:id/candle', (req, res) => {
  const { id } = req.params;
  const obit = dataState.obituaries.find(o => o.id === id);
  if (obit) {
    obit.candles += 1;
    return res.json({ success: true, newCount: obit.candles });
  }
  res.status(404).json({ success: false, message: "Obituary record not found" });
});

app.post('/api/obituaries', (req, res) => {
  const { name, age, location, causeOfDeath, wordsOfRemembrance } = req.body;
  if (!name || !causeOfDeath) {
    return res.status(400).json({ success: false, message: "Name and Cause of Death required" });
  }
  const newObit = {
    id: "o_" + Date.now(),
    name: name,
    age: age || "1 day old",
    location: location || "Kerala",
    avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80`,
    causeOfDeath: causeOfDeath,
    wordsOfRemembrance: wordsOfRemembrance || "May his buzzing rest in peace.",
    candles: 1
  };
  dataState.obituaries.unshift(newObit);
  res.json({ success: true, message: "Aadhraanjali post published 🕊️", data: newObit });
});

// 8. Leaderboard
app.get('/api/leaderboard', (req, res) => {
  res.json({ success: true, data: dataState.leaderboard });
});

// 9. ZIP Exporter Endpoint
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.join(__dirname, 'KothukuHub_2.0.zip');
  
  // Re-generate package zip
  try {
    const bundleScript = path.join(__dirname, 'bundle-zip.js');
    execSync(`"${process.execPath}" "${bundleScript}"`);
  } catch (err) {
    console.error('Error generating zip:', err.message);
  }

  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="KothukuHub_2.0.zip"');
    return res.sendFile(zipPath);
  }
  res.status(500).json({ success: false, message: "Could not build ZIP file archive." });
});

// Fallback to single-page app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`🦟 KothukuHub 2.0 Server Live on http://localhost:${PORT}`);
  console.log(`🩸 Kerala's #1 Mosquito Social Network Active!`);
  console.log(`===================================================`);
});
