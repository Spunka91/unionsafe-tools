const STORAGE_KEY = "unionsafe_submissions_v13";

function $(id) { return document.getElementById(id); }
function value(id) { return ($(id)?.value || "").trim(); }
function lower(id) { return value(id).toLowerCase(); }

function setOutput(id, text) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.classList.remove("empty");
}

function detectStandards(text) {
  const t = text.toLowerCase();
  const matches = [];
  const add = (topic, standard, note) => matches.push({ topic, standard, note });

  if (/wet|slip|floor|ice|spill|slick|trip|walkway|housekeeping/.test(t)) add("Walking/working surfaces and housekeeping", "29 CFR 1910.22", "Walking-working surfaces must be kept clean, orderly, sanitary, and where possible dry. Document exposure, location, and whether workers had to pass through the condition.");
  if (/ppe|glove|vest|eye|face|hearing|respirator|mask|shoe|boot|hard hat|protective/.test(t)) add("PPE hazard assessment", "29 CFR 1910.132", "Employers must assess hazards and provide appropriate PPE when needed.");
  if (/tug|tractor|forklift|powered|vehicle|gse|brake|horn|alarm|backup|steering|hydraulic|equipment/.test(t)) add("Powered industrial trucks / equipment safety", "29 CFR 1910.178", "Powered industrial trucks must be kept in safe operating condition. Unsafe equipment should be removed from service until corrected.");
  if (/noise|loud|hearing|engine|aircraft|jet|decibel/.test(t)) add("Occupational noise", "29 CFR 1910.95", "Noise exposure may require monitoring, controls, hearing protection, and hearing conservation measures.");
  if (/chemical|glycol|fuel|odor|smell|fume|vapor|dust|haboob|construction|hazcom|sds/.test(t)) add("Hazard Communication", "29 CFR 1910.1200", "Chemical, dust, and exposure concerns may require SDS review, labeling, communication, and protective measures.");
  if (/first aid|medical|heat|heat illness|dizzy|faint|dehydration|ambulance|injury|symptom/.test(t)) add("Medical services and first aid", "29 CFR 1910.151", "Employers must ensure medical services and first aid are available. Heat symptoms should be documented clearly with work activity, conditions, and timing.");
  if (/fall|ladder|platform|height|edge|hole|stairs|guardrail/.test(t)) add("Fall/walking-working surface concern", "29 CFR 1910 Subpart D", "Falls and elevated work concerns may involve walking-working surface requirements, ladder safety, and fall protection depending on the facts.");

  if (matches.length === 0) add("General workplace hazard", "General Duty Clause, Section 5(a)(1)", "When no specific standard is obvious, OSHA may still evaluate whether a recognized serious hazard exists and whether feasible controls were available.");
  return matches;
}

function formatStandards(text) {
  const matches = detectStandards(text);
  return matches.map((m, i) => `${i + 1}. ${m.topic}\nPossible standard/reference: ${m.standard}\nWhat it means: ${m.note}`).join("\n\n");
}

function handleOshaRef() {
  const input = value("oshaRefInput");
  if (!input) return setOutput("oshaRefOutput", "Type a safety concern first, such as wet floor, tug hit aircraft, heat exposure, dust, or broken equipment.");
  setOutput("oshaRefOutput", `Concern entered: ${input}\n\nPossible OSHA reference(s):\n\n${formatStandards(input)}\n\nReminder: This is a practical reference tool. Verify final application with official OSHA standards, company policy, airport rules, and qualified safety review.`);
}

function handleOshaCheck() {
  const input = value("oshaCheckInput");
  if (!input) return setOutput("oshaCheckOutput", "Type the condition or event first so the tool can check for possible OSHA-related concerns.");
  const likely = /exposed|injury|hurt|unsafe|broken|wet|spill|hit|struck|contact|dust|chemical|heat|noise|fall|no ppe|not working/.test(input.toLowerCase());
  const risk = likely ? "Possible OSHA-related concern — document and escalate for review." : "Needs more detail — describe exposure, location, who was affected, and what control was missing.";
  setOutput("oshaCheckOutput", `Is this an OSHA violation?\n\n${risk}\n\nWhat to document:\n- What condition existed\n- Who was exposed\n- Where and when it happened\n- Whether the hazard was known or repeated\n- What controls were missing or not working\n- Photos, witnesses, and reports if available\n\nPossible standard(s):\n\n${formatStandards(input)}`);
}

function handleGsap() {
  const input = value("gsapInput");
  if (!input) return setOutput("gsapOutput", "Type the event in your own words first.");
  const t = input.toLowerCase();
  let eventFocus = "a safety event";
  if (/tug|tractor|vehicle|gse/.test(t) && /aircraft|plane|ac/.test(t)) eventFocus = "ground equipment contacting an aircraft";
  else if (/belt|loader|beltloader|powerstow/.test(t)) eventFocus = "equipment positioning or aircraft servicing risk";
  else if (/wing|wingtip|tow|push/.test(t)) eventFocus = "aircraft movement / wing clearance risk";
  else if (/injury|hurt|strain|fall/.test(t)) eventFocus = "worker injury or near-injury risk";

  setOutput("gsapOutput", `Suggested GSAP / ASAP language\n\nEvent focus: ${eventFocus}\n\nSuggested wording:\nDuring the assigned work activity, a safety event occurred involving: ${input}. I am submitting this report in good faith so the event can be reviewed for contributing factors and prevention opportunities.\n\nKey factors to consider:\n- Task conditions at the time of the event\n- Communication and situational awareness\n- Staffing and workload conditions\n- Equipment condition, positioning, and visibility\n- Environmental conditions such as weather, lighting, surface condition, or ramp congestion\n- Whether the existing process allowed the work to be completed safely\n\nPrevention focus:\nThe goal of this report is to identify what allowed the risk to develop and what controls can help prevent recurrence. This may include process clarification, equipment review, communication improvement, staffing review, or other corrective actions based on the facts of the event.`);
}

function handleInjury() {
  const input = value("injuryInput");
  if (!input) return setOutput("injuryOutput", "Type the injury situation in your own words first.");
  setOutput("injuryOutput", `Suggested injury reporting language\n\nI am reporting a work-related injury/illness concern based on the following facts: ${input}.\n\nSuggested details to include:\n- The specific work task being performed\n- The location and time symptoms or injury occurred\n- The condition that contributed to the injury or illness\n- Symptoms experienced and when they started\n- Who was notified and when\n- Whether medical evaluation, first aid, cooling, rest, or other response was needed\n- Any witnesses or supporting documentation\n\nExample structure:\nWhile performing my assigned work duties, I experienced symptoms/injury connected to the work activity and conditions present at the time. The condition occurred during work, was reported, and should be reviewed as a work-related event based on the facts documented above.\n\nReminder: Use your own words and be accurate. Do not exaggerate or guess. Clearly connect the injury/illness to the work activity, location, timing, and conditions.`);
}

function handlePpe() {
  const input = value("ppeInput");
  if (!input) return setOutput("ppeOutput", "Type the exposure or condition first, such as haboob, construction dust, glycol odor, heat, wet floor, noise, or chemicals.");
  const t = input.toLowerCase();
  const items = [];
  if (/dust|haboob|construction|particulate|sand/.test(t)) items.push("Dust/particulate exposure: evaluate source, duration, ventilation, respiratory protection program requirements, eye protection, and sheltering controls.");
  if (/heat|hot|sun|dehydration/.test(t)) items.push("Heat exposure: water, rest, shade/cooling, acclimatization, monitoring, and workload adjustment should be considered.");
  if (/cold|ice|snow|winter/.test(t)) items.push("Cold exposure: insulated layers, gloves, traction controls, warm-up breaks, and slip prevention should be considered.");
  if (/chemical|glycol|fuel|odor|smell|fume|vapor/.test(t)) items.push("Chemical/odor exposure: review SDS, exposure route, ventilation, splash protection, gloves, eyewash/shower access, and reporting procedure.");
  if (/noise|loud|aircraft|engine|jet/.test(t)) items.push("Noise exposure: hearing protection, noise assessment, and hearing conservation controls may apply.");
  if (/wet|spill|slick|floor/.test(t)) items.push("Wet/slip condition: barricade or isolate area, clean up, document, and correct walking surface exposure.");
  if (/vehicle|tug|gse|equipment|brake|alarm|horn/.test(t)) items.push("Equipment concern: remove unsafe equipment from service, tag/report defect, and verify repair before return to service.");
  if (items.length === 0) items.push("General PPE/exposure review: identify the hazard, exposure route, affected workers, duration, existing controls, and whether PPE or engineering/administrative controls are needed.");
  setOutput("ppeOutput", `Condition entered: ${input}\n\nRecommended review points:\n- ${items.join("\n- ")}\n\nAlso consider:\n- Is there a written procedure or SDS?\n- Are workers trained on the hazard?\n- Is PPE available, correct for the hazard, and being used properly?\n- Are controls needed beyond PPE, such as isolation, ventilation, barricades, rotation, or stopping the task?`);
}

function handleFreeze() {
  setOutput("freezeOutput", `Freeze the Scene Steps\n\n1. Stop work and protect people from immediate danger.\n2. Call emergency response if anyone is hurt or symptoms are serious.\n3. Secure the scene with cones, tape, barricades, or a person posted at the area.\n4. Do not move equipment, tools, ladders, cords, vehicles, or materials unless life safety requires it.\n5. Identify witnesses and separate them when possible.\n6. Take photos: wide view, mid-range, and close-up.\n7. Record time, weather, lighting, staffing, radio status, equipment ID, and who was present.\n8. Preserve defective equipment, PPE, forms, messages, and related records.\n9. Submit the correct safety, injury, GSAP/ASAP, or company report.\n10. Assign follow-up ownership so the issue does not disappear without correction.`);
}

function getSubmissions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function saveSubmissions(rows) { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); }
function addSubmission(row) { const rows = getSubmissions(); rows.push(row); saveSubmissions(rows); }

function escapeCsv(value) {
  const s = String(value ?? "");
  return '"' + s.replace(/"/g, '""') + '"';
}
function downloadCsv(filename, rows) {
  if (!rows.length) { alert("No submissions to export yet."); return; }
  const headers = ["date", "name", "email", "organization", "mailing_list", "message"];
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => escapeCsv(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
function renderAdmin() {
  const admin = new URLSearchParams(window.location.search).get("admin") === "union";
  const panel = $("adminPanel");
  if (!admin || !panel) return;
  panel.classList.remove("hidden");
  const rows = getSubmissions();
  const tbody = document.querySelector("#submissionTable tbody");
  tbody.innerHTML = "";
  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.date}</td><td>${r.name}</td><td>${r.email}</td><td>${r.organization}</td><td>${r.mailing_list}</td><td>${r.message}</td>`;
    tbody.appendChild(tr);
  });
  $("mailingCount").textContent = rows.filter(r => r.mailing_list === "Yes").length;
}

function setupForm() {
  const form = $("contactForm");
  if (!form) return;
  form.addEventListener("submit", () => {
    const row = {
      date: new Date().toLocaleString(),
      name: value("contactName") || "Not provided",
      email: value("contactEmail") || "Not provided",
      organization: value("contactOrg") || "Not provided",
      mailing_list: $("mailingList")?.checked ? "Yes" : "No",
      message: value("contactMessage") || "No message provided"
    };
    $("emailSubject").value = `UnionSafe Tools Submission - ${row.organization} - ${row.name}`;
    addSubmission(row);
    sessionStorage.setItem("unionsafe_thank_you", "true");
  });
  if (new URLSearchParams(window.location.search).get("submitted") === "true" || sessionStorage.getItem("unionsafe_thank_you") === "true") {
    $("thankYou")?.classList.remove("hidden");
    sessionStorage.removeItem("unionsafe_thank_you");
  }
}

function setupAdminButtons() {
  $("exportAll")?.addEventListener("click", () => downloadCsv("unionsafe-all-submissions.csv", getSubmissions()));
  $("exportMailing")?.addEventListener("click", () => downloadCsv("unionsafe-mailing-list.csv", getSubmissions().filter(r => r.mailing_list === "Yes")));
  $("clearTracking")?.addEventListener("click", () => {
    if (confirm("Clear locally saved submissions on this browser/device?")) { saveSubmissions([]); renderAdmin(); }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      if (action === "osha-ref") handleOshaRef();
      if (action === "osha-check") handleOshaCheck();
      if (action === "gsap") handleGsap();
      if (action === "injury") handleInjury();
      if (action === "ppe") handlePpe();
      if (action === "freeze") handleFreeze();
    });
  });
  setupForm();
  setupAdminButtons();
  renderAdmin();
});
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    organization: this.organization.value,
    mailing_list: this.mailing_list.checked ? "Yes" : "No",
    message: this.message.value
  };

  fetch("PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    alert("Thank you! Your submission has been received.");
    this.reset();
  });
});
