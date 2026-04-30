function clean(v){return (v||'').trim();}
function lower(v){return clean(v).toLowerCase();}
function setOutput(id,text){document.getElementById(id).textContent=text;}
function includesAny(t, words){return words.some(w=>t.includes(w));}

const standards = [
  {keys:['ppe','glove','gloves','vest','eye','face shield','hard hat','respirator','n95','mask'], standard:'29 CFR 1910.132 - Personal Protective Equipment', meaning:'Employer must assess workplace hazards and provide/use appropriate PPE where hazards are present.'},
  {keys:['tug','tractor','forklift','vehicle','gse','brake','horn','backup','alarm','seatbelt','towbar','beltloader','powerstow'], standard:'29 CFR 1910.178 - Powered Industrial Trucks / Industrial Vehicle Safety', meaning:'Equipment used in the workplace must be operated and maintained safely. Unsafe equipment should be removed from service until corrected.'},
  {keys:['noise','hearing','loud','jet blast','aircraft running','apu'], standard:'29 CFR 1910.95 - Occupational Noise Exposure', meaning:'Noise exposure must be evaluated and controlled where levels may create hearing risk.'},
  {keys:['chemical','glycol','fuel','odor','smell','spill','hazcom','sds','battery','acid'], standard:'29 CFR 1910.1200 - Hazard Communication', meaning:'Workers must have chemical hazard information, labeling, SDS access, and training.'},
  {keys:['first aid','medical','ambulance','injury','heat illness','dizzy','nausea','collapse','cramp'], standard:'29 CFR 1910.151 - Medical Services and First Aid', meaning:'Employers must ensure medical/first-aid response is reasonably available for workplace injuries or illnesses.'},
  {keys:['wet floor','slip','trip','fall','ice','water','slick','oil','grease'], standard:'29 CFR 1910.22 - Walking-Working Surfaces', meaning:'Walking-working surfaces must be kept clean, orderly, and sanitary. Hazards such as wet or slippery surfaces require attention.'},
  {keys:['ladder','platform','stairs','step'], standard:'29 CFR 1910 Subpart D - Walking-Working Surfaces', meaning:'Walking-working surfaces, ladders, stairs, and elevated work areas must be maintained and used safely.'},
  {keys:['heat','hot','temperature','sun','dehydration','haboob','dust storm'], standard:'General Duty Clause, Section 5(a)(1) of the OSH Act', meaning:'Where no specific OSHA standard applies, recognized serious hazards must still be addressed with feasible controls.'},
  {keys:['dust','construction dust','haboob','sand','air quality','respiratory'], standard:'29 CFR 1910.134 - Respiratory Protection / General Duty Clause', meaning:'Respiratory hazards require evaluation. Respirators require a proper program, medical clearance, training, and fit testing when required.'}
];

function matchStandard(text){
  const t=lower(text);
  let matches=standards.filter(s=>includesAny(t,s.keys));
  if(matches.length===0){
    matches=[{standard:'Possible General Duty Clause / applicable OSHA standard review needed', meaning:'The condition may still require correction if it exposes workers to a recognized hazard. Review the task, exposure, controls, and applicable OSHA/company procedures.'}];
  }
  return matches.slice(0,3);
}

function generateOshaReference(){
  const input=clean(document.getElementById('oshaRefInput').value);
  if(!input){setOutput('oshaRefOutput','Type a concern first, such as wet floor, tug hit aircraft, heat, dust, noise, chemical odor, or PPE.');return;}
  const matches=matchStandard(input);
  const text=`Concern entered: ${input}\n\nLikely OSHA reference(s) to review:\n${matches.map((m,i)=>`${i+1}. ${m.standard}\n   Plain meaning: ${m.meaning}`).join('\n\n')}\n\nField reminder: Use this as a starting point. Verify the exact requirement through OSHA, company policy, airport rules, and local procedures.`;
  setOutput('oshaRefOutput',text);
}

function checkOshaViolation(){
  const input=clean(document.getElementById('oshaViolationInput').value);
  if(!input){setOutput('oshaViolationOutput','Type the condition first. Example: wet floor with no warning signs, inoperative tug horn, chemical odor in work area.');return;}
  const matches=matchStandard(input);
  const direct = `Concern entered: ${input}\n\nIs this an OSHA violation?\nIt may be a safety concern that requires review. A final OSHA violation determination depends on facts such as employee exposure, employer knowledge, hazard recognition, severity, and whether an effective control was in place.\n\nPossible standard(s) to review:\n${matches.map((m,i)=>`${i+1}. ${m.standard}\n   Why it may apply: ${m.meaning}`).join('\n\n')}\n\nWhat to document:\n- What happened or what condition exists\n- Who was exposed or could be exposed\n- Where and when it occurred\n- Whether controls, barricades, PPE, training, or equipment were missing or ineffective\n- Photos, witnesses, equipment ID, and prior reports if available`;
  setOutput('oshaViolationOutput', direct);
}

function gsapScenarioGuidance(t){
  if(includesAny(t,['tug','aircraft','hit aircraft','contact aircraft','struck aircraft','towbar'])){
    return 'Direct event focus: aircraft contact involving tug/GSE. Capture equipment ID, aircraft position, guide/wingwalker communication, stop points, lighting, surface conditions, congestion, task assignment, and whether the crew had clear, realistic conditions to follow SOP.';
  }
  if(includesAny(t,['beltloader','door','cargo door','airbus','powerstow'])){
    return 'Direct event focus: aircraft door or beltloader/GSE positioning. Capture equipment approach, clearance, guide communication, stop point, aircraft configuration, lighting, and any condition that affected visibility or positioning.';
  }
  if(includesAny(t,['wing','wingtip','pushback','taxi','tow'])){
    return 'Direct event focus: aircraft movement / clearance. Capture wingwalker placement, communication method, stop command process, route, ramp congestion, lighting, markings, and any non-normal condition.';
  }
  return 'Direct event focus: describe the task, condition, exposure, contributing factors, and prevention steps using only what you personally know or observed.';
}

function generateGsapWording(){
  const input=clean(document.getElementById('gsapInput').value);
  if(!input){setOutput('gsapOutput','Type the event first. Example: tug contacted aircraft during repositioning.');return;}
  const t=lower(input);
  const focus=gsapScenarioGuidance(t);
  const text=`Suggested GSAP / Safety Concern Verbiage\n\nEvent described: ${input}\n\n${focus}\n\nSuggested wording:\nDuring the operation, a safety event occurred involving the condition described above. I am submitting this report in good faith so the event can be reviewed for contributing factors and prevention opportunities.\n\nRelevant factors to review may include: task assignment, communication, equipment condition, visibility, lighting, ramp congestion, surface condition, staffing levels, training, procedure clarity, and whether the crew had the time and resources needed to complete the task safely.\n\nSuggested prevention focus:\n- Review the sequence of events and communication points\n- Confirm whether all required safety steps were practical under the conditions\n- Identify any equipment, staffing, training, or process gaps\n- Share lessons learned so the event does not repeat\n\nReminder: Keep the report truthful, factual, and in your own words. Do not guess or assign blame.`;
  setOutput('gsapOutput',text);
}

function generateInjuryWording(){
  const input=clean(document.getElementById('injuryInput').value);
  if(!input){setOutput('injuryOutput','Type the injury or symptoms first. Example: while working outside in high heat, I became dizzy and nauseated.');return;}
  const t=lower(input);
  let specific='';
  if(includesAny(t,['heat','hot','dizzy','nausea','cramp','dehydration','sun'])){
    specific='Heat-related focus: Include temperature if known, direct sun, workload, PPE, hydration access, rest/cool-down access, symptoms, when symptoms started, who was notified, and whether medical evaluation was needed.';
  } else if(includesAny(t,['slip','trip','fall','wet','ice','slick'])){
    specific='Slip/trip/fall focus: Include surface condition, footwear, lighting, warning signs, what task you were performing, body part affected, and witnesses.';
  } else if(includesAny(t,['dust','chemical','smell','odor','glycol','fuel'])){
    specific='Exposure focus: Include what you smelled/saw, duration, location, symptoms, ventilation, PPE, who was notified, and whether others experienced symptoms.';
  } else {
    specific='General injury focus: Include the work task, body part affected, symptoms, time/location, what changed in your condition, witnesses, and who you notified.';
  }
  const text=`Suggested Injury Reporting Language\n\nSituation described: ${input}\n\n${specific}\n\nSuggested wording:\nWhile performing my assigned work duties, I experienced the condition/symptoms described above. The symptoms occurred during or after the work activity and were connected to the work environment or task conditions as described.\n\nFacts to include in your own words:\n- Exact task being performed\n- Date, time, and location\n- Body part or symptoms involved\n- What work condition contributed to the injury or illness\n- Who was notified and when\n- Witnesses, photos, equipment ID, weather, exposure, or medical response if applicable\n\nImportant: Report truthfully and accurately. This tool helps organize facts; it should not be used to exaggerate, hide information, or make unsupported claims.`;
  setOutput('injuryOutput',text);
}

function generatePpeGuidance(){
  const input=clean(document.getElementById('ppeInput').value);
  if(!input){setOutput('ppeOutput','Type any exposure or condition first: haboob, construction dust, wet ramp, chemical odor, heat, cold, noise, etc.');return;}
  const t=lower(input);
  let guidance=[];
  if(includesAny(t,['haboob','dust','sand','construction dust','air quality'])) guidance.push('Dust/air quality: evaluate exposure, reduce time in affected area when possible, use sheltering controls, and only use respiratory protection through a proper respiratory program when required.');
  if(includesAny(t,['chemical','smell','odor','glycol','fuel','spill','battery'])) guidance.push('Chemical/odor: review SDS, notify proper response personnel, avoid unknown exposure, use splash protection/gloves if required, and document symptoms or odor location.');
  if(includesAny(t,['wet','rain','slick','ice','snow'])) guidance.push('Slip hazard: use traction awareness, barricades/signage, housekeeping, proper footwear, and report surface hazards immediately.');
  if(includesAny(t,['heat','hot','sun'])) guidance.push('Heat: water, rest, shade/cooling, acclimatization, buddy checks, and symptom monitoring.');
  if(includesAny(t,['cold','freezing','wind'])) guidance.push('Cold: insulated layers, gloves, warm-up breaks, traction awareness, and monitoring for cold stress symptoms.');
  if(includesAny(t,['noise','loud','aircraft','apu','jet'])) guidance.push('Noise: use hearing protection where required and report areas where noise exposure may exceed safe levels.');
  if(includesAny(t,['ppe','glove','vest','eye','face','respirator','mask'])) guidance.push('PPE: verify task-specific PPE through hazard assessment, policy, SDS, and local procedure.');
  if(guidance.length===0) guidance.push('General guidance: identify the hazard, exposure route, affected workers, existing controls, missing controls, PPE needs, and who should own the corrective action.');
  const text=`PPE / Exposure Guidance\n\nCondition entered: ${input}\n\n${guidance.map((g,i)=>`${i+1}. ${g}`).join('\n')}\n\nSuggested documentation:\n- What condition exists\n- Who is exposed and how\n- Current controls or missing controls\n- PPE being used or needed\n- Photos, location, time, weather, and supervisor notification\n\nReminder: Respirators require proper evaluation, training, medical clearance, and fit testing when required.`;
  setOutput('ppeOutput',text);
}

function generateHeatGuidance(){
 const input=clean(document.getElementById('heatInput').value);
 if(!input){setOutput('heatOutput','Type heat conditions or symptoms first.');return;}
 const text=`Heat Safety Guidance\n\nCondition entered: ${input}\n\nRecommended response language:\nHeat-related conditions were present during the work activity. The concern should be reviewed for access to water, rest, shade/cooling, workload, staffing, direct sun, pavement heat, PPE, acclimatization, and symptom monitoring.\n\nIf symptoms are present, document dizziness, nausea, cramping, confusion, weakness, collapse, headache, heavy sweating, lack of sweating, or any medical response.\n\nAction focus:\n- Remove affected worker from heat exposure\n- Cool down and hydrate if safe to do so\n- Notify supervision and seek medical response when symptoms are serious\n- Document conditions and follow injury/reporting process`;
 setOutput('heatOutput',text);
}

function buildFeedbackText(){
 const name=clean(document.getElementById('contactName').value)||'Not provided';
 const email=clean(document.getElementById('contactEmail').value)||'Not provided';
 const org=clean(document.getElementById('contactOrg').value)||'Not provided';
 const mailing=clean(document.getElementById('mailingList').value)||'Not answered';
 const msg=clean(document.getElementById('contactMessage').value)||'No message provided';
 return `UnionSafe Tools Submission\n\nName: ${name}\nEmail: ${email}\nOrganization / Local / Station: ${org}\nMailing list: ${mailing}\n\nMessage:\n${msg}`;
}
function submitFeedback(){
 const body=encodeURIComponent(buildFeedbackText());
 const subject=encodeURIComponent('UnionSafe Tools Feedback / Interest Form');
 window.location.href=`mailto:unionsafe141@gmail.com?subject=${subject}&body=${body}`;
 setOutput('contactOutput','Thank you. Your email app should open with the message prepared. Please press SEND in your email app to complete the submission. If it does not open, use the Copy Submission button and email it to unionsafe141@gmail.com.');
}
async function copyFeedback(){
 const text=buildFeedbackText();
 try{await navigator.clipboard.writeText(text);setOutput('contactOutput','Submission copied. Paste it into an email and send it to unionsafe141@gmail.com.');}
 catch(e){setOutput('contactOutput',text);}
}
