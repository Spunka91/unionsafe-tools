function textValue(id){return (document.getElementById(id).value || "").toLowerCase().trim();}
function rawValue(id){return (document.getElementById(id).value || "").trim();}
function write(id, text){document.getElementById(id).innerHTML = text;}
function has(t, words){return words.some(w => t.includes(w));}
function esc(s){return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function bullets(items){return items.map(x=>"• "+x).join("<br>");}

function standardList(t){
  const hits=[];

  if(has(t,["broken ladder","damaged ladder","ladder","missing rung","loose rung","step ladder","extension ladder","unstable ladder","bad ladder"])) {
    hits.push("29 CFR 1910.23 — Ladders. Covers ladder condition, rungs, steps, side rails, ladder surfaces, and safe use. A broken, damaged, unstable, or defective ladder should be removed from service until corrected.");
  }
  if(has(t,["wet floor","slip","trip","floor","ice","snow","water","oil","slick","mat","walkway","aisle","housekeeping","cord","obstruction","hole","pothole","uneven","standing water","bagroom floor"])) {
    hits.push("29 CFR 1910.22 — Walking-Working Surfaces. Walking/working surfaces must be kept clean, orderly, sanitary, and in safe condition. This is the likely reference for wet floors, slip/trip hazards, poor housekeeping, cords across walkways, holes, and unsafe walking surfaces.");
  }
  if(has(t,["fall protection","open edge","platform","guardrail","floor opening","unprotected edge","mezzanine","open hole"])) {
    hits.push("29 CFR 1910.28 and 1910.29 — Fall Protection and Fall Protection Systems. Applies when employees are exposed to fall hazards requiring guardrails, covers, or other fall protection systems.");
  }
  if(has(t,["ppe","glove","gloves","eye","face","vest","shoe","boots","hard hat","safety glasses","goggles","face shield","hi vis","high visibility","reflective"])){ 
    hits.push("29 CFR 1910.132 — Personal Protective Equipment. Requires hazard assessment and appropriate PPE selection, use, and maintenance.");
  }
  if(has(t,["respirator","mask","n95","p95","dust mask","breathing protection","airborne","construction dust","dust storm","haboob","particulate"])){ 
    hits.push("29 CFR 1910.134 — Respiratory Protection. Applies when respirators are required, including program requirements, medical evaluation, fit testing, and proper use. Dust exposure may also require hazard assessment and air-quality review.");
  }
  if(has(t,["noise","loud","hearing","jet engine","apu","ear plugs","earmuffs","high noise","engine noise"])) {
    hits.push("29 CFR 1910.95 — Occupational Noise Exposure. Covers noise monitoring, hearing conservation, and hearing protection requirements.");
  }
  if(has(t,["chemical","odor","glycol","fuel","spill","unknown liquid","unknown substance","sds","hazcom","label","unlabeled","solvent","cleaner","leak","unknown spill","mystery liquid","fumes"])) {
    hits.push("29 CFR 1910.1200 — Hazard Communication. Covers chemical identification, labeling, SDS access, and employee information/training. Unknown liquids or odors should be treated as unidentified until verified.");
  }
  if(has(t,["tug","beltloader","belt loader","forklift","vehicle","brake","horn","backup alarm","backup","steering","gse","loader","powered industrial truck","pit","losing power","hydraulic","hydraulics"])){ 
    hits.push("29 CFR 1910.178 — Powered Industrial Trucks. Applies to powered industrial truck operation, inspection, safe condition, operator training, and removal of unsafe equipment from service when applicable.");
  }
  if(has(t,["first aid","medical","ambulance","injury","symptoms","collapse","blood","bleeding","cut","heat illness","dehydration","dizzy","fainted","vomit","chest pain"])) {
    hits.push("29 CFR 1910.151 — Medical Services and First Aid. Covers first aid/medical response availability and emergency care expectations.");
  }
  if(has(t,["electrical","extension cord","cord","plug","frayed","outlet","breaker","shock","exposed wire","power strip","damaged cord"])){ 
    hits.push("29 CFR 1910.303 and 1910.305 — Electrical. Covers safe electrical equipment use, wiring methods, flexible cords, and guarding employees from electrical hazards.");
  }
  if(has(t,["blocked exit","exit blocked","emergency exit","egress","evacuation route","blocked door","exit route"])){ 
    hits.push("29 CFR 1910.36 and 1910.37 — Exit Routes and Emergency Planning. Exit routes must remain free and unobstructed and must be maintained for emergency use.");
  }
  if(has(t,["fire extinguisher","extinguisher","fire","blocked extinguisher"])){ 
    hits.push("29 CFR 1910.157 — Portable Fire Extinguishers. Covers access, placement, inspection, maintenance, and employee use where applicable.");
  }
  if(has(t,["heat","hot","heat index","sun","summer","heat stress","heat illness","cramps","dehydration","high temperature"])){ 
    hits.push("General Duty Clause, OSH Act Section 5(a)(1) — Heat is commonly addressed as a recognized serious hazard when no specific federal heat standard applies. Verify company heat plan, state/local heat rules, and medical response process.");
  }
  if(has(t,["lightning","weather","wind","visibility","severe weather","storm","ramp closure","dust storm","haboob"])){ 
    hits.push("General Duty Clause, OSH Act Section 5(a)(1) — Severe weather, visibility, lightning, and dust hazards may require protective action when they create recognized serious hazards. Verify company and airport weather procedures.");
  }

  return hits.length ? hits : ["No exact match found from the keywords entered. Start with the General Duty Clause, OSH Act Section 5(a)(1), and verify whether a specific 29 CFR 1910 standard applies once the hazard details are clearer."];
}

function commonNextSteps(t){
  const steps=[];
  if(has(t,["accident","injury","damage","aircraft damage","hit","contact","collision","spill","unknown liquid","unknown substance"])) steps.push("Freeze the scene if an accident, injury, aircraft damage, equipment contact, spill, or serious event occurred.");
  if(has(t,["unknown spill","unknown liquid","unknown substance","chemical","fuel","glycol","leak","odor"])) steps.push("Keep people away from the area and do not touch or clean the material until it is identified and the proper PPE/response is confirmed.");
  steps.push("Control the exposure first; do not allow employees to continue into an uncontrolled hazard.");
  steps.push("Notify the safety rep, crew chief, supervisor, or manager based on immediacy and local process.");
  steps.push("Document facts: location, time, photos, equipment asset numbers, aircraft/tail numbers, names of who was notified, witnesses, and conditions present.");
  steps.push("File a safety concern, injury report, environmental report, or proactive GSAP/ASAP report when applicable.");
  return steps;
}

function oshaRefCheck(){
  const raw=rawValue("oshaRef"); const t=raw.toLowerCase();
  if(!raw){write("oshaRefResult","Type a condition first, such as broken ladder, wet floor, unknown spill, tug brake, heat, noise, dust, blocked exit, or electrical cord.");return;}
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  let note="";
  if(has(t,["unknown spill","unknown liquid","unknown substance","unidentified","mystery liquid","leak"])) note="<br><br><strong>Unknown spill rule:</strong> Do not touch, step in, clean, or move it until the substance is identified and the proper response/PPE is confirmed.";
  write("oshaRefResult",`<strong>Likely OSHA reference area(s) for:</strong> ${esc(raw)}<br><br>${standards}${note}<br><br><strong>How to use this:</strong><br>${bullets(["Use the most specific standard first when one applies.","A broken ladder points to ladder standards, not just the General Duty Clause.","Heat and many severe weather hazards are usually reviewed under the General Duty Clause unless a state/local rule or company plan gives more specific requirements.","Verify the final standard against OSHA, company policy, airport rules, SDS, and local procedure."])}`);
}

function oshaViolationCheck(){
  const raw=rawValue("oshaViolation"); const t=raw.toLowerCase();
  if(!raw){write("oshaViolationResult","Describe the condition first. Example: broken ladder, wet floor in walkway, unknown liquid, tug brake not working, heat symptoms.");return;}
  let assessment="This may be a safety concern if employees are exposed to the hazard and the condition is not controlled.";
  if(has(t,["broken ladder","ladder","missing rung","damaged ladder","unstable ladder"])) assessment="A damaged, broken, unstable, or defective ladder should not be used. Remove it from service, prevent access, and report it for correction before anyone climbs it.";
  if(has(t,["wet floor","slick","slip","trip","ice","cord","obstruction","hole","pothole"])) assessment="A walking/working surface hazard can lead to slips, trips, falls, and injuries. Control the area, warn others, correct the condition, and document if it is not promptly corrected.";
  if(has(t,["unknown spill","unknown liquid","chemical","fuel","glycol","odor","leak"])) assessment="Treat this as a potential exposure/spill concern. Do not touch, step in, clean, or move the material until identified and proper response/PPE is confirmed.";
  if(has(t,["brake","steering","losing power","no horn","backup alarm","tug hit","contacted aircraft","collision","aircraft damage","hydraulic"])) assessment="This may involve unsafe equipment condition or aircraft/equipment damage risk. Remove unsafe equipment from service when applicable, preserve the condition, document asset numbers, and notify the proper parties.";
  if(has(t,["heat","collapse","dizzy","vomit","confusion","cramps","dehydration"])) assessment="This may involve heat illness or heat exposure. Move the worker to a cooler area, begin cooling measures, seek medical support when symptoms are serious, and document workload, weather, timing, and controls available.";
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  write("oshaViolationResult",`<strong>Potential OSHA concern:</strong><br>${esc(raw)}<br><br><strong>Field assessment:</strong><br>${assessment}<br><br><strong>Likely standard/reference area:</strong><br>${standards}<br><br><strong>What to do next:</strong><br>${bullets(commonNextSteps(t))}`);
}

function gsapWording(){
  const raw=rawValue("gsapText"); const t=raw.toLowerCase();
  if(!raw){write("gsapResult","Describe the event first. Example: tug contacted aircraft, wingwalker lost sight line, beltloader contacted door, staffing/resource pressure during aircraft movement.");return;}
  let focus=[];
  if(has(t,["tug","tractor","aircraft","hit","contact","collision","damage","tail","nose","towbar","pushback","tow"])){ 
    focus.push("equipment asset/GSE number, aircraft/tail number, gate/spot, movement direction, approximate position/speed, and point of contact or closest clearance concern");
    focus.push("who was operating, guiding, wingwalking, communicating, and who had the ability to stop the movement");
    focus.push("who was notified, including manager/lead/supervisor names when applicable, and what immediate action was taken");
  }
  if(has(t,["wing","wingtip","wingwalker","marshal","spotter","guide"])){ 
    focus.push("wingwalker/guide positions, sight lines, hand signals or headset communication, ramp traffic, lighting, and any blocked views");
  }
  if(has(t,["beltloader","belt loader","door","cargo","bin","powerstow","loader"])){ 
    focus.push("beltloader/powerstow asset number, aircraft/tail number, door/bin involved, equipment height/position, and whether a spotter/guide was used");
  }
  if(has(t,["staff","short","coverage","alone","manpower","rushed","pressure","time","multiple","overlap","assignment"])){ 
    focus.push("staffing level, task assignment, task overlap, workload, operational pressure, and whether the crew had enough resources to complete required steps safely");
  }
  if(has(t,["weather","rain","snow","ice","heat","lightning","wind","haboob","dust","visibility"])){ 
    focus.push("weather, visibility, surface condition, ramp alerts/closures, PPE available, and any environmental condition affecting the task");
  }
  if(!focus.length) focus.push("time, location, task being performed, people involved, communication, equipment condition, environmental conditions, and what controls were or were not available");

  const wording=`During the operation, the following safety concern was observed/reported: ${raw}. The report is being submitted in good faith so the event can be reviewed for contributing factors and prevention, including communication, visibility, equipment condition, staffing/resources, task setup, weather/environment, and whether the process allowed the task to be completed safely.`;
  write("gsapResult",`<strong>Suggested GSAP/ASAP or safety report wording:</strong><br>${esc(wording)}<br><br><strong>Include as much factual detail as possible:</strong><br>${bullets(focus)}<br><br><strong>Also include when applicable:</strong><br>${bullets(["date/time and exact location/gate/spot","equipment asset numbers and aircraft/tail numbers","manager, supervisor, lead, crew chief, or safety rep names if they were involved or notified","witnesses and photos if available","immediate actions taken to stop, protect, preserve, or correct the condition"])}<br><br><strong>Wording reminder:</strong> Keep it factual. Avoid guessing motive or blame. Focus on what happened, what conditions existed, what controls were available, and what could prevent recurrence.`);
}

function injuryLanguage(){
  const raw=rawValue("injuryText"); const t=raw.toLowerCase();
  if(!raw){write("injuryResult","Describe the injury/symptoms first. Example: heat symptoms after ramp work, slip on wet floor, strain while lifting bags.");return;}
  let details=[];
  details.push("the exact work task being performed at the time symptoms or injury occurred");
  details.push("where it occurred, date/time, who was notified, and whether witnesses were present");
  details.push("what work condition contributed, such as heat, surface condition, lifting, equipment, weather, staffing/resource pressure, or exposure");
  if(has(t,["heat","hot","dehydration","dizzy","cramps","vomit","confusion","collapse"])) details.push("temperature/heat index if known, workload, time on ramp, access to water/rest/shade/cooling, PPE worn, and when symptoms first started");
  if(has(t,["slip","trip","fall","wet","ice","floor","ladder"])) details.push("surface condition, footwear, lighting, housekeeping, ladder/equipment condition, photos, and whether the condition was reported before");
  if(has(t,["strain","lift","lifting","bag","baggage","back","shoulder","knee","twist"])) details.push("object/task being handled, approximate weight if known, body movement, staffing/team lift availability, belt height, repetition, and when pain started");
  if(has(t,["chemical","odor","spill","glycol","fuel","dust","haboob","respiratory","breathing"])) details.push("substance/exposure if known, SDS/air quality information if available, PPE used, duration of exposure, symptoms, and who was notified");

  write("injuryResult",`<strong>Suggested injury reporting language:</strong><br>While performing my assigned work duties, I experienced the following injury or symptoms: ${esc(raw)}.<br><br><strong>Important details to include:</strong><br>${bullets(details)}<br><br><strong>Work-related clarity:</strong><br>Use clear factual language that connects the injury or symptoms to the work task and work conditions. Example: “While performing my assigned task at [location], I began experiencing [symptoms/injury] after [work condition/task]. I notified [name/title] at approximately [time].”<br><br><strong>Important:</strong> Be truthful, accurate, and complete. This tool does not guarantee workers’ compensation acceptance, but complete factual reporting helps the claim be reviewed with the correct work-related information.`);
}

function ppeCheck(){
  const raw=rawValue("ppeText"); const t=raw.toLowerCase();
  if(!raw){write("ppeResult","Describe the exposure first. Example: haboob, construction dust, unknown liquid, glycol odor, high noise, heat, cold, fuel spill.");return;}
  let guidance=[];
  if(has(t,["unknown spill","unknown liquid","unknown substance","leak","unidentified","mystery liquid"])) guidance.push("Do not touch, step in, clean, or move it until the substance is identified and the proper response/PPE is confirmed. Isolate the area and escalate through the proper spill/environmental process.");
  if(has(t,["chemical","fuel","glycol","odor","sds","hazcom","fumes","cleaner","solvent"])) guidance.push("Review SDS/HazCom information, identify the substance, avoid exposure, and confirm glove, eye/face, ventilation, and respiratory requirements before response.");
  if(has(t,["haboob","dust","construction dust","sand","air quality","aqi","particulate"])) guidance.push("Evaluate visibility and respiratory exposure. Consider stopping/relocating work, sheltering, dust controls, and respiratory protection only under an approved program when required.");
  if(has(t,["noise","loud","engine","apu","hearing"])) guidance.push("Use hearing protection where required and report uncontrolled noise exposure concerns. Consider whether monitoring/hearing conservation requirements apply.");
  if(has(t,["heat","hot","sun","summer","heat index"])) guidance.push("Use heat controls: water, rest, shade/cooling, buddy checks, acclimatization, symptom monitoring, and supervisor awareness when conditions are elevated.");
  if(has(t,["cold","ice","snow","winter","freezing"])) guidance.push("Use cold-weather PPE, traction awareness, warm-up breaks, and controls for slippery surfaces.");
  if(has(t,["wet","slip","floor","oil","slick"])) guidance.push("Control the walking surface hazard first: barricade/mark the area, clean only if safe and trained to do so, and report if correction is delayed or recurring.");
  if(!guidance.length) guidance.push("Identify the hazard, control exposure first, then select PPE based on the task, SDS/policy, OSHA requirements, and local procedure. PPE is the last line of defense after eliminating or controlling the hazard.");
  write("ppeResult",`<strong>Exposure / PPE guidance for:</strong> ${esc(raw)}<br><br>${bullets(guidance)}<br><br><strong>Next steps:</strong><br>${bullets(commonNextSteps(t))}`);
}

function stopWorkCheck(){
  const raw=rawValue("stopWorkText"); const t=raw.toLowerCase();
  if(!raw){write("stopWorkResult","Describe the situation first. Example: no wingwalker, lightning nearby, unknown spill, tug losing power, blocked visibility.");return;}
  let response="Use STOP: Stop, Think, Observe, and Proceed only after the hazard is understood and controlled. Pause the task, reassess conditions, confirm roles, and proceed only when the crew can complete the task safely.";
  if(has(t,["unknown spill","unknown liquid","chemical","fuel","lightning","haboob","no visibility","brake","steering","losing power","no wingwalker","blocked view","aircraft contact","injury","accident","damage","collapse"])){ response="Do not continue until the hazard is controlled. Use STOP: Stop, Think, Observe, and Proceed. Protect people first, notify the crew chief/supervisor/safety rep, document the condition, and restart only after the responsible process confirms safe conditions."; }
  write("stopWorkResult",`<strong>STOP guidance:</strong><br>${response}<br><br><strong>Professional language to use:</strong><br>“I am using STOP — Stop, Think, Observe, and Proceed. I am stopping to verify safe conditions before continuing.”<br><br><strong>What to do next:</strong><br>${bullets(commonNextSteps(t))}`);
}

function timePressureCheck(){
  const raw=rawValue("timePressureText"); const t=raw.toLowerCase();
  if(!raw){write("timePressureResult","Describe the time pressure, staffing, task overlap, or operational pressure first.");return;}
  let flags=[];
  if(has(t,["short","staff","coverage","manpower","alone","understaffed"])) flags.push("staffing/resource gap");
  if(has(t,["rush","rushed","pressure","quick","hurry","late","time","turn time"])) flags.push("time pressure");
  if(has(t,["multiple","overlap","two jobs","multitask","same time","split"])){ flags.push("task overlap/multitasking"); }
  if(has(t,["weather","heat","lightning","wind","dust","haboob","rain","snow","ice"])) flags.push("weather/environmental pressure");
  if(has(t,["equipment","broken","missing","asset","tug","beltloader","loader"])) flags.push("equipment/resource issue");
  if(!flags.length) flags.push("possible operational pressure");
  write("timePressureResult",`<strong>Risk factors identified:</strong> ${flags.join(", ")}.<br><br><strong>Guidance:</strong><br>Time pressure is an error-producing condition. Slow the operation down enough to complete required safety steps. Reconfirm roles, avoid combining critical duties, verify equipment/resources, and do not allow speed to replace safety checks.<br><br><strong>AYR reminder:</strong><br>Make sure all proper AYR protocols are completed before performing the task. If the crew is not ready, stop and reset before proceeding.<br><br><strong>Proactive reporting:</strong><br>File proactive reports through the GSAP/ASAP program when time pressure, staffing/resource gaps, task overlap, or operational conditions create a safety risk or make it difficult to complete required steps safely.`);
}

function nearMissBuilder(){
  const raw=rawValue("nearMissText"); const t=raw.toLowerCase();
  if(!raw){write("nearMissResult","Describe what almost happened first. Example: tug almost contacted aircraft, pedestrian crossed behind equipment, wingtip clearance was close.");return;}
  let hazard="potential injury, equipment damage, or aircraft damage";
  if(has(t,["wing","aircraft","tug","beltloader","collision","contact","door","tail","towbar"])) hazard="potential aircraft/equipment contact or damage";
  if(has(t,["pedestrian","walked","behind","traffic","vehicle","roadway"])) hazard="potential pedestrian/vehicle strike";
  write("nearMissResult",`<strong>Near-miss wording:</strong><br>A near miss occurred when: ${esc(raw)}.<br><br>No injury or damage should be stated unless confirmed, but the situation created risk of ${hazard}.<br><br><strong>Facts to include:</strong><br>${bullets(["exact location/gate/spot and approximate time","equipment asset number and aircraft/tail number if involved","who was present and who was notified","visibility, lighting, weather, ramp traffic, and communication conditions","what stopped the event from becoming an injury or damage event"])}<br><br><strong>Prevention focus:</strong><br>Identify what control would prevent recurrence: better communication, additional guide/wingwalker, equipment removal, staffing/resource adjustment, traffic control, weather response, or SOP clarification. Consider filing a proactive GSAP/ASAP report when it involves operational safety risk.`);
}

function reportRoute(){
  const raw=rawValue("routeText"); const t=raw.toLowerCase();
  if(!raw){write("routeResult","Describe the issue first. Example: injury, aircraft contact, unknown spill, PPE concern, staffing/time pressure, near miss.");return;}
  let routes=[];
  routes.push("Start with the safety rep, crew chief, supervisor, or manager based on immediacy and local process.");
  if(has(t,["injury","hurt","pain","medical","ambulance","heat symptoms","collapse","blood","cut","strain"])) routes.push("Use the injury/medical reporting process immediately and seek medical evaluation when needed.");
  if(has(t,["aircraft damage","contacted aircraft","hit aircraft","collision","tug hit","wingtip","door damage","accident","damage"])) routes.push("If an accident or aircraft/equipment damage occurs, always freeze the scene, preserve evidence, notify supervision/safety, and follow accident reporting procedures.");
  if(has(t,["unknown spill","spill","fuel","glycol","chemical","odor","leak","unknown liquid"])) routes.push("Use the environmental/spill response process. Keep employees away until the substance is identified and response/PPE is confirmed.");
  if(has(t,["near miss","unsafe","hazard","wet floor","noise","ppe","staffing","time pressure","communication","procedure","equipment"])) routes.push("Use the safety concern/JSC process for hazard tracking and corrective action. File proactive reports through GSAP/ASAP when the issue involves operational safety risk.");
  if(routes.length===1) routes.push("If unsure, document the condition and route through safety concern or GSAP/ASAP if it involves operational safety risk.");
  write("routeResult",`<strong>Suggested reporting route:</strong><br>${bullets(routes)}<br><br><strong>Close-the-loop reminder:</strong><br>Ask who owns the corrective action, when follow-up will occur, and how the frontline will know the hazard was corrected.`);
}

function freezeSceneTool(){
  const raw=rawValue("freezeText");
  const eventText = raw ? esc(raw) : "the accident/incident scene";
  write("freezeResult",`<strong>Freeze-the-scene guidance for:</strong> ${eventText}<br><br>${bullets(["Stop the operation and protect people from further harm.","Call emergency response or medical support when needed.","Do not move equipment, tools, cords, ladders, vehicles, aircraft items, spill evidence, or PPE unless needed to prevent further injury.","Secure the area with cones, tape, barricades, or a posted person.","Identify witnesses and keep statements factual.","Take photos: wide view, mid-range, and close-up before anything changes.","Capture time, exact location, weather/lighting, equipment asset numbers, aircraft/tail numbers, manager/lead names, and who was notified.","Preserve defective equipment or parts until released by the proper process.","Report through supervisor/safety channels, injury reporting, environmental/spill process, and GSAP/ASAP when applicable."])}<br><br><strong>Key reminder:</strong><br>If an accident occurs, always freeze the scene and report it through the proper process.`);
}

document.addEventListener("DOMContentLoaded", function(){
  const form=document.getElementById("contactForm");
  if(!form) return;
  form.addEventListener("submit", function(){
    alert("Thank you. Your submission is being sent to UnionSafe141.");
  });
});
