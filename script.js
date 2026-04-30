function show(id, text) {
  const el = document.getElementById(id);
  el.innerHTML = `${escapeHtml(text)}\n\n<button class="copy-btn" onclick="copyOutput('${id}')">Copy Text</button>`;
  el.classList.add('show');
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function(match) {
    return ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;'})[match];
  });
}

function copyOutput(id) {
  const el = document.getElementById(id);
  const text = el.innerText.replace('Copy Text', '').trim();
  navigator.clipboard.writeText(text);
}

function normalize(value) {
  return (value || '').toLowerCase();
}

function standardsFor(text) {
  const t = normalize(text);
  const results = [];

  if (t.includes('wet') || t.includes('slip') || t.includes('floor') || t.includes('ice') || t.includes('slick')) {
    results.push('Walking-working surfaces: 29 CFR 1910 Subpart D, including 1910.22 for clean, orderly, sanitary walking-working surfaces.');
  }
  if (t.includes('ppe') || t.includes('glove') || t.includes('eye') || t.includes('face') || t.includes('shoe') || t.includes('vest') || t.includes('respirator') || t.includes('mask')) {
    results.push('PPE: 29 CFR 1910.132 for hazard assessment and required PPE; eye/face protection may involve 1910.133; respiratory protection may involve 1910.134.');
  }
  if (t.includes('forklift') || t.includes('tug') || t.includes('cart') || t.includes('tractor') || t.includes('powered') || t.includes('gse') || t.includes('vehicle')) {
    results.push('Powered industrial trucks / equipment safety: 29 CFR 1910.178 and employer equipment maintenance/tag-out procedures.');
  }
  if (t.includes('noise') || t.includes('hearing') || t.includes('loud') || t.includes('aircraft')) {
    results.push('Occupational noise: 29 CFR 1910.95 for noise exposure and hearing conservation requirements.');
  }
  if (t.includes('chemical') || t.includes('glycol') || t.includes('fuel') || t.includes('odor') || t.includes('sds') || t.includes('spill')) {
    results.push('Hazard Communication: 29 CFR 1910.1200 for chemical hazards, labels, SDS access, and training.');
  }
  if (t.includes('heat') || t.includes('hot') || t.includes('dehydration') || t.includes('sun') || t.includes('haboob')) {
    results.push('Heat hazards are commonly addressed through the OSHA General Duty Clause when no specific federal heat standard applies, plus applicable state/company heat procedures.');
  }
  if (t.includes('dust') || t.includes('construction') || t.includes('haboob') || t.includes('air quality') || t.includes('aqi')) {
    results.push('Airborne exposure may involve hazard assessment, respiratory protection if required by program, HazCom if chemical exposure is present, and the General Duty Clause depending on conditions.');
  }
  if (t.includes('first aid') || t.includes('medical') || t.includes('ambulance') || t.includes('injury')) {
    results.push('Medical and First Aid: 29 CFR 1910.151 requires adequate first aid and medical response availability.');
  }
  if (t.includes('exit') || t.includes('blocked') || t.includes('fire') || t.includes('egress')) {
    results.push('Exit routes / emergency egress: 29 CFR 1910 Subpart E, including exit access remaining free and unobstructed.');
  }

  if (results.length === 0) {
    results.push('Possible reference: OSHA General Duty Clause, Section 5(a)(1), if there is a recognized serious hazard and feasible means of correction. More detail is needed to identify a specific standard.');
    results.push('Also review applicable company policy, airport rules, manufacturer instructions, SDS, and local procedures.');
  }
  return results;
}

function generateOshaReference() {
  const input = document.getElementById('oshaRefInput').value.trim();
  const topic = input || 'No topic entered';
  const standards = standardsFor(topic);
  const text = `OSHA Reference Lookup\n\nTopic entered: ${topic}\n\nPossible standards or references:\n- ${standards.join('\n- ')}\n\nPlain-language reminder:\nThis is a reference guide, not a final legal determination. Use the standard number as a starting point and verify the official OSHA text, company policy, and local procedure.`;
  show('oshaRefOutput', text);
}

function generateViolationCheck() {
  const input = document.getElementById('violationInput').value.trim();
  const concern = input || 'No concern entered';
  const standards = standardsFor(concern);
  const text = `Is This an OSHA Violation?\n\nConcern described: ${concern}\n\nField answer:\nThis may be a safety concern that should be documented and reviewed. Whether it is an OSHA violation depends on employee exposure, employer knowledge, applicable standard, hazard seriousness, and whether feasible corrective action exists.\n\nPossible standard(s):\n- ${standards.join('\n- ')}\n\nQuestions to document:\n1. Who was exposed or could be exposed?\n2. How long has the condition existed?\n3. Was supervision or management aware?\n4. What control was missing or not working?\n5. Was there a prior report, injury, near miss, or repeat concern?\n6. What immediate correction is needed to protect workers?`;
  show('violationOutput', text);
}

function generateGsapWording() {
  const input = document.getElementById('gsapInput').value.trim();
  const description = input || 'Describe the event or safety concern in your own words.';
  const text = `Suggested GSAP / Safety Report Verbiage\n\nSubmitted concern:\n${description}\n\nSuggested wording:\nI am submitting this report in good faith because the condition described created a safety risk during the operation. The concern involved the work environment, available resources, task sequencing, communication, equipment condition, or other contributing factors that affected the crew’s ability to complete the task safely and consistently with procedure.\n\nThis report is intended to identify contributing factors, improve the process, and prevent recurrence. I am requesting review of the conditions present at the time, including staffing levels, workload, equipment availability, communication, weather, surface conditions, training, and whether the procedure could be followed safely under the circumstances.\n\nSuggested corrective focus:\n- Identify the contributing factors.\n- Determine whether the procedure was realistic under the conditions.\n- Provide coaching, training, equipment correction, or process improvement as appropriate.\n- Share lessons learned with frontline employees.`;
  show('gsapOutput', text);
}

function generateInjuryWording() {
  const input = document.getElementById('injuryInput').value.trim();
  const description = input || 'Describe the work task, exposure, symptoms, and reporting timeline in your own words.';
  const text = `Suggested Injury Reporting Language\n\nYour description:\n${description}\n\nSuggested wording:\nWhile performing my assigned work duties, I experienced symptoms/injury connected to the work activity, work environment, or exposure described above. The condition occurred during the course of my work and was related to the task, location, physical demands, environmental conditions, equipment, or exposure present at the time.\n\nImportant details to include in your own words:\n1. The exact task you were performing.\n2. The location and time symptoms or injury began.\n3. The work condition or exposure involved, such as heat, lifting, repetitive motion, slip/trip hazard, chemical odor, dust, equipment, noise, or weather.\n4. The symptoms you experienced and when they started.\n5. Who you notified and when.\n6. Whether medical care, first aid, removal from exposure, cooling, hydration, or emergency response was needed.\n\nReminder:\nReport facts clearly and promptly. Do not guess. Do not minimize symptoms. This tool does not guarantee workers’ compensation acceptance; it helps you explain the work connection clearly.`;
  show('injuryOutput', text);
}

function generatePpeGuidance() {
  const input = document.getElementById('ppeInput').value.trim();
  const condition = input || 'No condition entered';
  const t = normalize(condition);
  const items = [];

  items.push('Has a hazard assessment been completed for this task or condition?');
  items.push('What body part could be exposed: eyes, lungs, skin, hands, feet, hearing, head, or whole body?');

  if (t.includes('dust') || t.includes('haboob') || t.includes('construction') || t.includes('air')) {
    items.push('Is airborne dust present, and is respiratory protection required through a proper respiratory protection program and fit testing?');
    items.push('Are workers able to shelter, relocate, or reduce exposure when visibility or air quality is poor?');
  }
  if (t.includes('chemical') || t.includes('glycol') || t.includes('fuel') || t.includes('odor') || t.includes('spill')) {
    items.push('Has the SDS been reviewed, and are splash, glove, ventilation, and spill-response controls available?');
  }
  if (t.includes('noise') || t.includes('aircraft') || t.includes('loud')) {
    items.push('Is hearing protection required based on noise exposure or local policy?');
  }
  if (t.includes('heat') || t.includes('hot') || t.includes('sun')) {
    items.push('Are water, rest, shade/cooling, acclimatization, and symptom monitoring in place?');
  }
  if (t.includes('cold') || t.includes('ice') || t.includes('rain') || t.includes('wet')) {
    items.push('Are slip-resistant footwear, weather gear, traction controls, and warm-up/dry areas needed?');
  }
  if (t.includes('sharp') || t.includes('metal') || t.includes('cut')) {
    items.push('Are cut-resistant or task-appropriate gloves needed?');
  }

  items.push('If PPE is required, is it available, correct size, maintained, and actually being used?');
  items.push('If PPE alone is not enough, what engineering, administrative, staffing, or stop-work controls are needed?');

  const text = `PPE / Exposure Control Questions\n\nCondition entered: ${condition}\n\nQuestions to ask:\n- ${items.join('\n- ')}\n\nPossible OSHA references:\n- ${standardsFor(condition).join('\n- ')}\n\nReminder: PPE is the last line of defense. Eliminate or control the hazard first when possible.`;
  show('ppeOutput', text);
}

function generateHeatCheck() {
  const temp = Number(document.getElementById('tempInput').value);
  const humidity = Number(document.getElementById('humidityInput').value);
  const workload = document.getElementById('workloadInput').value;

  if (!temp || !humidity) {
    show('heatOutput', 'Please enter both temperature and humidity.');
    return;
  }

  let hi = -42.379 + 2.04901523 * temp + 10.14333127 * humidity - 0.22475541 * temp * humidity - 0.00683783 * temp * temp - 0.05481717 * humidity * humidity + 0.00122874 * temp * temp * humidity + 0.00085282 * temp * humidity * humidity - 0.00000199 * temp * temp * humidity * humidity;
  hi = Math.round(hi);
  let adjusted = hi;
  if (workload === 'moderate') adjusted += 4;
  if (workload === 'heavy') adjusted += 8;

  let guidance = 'Lower flag: continue hydration, routine breaks, and symptom awareness.';
  if (adjusted >= 95) guidance = 'Caution: use water, rest, shade/cooling, buddy checks, and supervision monitoring. Increase breaks for direct sun or heavy work.';
  if (adjusted >= 105) guidance = 'High risk: increase cool-down breaks, rotate tasks, closely monitor symptoms, and consider stopping or modifying work if controls are not effective.';

  const text = `Heat Stress Field Check\n\nTemperature: ${temp}°F\nHumidity: ${humidity}%\nEstimated heat index: ${hi}°F\nWorkload: ${workload}\n\nRecommendation:\n${guidance}\n\nDocument conditions such as direct sun, hot pavement, PPE, poor airflow, overtime, staffing, acclimatization, and any symptoms reported.`;
  show('heatOutput', text);
}

function generateFreezeScene() {
  const text = `Freeze the Scene Checklist\n\n1. Stop work and protect people from immediate danger.\n2. Call emergency response if needed.\n3. Secure the area with cones, tape, barricades, or a person posted at the scene.\n4. Do not move tools, equipment, ladders, cords, vehicles, chocks, or materials unless life safety requires it.\n5. Identify witnesses and separate them if possible.\n6. Take photos: wide view, middle view, close-up view.\n7. Record time, weather, lighting, staffing, radio status, equipment ID, and who was present.\n8. Preserve defective equipment, PPE, forms, messages, and training records.\n9. Submit the proper injury, safety concern, GSAP/ASAP, or company report.\n10. Assign ownership and follow-up so the corrective action is not lost.`;
  show('freezeOutput', text);
}

function submitContact() {
  const name = document.getElementById('contactName').value || 'Not provided';
  const email = document.getElementById('contactEmail').value || 'Not provided';
  const org = document.getElementById('contactOrg').value || 'Not provided';
  const mailing = document.getElementById('mailingList').checked ? 'Yes' : 'No';
  const message = document.getElementById('contactMessage').value || 'No message provided';

  const subject = encodeURIComponent('UnionSafe141 Safety Tools Submission');
  const body = encodeURIComponent(`UnionSafe141 Safety Tools Submission\n\nName: ${name}\nEmail: ${email}\nOrganization / Local / Station: ${org}\nWants to be on mailing list: ${mailing}\n\nMessage:\n${message}`);
  window.location.href = `mailto:unionsafe141@gmail.com?subject=${subject}&body=${body}`;

  show('contactOutput', 'Thank you. Your information has been prepared in an email to unionsafe141@gmail.com. Please send the email from your mail app to complete the submission.');
}
