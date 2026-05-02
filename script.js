const STORAGE_KEY = 'unionsafe_submissions_v1';

function clean(text) {
  return (text || '').trim();
}

function lower(text) {
  return clean(text).toLowerCase();
}

function show(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function standardsFor(input) {
  const t = lower(input);
  const items = [];

  if (!t) return ['Type the condition or hazard first. Example: wet floor, tug contact, chemical smell, construction dust, heat, noise.'];
  if (t.includes('wet') || t.includes('slip') || t.includes('trip') || t.includes('floor') || t.includes('ice')) {
    items.push('Walking-Working Surfaces — 29 CFR 1910 Subpart D, including housekeeping/surface condition concerns.');
  }
  if (t.includes('tug') || t.includes('vehicle') || t.includes('forklift') || t.includes('tractor') || t.includes('beltloader') || t.includes('belt loader') || t.includes('equipment')) {
    items.push('Powered Industrial Trucks / equipment safety — 29 CFR 1910.178 where applicable, plus employer equipment maintenance and safe-use procedures.');
  }
  if (t.includes('ppe') || t.includes('glove') || t.includes('eye') || t.includes('vest') || t.includes('shoe') || t.includes('respirator') || t.includes('mask')) {
    items.push('Personal Protective Equipment — 29 CFR 1910.132; Eye/Face Protection — 1910.133; Respiratory Protection — 1910.134 where respirators are required.');
  }
  if (t.includes('noise') || t.includes('loud') || t.includes('hearing')) {
    items.push('Occupational Noise Exposure — 29 CFR 1910.95.');
  }
  if (t.includes('chemical') || t.includes('glycol') || t.includes('fuel') || t.includes('odor') || t.includes('smell') || t.includes('spill')) {
    items.push('Hazard Communication — 29 CFR 1910.1200; Emergency eyewash/shower or first aid review may also apply depending on exposure.');
  }
  if (t.includes('heat') || t.includes('hot') || t.includes('haboob') || t.includes('dust') || t.includes('air quality') || t.includes('smoke')) {
    items.push('General Duty Clause — Section 5(a)(1) of the OSH Act may apply when a recognized serious hazard is not covered by a specific standard. Also review PPE, respiratory, and heat illness prevention controls.');
  }
  if (t.includes('first aid') || t.includes('medical') || t.includes('injury') || t.includes('ambulance')) {
    items.push('Medical Services and First Aid — 29 CFR 1910.151.');
  }
  if (items.length === 0) {
    items.push('General Duty Clause — Section 5(a)(1) of the OSH Act may be a starting point for recognized hazards not addressed by a specific standard.');
    items.push('Also review PPE — 29 CFR 1910.132 and any task-specific OSHA/company/airport requirements.');
  }
  return items;
}

function generateOshaReference() {
  const input = clean(document.getElementById('oshaRefInput').value);
  const standards = standardsFor(input);
  const result = `OSHA Reference Guidance\n\nConcern entered:\n${input || '[No concern entered]'}\n\nLikely OSHA reference areas to review:\n- ${standards.join('\n- ')}\n\nPlain-language note:\nThis does not automatically mean a violation exists. It identifies the standards or OSHA areas that may be relevant so the concern can be reviewed correctly.`;
  show('oshaRefOutput', result);
}

function checkOshaViolation() {
  const input = clean(document.getElementById('oshaViolationInput').value);
  if (!input) {
    show('oshaViolationOutput', 'Type the condition first. Example: wet floor near walkway, tug contacted aircraft, construction dust in work area.');
    return;
  }
  const standards = standardsFor(input);
  const result = `Is This an OSHA Violation?\n\nPossible concern: YES — this may be a safety concern that should be documented and reviewed.\n\nCondition described:\n${input}\n\nPossible standards / reference areas:\n- ${standards.join('\n- ')}\n\nWhat determines whether it becomes an OSHA violation:\n- Was there employee exposure?\n- Did the employer know, or should they have known?\n- Was there a recognized hazard?\n- Was there an applicable standard or General Duty Clause issue?\n- Were effective controls missing or not working?\n\nRecommended action:\n1. Protect workers from immediate exposure.\n2. Take photos or notes if safe to do so.\n3. Report through the proper safety concern, injury, GSAP/ASAP, or station process.\n4. Ask who owns the corrective action and when it will be closed.`;
  show('oshaViolationOutput', result);
}

function generateGsapWording() {
  const input = clean(document.getElementById('gsapInput').value);
  if (!input) {
    show('gsapOutput', 'Type what happened first. Example: tug contacted aircraft during repositioning in a congested area.');
    return;
  }
  const t = lower(input);
  let event = 'the event described';
  let focus = 'communication, task setup, equipment condition, environmental conditions, work area congestion, available resources, and whether the process supported safe SOP compliance';

  if (t.includes('tug') && (t.includes('aircraft') || t.includes('plane'))) {
    event = 'a tug / aircraft contact event';
    focus = 'equipment positioning, clearance, communication, guide/spotter use, visibility, surface conditions, congestion, equipment response, and whether the operation was set up for safe movement';
  } else if (t.includes('belt') || t.includes('beltloader') || t.includes('belt loader')) {
    event = 'a beltloader / aircraft or baggage operation event';
    focus = 'equipment approach, clearance, brake/controls condition, hand signals, positioning, surface conditions, and task coordination';
  } else if (t.includes('wing') || t.includes('tow') || t.includes('push')) {
    event = 'an aircraft movement safety event';
    focus = 'wingwalker/guide positioning, communication, visibility, route clearance, equipment condition, and non-normal movement factors';
  } else if (t.includes('chock') || t.includes('cone')) {
    event = 'a ramp setup / aircraft protection event';
    focus = 'placement, visibility, communication, procedure clarity, and whether the work area was controlled before the task continued';
  }

  const result = `Suggested GSAP / Safety Report Wording\n\nI am submitting this report in good faith regarding ${event}. The situation was: ${input}.\n\nThis created a safety concern because the conditions present could affect safe task completion and SOP compliance. I am requesting review of ${focus}.\n\nSuggested prevention focus:\n- Identify the contributing factors present at the time of the event.\n- Review whether the task setup allowed the crew to complete the work safely.\n- Determine whether equipment, communication, environment, or process controls need improvement.\n- Share lessons learned so the same hazard is less likely to repeat.\n\nReminder: Keep the report factual. Use your own words. Avoid guessing intent or blaming individuals.`;
  show('gsapOutput', result);
}

function generateInjuryWording() {
  const input = clean(document.getElementById('injuryInput').value);
  if (!input) {
    show('injuryOutput', 'Type the injury, symptoms, task, or exposure first. Example: heat symptoms after working outside in direct sun.');
    return;
  }
  const t = lower(input);
  let specific = 'work task, exposure, body part affected, symptoms, time symptoms started, who was notified, and what medical treatment or first aid was needed';
  if (t.includes('heat') || t.includes('hot') || t.includes('dehyd') || t.includes('dizzy') || t.includes('cramp')) {
    specific = 'temperature/heat conditions, direct sun or hot surface exposure, workload, PPE/clothing, water/rest access, symptoms, when symptoms began, who was notified, and whether medical care was requested';
  }
  if (t.includes('slip') || t.includes('fall') || t.includes('trip')) {
    specific = 'surface condition, footwear, lighting, walking path, object/liquid involved, body part affected, symptoms, witnesses, and whether the condition was reported before';
  }

  const result = `Suggested Injury Reporting Language\n\nUse your own words and include clear work-related facts. Based on what you entered:\n${input}\n\nSuggested wording structure:\nWhile performing my assigned work duties, I experienced the following injury/symptoms: [describe symptoms/body part]. The condition occurred during or after the following work activity/exposure: [describe task/exposure].\n\nImportant facts to include:\n- ${specific}.\n- What you were doing immediately before symptoms or injury occurred.\n- Whether the condition worsened during the shift.\n- Who you notified and when.\n- Any first aid, medical evaluation, ambulance, clinic, or hospital care.\n\nReminder: Be accurate and factual. Do not downplay symptoms. Do not guess a medical diagnosis if you do not know it.`;
  show('injuryOutput', result);
}

function generatePpeGuidance() {
  const input = clean(document.getElementById('ppeInput').value);
  if (!input) {
    show('ppeOutput', 'Type the task or exposure first. Example: haboob, construction dust, glycol odor, loud equipment, chemical splash.');
    return;
  }
  const t = lower(input);
  const controls = [];

  if (t.includes('dust') || t.includes('haboob') || t.includes('air quality') || t.includes('smoke')) controls.push('Dust/air quality: reduce exposure, move indoors if needed, evaluate respiratory hazards, use respiratory protection only under the proper program when required.');
  if (t.includes('chemical') || t.includes('glycol') || t.includes('fuel') || t.includes('odor') || t.includes('smell')) controls.push('Chemical/odor: review SDS, improve ventilation or isolate source, use gloves/eye protection as required, report persistent odors or symptoms.');
  if (t.includes('noise') || t.includes('loud')) controls.push('Noise: use hearing protection where required and review noise exposure/hearing conservation controls.');
  if (t.includes('heat') || t.includes('hot')) controls.push('Heat: water, rest, shade/cooling, rotation, acclimatization, buddy checks, and symptom monitoring.');
  if (t.includes('cold') || t.includes('ice') || t.includes('snow')) controls.push('Cold/ice: insulated layers, gloves, traction controls, warm-up breaks, and slip prevention.');
  if (t.includes('sharp') || t.includes('cut')) controls.push('Cuts/sharp edges: cut-resistant gloves, inspection, guarding, and safe handling.');
  if (t.includes('splash') || t.includes('eye') || t.includes('face')) controls.push('Splash/eye exposure: safety glasses, goggles, face shield, and eyewash access where required.');

  if (controls.length === 0) controls.push('General PPE review: hazard assessment, task-appropriate gloves, eye/face protection, footwear, hi-vis gear, hearing protection, and exposure controls based on the actual condition.');

  const result = `PPE / Exposure Guidance\n\nCondition entered:\n${input}\n\nPossible controls to consider:\n- ${controls.join('\n- ')}\n\nReminder: Final PPE requirements should be verified through company policy, SDS, OSHA standards, airport rules, and local procedures.`;
  show('ppeOutput', result);
}

function generateHeatGuidance() {
  const input = clean(document.getElementById('heatInput').value);
  if (!input) {
    show('heatOutput', 'Type heat conditions or symptoms first. Example: 98 degrees, direct sun, worker dizzy.');
    return;
  }
  const result = `Heat Risk Support\n\nCondition entered:\n${input}\n\nRecommended actions:\n- Move affected worker to a cooler/shaded area when symptoms appear.\n- Provide water and allow recovery time.\n- Monitor for dizziness, confusion, weakness, cramps, nausea, headache, or fainting.\n- Escalate for medical response when symptoms are serious, worsening, or do not improve.\n- Review staffing, workload, direct sun, pavement heat, PPE/clothing, overtime, and acclimatization.\n\nReporting note:\nDocument the work conditions, task, heat exposure, symptoms, timing, who was notified, and any medical care requested.`;
  show('heatOutput', result);
}

function generateFreezeGuide() {
  const result = `Freeze the Scene Steps\n\n1. Stop work and protect people from immediate danger.\n2. Call emergency response if anyone is injured or symptoms are serious.\n3. Secure the area with cones, tape, barricades, or a person posted at the scene.\n4. Do not move tools, equipment, vehicles, cords, ladders, chocks, or materials unless life safety requires it.\n5. Identify witnesses and separate them when possible.\n6. Take photos: wide view, mid-range view, and close-up view.\n7. Record time, weather, lighting, staffing, radio status, equipment ID, and who was present.\n8. Preserve defective equipment, PPE, forms, messages, and related records.\n9. Submit the correct safety, injury, GSAP/ASAP, or company report.\n10. Assign follow-up ownership so the issue is corrected and closed.`;
  show('freezeOutput', result);
}

function getSubmissions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}

function saveSubmission(record) {
  const records = getSubmissions();
  records.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  renderSubmissionTable();
}

function contactRecord() {
  return {
    date: new Date().toLocaleString(),
    name: clean(document.getElementById('contactName').value) || 'Not provided',
    email: clean(document.getElementById('contactEmail').value) || 'Not provided',
    organization: clean(document.getElementById('contactOrg').value) || 'Not provided',
    mailingList: document.getElementById('mailingList').checked ? 'Yes' : 'No',
    message: clean(document.getElementById('contactMessage').value) || 'No message provided'
  };
}

function contactBody() {
  const r = contactRecord();
  return `UnionSafe Tools Contact Submission\n\nDate: ${r.date}\nName: ${r.name}\nEmail: ${r.email}\nOrganization/Local/Station: ${r.organization}\nWants mailing list: ${r.mailingList}\n\nMessage:\n${r.message}`;
}

function handleContactSubmit() {
  const r = contactRecord();
  const subject = `UnionSafe Tools Submission - ${r.organization} - ${r.name}`;
  const subjectField = document.getElementById('emailSubject');
  if (subjectField) subjectField.value = subject;

  saveSubmission(r);
  show('contactOutput', 'Thank you. Your information was submitted and saved to this device tracking table. You should receive a copy through the UnionSafe141 form email system.');

  setTimeout(() => {
    const form = document.getElementById('contactForm');
    if (form) form.reset();
  }, 1000);
  return true;
}

function copyContactInfo() {
  const body = contactBody();
  copyText(body);
  show('contactOutput', 'Submission copied. Please paste it into an email and send it to unionsafe141@gmail.com.');
}

function csvEscape(value) {
  return '"' + String(value ?? '').replaceAll('"', '""') + '"';
}

function recordsToCsv(records) {
  const headers = ['Date', 'Name', 'Email', 'Organization', 'Mailing List', 'Message'];
  const rows = records.map(r => [r.date, r.name, r.email, r.organization, r.mailingList, r.message]);
  return [headers, ...rows].map(row => row.map(csvEscape).join(',')).join('\n');
}

function downloadCsv(filename, csvText) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadSubmissionsCsv() {
  const records = getSubmissions();
  if (!records.length) {
    alert('No local submissions to export yet.');
    return;
  }
  downloadCsv('unionsafe-submissions.csv', recordsToCsv(records));
}

function downloadMailingListCsv() {
  const records = getSubmissions().filter(r => r.mailingList === 'Yes');
  if (!records.length) {
    alert('No mailing list records to export yet.');
    return;
  }
  const unique = [];
  const seen = new Set();
  for (const r of records) {
    const key = (r.email || '').toLowerCase();
    if (key && key !== 'not provided' && !seen.has(key)) {
      unique.push(r);
      seen.add(key);
    }
  }
  downloadCsv('unionsafe-mailing-list.csv', recordsToCsv(unique.length ? unique : records));
}

function clearLocalSubmissions() {
  if (!confirm('Clear locally stored submission tracking on this device? This will not delete emails already received.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderSubmissionTable();
}

function renderSubmissionTable() {
  const records = getSubmissions();
  const body = document.getElementById('submissionTableBody');
  const total = document.getElementById('totalSubmissions');
  const mailing = document.getElementById('mailingCount');

  if (total) total.innerText = records.length;
  if (mailing) mailing.innerText = records.filter(r => r.mailingList === 'Yes').length;

  if (!body) return;
  body.innerHTML = '';

  if (!records.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.innerText = 'No submissions tracked on this device yet.';
    tr.appendChild(td);
    body.appendChild(tr);
    return;
  }

  for (const r of records) {
    const tr = document.createElement('tr');
    [r.date, r.name, r.email, r.organization, r.mailingList, r.message].forEach(value => {
      const td = document.createElement('td');
      td.innerText = value || '';
      tr.appendChild(td);
    });
    body.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSubmissionTable();
  if (new URLSearchParams(window.location.search).get('submitted') === 'true') {
    show('contactOutput', 'Thank you. Your submission was received.');
  }
});
