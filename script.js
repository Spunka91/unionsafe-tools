function textValue(id){return (document.getElementById(id).value || "").toLowerCase().trim();}
function write(id, text){document.getElementById(id).innerHTML = text;}
function has(t, words){return words.some(w => t.includes(w));}
function esc(s){return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function standardList(t){
  const hits=[];
  if(has(t,["wet","slip","trip","floor","ice","snow","water","oil","slick","mat"])) hits.push("29 CFR 1910 Subpart D — Walking-Working Surfaces / housekeeping and safe walking conditions.");
  if(has(t,["ppe","glove","gloves","eye","face","vest","shoe","boots","respirator","mask","hearing"])) hits.push("29 CFR 1910.132 — PPE hazard assessment and appropriate protective equipment.");
  if(has(t,["noise","loud","hearing","jet engine","apu"])) hits.push("29 CFR 1910.95 — Occupational noise exposure / hearing conservation.");
  if(has(t,["chemical","odor","glycol","fuel","spill","unknown liquid","unknown substance","sds","hazcom"])) hits.push("29 CFR 1910.1200 — Hazard Communication / chemical identification, labels, SDS, and training.");
  if(has(t,["tug","beltloader","forklift","vehicle","brake","horn","backup","alarm","steering","gse","loader"])) hits.push("29 CFR 1910.178 — Powered Industrial Trucks / equipment condition, safe operation, and removing unsafe equipment from service when applicable.");
  if(has(t,["first aid","medical","ambulance","heat illness","injury","symptoms","collapse","dehydration"])) hits.push("29 CFR 1910.151 — Medical services and first aid.");
  if(has(t,["heat","haboob","dust storm","lightning","weather","wind","visibility"])) hits.push("General Duty Clause, Section 5(a)(1) — recognized serious hazards where no specific OSHA standard fully covers the condition.");
  return hits.length?hits:["General Duty Clause, Section 5(a)(1) may apply where a recognized serious hazard exists, plus any specific OSHA standard that fits the hazard after review."];
}
function oshaRefCheck(){
  const t=textValue("oshaRef");
  if(!t){write("oshaRefResult","Type a condition first, such as wet floor, unknown spill, noise, tug brake, heat, or dust.");return;}
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  let note="";
  if(has(t,["unknown spill","unknown liquid","unknown substance","unidentified","mystery liquid","leak"])) note="<br><br><strong>Unknown spill rule:</strong> Do not touch, step in, clean, or move it until the substance is identified and proper response/PPE is confirmed.";
  write("oshaRefResult",`<strong>Possible OSHA reference areas:</strong><br>${standards}${note}<br><br><strong>Plain language:</strong> Use this as a starting point. Verify the exact standard, company policy, SDS, and local procedure before making a final determination.`);
}
function oshaViolationCheck(){
  const t=textValue("oshaViolation");
  if(!t){write("oshaViolationResult","Describe the condition first. Example: wet floor in walkway, unknown liquid, broken tug brake.");return;}
  let severity="Potential safety concern — document, control exposure, and escalate through the proper process.";
  if(has(t,["unknown spill","unknown liquid","chemical","fuel","glycol","odor","leak"])) severity="Potential serious exposure concern — isolate the area, keep employees away, identify the substance, review SDS/procedure, and confirm proper response/PPE before touching or cleaning.";
  if(has(t,["brake","steering","losing power","no horn","backup alarm","tug hit","contacted aircraft","collision","aircraft damage"])) severity="Potential serious equipment/aircraft damage concern — stop use if unsafe, secure the scene, preserve equipment condition, notify supervision/safety, and document equipment ID and conditions.";
  if(has(t,["heat","collapse","dizzy","vomit","confusion","cramps","dehydration"])) severity="Potential heat illness concern — remove from heat, cool down, seek medical evaluation when symptoms are serious, and document work conditions, timing, workload, and controls available.";
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  write("oshaViolationResult",`<strong>Is it an OSHA violation?</strong><br>This tool cannot make a legal final determination, but it does identify a potential safety concern requiring review.<br><br><strong>Field guidance:</strong> ${severity}<br><br><strong>Possible standards/reference areas:</strong><br>${standards}`);
}
function gsapWording(){
  const raw=document.getElementById("gsapText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("gsapResult","Describe the event first. Example: tug contacted aircraft, beltloader contacted door, wingwalker lost sight line.");return;}
  let focus="operational conditions, communication, visibility, equipment condition, task setup, staffing/resource availability, and whether the process allowed the crew to complete the task safely.";
  if(has(t,["tug","aircraft","hit","contact","collision","damage"])) focus="equipment condition, visibility, clearance, guide/wingwalker positioning, communication, ramp congestion, aircraft/GSE spacing, and any conditions that affected safe movement.";
  if(has(t,["wing","wingtip","wingwalker","marshal","spotter","tow","push"])) focus="wingwalker placement, sight lines, communication, clearance, traffic flow, lighting, weather, and whether all team members had a clear ability to stop the movement.";
  if(has(t,["beltloader","door","cargo","bin","powerstow"])) focus="equipment positioning, aircraft clearance, guide marks, communication, door status, surface conditions, and whether the task setup supported safe operation.";
  write("gsapResult",`<strong>Suggested GSAP / safety report language:</strong><br>During the operation, the following safety concern occurred: ${esc(raw)}.<br><br>I am submitting this report in good faith so the event can be reviewed for contributing factors, including ${focus}<br><br><strong>Suggested prevention focus:</strong><br>Review the conditions present at the time, identify any process or communication gaps, verify whether equipment and staffing/resources supported safe completion of the task, and share corrective actions or lessons learned to prevent recurrence.`);
}
function injuryLanguage(){
  const raw=document.getElementById("injuryText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("injuryResult","Describe the injury or symptoms first. Example: heat symptoms after ramp work, slip on wet floor, strain during lift.");return;}
  let details="task being performed, body part affected, time symptoms began, location, witnesses, equipment/materials involved, and any conditions that contributed.";
  if(has(t,["heat","hot","dizzy","cramp","vomit","dehydration","collapse","headache"])) details="temperature/heat conditions, direct sun or hot pavement, workload, PPE worn, access to water/rest/shade/cooling, time symptoms began, symptoms observed, and whether medical evaluation was needed.";
  if(has(t,["slip","trip","fall","wet","ice","floor"])) details="walking surface condition, footwear, lighting, warning signs/cones, substance or obstruction present, photos/witnesses, and the body part affected.";
  if(has(t,["strain","lift","bag","back","shoulder","knee","twist"])) details="object handled, approximate weight if known, body mechanics, staffing/team lift availability, repetitive work, equipment used, and when pain/symptoms began.";
  write("injuryResult",`<strong>Suggested factual injury reporting language:</strong><br>While performing work duties, I experienced the following injury/symptoms: ${esc(raw)}.<br><br>The report should clearly document ${details}<br><br><strong>Important:</strong> Be factual and accurate. Do not exaggerate or guess. Explain what happened, when symptoms began, what task you were doing, and what work conditions may have contributed.`);
}
function ppeCheck(){
  const raw=document.getElementById("ppeText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("ppeResult","Describe the exposure first. Example: haboob, construction dust, unknown liquid, glycol odor, high noise.");return;}
  let guidance=[];
  if(has(t,["unknown spill","unknown liquid","unknown substance","leak","unidentified"])) guidance.push("Do not touch, step in, clean, or move it until the substance is identified and proper response/PPE is confirmed. Isolate the area and escalate through the proper spill/environmental process.");
  if(has(t,["chemical","fuel","glycol","odor","sds","hazcom"])) guidance.push("Review SDS/HazCom information, identify the substance, avoid exposure, and confirm glove/eye/face/respiratory requirements before response.");
  if(has(t,["haboob","dust","construction dust","sand","air quality","aqi"])) guidance.push("Evaluate visibility and respiratory exposure. Consider ramp/operation controls, sheltering, dust reduction, and respiratory protection only under an approved program and fit testing when required.");
  if(has(t,["noise","loud","engine","apu","hearing"])) guidance.push("Use hearing protection where required and report uncontrolled noise exposure concerns.");
  if(has(t,["heat","hot","sun","summer"])) guidance.push("Use heat controls: water, rest, shade/cooling, buddy checks, acclimatization, and symptom monitoring.");
  if(!guidance.length) guidance.push("Identify the hazard, control exposure first, then select PPE based on the task, SDS/policy, and local procedure. PPE is the last line of defense after eliminating or controlling the hazard.");
  write("ppeResult",`<strong>Exposure / PPE guidance for:</strong> ${esc(raw)}<br><br>${guidance.map(x=>"• "+x).join("<br>")}<br><br><strong>Reminder:</strong> Verify with company policy, OSHA, SDS, airport rules, and local procedure.`);
}
function stopWorkCheck(){
  const raw=document.getElementById("stopWorkText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("stopWorkResult","Describe the situation first.");return;}
  let answer="Pause and reassess. If the hazard cannot be controlled immediately, stop the task, notify supervision, and restart only when conditions are safe and the process is clear.";
  if(has(t,["unknown spill","unknown liquid","chemical","fuel","lightning","haboob","no visibility","brake","steering","losing power","no wingwalker","blocked view","aircraft contact"])) answer="STOP WORK / DO NOT PROCEED until the hazard is controlled. Protect people first, notify supervision/safety, document the condition, and restart only after the responsible process confirms it is safe.";
  write("stopWorkResult",`<strong>Stop-work guidance:</strong><br>${answer}<br><br><strong>Use this language:</strong> “I am stopping to verify safe conditions before continuing. I need the hazard controlled or clarified before we proceed.”`);
}
function timePressureCheck(){
  const raw=document.getElementById("timePressureText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("timePressureResult","Describe the time pressure, staffing, or task overlap first.");return;}
  let flags=[];
  if(has(t,["short","staff","coverage","manpower","alone"])) flags.push("staffing/resource gap");
  if(has(t,["rush","rushed","pressure","quick","hurry","late","time"])) flags.push("time pressure");
  if(has(t,["multiple","overlap","two jobs","multitask","same time"])) flags.push("task overlap/multitasking");
  if(has(t,["weather","heat","lightning","wind","dust","haboob"])) flags.push("weather/environmental pressure");
  if(!flags.length) flags.push("possible operational pressure");
  write("timePressureResult",`<strong>Risk factors identified:</strong> ${flags.join(", ")}.<br><br><strong>Guidance:</strong> Time pressure is a known error-producing condition. Reconfirm roles, stop combining critical duties, verify staffing/resources, and do not allow speed to replace required safety steps.<br><br><strong>Report focus:</strong> Describe the condition and how it affected the ability to safely follow procedure.`);
}
function nearMissBuilder(){
  const raw=document.getElementById("nearMissText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("nearMissResult","Describe what almost happened first.");return;}
  let hazard="potential injury, equipment damage, or aircraft damage";
  if(has(t,["wing","aircraft","tug","beltloader","collision","contact"])) hazard="potential aircraft/equipment contact or damage";
  if(has(t,["pedestrian","walked","behind","traffic","vehicle"])) hazard="potential pedestrian/vehicle strike";
  write("nearMissResult",`<strong>Near-miss wording:</strong><br>A near miss occurred when: ${esc(raw)}.<br><br>No injury or damage is being reported from this wording unless confirmed, but the situation created risk of ${hazard}.<br><br><strong>Contributing factors to review:</strong> visibility, communication, spacing, equipment condition, task setup, staffing/resources, weather, lighting, and traffic flow.<br><br><strong>Prevention focus:</strong> Identify what control would prevent the same condition from recurring.`);
}
function reportRoute(){
  const raw=document.getElementById("routeText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("routeResult","Describe the issue first.");return;}
  let routes=[];
  if(has(t,["injury","hurt","pain","medical","ambulance","heat symptoms","collapse"])) routes.push("Injury/medical reporting process immediately; supervisor notification; seek medical evaluation when needed.");
  if(has(t,["aircraft damage","contacted aircraft","hit aircraft","collision","tug hit","wingtip","door damage"])) routes.push("Immediate supervisor/operations notification; freeze/preserve scene; safety/accident reporting; GSAP/ASAP when applicable.");
  if(has(t,["unknown spill","spill","fuel","glycol","chemical","odor","leak"])) routes.push("Environmental/spill response process; keep employees away until identified; review SDS/procedure.");
  if(has(t,["near miss","unsafe","hazard","wet floor","noise","ppe","staffing","time pressure"])) routes.push("Safety concern/JSC process for hazard tracking and corrective action; GSAP/ASAP where the event fits program criteria.");
  if(!routes.length) routes.push("Start with supervisor/safety representative, document the condition, and route through safety concern or GSAP/ASAP if it involves operational safety risk.");
  write("routeResult",`<strong>Suggested reporting route:</strong><br>${routes.map(x=>"• "+x).join("<br>")}<br><br><strong>Close-the-loop reminder:</strong> Ask who owns the corrective action and when follow-up will occur.`);
}

document.addEventListener("DOMContentLoaded", function(){
  const form=document.getElementById("contactForm");
  if(!form) return;
  form.addEventListener("submit", function(){
    alert("Thank you. Your submission is being sent to UnionSafe141.");
  });
});
