const oshaStandards = {
  "Personal Protective Equipment (PPE)": {
    standard: "29 CFR 1910.132",
    plain: "Employers must assess workplace hazards and provide appropriate PPE when hazards are present or likely to be present.",
    action: "Document the hazard, what PPE is needed, whether PPE was available, and whether workers were trained to use it."
  },
  "Powered Industrial Trucks / Equipment": {
    standard: "29 CFR 1910.178",
    plain: "Powered industrial trucks must be operated safely, maintained properly, and removed from service when unsafe.",
    action: "Document the equipment ID, defect, exposure, prior reports, and whether the equipment was tagged out or returned to service."
  },
  "Noise / Hearing Protection": {
    standard: "29 CFR 1910.95",
    plain: "Employers must protect workers from harmful noise exposure and use hearing conservation controls when exposure levels require it.",
    action: "Document noise source, duration, hearing protection availability, training, and whether exposure monitoring exists."
  },
  "Hazard Communication / Chemicals": {
    standard: "29 CFR 1910.1200",
    plain: "Workers must be informed and trained on chemical hazards, labels, SDS information, and protective measures.",
    action: "Document the chemical, odor/exposure concern, SDS access, labeling, training, and any symptoms or complaints."
  },
  "Medical and First Aid": {
    standard: "29 CFR 1910.151",
    plain: "Employers must ensure medical and first aid availability suitable for the workplace and exposure risks.",
    action: "Document injury/illness response, delays, availability of first aid, eyewash/shower access where needed, and emergency response."
  },
  "General Unsafe Condition": {
    standard: "General Duty Clause, 29 USC 654(a)(1)",
    plain: "Employers must provide a workplace free from recognized serious hazards likely to cause death or serious physical harm.",
    action: "Document the recognized hazard, worker exposure, injury potential, prior knowledge, and feasible controls."
  }
};

const ppeByJob = {
  "Ramp Agent / Fleet Service": [
    "High-visibility vest or reflective outerwear",
    "Safety shoes / protective footwear",
    "Hearing protection near aircraft, GSE, or loud areas",
    "Task-appropriate gloves",
    "Eye protection when exposed to splash, dust, debris, chemicals, or pressurized systems",
    "Weather PPE when needed: rain gear, cooling PPE, or cold-weather gear"
  ],
  "Bagroom / Baggage Sortation": [
    "Safety shoes",
    "Gloves for baggage handling",
    "Hearing protection where required",
    "Ergonomic controls: mats, rotation, team lifts, and belt-height awareness",
    "High-visibility gear if exposed to ramp traffic"
  ],
  "Lavatory / Potable Water Service": [
    "High-visibility vest",
    "Safety shoes",
    "Chemical-resistant gloves",
    "Eye or face protection where splash is possible",
    "Hand-washing and sanitation supplies",
    "Spill-response materials"
  ],
  "GSE / Equipment Support": [
    "High-visibility vest",
    "Safety shoes",
    "Cut-resistant or task-appropriate gloves",
    "Eye protection",
    "Hearing protection near aircraft or loud equipment",
    "Out-of-service / tag-out process when equipment is unsafe"
  ]
};

const freezeSteps = [
  "Stop work and protect people from immediate danger.",
  "Call emergency response if anyone is hurt or symptoms are serious.",
  "Secure the area with cones, tape, barricades, or a person posted at the scene.",
  "Do not move equipment, tools, ladders, cords, vehicles, or materials unless life safety requires it.",
  "Identify witnesses and separate them when possible before stories blend together.",
  "Take photos: wide view, middle view, and close-up view.",
  "Write down time, weather, lighting, staffing, radio status, equipment ID, and who was present.",
  "Preserve defective equipment, PPE, forms, messages, and training records.",
  "Submit the correct safety, injury, GSAP/ASAP, or company report.",
  "Assign follow-up ownership so the issue does not disappear without correction."
];

let freezeChecked = [];

function populateSelects() {
  const topicSelect = document.getElementById("oshaTopic");
  const hazardSelect = document.getElementById("hazardType");
  const ppeSelect = document.getElementById("ppeJob");

  Object.keys(oshaStandards).forEach(topic => {
    topicSelect.add(new Option(topic, topic));
    hazardSelect.add(new Option(topic, topic));
  });

  Object.keys(ppeByJob).forEach(job => ppeSelect.add(new Option(job, job)));
  showOshaReference();
  generatePpe();
  renderFreezeChecklist();
  calculateHeat();
  generateReport();
}

function showOshaReference() {
  const topic = document.getElementById("oshaTopic").value;
  const item = oshaStandards[topic];
  document.getElementById("oshaReferenceResult").innerHTML = `<strong>Standard:</strong> ${item.standard}\n\n<strong>Plain-language meaning:</strong> ${item.plain}\n\n<strong>Documentation focus:</strong> ${item.action}\n\nReminder: This is a simplified reference. Verify the official OSHA standard and your company/local procedure.`;
}

document.addEventListener("change", (e) => {
  if (e.target && e.target.id === "oshaTopic") showOshaReference();
});

function runOshaCheck() {
  const topic = document.getElementById("hazardType").value;
  const standard = oshaStandards[topic];
  const exposed = document.getElementById("employeesExposed").checked;
  const control = document.getElementById("controlMissing").checked;
  const repeat = document.getElementById("repeatIssue").checked;
  const injury = document.getElementById("injuryPotential").checked;

  let score = 0;
  if (exposed) score += 30;
  if (control) score += 30;
  if (repeat) score += 20;
  if (injury) score += 20;

  let decision = "Lower concern — verify and monitor.";
  if (score >= 75) decision = "Possible OSHA-related concern — document and escalate.";
  else if (score >= 45) decision = "Moderate concern — correct, document, and follow up.";

  const text = `<strong>Question:</strong> Is this an OSHA violation?\n\n<strong>Practical answer:</strong> This tool cannot make a legal violation determination, but based on your answers this appears to be: ${decision}\n\n<strong>Possible standard:</strong> ${standard.standard}\n\n<strong>Why this standard may apply:</strong> ${standard.plain}\n\n<strong>What to document:</strong> ${standard.action}\n\n<strong>Next steps:</strong> Protect employees, notify the correct safety/management channel, document the condition, submit the proper report, and follow up until corrected.`;

  document.getElementById("oshaCheckResult").innerHTML = text;
}

function generateReport() {
  const task = document.getElementById("reportTask").value;
  const issue = document.getElementById("reportIssue").value;
  const hazard = document.getElementById("reportHazard").value;
  const outcome = document.getElementById("reportOutcome").value;
  const text = `Suggested Safety Report Wording\n\nDuring ${task}, ${issue}. This created a safety concern because ${hazard}. The outcome was: ${outcome}.\n\nI am reporting this in good faith so the event can be reviewed for contributing factors, including staffing, time pressure, task overlap, communication, weather, delays, equipment availability, and whether the current process gives the crew enough time and resources to follow SOP without shortcuts.\n\nSuggested corrective focus:\n1. Review staffing and task assignment.\n2. Verify whether SOP steps were realistic under the conditions.\n3. Identify whether additional training, manpower, equipment, or process change is needed.\n4. Share lessons learned back to frontline workers.`;
  document.getElementById("reportResult").textContent = text;
}

function generatePpe() {
  const job = document.getElementById("ppeJob").value;
  const list = [...ppeByJob[job]];
  if (document.getElementById("ppeHeat").checked) list.push("Cooling PPE, water access, shade/cool-down access, and heat illness monitoring");
  if (document.getElementById("ppeCold").checked) list.push("Cold-weather gloves, insulated layers, traction awareness, and warm-up breaks");
  if (document.getElementById("ppeChemical").checked) list.push("Chemical-specific SDS review and splash protection");
  if (document.getElementById("ppeDust").checked) list.push("Dust exposure evaluation; respiratory protection only through a proper program and fit testing");
  document.getElementById("ppeResult").textContent = `Recommended PPE / controls:\n\n${list.map((item, i) => `${i + 1}. ${item}`).join("\n")}\n\nVerify final requirements with company policy, OSHA standards, SDS, airport rules, and local procedures.`;
}

function calculateHeat() {
  const T = Number(document.getElementById("heatTemp").value);
  const R = Number(document.getElementById("heatHumidity").value);
  const workload = document.getElementById("heatWorkload").value;
  const hi = Math.round(-42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R - 0.00683783*T*T - 0.05481717*R*R + 0.00122874*T*T*R + 0.00085282*T*R*R - 0.00000199*T*T*R*R);
  let adjusted = hi;
  if (workload === "Moderate") adjusted += 4;
  if (workload === "Heavy") adjusted += 8;
  let guidance = "Lower Flag — Continue hydration, routine breaks, and symptom awareness. Conditions can change quickly.";
  if (adjusted >= 105) guidance = "High Risk — Increase cool-down breaks, rotate workers, monitor symptoms, provide shade/cooling, and consider stopping or modifying work if controls are not effective.";
  else if (adjusted >= 95) guidance = "Caution — Use water, rest, shade, acclimatization, buddy checks, and supervisor monitoring. Increase breaks for heavy work or direct sun.";
  document.getElementById("heatResult").textContent = `Estimated Heat Index: ${hi}°F\nWorkload: ${workload}\n\nRecommendation: ${guidance}\n\nConsider direct sun, hot pavement, aircraft heat, PPE, poor airflow, overtime, staffing shortages, and acclimatization.`;
}

function renderFreezeChecklist() {
  const box = document.getElementById("freezeChecklist");
  box.innerHTML = "";
  freezeSteps.forEach((step, index) => {
    const btn = document.createElement("button");
    btn.className = "freeze-step" + (freezeChecked.includes(index) ? " done" : "");
    btn.textContent = `${freezeChecked.includes(index) ? "✓" : "○"} Step ${index + 1}: ${step}`;
    btn.onclick = () => toggleFreeze(index);
    box.appendChild(btn);
  });
  document.getElementById("freezeResult").textContent = `Completed ${freezeChecked.length} of ${freezeSteps.length} steps.`;
}

function toggleFreeze(index) {
  if (freezeChecked.includes(index)) freezeChecked = freezeChecked.filter(i => i !== index);
  else freezeChecked.push(index);
  renderFreezeChecklist();
}

function resetFreezeChecklist() {
  freezeChecked = [];
  renderFreezeChecklist();
}

function submitInterest() {
  const name = document.getElementById("contactName").value || "Not provided";
  const email = document.getElementById("contactEmail").value || "Not provided";
  const org = document.getElementById("contactOrg").value || "Not provided";
  const message = document.getElementById("contactMessage").value || "Not provided";

  const subject = encodeURIComponent("UnionSafe141 Safety Tools Interest Submission");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nOrganization: ${org}\nMessage: ${message}`);
  window.location.href = `mailto:unionsafe141@gmail.com?subject=${subject}&body=${body}`;

  document.getElementById("contactThankYou").textContent = "Thank you. Your email client should open with the information ready to send to unionsafe141@gmail.com.";
}

window.onload = populateSelects;
