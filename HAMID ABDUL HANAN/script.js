/* ═══════════════════════════════════════════════════════════════
   DATA SETS — Expanded databases
═══════════════════════════════════════════════════════════════ */
const COMMON_PASSWORDS = new Set([
  "password","123456","12345678","qwerty","abc123","monkey","1234567",
  "letmein","trustno1","dragon","baseball","iloveyou","master","sunshine",
  "ashley","bailey","passw0rd","shadow","123123","654321","superman",
  "qazwsx","michael","football","welcome","jesus","ninja","mustang",
  "password1","123456789","admin","hello","charlie","donald","password123",
  "qwerty123","princess","welcome1","shadow1","1234","12345","111111",
  "000000","pass","test","guest","root","login","letmein1","abc1234",
  "654321","123321","qwertyuiop","asdfghjkl","zxcvbnm","passpass",
  "admin123","administrator","changeme","default","manager","service"
]);

const COMMON_NAMES = new Set([
  // Pakistani / Urdu names
  "ali","ahmed","muhammad","hamza","hassan","hussain","usman","omar",
  "bilal","zain","faisal","tariq","arif","asim","imran","khalid","hamid",
  "nadeem","waseem","naeem","saleem","raheem","azeem","kareem","hakeem",
  "fatima","ayesha","zainab","hira","sana","nadia","asma","rabia",
  "maryam","khadija","amina","bushra","saima","uzma","fariha","anum",
  // English / Western names
  "john","david","michael","james","robert","william","richard","joseph",
  "charles","thomas","christopher","daniel","matthew","anthony","donald",
  "sarah","maria","emily","jessica","ashley","amanda","stephanie","melissa",
  "jennifer","elizabeth","lisa","helen","rachel","samantha","emma","sophia",
  "oliver","noah","liam","ethan","mason","logan","lucas","jacob",
  "adam","alex","andrew","brian","carlos","eric","frank","george",
  "henry","ivan","kevin","larry","mark","nathan","paul","ryan","steve",
  "anna","alice","betty","carol","diana","grace","julia","karen",
  "laura","linda","mary","nancy","patricia","sandra","sharon","susan"
]);

const COUNTRY_NAMES = new Set([
  "pakistan","india","china","usa","america","canada","germany","france",
  "italy","turkey","saudiarabia","saudi","uae","england","russia","japan",
  "australia","brazil","mexico","spain","netherlands","sweden","norway",
  "denmark","finland","switzerland","austria","belgium","poland","ukraine",
  "greece","portugal","czech","hungary","romania","bulgaria","croatia",
  "serbia","iran","iraq","syria","jordan","egypt","algeria","morocco",
  "nigeria","kenya","ghana","ethiopia","indonesia","malaysia","thailand",
  "vietnam","philippines","bangladesh","srilanka","nepal","afghanistan",
  "newzealand","argentina","colombia","peru","chile","venezuela","qatar",
  "kuwait","bahrain","oman","libya","tunisia","sudan","somalia",
  "britain","uk","unitedkingdom","unitedstates","southkorea","northkorea",
  "southafrica","myanmar","singapore","israel","palestine","lebanon","yemen"
]);

const CITY_NAMES = new Set([
  // Pakistan cities — comprehensive
  "lahore","karachi","islamabad","rawalpindi","peshawar","quetta",
  "multan","faisalabad","hyderabad","sialkot","gujranwala","abbottabad",
  "bahawalpur","sargodha","sukkur","larkana","sheikhupura","rahim","jhang",
  "gujrat","mardan","mingora","nawabshah","mirpur","muzaffarabad","gilgit",
  // Middle East
  "dubai","riyadh","jeddah","abudhabi","doha","kuwait","muscat","manama",
  "sharjah","ajman","tehran","baghdad","amman","beirut","damascus","kabul",
  // Asia
  "tokyo","beijing","delhi","mumbai","shanghai","seoul","bangkok","jakarta",
  "manila","kualalumpur","singapore","hongkong","dhaka","colombo","kathmandu",
  "taipei","osaka","kyoto","guangzhou","shenzhen","chennai","bangalore","kolkata",
  // Europe
  "london","paris","berlin","madrid","rome","milan","amsterdam","brussels",
  "vienna","warsaw","budapest","prague","bucharest","athens","lisbon","oslo",
  "stockholm","copenhagen","helsinki","zurich","geneva","moscow","istanbul",
  // Americas & Africa
  "newyork","losangeles","chicago","houston","miami","toronto","sydney",
  "melbourne","cairo","nairobi","lagos","accra","casablanca","tunis","algiers",
  "johannesburg","capetown","montreal","vancouver","boston","seattle","dallas"
]);

const SEQUENTIAL_PATTERNS = [
  "abcdef","bcdefg","cdefgh","defghi","efghij","fghijk","ghijkl",
  "hijklm","ijklmn","jklmno","klmnop","lmnopq","mnopqr","nopqrs",
  "opqrst","pqrstu","qrstuv","rstuvw","stuvwx","tuvwxy","uvwxyz",
  "123456","234567","345678","456789","567890","654321","987654",
  "qwerty","asdfgh","zxcvbn","qwertyu","asdfghj","poiuyt","lkjhgf"
];

/* ═══════════════════════════════════════════════════════════════
   OSINT SEVERITY ENGINE
═══════════════════════════════════════════════════════════════ */
function computeOsintSeverity(names, countries, cities) {
  const total = names.length + countries.length + cities.length;
  const types  = [names.length>0, countries.length>0, cities.length>0].filter(Boolean).length;

  if (total === 0) return { level: null, cls: "", label: "", penalty: 0, desc: "" };

  if (total === 1 && types === 1) {
    return {
      level: "medium",
      cls: "sev-medium",
      label: "⚠ MEDIUM — Single Match",
      penalty: 15,
      desc: "One predictable keyword found. Reduces security, especially against targeted attacks."
    };
  }
  if (total === 2 || types === 2) {
    return {
      level: "high",
      cls: "sev-high",
      label: "🔴 HIGH — Double Match",
      penalty: 30,
      desc: "Two predictable keywords found. Attackers commonly combine name + city / name + country in hybrid wordlists."
    };
  }
  if (total === 3 || types === 3) {
    return {
      level: "very-high",
      cls: "sev-very-high",
      label: "🚨 VERY HIGH — Triple Match",
      penalty: 45,
      desc: "Three predictable keywords found. This password type is commonly cracked within seconds using OSINT-based wordlists."
    };
  }
  return {
    level: "critical",
    cls: "sev-critical",
    label: "☠ CRITICAL — Multiple Personal Keywords",
    penalty: 60,
    desc: "Multiple personal keywords detected. Password cannot receive a Strong or Very Strong rating regardless of length or special characters."
  };
}

/* Detect combinations (Name+Country, Name+City, City+Country, etc.) */
function detectCombinations(foundNames, foundCountries, foundCities) {
  const combos = [];

  if (foundNames.length && foundCountries.length) {
    foundNames.forEach(n => foundCountries.forEach(c => {
      combos.push({
        type: "Name + Country",
        example: `${cap(n)} + ${cap(c)}`,
        msg: `Name "${cap(n)}" combined with country "${cap(c)}" — a classic hybrid wordlist attack pattern`
      });
    }));
  }
  if (foundNames.length && foundCities.length) {
    foundNames.forEach(n => foundCities.forEach(c => {
      combos.push({
        type: "Name + City",
        example: `${cap(n)} + ${cap(c)}`,
        msg: `Name "${cap(n)}" combined with city "${cap(c)}" — commonly used in targeted OSINT attacks`
      });
    }));
  }
  if (foundCities.length && foundCountries.length) {
    foundCities.forEach(c => foundCountries.forEach(k => {
      combos.push({
        type: "City + Country",
        example: `${cap(c)} + ${cap(k)}`,
        msg: `City "${cap(c)}" combined with country "${cap(k)}" — geography-based combination attack`
      });
    }));
  }
  if (foundNames.length && foundCities.length && foundCountries.length) {
    combos.push({
      type: "Name + City + Country",
      example: `${cap(foundNames[0])} + ${cap(foundCities[0])} + ${cap(foundCountries[0])}`,
      msg: "Full personal profile detected in password — Name + City + Country combination is critically weak against OSINT attacks"
    });
  }
  return combos;
}

function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

/* Suggest a random safe replacement */
function suggestReplacement(originalPwd) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*-_=+";
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => chars[b % chars.length]).join("");
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ANALYZER
═══════════════════════════════════════════════════════════════ */
function analyzePassword(pwd, twofa) {
  const result = {
    score: 0, strength: "", entropy: 0, entropyLabel: "",
    crackTime: "", weaknesses: [], recommendations: [],
    foundNames: [], foundCountries: [], foundCities: [],
    combos: [], osintSeverity: null,
    twofa
  };

  if (!pwd) {
    result.strength = "Very Weak";
    result.crackTime = "Instant";
    result.entropyLabel = "Low Entropy";
    return result;
  }

  let score = 0;
  const low = pwd.toLowerCase();

  // 1. Common password check
  if (COMMON_PASSWORDS.has(low)) {
    result.weaknesses.push("Password is one of the most commonly used passwords in the world");
    result.recommendations.push("Choose a completely unique password — avoid any dictionary word");
    score -= 40;
  } else { score += 10; }

  // 2. Length scoring
  const len = pwd.length;
  if (len < 10) {
    result.weaknesses.push(`Too short — only ${len} character${len===1?"":"s"} (minimum 10 required)`);
    result.recommendations.push("Use at least 10 characters; 16+ is strongly recommended");
    score += len * 2;
  } else if (len <= 12) { score += 25; }
  else if (len <= 16)   { score += 35; }
  else                   { score += 45; }

  // 3. Character diversity
  const hasUpper   = /[A-Z]/.test(pwd);
  const hasLower   = /[a-z]/.test(pwd);
  const hasDigit   = /\d/.test(pwd);
  const hasSpecial = /[!@#$%^&*()\-_=+\[\]{}|;:'",.<>\/?`~\\]/.test(pwd);
  const diversity  = [hasUpper,hasLower,hasDigit,hasSpecial].filter(Boolean).length;
  score += diversity * 8;

  if (!hasUpper)   { result.weaknesses.push("No uppercase letters (A–Z)"); result.recommendations.push("Add uppercase letters"); }
  if (!hasLower)   { result.weaknesses.push("No lowercase letters (a–z)"); result.recommendations.push("Add lowercase letters"); }
  if (!hasDigit)   { result.weaknesses.push("No numbers (0–9)"); result.recommendations.push("Include at least one number"); }
  if (!hasSpecial) { result.weaknesses.push("No special characters (!@#$%^&* etc.)"); result.recommendations.push("Add special characters like ! @ # $ % ^"); }

  // 4. Repeated chars
  if (/(.)\1{3,}/.test(pwd)) {
    result.weaknesses.push("Repeated character pattern detected (e.g. aaaa / 1111)");
    result.recommendations.push("Avoid repeating the same character 4+ times consecutively");
    score -= 15;
  }

  // 5. Sequential patterns
  if (SEQUENTIAL_PATTERNS.some(p => low.includes(p))) {
    result.weaknesses.push("Sequential pattern detected (e.g. 12345 / abcde / qwerty)");
    result.recommendations.push("Avoid keyboard walks and sequential sequences");
    score -= 15;
  }

  // ── ADVANCED PERSONAL INFORMATION DETECTION ──
  // Case-insensitive, embedded detection

  // 6. Common names (case-insensitive, substring match)
  const foundNames = [...COMMON_NAMES].filter(n => low.includes(n));
  result.foundNames = foundNames;
  if (foundNames.length) {
    const display = foundNames.slice(0,4).map(cap).join(", ");
    result.weaknesses.push(`Common name(s) detected in password: ${display} — easily guessed via OSINT`);
    result.recommendations.push("Remove personal or common first names — attackers use OSINT (social media, LinkedIn, public records) to build custom wordlists");
  }

  // 7. Country names (case-insensitive, substring match, even mixed with symbols)
  const foundCountries = [...COUNTRY_NAMES].filter(c => low.includes(c));
  result.foundCountries = foundCountries;
  if (foundCountries.length) {
    const display = foundCountries.slice(0,4).map(cap).join(", ");
    result.weaknesses.push(`Country name(s) detected: ${display} — easily guessed in targeted attacks`);
    result.recommendations.push("Remove country names; they appear in every standard wordlist attack and OSINT-based cracking tool");
  }

  // 8. City names (case-insensitive, substring match)
  const foundCities = [...CITY_NAMES].filter(c => low.includes(c));
  result.foundCities = foundCities;
  if (foundCities.length) {
    const display = foundCities.slice(0,4).map(cap).join(", ");
    result.weaknesses.push(`City name(s) detected: ${display} — makes password vulnerable to geography-based guessing`);
    result.recommendations.push("Remove city names to prevent geography-based dictionary and hybrid attacks");
  }

  // 9. Combination detection
  result.combos = detectCombinations(foundNames, foundCountries, foundCities);

  // 10. OSINT severity scoring
  const sev = computeOsintSeverity(foundNames, foundCountries, foundCities);
  result.osintSeverity = sev;

  if (sev.level) {
    score -= sev.penalty;
    if (result.combos.length) {
      result.weaknesses.push(`Combination attack vulnerability: ${result.combos.length} keyword combination(s) detected — attackers use hybrid wordlists that auto-combine names, cities, and countries`);
    }
    // Critical: cap strength at Medium
    if (sev.level === "critical") {
      score = Math.min(score, 59); // never reaches Strong/Very Strong
    }
    result.recommendations.push("Replace all predictable personal keywords with random characters — even adding numbers or symbols to a name/city/country does NOT make it secure");
  }

  // 11. 2FA bonus
  if (twofa) score += 10;

  // 12. Entropy
  let charset = 0;
  if (hasLower)   charset += 26;
  if (hasUpper)   charset += 26;
  if (hasDigit)   charset += 10;
  if (hasSpecial) charset += 32;
  if (!charset)   charset = 26;
  const entropy = +(len * Math.log2(charset)).toFixed(1);
  result.entropy = entropy;
  result.entropyLabel = entropy < 40 ? "Low Entropy" : entropy < 70 ? "Medium Entropy" : "High Entropy";

  // 13. Clamp & categorise
  score = Math.max(0, Math.min(100, score));
  result.score = score;

  if      (score <= 20) { result.strength = "Very Weak";   result.crackTime = "Less than a second"; }
  else if (score <= 40) { result.strength = "Weak";        result.crackTime = "Minutes to hours"; }
  else if (score <= 60) { result.strength = "Medium";      result.crackTime = "Days to weeks"; }
  else if (score <= 80) { result.strength = "Strong";      result.crackTime = "Months to years"; }
  else                  { result.strength = "Very Strong"; result.crackTime = "Centuries or more"; }

  if (twofa && ["Very Weak","Weak","Medium"].includes(result.strength))
    result.crackTime += " (mitigated by 2FA)";

  if (!result.recommendations.length)
    result.recommendations.push("Excellent password! Use unique passwords for every account.");
  if (!twofa)
    result.recommendations.push("Enable Two-Factor Authentication (2FA) for an essential extra security layer");

  return result;
}

/* ═══════════════════════════════════════════════════════════════
   PASSWORD GENERATOR
═══════════════════════════════════════════════════════════════ */
function generatePassword() {
  const u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const l = "abcdefghijklmnopqrstuvwxyz";
  const d = "0123456789";
  const s = "!@#$%^&*()-_=+[]{}|;:,.<>?";
  const all = u + l + d + s;
  const len = 16 + Math.floor(Math.random() * 5);
  const arr = new Uint8Array(len + 4);
  crypto.getRandomValues(arr);
  let pwd = [u[arr[0]%u.length], l[arr[1]%l.length], d[arr[2]%d.length], s[arr[3]%s.length],
    ...Array.from({length:len}, (_,i) => all[arr[4+i]%all.length])];
  for (let i=pwd.length-1;i>0;i--){const j=arr[i%arr.length]%(i+1);[pwd[i],pwd[j]]=[pwd[j],pwd[i]];}
  return pwd.join("").slice(0, len);
}

/* ═══════════════════════════════════════════════════════════════
   STRENGTH META
═══════════════════════════════════════════════════════════════ */
const STRENGTH_META = {
  "Very Weak":   { cls:"very-weak",   icon:"⛔" },
  "Weak":        { cls:"weak",        icon:"⚠️" },
  "Medium":      { cls:"medium",      icon:"🔶" },
  "Strong":      { cls:"strong",      icon:"✅" },
  "Very Strong": { cls:"very-strong", icon:"🛡️" },
};

/* ═══════════════════════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════════════════════ */
const pwdInput     = document.getElementById("passwordInput");
const showPwdCb    = document.getElementById("showPwd");
const showToggle   = document.getElementById("showToggle");
const analyzeBtn   = document.getElementById("analyzeBtn");
const generateBtn  = document.getElementById("generateBtn");
const resetBtn     = document.getElementById("resetBtn");
const copyBtn      = document.getElementById("copyBtn");
const genResult    = document.getElementById("genResult");
const genPasswordEl= document.getElementById("genPassword");
const scoreNum     = document.getElementById("scoreNum");
const strengthLbl  = document.getElementById("strengthLabel");
const progressFill = document.getElementById("progressFill");
const chipEntropy  = document.getElementById("chipEntropy");
const chipCrack    = document.getElementById("chipCrack");
const chipTwofa    = document.getElementById("chipTwofa");
const weaknessList = document.getElementById("weaknessList");
const recList      = document.getElementById("recList");
const twofaBanner  = document.getElementById("twofaBanner");
// OSINT card refs
const osintCard    = document.getElementById("osintCard");
const severityPill = document.getElementById("severityPill");
const severityDesc = document.getElementById("severityDesc");
const keywordTags  = document.getElementById("keywordTags");
const comboHeading = document.getElementById("comboHeading");
const comboList    = document.getElementById("comboList");
const replaceBox   = document.getElementById("replaceBox");

/* ═══════════════════════════════════════════════════════════════
   EVENTS
═══════════════════════════════════════════════════════════════ */
function syncShow() {
  pwdInput.type = showPwdCb.checked ? "text" : "password";
  showToggle.textContent = showPwdCb.checked ? "🙈" : "👁";
}
showPwdCb.addEventListener("change", syncShow);
showToggle.addEventListener("click", () => { showPwdCb.checked = !showPwdCb.checked; syncShow(); });

pwdInput.addEventListener("input", () => { if (pwdInput.value) runAnalysis(); else resetUI(); });
pwdInput.addEventListener("keydown", e => { if(e.key==="Enter") runAnalysis(); });
document.querySelectorAll('input[name="twofa"]').forEach(r =>
  r.addEventListener("change", () => { if(pwdInput.value) runAnalysis(); })
);
analyzeBtn.addEventListener("click", runAnalysis);

generateBtn.addEventListener("click", () => {
  const pwd = generatePassword();
  genPasswordEl.textContent = pwd;
  genResult.classList.remove("hidden");
  pwdInput.value = pwd;
  pwdInput.type = "text";
  showPwdCb.checked = true;
  showToggle.textContent = "🙈";
  runAnalysis();
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(genPasswordEl.textContent).then(() => {
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 2000);
  });
});

resetBtn.addEventListener("click", resetAll);

/* ═══════════════════════════════════════════════════════════════
   RENDER
═══════════════════════════════════════════════════════════════ */
function runAnalysis() {
  const pwd   = pwdInput.value;
  const twofa = document.querySelector('input[name="twofa"]:checked').value === "enabled";
  const r     = analyzePassword(pwd, twofa);
  renderScore(r);
  renderOsintCard(r);
  renderWeaknesses(r);
  renderRecommendations(r);
}

function renderScore(r) {
  const meta = STRENGTH_META[r.strength] || STRENGTH_META["Very Weak"];
  scoreNum.textContent = r.score;
  scoreNum.className   = "score-number s-" + meta.cls;
  strengthLbl.textContent = meta.icon + "  " + r.strength;
  strengthLbl.className   = "strength-label s-" + meta.cls;
  progressFill.style.width = r.score + "%";
  progressFill.className   = "progress-fill b-" + meta.cls;
  chipEntropy.textContent  = r.entropy + " bits\n" + r.entropyLabel;
  chipCrack.textContent    = r.crackTime;
  chipTwofa.textContent    = r.twofa ? "✔ Enabled" : "✘ Not Enabled";
  chipTwofa.style.color    = r.twofa ? "var(--green)" : "var(--red)";
}

function renderOsintCard(r) {
  const sev = r.osintSeverity;
  const hasHits = r.foundNames.length || r.foundCountries.length || r.foundCities.length;

  if (!hasHits || !sev || !sev.level) {
    osintCard.classList.remove("visible");
    return;
  }

  osintCard.classList.add("visible");

  // Severity pill
  severityPill.className = "severity-pill " + sev.cls;
  severityPill.textContent = sev.label;
  severityDesc.textContent = sev.desc;

  // Keyword tags
  keywordTags.innerHTML = "";
  r.foundNames.forEach(n => {
    const t = document.createElement("span");
    t.className = "kw-tag kw-name";
    t.textContent = "👤 " + cap(n);
    keywordTags.appendChild(t);
  });
  r.foundCountries.forEach(c => {
    const t = document.createElement("span");
    t.className = "kw-tag kw-country";
    t.textContent = "🌍 " + cap(c);
    keywordTags.appendChild(t);
  });
  r.foundCities.forEach(c => {
    const t = document.createElement("span");
    t.className = "kw-tag kw-city";
    t.textContent = "🏙 " + cap(c);
    keywordTags.appendChild(t);
  });

  // Combination findings
  comboList.innerHTML = "";
  if (r.combos.length) {
    comboHeading.textContent = "Combination Attack Patterns Detected";
    r.combos.forEach(combo => {
      const d = document.createElement("div");
      d.className = "combo-item";
      d.innerHTML = `<span class="ci-icon">🔗</span><span><strong>[${escHtml(combo.type)}]</strong> ${escHtml(combo.msg)}</span>`;
      comboList.appendChild(d);
    });
  } else {
    comboHeading.textContent = "";
  }

  // Replace suggestion
  const originalPwd = pwdInput.value.slice(0,18) + (pwdInput.value.length > 18 ? "…" : "");
  const suggested = suggestReplacement(pwdInput.value);
  replaceBox.innerHTML = `
    <strong>🔄 Suggested Replacement</strong><br>
    Instead of: <code style="color:#FF9090;">${escHtml(originalPwd)}</code><br>
    Use: <code style="font-size:13px;">${escHtml(suggested)}</code><br>
    <span style="font-size:12px;opacity:.8;">Randomly generated — exponentially harder to crack than any name/city/country combination.</span>
  `;
}

function renderWeaknesses(r) {
  // 2FA banner
  twofaBanner.className = "twofa-banner";
  if (r.twofa) {
    twofaBanner.className += " enabled-style";
    twofaBanner.textContent = "🛡️  2FA is active — even if this password is compromised, your account remains significantly more secure because Two-Factor Authentication requires a second verification step.";
  } else {
    twofaBanner.className += " disabled-style";
    twofaBanner.textContent = "⚠️  Account relies entirely on password security. Enable Two-Factor Authentication to add an essential extra layer of protection.";
  }

  weaknessList.innerHTML = "";
  if (!r.weaknesses.length) {
    weaknessList.innerHTML = `<div class="list-item ok"><span class="item-icon">✅</span><span>No significant weaknesses detected — great password!</span></div>`;
    return;
  }
  r.weaknesses.forEach(w => {
    const div = document.createElement("div");
    div.className = "list-item warn";
    div.innerHTML = `<span class="item-icon">⚠</span><span>${escHtml(w)}</span>`;
    weaknessList.appendChild(div);
  });
}

function renderRecommendations(r) {
  recList.innerHTML = "";
  if (!r.recommendations.length) {
    recList.innerHTML = `<div class="empty-state">No recommendations — excellent password!</div>`;
    return;
  }
  r.recommendations.forEach((rec, i) => {
    const div = document.createElement("div");
    const is2fa = rec.toLowerCase().includes("2fa") || rec.toLowerCase().includes("two-factor");
    div.className = "list-item " + (is2fa ? "ok" : "tip");
    div.innerHTML = `<span class="item-icon">${is2fa ? "🛡️" : "💡"}</span><span><strong>${i+1}.</strong> ${escHtml(rec)}</span>`;
    recList.appendChild(div);
  });
}

function resetAll() {
  pwdInput.value = "";
  showPwdCb.checked = false;
  pwdInput.type = "password";
  showToggle.textContent = "👁";
  document.querySelector('input[name="twofa"][value="disabled"]').checked = true;
  genResult.classList.add("hidden");
  resetUI();
}

function resetUI() {
  scoreNum.textContent = "—"; scoreNum.className = "score-number";
  strengthLbl.textContent = "—"; strengthLbl.className = "strength-label";
  progressFill.style.width = "0%"; progressFill.className = "progress-fill";
  chipEntropy.textContent = "—"; chipCrack.textContent = "—";
  chipTwofa.textContent = "—"; chipTwofa.style.color = "";
  weaknessList.innerHTML = `<div class="empty-state">Analyze a password to see detected weaknesses.</div>`;
  recList.innerHTML = `<div class="empty-state">Recommendations will appear here after analysis.</div>`;
  twofaBanner.className = "twofa-banner";
  osintCard.classList.remove("visible");
}

function escHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
