function clean(text) {
  return (text || '').trim();
}

function lower(text) {
  return clean(text).toLowerCase();
}

function show(id, text) {
  document.getElementById(id).innerText = text;
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function standardsFor(input) {
  const t = lower(input);
  const items = [];

  if (!t) return [
    'Type the condition or hazard first. Example: wet floor, tug hit aircraft, construction dust, heat exposure, loud equipment, chemical smell.'
  ];

  if (t.includes('wet') || t.includes('slip') || t.includes('trip') || t.includes('fall') || t.includes('floor')) {
    items.push('Walking-working surfaces / housekeeping: 29 CFR 1910 Subpart D, including 1910.22. Review whether walking surfaces were kept clean, orderly, and dry where possible.');
  }
  if (t.includes('tug') || t.includes('tractor') || t.includes('forklift') || t.includes('vehicle') || t.includes('gse') || t.includes('beltloader') || t.includes('cart')) {
    items.push('Powered industrial trucks / equipment safety: 29 CFR 1910.178 may apply depending on equipment type and use. Also review company GSE maintenance, inspection, and out-of-service procedures.');
  }
  if (t.includes('aircraft') || t.includes('contact') || t.includes('hit') || t.includes('strike') || t.includes('collision')) {
    items.push('General Duty Clause: Section 5(a)(1) may be relevant where a recognized serious hazard exists and no specific OSHA standard fully covers the condition. Also review company aircraft movement and ground damage procedures.');
  }
  if (t.includes('ppe') || t.includes('glove') || t.includes('vest') || t.includes('eye') || t.includes('face') || t.includes('shoe') || t.includes('boot')) {
    items.push('Personal protective equipment: 29 CFR 1910.132. Employer hazard assessment, PPE selection, and employee use may be relevant.');
  }
  if (t.includes('noise') || t.includes('hearing') || t.includes('loud')) {
    items.push('Occupational noise: 29 CFR 1910.95. Review noise exposure, hearing protection, and hearing conservation requirements.');
  }
  if (t.includes('chemical') || t.includes('glycol') || t.includes('fuel') || t.includes('odor') || t.includes('smell') || t.includes('sds') || t.includes('spill') || t.includes('unknown substance') || t.includes('unknown liquid')) {
    items.push('Hazard Communication: 29 CFR 1910.1200. Review SDS access, labeling, chemical exposure communication, and training. If the spill or substance is unknown, do not touch, step in, clean, or move it until the substance is identified and the proper response/PPE is confirmed.');
  }
  if (t.includes('dust') || t.includes('haboob') || t.includes('air quality') || t.includes('respirator') || t.includes('mask') || t.includes('n95')) {
    items.push('Respiratory protection may be relevant: 29 CFR 1910.134 if respirators are required. Also review air quality, dust exposure controls, and voluntary vs required respirator use.');
  }
  if (t.includes('heat') || t.includes('hot') || t.includes('dehydration') || t.includes('dizzy') || t.includes('faint') || t.includes('cramp')) {
    items.push('Heat illness is commonly addressed through the General Duty Clause where no federal heat standard applies. Review water, rest, shade/cooling, acclimatization, emergency response, and state/local heat requirements.');
  }
  if (t.includes('first aid') || t.includes('medical') || t.includes('ambulance') || t.includes('injury') || t.includes('illness')) {
    items.push('Medical services and first aid: 29 CFR 1910.151. Review access to first aid, emergency medical response, eyewash/shower where corrosives may be present, and local procedures.');
  }
  if (t.includes('ladder')) {
    items.push('Ladders: 29 CFR 1910.23. Review ladder condition, use, surface, height, footing, and whether the task was appropriate for ladder work.');
  }

  if (items.length === 0) {
    items.push('Possible OSHA review areas: General Duty Clause Section 5(a)(1), PPE 1910.132, walking-working surfaces 1910 Subpart D, and any task-specific standard that matches the hazard. Provide more detail for a closer match.');
  }

  return items;
}

function generateOshaReference() {
  const input = clean(document.getElementById('oshaRefInput').value);
  const standards = standardsFor(input);
  const result = `Concern entered:\n${input || 'No concern entered yet.'}\n\nPossible OSHA reference areas to review:\n- ${standards.join('\n- ')}\n\nPlain-language note:\nThis does not automatically prove a violation. It identifies likely standards or OSHA principles to review based on the words entered.`;
  show('oshaRefOutput', result);
}

function checkOshaViolation() {
  const input = clean(document.getElementById('oshaViolationInput').value);
  if (!input) {
    show('oshaViolationOutput', 'Type the condition first. Example: wet floor near an active walkway, tug with brake issue, construction dust in work area.');
    return;
  }
  const standards = standardsFor(input);
  const result = `Is this an OSHA violation?\n\nIt may be a safety concern that should be documented and reviewed. A final violation determination depends on facts such as employee exposure, employer knowledge, applicable standard, severity, and whether effective controls were in place.\n\nCondition described:\n${input}\n\nLikely standards / reference areas:\n- ${standards.join('\n- ')}\n\nRecommended action:\n1. Protect workers from immediate exposure.\n2. Take photos or notes if safe to do so.\n3. Report through the proper safety concern, injury, GSAP/ASAP, or station process.\n4. Ask who owns the corrective action and when it will be closed.`;
  show('oshaViolationOutput', result);
}

function generateGsapWording() {
  const input = clean(document.getElementById('gsapInput').value);
  if (!input) {
    show('gsapOutput', 'Type what happened first. Example: tug contacted aircraft during repositioning in a congested area.');
    return;
  }
  const t = lower(input);
  let focus = 'contributing factors such as communication, staffing level, task setup, equipment condition, environmental conditions, work area congestion, time pressure, and whether the process supported safe SOP compliance';
  let event = 'the event described';

  if (t.includes('tug') && (t.includes('aircraft') || t.includes('plane'))) {
    event = 'a tug / aircraft contact event';
    focus = 'equipment positioning, clearance, communication, guide/spotter use, visibility, surface conditions, congestion, equipment response, and whether the crew had the support needed to complete the movement safely';
  } else if (t.includes('belt') || t.includes('beltloader')) {
    event = 'a beltloader / aircraft or baggage operation event';
    focus = 'equipment approach, clearance, brake/controls condition, hand signals, positioning, surface conditions, and task coordination';
  } else if (t.includes('wing') || t.includes('tow') || t.includes('push')) {
    event = 'an aircraft movement safety event';
    focus = 'wingwalker/guide positioning, communication, visibility, route clearance, equipment condition, and non-normal movement factors';
  }

  const result = `Suggested GSAP / Safety Report Wording\n\nI am submitting this report in good faith regarding ${event}. The situation was: ${input}.\n\nThis created a safety concern because the conditions present could affect safe task completion and SOP compliance. I am requesting review of ${focus}.\n\nSuggested prevention focus:\n- Identify the contributing factors present at the time of the event.\n- Review whether the task setup allowed the crew to complete the work safely.\n- Determine whether equipment, communication, staffing, environment, or process controls need improvement.\n- Share the lessons learned so the same hazard is less likely to repeat.\n\nReminder: Keep the report factual. Use your own words. Avoid guessing intent or blaming individuals.`;
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
    show('ppeOutput', 'Type the task or exposure first. Example: unknown spill, haboob, construction dust, glycol odor, loud equipment, chemical splash.');
    return;
  }
  const t = lower(input);
  const controls = [];

  if (t.includes('spill') || t.includes('unknown substance') || t.includes('unknown liquid') || t.includes('mystery liquid') || t.includes('leak')) controls.push('Unknown spill/substance: do not touch it, step in it, clean it, move it, or allow others into the area until the substance is identified. Secure the area, notify supervision/safety, request SDS or qualified spill response, and confirm proper PPE before any cleanup.');
  if (t.includes('dust') || t.includes('haboob') || t.includes('air quality')) controls.push('Dust/air quality: reduce exposure, move indoors if needed, evaluate respiratory hazards, use respiratory protection only under the proper program when required.');
  if (t.includes('chemical') || t.includes('glycol') || t.includes('fuel') || t.includes('odor') || t.includes('smell')) controls.push('Chemical/odor: review SDS, identify the substance before contact or cleanup, improve ventilation or isolate source, use gloves/eye protection as required, report persistent odors or symptoms.');
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

function contactBody() {
  const name = clean(document.getElementById('contactName').value) || 'Not provided';
  const email = clean(document.getElementById('contactEmail').value) || 'Not provided';
  const org = clean(document.getElementById('contactOrg').value) || 'Not provided';
  const mail = clean(document.getElementById('mailingList').value) || 'Not provided';
  const msg = clean(document.getElementById('contactMessage').value) || 'No message provided';
  return `UnionSafe Tools Contact Submission\n\nName: ${name}\nEmail: ${email}\nOrganization/Local/Station: ${org}\nWants mailing list: ${mail}\n\nMessage:\n${msg}`;
}

function handleContactSubmit() {
  show('contactOutput', 'Thank you. Your information is being submitted to unionsafe141@gmail.com.');
  setTimeout(() => {
    const form = document.getElementById('contactForm');
    if (form) form.reset();
  }, 1200);
  return true;
}

function copyContactInfo() {
  const body = contactBody();
  copyText(body);
  show('contactOutput', 'Submission copied. Please paste it into an email and send it to unionsafe141@gmail.com.');
}
