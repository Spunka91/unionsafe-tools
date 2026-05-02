function textValue(id){return (document.getElementById(id).value || "").toLowerCase().trim();}
function write(id, text){document.getElementById(id).innerHTML = text;}
function has(t, words){return words.some(w => t.includes(w));}
function esc(s){return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

function standardList(t){
  const hits=[];

  if(has(t,["broken ladder","ladder","missing rung","rung","step ladder","extension ladder","damaged ladder","unstable ladder"])) {
    hits.push("29 CFR 1910.23 — Ladders: ladder surfaces, rungs, steps, side rails, use, and condition. A broken/damaged ladder should be removed from service until corrected.");
  }
  if(has(t,["wet","slip","trip","floor","ice","snow","water","oil","slick","mat","walkway","aisle","housekeeping","cord","obstruction","hole","pothole"])) {
    hits.push("29 CFR 1910.22 — Walking-Working Surfaces: surfaces must be kept clean, orderly, sanitary, and in safe condition.");
  }
  if(has(t,["fall protection","open edge","platform","guardrail","floor opening","hole","mezzanine"])) {
    hits.push("29 CFR 1910.28 / 1910.29 — Duty to have fall protection and fall protection systems criteria.");
  }
  if(has(t,["ppe","glove","gloves","eye","face","vest","shoe","boots","hard hat","safety glasses","goggles","face shield"])){ 
    hits.push("29 CFR 1910.132 — Personal Protective Equipment: hazard assessment, selection, use, and maintenance of PPE.");
  }
  if(has(t,["respirator","mask","n95","p95","dust mask","breathing protection","airborne"])){ 
    hits.push("29 CFR 1910.134 — Respiratory Protection: respirator program, medical evaluation, fit testing, and proper use when respirators are required.");
  }
  if(has(t,["noise","loud","hearing","jet engine","apu","ear plugs","earmuffs"])) {
    hits.push("29 CFR 1910.95 — Occupational Noise Exposure: noise controls, monitoring, hearing conservation, and hearing protection requirements.");
  }
  if(has(t,["chemical","odor","glycol","fuel","spill","unknown liquid","unknown substance","sds","hazcom","label","unlabeled","solvent","cleaner","leak"])) {
    hits.push("29 CFR 1910.1200 — Hazard Communication: chemical identification, labels, SDS access, employee information, and training.");
  }
  if(has(t,["unknown spill","unknown liquid","unknown substance","unidentified spill","mystery liquid"])) {
    hits.push("29 CFR 1910.1200 plus applicable spill/emergency procedures — unknown substances must be identified before cleanup or contact.");
  }
  if(has(t,["tug","beltloader","belt loader","forklift","vehicle","brake","horn","backup","alarm","steering","gse","loader","powered industrial truck","pit"])){ 
    hits.push("29 CFR 1910.178 — Powered Industrial Trucks: equipment condition, safe operation, training, inspection, and removing unsafe equipment from service when applicable.");
  }
  if(has(t,["first aid","medical","ambulance","injury","symptoms","collapse","blood","bleeding","cut","heat illness","dehydration"])) {
    hits.push("29 CFR 1910.151 — Medical Services and First Aid: medical assistance/first aid availability and emergency response expectations.");
  }
  if(has(t,["electrical","extension cord","cord","plug","frayed","outlet","breaker","shock","exposed wire"])){ 
    hits.push("29 CFR 1910.303 / 1910.305 — Electrical: safe installation/use of electrical equipment, wiring methods, cords, and guarding against electrical hazards.");
  }
  if(has(t,["heat","hot","heat index","sun","summer","heat stress","heat illness","dizzy","cramp","vomit","dehydration"])){ 
    hits.push("General Duty Clause, OSH Act Section 5(a)(1) — Heat illness prevention is commonly addressed as a recognized hazard when no single federal heat standard applies; also verify state/local heat rules and company heat plan.");
  }
  if(has(t,["haboob","dust storm","lightning","weather","wind","visibility","severe weather"])){ 
    hits.push("General Duty Clause, OSH Act Section 5(a)(1) — severe weather/visibility hazards may require protective action when they create recognized serious hazards; verify company/airport weather procedures.");
  }

  return hits.length ? hits : ["No exact match found. Start with the General Duty Clause, OSH Act Section 5(a)(1), then verify whether a specific 29 CFR 1910 standard applies based on the hazard details."];
}

function oshaRefCheck(){
  const t=textValue("oshaRef");
  if(!t){write("oshaRefResult","Type a condition first, such as broken ladder, wet floor, unknown spill, tug brake, heat, noise, dust, or electrical cord.");return;}
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  let note="";
  if(has(t,["unknown spill","unknown liquid","unknown substance","unidentified","mystery liquid","leak"])) note="<br><br><strong>Unknown spill rule:</strong> Do not touch, step in, clean, or move it until the substance is identified and proper response/PPE is confirmed.";
  write("oshaRefResult",`<strong>Likely OSHA reference area(s):</strong><br>${standards}${note}<br><br><strong>Plain language:</strong> The more specific the hazard, the more specific the standard. For example, heat is usually reviewed under the General Duty Clause, while a broken ladder points to 29 CFR 1910.23. Always verify the final standard, company policy, SDS, and local procedure.`);
}

function oshaViolationCheck(){
  const t=textValue("oshaViolation");
  if(!t){write("oshaViolationResult","Describe the condition first. Example: broken ladder, wet floor in walkway, unknown liquid, tug brake not working, heat symptoms.");return;}
  let severity="Potential safety concern — document the condition, protect employees from exposure, and escalate through the proper process.";
  if(has(t,["broken ladder","ladder","missing rung","damaged ladder","unstable ladder"])) severity="Potential ladder safety concern — remove the ladder from service, prevent use, document the defect, and report for correction before anyone climbs it.";
  if(has(t,["unknown spill","unknown liquid","chemical","fuel","glycol","odor","leak"])) severity="Potential exposure concern — isolate the area, keep employees away, identify the substance, review SDS/procedure, and confirm proper response/PPE before touching or cleaning.";
  if(has(t,["brake","steering","losing power","no horn","backup alarm","tug hit","contacted aircraft","collision","aircraft damage"])) severity="Potential serious equipment/aircraft damage concern — stop use if unsafe, secure the scene, preserve equipment condition, notify supervision/safety, and document equipment ID and conditions.";
  if(has(t,["heat","collapse","dizzy","vomit","confusion","cramps","dehydration"])) severity="Potential heat illness concern — remove from heat, cool down, seek medical evaluation when symptoms are serious, and document work conditions, timing, workload, and controls available.";
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  write("oshaViolationResult",`<strong>Is it an OSHA violation?</strong><br>This tool cannot make a legal final determination, but it can identify whether the condition may fit a specific OSHA standard or recognized hazard.<br><br><strong>Field guidance:</strong> ${severity}<br><br><strong>Likely standard/reference area:</strong><br>${standards}<br><br><strong>Best next step:</strong> Control exposure first, document the condition, and verify the exact standard with OSHA/company policy/local procedure.`);
}

function gsapWording(){
  const raw=document.getElementById("gsapText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("gsapResult","Describe the event first. Example: tug contacted aircraft, beltloader contacted door, wingwalker lost sight line.");return;}
  let focus="operational conditions, communication, visibility, equipment condition, task setup, staffing/resource availability, and whether the process allowed the crew to complete the task safely.";
  let specific=[];
  if(has(t,["tug","tractor","aircraft","hit","contact","collision","damage","tail","nose","towbar"])){ 
    focus="equipment condition, visibility, clearance, guide/wingwalker positioning, communication, ramp congestion, aircraft/GSE spacing, and any conditions that affected safe movement.";
    specific.push("equipment asset number / GSE ID, tug type, aircraft tail number or fleet number, gate/spot, movement direction, approximate speed, and point of contact");
    specific.push("names/titles of managers, crew chiefs, leads, or supervisors notified, time notification was made, and whether the scene/equipment was preserved");
  }
  if(has(t,["wing","wingtip","wingwalker","marshal","spotter","tow","push","pushback"])){ 
    focus="wingwalker placement, sight lines, headset/hand-signal communication, clearance, traffic flow, lighting, weather, and whether all team members had a clear ability to stop the movement.";
    specific.push("wingwalker/guide positions, who had headset communication, whether sight lines were blocked, and any roadway/ramp traffic conflicts");
  }
  if(has(t,["beltloader","belt loader","door","cargo","bin","powerstow","loader"])){ 
    focus="equipment positioning, aircraft clearance, guide marks, communication, door status, surface conditions, and whether the task setup supported safe operation.";
    specific.push("beltloader or powerstow asset number, aircraft tail number, door/bin involved, equipment height/position, and whether a spotter/guide was used");
  }
  if(has(t,["staff","short","coverage","alone","manpower","rushed","pressure","time","multiple","overlap"])){ 
    specific.push("staffing level, assignments, task overlap, operational pressure, and whether the crew had enough people/resources to complete required steps safely");
  }
  if(has(t,["weather","rain","snow","ice","heat","lightning","wind","haboob","dust","visibility"])){ 
    specific.push("weather/visibility conditions, surface condition, ramp closures or alerts, and any PPE or operational controls available");
  }
  if(has(t,["radio","headset","communication","could not hear","confusion","instruction"])){ 
    specific.push("communication method used, radio/headset condition, instructions given, who gave them, and where the breakdown occurred");
  }
  if(!specific.length){
    specific.push("date/time, exact location, flight/gate if known, aircraft number if applicable, equipment asset numbers if involved, names/titles of people notified, witnesses, photos, weather/lighting, and what was happening immediately before and after the event");
  }
  const detailList=specific.map(x=>"• "+x).join("<br>");
  write("gsapResult",`<strong>Suggested GSAP / ASAP / safety report language:</strong><br>During the operation, the following safety concern occurred: ${esc(raw)}.<br><br>I am submitting this report in good faith so the event can be reviewed for contributing factors, including ${focus}<br><br><strong>Information to include when available:</strong><br>${detailList}<br><br><strong>Important reporting reminder:</strong><br>Put as much factual information in the report as possible. Include equipment asset numbers, aircraft/tail numbers, gate or location, manager/crew chief/lead/supervisor names, witness names, times, weather/lighting, photos if available, and any immediate actions taken. If you do not know something, write “unknown” rather than guessing.<br><br><strong>Proactive reporting reminder:</strong><br>File proactive reports through the GSAP/ASAP program when the event identifies an operational safety risk, near miss, procedure concern, communication gap, equipment concern, or condition that could lead to injury, damage, or recurrence.<br><br><strong>Suggested prevention focus:</strong><br>Review the conditions present at the time, identify any process or communication gaps, verify whether equipment and staffing/resources supported safe completion of the task, and share corrective actions or lessons learned to prevent recurrence.`);
}

function injuryLanguage(){
  const raw=document.getElementById("injuryText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("injuryResult","Describe the injury or symptoms first. Example: heat symptoms after ramp work, slip on wet floor, strain during lift.");return;}
  let details="the exact work task being performed, body part affected, time symptoms began, exact location, witnesses, equipment/materials involved, what changed in your condition, and any work conditions that contributed.";
  if(has(t,["heat","hot","dizzy","cramp","vomit","dehydration","collapse","headache","nausea","confusion"])){ details="the ramp/work area temperature or heat conditions, direct sun/hot pavement, workload, PPE worn, access to water/rest/shade/cooling, timing of symptoms, symptoms observed, who was notified, and whether medical evaluation was needed."; }
  if(has(t,["slip","trip","fall","wet","ice","floor"])){ details="the walking surface condition, substance or object involved, footwear, lighting, warning signs/cones, photos/witnesses, exact location, and the body part affected."; }
  if(has(t,["strain","lift","bag","back","shoulder","knee","twist","pull"])){ details="the task being performed, object handled, approximate weight if known, repetitive work, body movement involved, staffing/team lift availability, equipment used, and when pain/symptoms began."; }
  write("injuryResult",`<strong>Suggested factual injury reporting language:</strong><br>While performing assigned work duties, I experienced the following injury/symptoms: ${esc(raw)}.<br><br>The report should clearly document ${details}<br><br><strong>To reduce confusion or disputes:</strong><br>State what work task you were doing, where you were, when symptoms or injury occurred, who you notified, whether witnesses were present, and what work condition contributed. Use clear factual wording like “while performing my assigned work task...” and avoid guessing, minimizing, or leaving out key work-related details.<br><br><strong>Important:</strong> Be truthful, accurate, and complete. This tool does not guarantee workers’ compensation acceptance, but complete factual reporting helps the claim be reviewed with the correct work-related information.`);
}

function ppeCheck(){
  const raw=document.getElementById("ppeText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("ppeResult","Describe the exposure first. Example: haboob, construction dust, unknown liquid, glycol odor, high noise.");return;}
  let guidance=[];
  if(has(t,["unknown spill","unknown liquid","unknown substance","leak","unidentified","mystery liquid"])) guidance.push("Do not touch, step in, clean, or move it until the substance is identified and proper response/PPE is confirmed. Isolate the area and escalate through the proper spill/environmental process.");
  if(has(t,["chemical","fuel","glycol","odor","sds","hazcom"])) guidance.push("Review SDS/HazCom information, identify the substance, avoid exposure, and confirm glove/eye/face/respiratory requirements before response.");
  if(has(t,["haboob","dust","construction dust","sand","air quality","aqi"])) guidance.push("Evaluate visibility and respiratory exposure. Consider ramp/operation controls, sheltering, dust reduction, and respiratory protection only under an approved program and fit testing when required.");
  if(has(t,["noise","loud","engine","apu","hearing"])) guidance.push("Use hearing protection where required and report uncontrolled noise exposure concerns.");
  if(has(t,["heat","hot","sun","summer"])) guidance.push("Use heat controls: water, rest, shade/cooling, buddy checks, acclimatization, and symptom monitoring.");
  if(has(t,["cold","ice","snow","winter","freezing"])) guidance.push("Use cold-weather PPE, traction awareness, warm-up breaks, and controls for slippery surfaces.");
  if(!guidance.length) guidance.push("Identify the hazard, control exposure first, then select PPE based on the task, SDS/policy, and local procedure. PPE is the last line of defense after eliminating or controlling the hazard.");
  write("ppeResult",`<strong>Exposure / PPE guidance for:</strong> ${esc(raw)}<br><br>${guidance.map(x=>"• "+x).join("<br>")}<br><br><strong>Reminder:</strong> Verify with company policy, OSHA, SDS, airport rules, and local procedure.`);
}

function stopWorkCheck(){
  const raw=document.getElementById("stopWorkText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("stopWorkResult","Describe the situation first.");return;}
  let answer="Use STOP: Stop, Think, Observe, and Proceed only after the hazard is understood and controlled. Pause, reassess, notify the crew chief/supervisor/safety rep as needed, and restart only when conditions are safe and the process is clear.";
  if(has(t,["unknown spill","unknown liquid","chemical","fuel","lightning","haboob","no visibility","brake","steering","losing power","no wingwalker","blocked view","aircraft contact","injury","accident"])){ answer="STOP WORK / DO NOT PROCEED. Use STOP: Stop, Think, Observe, and Proceed only after the hazard is controlled. Protect people first, notify the crew chief/supervisor/safety rep, document the condition, and restart only after the responsible process confirms it is safe."; }
  write("stopWorkResult",`<strong>Stop-work guidance:</strong><br>${answer}<br><br><strong>Use this language:</strong> “I am using STOP — Stop, Think, Observe, and Proceed. I am stopping to verify safe conditions before continuing.”`);
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
  write("timePressureResult",`<strong>Risk factors identified:</strong> ${flags.join(", ")}.<br><br><strong>Guidance:</strong> Time pressure is a known error-producing condition. Reconfirm roles, stop combining critical duties, verify staffing/resources, and do not allow speed to replace required safety steps.<br><br><strong>AYR reminder:</strong> Make sure all proper AYR protocols are completed before performing the task. If the crew is not ready, stop and reset before proceeding.<br><br><strong>Proactive reporting:</strong> File proactive reports through the GSAP/ASAP program when time pressure, staffing/resource gaps, task overlap, or operational conditions create a safety risk or make it difficult to complete required steps safely.`);
}

function nearMissBuilder(){
  const raw=document.getElementById("nearMissText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("nearMissResult","Describe what almost happened first.");return;}
  let hazard="potential injury, equipment damage, or aircraft damage";
  if(has(t,["wing","aircraft","tug","beltloader","collision","contact"])) hazard="potential aircraft/equipment contact or damage";
  if(has(t,["pedestrian","walked","behind","traffic","vehicle"])) hazard="potential pedestrian/vehicle strike";
  write("nearMissResult",`<strong>Near-miss wording:</strong><br>A near miss occurred when: ${esc(raw)}.<br><br>No injury or damage is being reported from this wording unless confirmed, but the situation created risk of ${hazard}.<br><br><strong>Contributing factors to review:</strong> visibility, communication, spacing, equipment condition, task setup, staffing/resources, weather, lighting, traffic flow, and whether AYR/STOP checks were fully completed.<br><br><strong>Prevention focus:</strong> Identify what control would prevent the same condition from recurring. Consider filing a proactive GSAP/ASAP report when it involves operational safety risk.`);
}

function reportRoute(){
  const raw=document.getElementById("routeText").value.trim(); const t=raw.toLowerCase();
  if(!raw){write("routeResult","Describe the issue first.");return;}
  let routes=[];
  routes.push("Notify the appropriate safety rep, crew chief, and/or supervisor based on immediacy and severity.");
  if(has(t,["injury","hurt","pain","medical","ambulance","heat symptoms","collapse"])) routes.push("Use the injury/medical reporting process immediately and seek medical evaluation when needed.");
  if(has(t,["aircraft damage","contacted aircraft","hit aircraft","collision","tug hit","wingtip","door damage","accident"])) routes.push("If an accident or aircraft/equipment damage occurs, always freeze the scene, preserve evidence, notify supervision/safety, and follow accident reporting procedures.");
  if(has(t,["unknown spill","spill","fuel","glycol","chemical","odor","leak"])) routes.push("Use the environmental/spill response process. Keep employees away until the substance is identified and response/PPE is confirmed.");
  if(has(t,["near miss","unsafe","hazard","wet floor","noise","ppe","staffing","time pressure","communication","procedure"])) routes.push("Use the safety concern/JSC process for hazard tracking and corrective action. File proactive reports through GSAP/ASAP when the issue involves operational safety risk.");
  if(routes.length===1) routes.push("If unsure, start with the safety rep/crew chief/supervisor, document the condition, and route through safety concern or GSAP/ASAP if it involves operational safety risk.");
  write("routeResult",`<strong>Suggested reporting route:</strong><br>${routes.map(x=>"• "+x).join("<br>")}<br><br><strong>Close-the-loop reminder:</strong> Ask who owns the corrective action and when follow-up will occur.`);
}

function freezeSceneTool(){
  const raw=document.getElementById("freezeText").value.trim();
  const eventText = raw ? esc(raw) : "the accident/incident scene";
  write("freezeResult",`<strong>Freeze-the-scene guidance for:</strong> ${eventText}<br><br>• Stop the operation and protect people from further harm.<br>• Call emergency response or medical support when needed.<br>• Do not move equipment, tools, cords, ladders, vehicles, aircraft items, spill evidence, or PPE unless needed to prevent further injury.<br>• Secure the area with cones, tape, barricades, or a posted person.<br>• Identify witnesses and keep statements factual.<br>• Take photos: wide view, mid-range, and close-up before anything changes.<br>• Capture time, exact location, weather/lighting, equipment asset numbers, aircraft/tail numbers, manager/lead names, and who was notified.<br>• Preserve defective equipment or parts until released by the proper process.<br>• Report through supervisor/safety channels, injury reporting, environmental/spill process, and GSAP/ASAP when applicable.<br><br><strong>Key reminder:</strong> If an accident occurs, always freeze the scene and report it through the proper process.`);
}

document.addEventListener("DOMContentLoaded", function(){
  const form=document.getElementById("contactForm");
  if(!form) return;
  form.addEventListener("submit", function(){
    alert("Thank you. Your submission is being sent to UnionSafe141.");
  });
});
