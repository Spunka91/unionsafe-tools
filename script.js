function textValue(id){return (document.getElementById(id).value || "").toLowerCase().trim();}
function rawValue(id){return (document.getElementById(id).value || "").trim();}
function write(id, text){document.getElementById(id).innerHTML = text;}
function has(t, words){return words.some(w => t.includes(w));}
function esc(s){return (s || "").replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function bullets(items){return items.map(x=>"• "+x).join("<br>");}

const keywordSets = {
  ladder:["broken ladder","damaged ladder","ladder","missing rung","loose rung","step ladder","extension ladder","unstable ladder","bad ladder","ladder fall"],
  walking:["wet floor","slip","trip","floor","ice","snow","water","oil","slick","mat","walkway","aisle","housekeeping","cord","obstruction","hole","pothole","uneven","standing water","bagroom floor","ramp slick"],
  ppe:["ppe","glove","gloves","eye","face","vest","shoe","boots","hard hat","safety glasses","goggles","face shield","hi vis","high visibility","reflective","hearing protection"],
  respiratory:["respirator","mask","n95","p95","dust mask","breathing protection","airborne","construction dust","dust storm","haboob","particulate","smoke","poor air"],
  noise:["noise","loud","hearing","jet engine","apu","ear plugs","earmuffs","high noise","engine noise","running engine"],
  chemical:["chemical","odor","glycol","fuel","spill","unknown liquid","unknown substance","sds","hazcom","label","unlabeled","solvent","cleaner","leak","unknown spill","mystery liquid","fumes","hydraulic fluid","lav fluid"],
  equipment:["tug","beltloader","belt loader","forklift","vehicle","brake","horn","backup alarm","backup","steering","gse","loader","powered industrial truck","pit","losing power","hydraulic","hydraulics","no brakes","deadman","towbar","powerstow"],
  medical:["first aid","medical","ambulance","injury","symptoms","collapse","blood","bleeding","cut","heat illness","dehydration","dizzy","fainted","vomit","chest pain","strain","pain"],
  electrical:["electrical","extension cord","cord","plug","frayed","outlet","breaker","shock","exposed wire","power strip","damaged cord","sparking"],
  blockedExit:["blocked exit","exit blocked","emergency exit","egress","evacuation route","blocked door","exit route"],
  heat:["heat","hot","heat index","sun","summer","heat stress","heat illness","cramps","dehydration","high temperature","no shade","no water"],
  weather:["lightning","weather","wind","visibility","severe weather","storm","ramp closure","dust storm","haboob","microburst","rain","snow","ice"],
  aircraftContact:["aircraft contact","hit aircraft","contacted aircraft","tug hit","beltloader hit","belt loader hit","door damage","wingtip","tail strike","collision","aircraft damage","scrape","dent","tow event"],
  wingwalker:["wingwalker","wing walker","guide","marshal","marshalling","spotter","lost sight","sight line","hand signal","headset","pushback","tow"],
  staffing:["short staffed","staffing","short","coverage","manpower","alone","understaffed","not enough people","split crew","multiple tasks","task overlap","overlap","rushed","rush","time pressure","hurry","quick turn"],
  traffic:["traffic","roadway","vehicle traffic","pedestrian","crossed behind","bag cart","cart train","service road","congestion"],
  doorBelt:["beltloader","belt loader","powerstow","aircraft door","cargo door","bin door","door contact","loader contact","green light"],
  chocks:["chock","chocks","missing chock","chocked","wheel chock"],
  jetblast:["jet blast","engine blast","prop wash","blast","exhaust"],
  batteries:["lithium","battery","thermal runaway","smoke battery","phone battery","bag battery"]
};

function detectScenarios(t){
  const found=[];
  for(const [key, words] of Object.entries(keywordSets)) if(has(t, words)) found.push(key);
  return found;
}

function realTalkLine(t){
  if(has(t, keywordSets.chemical)) return "Real talk: if you do not know what it is, do not touch it, do not step in it, and do not let anyone else walk through it.";
  if(has(t, keywordSets.aircraftContact)) return "Real talk: once aircraft or equipment contact is involved, stop the operation and protect the scene. Do not let the operation wash away the facts.";
  if(has(t, keywordSets.staffing)) return "Real talk: short staffing and time pressure are not excuses to skip the steps that keep people and aircraft safe.";
  if(has(t, keywordSets.weather)) return "Real talk: weather does not care about the operation. If visibility, lightning, heat, or wind creates risk, slow it down and get the right people involved.";
  if(has(t, keywordSets.ladder) || has(t, keywordSets.walking)) return "Real talk: if it can put someone on the ground, it needs to be controlled before someone gets hurt.";
  return "Real talk: document facts, protect people first, and do not let the issue disappear without follow-up.";
}

function rampScenarioGuidance(t){
  const out=[];
  if(has(t, keywordSets.aircraftContact)) out.push("Aircraft/equipment contact scenario: freeze the scene, stop movement, preserve equipment position when safe, capture asset numbers, aircraft/tail number, gate/spot, point of contact, photos, witnesses, and who was notified.");
  if(has(t, keywordSets.equipment)) out.push("GSE scenario: if brakes, steering, horn, backup alarm, hydraulics, deadman, or power loss are involved, remove equipment from service when applicable and document the asset number before it gets swapped or returned to service.");
  if(has(t, keywordSets.wingwalker)) out.push("Wingwalker/guide scenario: document guide positions, sight lines, hand signals/headset communication, who had stop authority, and whether views were blocked by equipment, jet bridge, traffic, weather, or lighting.");
  if(has(t, keywordSets.doorBelt)) out.push("Beltloader/door scenario: document equipment height/position, aircraft door/bin involved, asset number, aircraft/tail number, spotter use, lighting, and any green-light/procedure concerns if applicable.");
  if(has(t, keywordSets.staffing)) out.push("Staffing/time-pressure scenario: document crew size, task assignment, overlap, resource gaps, and whether AYR steps could be fully completed before work began.");
  if(has(t, keywordSets.weather)) out.push("Weather scenario: document lightning/dust/wind/heat/visibility conditions, alerts, ramp closure status, PPE availability, and who made the decision to continue or pause.");
  if(has(t, keywordSets.chemical)) out.push("Spill/exposure scenario: isolate the area, identify the substance, verify SDS/response/PPE, and document odor, liquid color, location, duration, and who was notified.");
  if(has(t, keywordSets.traffic)) out.push("Ramp traffic scenario: document roadway location, direction of travel, pedestrian/equipment movement, visibility, cones/barricades, and whether someone was asked to direct traffic outside their safe role.");
  if(has(t, keywordSets.chocks)) out.push("Chock scenario: document aircraft/equipment position, chock placement, whether chocks were missing/moved, and any jet bridge or ramp layout factor affecting safe placement.");
  if(has(t, keywordSets.jetblast)) out.push("Jet blast scenario: move personnel/equipment out of the blast zone, report the hazard, and document aircraft position, engine status, traffic control, and who was notified.");
  if(has(t, keywordSets.batteries)) out.push("Lithium battery scenario: isolate the item when safe, keep away from combustibles, notify proper response channels, and document smoke, heat, smell, location, and item type.");
  return out;
}

function standardList(t){
  const hits=[];
  if(has(t, keywordSets.ladder)) hits.push("29 CFR 1910.23 — Ladders. This is the specific starting point for broken, damaged, unstable, or defective ladders. Remove unsafe ladders from service until corrected.");
  if(has(t, keywordSets.walking)) hits.push("29 CFR 1910.22 — Walking-Working Surfaces. Likely reference for wet floors, slip/trip hazards, cords across walkways, holes, unsafe aisles, poor housekeeping, and slick surfaces.");
  if(has(t,["fall protection","open edge","platform","guardrail","floor opening","unprotected edge","mezzanine","open hole"])) hits.push("29 CFR 1910.28 and 1910.29 — Fall Protection and Fall Protection Systems. Applies when employees are exposed to fall hazards requiring guardrails, covers, or other fall protection systems.");
  if(has(t, keywordSets.ppe)) hits.push("29 CFR 1910.132 — Personal Protective Equipment. Requires hazard assessment and appropriate PPE selection, use, and maintenance.");
  if(has(t, keywordSets.respiratory)) hits.push("29 CFR 1910.134 — Respiratory Protection. Applies when respirators are required, including program requirements, medical evaluation, fit testing, and proper use.");
  if(has(t, keywordSets.noise)) hits.push("29 CFR 1910.95 — Occupational Noise Exposure. Covers noise monitoring, hearing conservation, and hearing protection.");
  if(has(t, keywordSets.chemical)) hits.push("29 CFR 1910.1200 — Hazard Communication. Covers chemical identification, labeling, SDS access, and employee information. Unknown liquids or odors must be identified before response.");
  if(has(t, keywordSets.equipment)) hits.push("29 CFR 1910.178 — Powered Industrial Trucks. Applies when powered industrial trucks/GSE are involved, including safe condition, inspection, operation, training, and removing unsafe equipment from service where applicable.");
  if(has(t, keywordSets.medical)) hits.push("29 CFR 1910.151 — Medical Services and First Aid. Applies to first aid/medical response availability and emergency care expectations.");
  if(has(t, keywordSets.electrical)) hits.push("29 CFR 1910.303 and 1910.305 — Electrical. Covers safe electrical equipment use, wiring methods, flexible cords, damaged cords, exposed wires, and guarding employees from electrical hazards.");
  if(has(t, keywordSets.blockedExit)) hits.push("29 CFR 1910.36 and 1910.37 — Exit Routes. Exit routes must be free, unobstructed, and maintained for emergency use.");
  if(has(t,["fire extinguisher","extinguisher","fire","blocked extinguisher"])) hits.push("29 CFR 1910.157 — Portable Fire Extinguishers. Covers access, placement, inspection, and maintenance where applicable.");
  if(has(t, keywordSets.heat)) hits.push("General Duty Clause, OSH Act Section 5(a)(1) — Heat is commonly addressed as a recognized serious hazard when no specific federal heat standard applies. Also verify state/local heat rules and company heat plan.");
  if(has(t, keywordSets.weather)) hits.push("General Duty Clause, OSH Act Section 5(a)(1) — Severe weather, lightning, dust, wind, and visibility hazards may require protective action when recognized serious hazards exist. Verify company and airport weather procedures.");
  return hits.length ? hits : ["No exact match found from the keywords entered. Start with the General Duty Clause, OSH Act Section 5(a)(1), then verify whether a more specific 29 CFR 1910 standard applies once the hazard details are clearer."];
}

function commonNextSteps(t){
  const steps=[];
  if(has(t,["accident","injury","damage","aircraft damage","hit","contact","collision","spill","unknown liquid","unknown substance"])) steps.push("Freeze the scene if an accident, injury, aircraft damage, equipment contact, spill, or serious event occurred.");
  if(has(t, keywordSets.chemical)) steps.push("Keep people away from the area and do not touch or clean the material until it is identified and the proper PPE/response is confirmed.");
  if(has(t, keywordSets.staffing)) steps.push("Use STOP and AYR: slow down, verify crew readiness, roles, equipment, and whether the task can be performed without shortcuts.");
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
  const scenarios=rampScenarioGuidance(t);
  write("oshaRefResult",`<strong>Likely OSHA reference area(s) for:</strong> ${esc(raw)}<br><br>${standards}<br><br>${scenarios.length?"<strong>Real ramp context:</strong><br>"+bullets(scenarios)+"<br><br>":""}<strong>How to use this:</strong><br>${bullets(["Use the most specific standard first when one applies.","A broken ladder points to ladder standards, not just the General Duty Clause.","Heat and many severe weather hazards usually start under the General Duty Clause unless a state/local rule or company plan gives more specific requirements.","If the condition can hurt someone, control it first and verify the standard after the exposure is protected."])}<br><br><strong>${realTalkLine(t)}</strong>`);
}

function oshaViolationCheck(){
  const raw=rawValue("oshaViolation"); const t=raw.toLowerCase();
  if(!raw){write("oshaViolationResult","Describe the condition first. Example: broken ladder, wet floor in walkway, unknown liquid, tug brake not working, heat symptoms.");return;}
  let assessment="This may be a safety concern if employees are exposed to the hazard and the condition is not controlled.";
  if(has(t, keywordSets.ladder)) assessment="A damaged, broken, unstable, or defective ladder should not be used. Remove it from service, prevent access, and report it for correction before anyone climbs it.";
  if(has(t, keywordSets.walking)) assessment="A walking/working surface hazard can lead to slips, trips, falls, and injuries. Control the area, warn others, correct the condition, and document if it is not promptly corrected.";
  if(has(t, keywordSets.chemical)) assessment="Treat this as a potential exposure/spill concern. Do not touch, step in, clean, or move the material until identified and proper response/PPE is confirmed.";
  if(has(t, keywordSets.equipment) || has(t, keywordSets.aircraftContact)) assessment="This may involve unsafe equipment condition or aircraft/equipment damage risk. Remove unsafe equipment from service when applicable, preserve the condition, document asset numbers, and notify the proper parties.";
  if(has(t, keywordSets.heat)) assessment="This may involve heat illness or heat exposure. Move the worker to a cooler area, begin cooling measures, seek medical support when symptoms are serious, and document workload, weather, timing, and controls available.";
  const standards=standardList(t).map(x=>"• "+x).join("<br>");
  const scenario=rampScenarioGuidance(t);
  write("oshaViolationResult",`<strong>Potential OSHA concern:</strong><br>${esc(raw)}<br><br><strong>Field assessment:</strong><br>${assessment}<br><br><strong>Likely standard/reference area:</strong><br>${standards}<br><br>${scenario.length?"<strong>Real ramp scenario guidance:</strong><br>"+bullets(scenario)+"<br><br>":""}<strong>What to do next:</strong><br>${bullets(commonNextSteps(t))}<br><br><strong>${realTalkLine(t)}</strong>`);
}

function gsapWording(){
  const raw=rawValue("gsapText"); const t=raw.toLowerCase();
  if(!raw){write("gsapResult","Describe the event first. Example: tug contacted aircraft, wingwalker lost sight line, beltloader contacted door, staffing/resource pressure during aircraft movement.");return;}
  let focus=[];
  const scenario=rampScenarioGuidance(t);
  if(has(t, keywordSets.aircraftContact) || has(t, ["tug","tractor","aircraft","tail","nose","towbar","pushback","tow"])){
    focus.push("equipment asset/GSE number, aircraft/tail number, gate/spot, movement direction, approximate position/speed, and point of contact or closest clearance concern");
    focus.push("who was operating, guiding, wingwalking, communicating, and who had the ability to stop the movement");
    focus.push("who was notified, including manager/lead/supervisor names when applicable, and what immediate action was taken");
  }
  if(has(t, keywordSets.wingwalker)) focus.push("wingwalker/guide positions, sight lines, hand signals or headset communication, ramp traffic, lighting, and any blocked views");
  if(has(t, keywordSets.doorBelt)) focus.push("beltloader/powerstow asset number, aircraft/tail number, door/bin involved, equipment height/position, and whether a spotter/guide was used");
  if(has(t, keywordSets.staffing)) focus.push("staffing level, task assignment, task overlap, workload, operational pressure, and whether the crew had enough resources to complete required steps safely");
  if(has(t, keywordSets.weather)) focus.push("weather, visibility, surface condition, ramp alerts/closures, PPE available, and any environmental condition affecting the task");
  if(!focus.length) focus.push("time, location, task being performed, people involved, communication, equipment condition, environmental conditions, and what controls were or were not available");
  const wording=`During the operation, the following safety concern was observed/reported: ${raw}. I am submitting this in good faith so the event can be reviewed for contributing factors and prevention, including communication, visibility, equipment condition, staffing/resources, task setup, weather/environment, and whether the process allowed the task to be completed safely.`;
  write("gsapResult",`<strong>Suggested GSAP/ASAP or safety report wording:</strong><br>${esc(wording)}<br><br>${scenario.length?"<strong>Real ramp scenario prompts:</strong><br>"+bullets(scenario)+"<br><br>":""}<strong>Put as much factual information in the report as possible:</strong><br>${bullets(focus)}<br><br><strong>Also include when applicable:</strong><br>${bullets(["date/time and exact location/gate/spot","equipment asset numbers and aircraft/tail numbers","manager, supervisor, lead, crew chief, or safety rep names if they were involved or notified","witnesses and photos if available","immediate actions taken to stop, protect, preserve, or correct the condition","whether STOP/AYR was completed, interrupted, or could not be completed safely due to conditions"])}<br><br><strong>Wording reminder:</strong> Keep it factual. Do not guess motive or blame. Tell the whole story: what happened, what conditions existed, what controls were available, what changed, and what could prevent recurrence.<br><br><strong>${realTalkLine(t)}</strong>`);
}

function injuryLanguage(){
  const raw=rawValue("injuryText"); const t=raw.toLowerCase();
  if(!raw){write("injuryResult","Describe the injury/symptoms first. Example: heat symptoms after ramp work, slip on wet floor, strain while lifting bags.");return;}
  let details=["the exact work task being performed at the time symptoms or injury occurred","where it occurred, date/time, who was notified, and whether witnesses were present","what work condition contributed, such as heat, surface condition, lifting, equipment, weather, staffing/resource pressure, or exposure"];
  if(has(t, keywordSets.heat)) details.push("temperature/heat index if known, workload, time on ramp, access to water/rest/shade/cooling, PPE worn, and when symptoms first started");
  if(has(t, keywordSets.walking) || has(t, keywordSets.ladder)) details.push("surface condition, footwear, lighting, housekeeping, ladder/equipment condition, photos, and whether the condition was reported before");
  if(has(t,["strain","lift","lifting","bag","baggage","back","shoulder","knee","twist","pull","push"])) details.push("object/task being handled, approximate weight if known, body movement, staffing/team lift availability, belt height, repetition, and when pain started");
  if(has(t, keywordSets.chemical) || has(t, keywordSets.respiratory)) details.push("substance/exposure if known, SDS/air quality information if available, PPE used, duration of exposure, symptoms, and who was notified");
  write("injuryResult",`<strong>Suggested injury reporting language:</strong><br>While performing my assigned work duties, I experienced the following injury or symptoms: ${esc(raw)}.<br><br><strong>Important details to include:</strong><br>${bullets(details)}<br><br><strong>Work-related clarity:</strong><br>Use clear factual language that connects the injury or symptoms to the work task and work conditions. Example: “While performing my assigned task at [location], I began experiencing [symptoms/injury] after [specific work task or work condition]. I notified [name/title] at approximately [time].”<br><br><strong>Do not leave gaps:</strong><br>${bullets(["Report the injury as soon as possible through the proper process.","Identify the work task, condition, location, and time clearly.","List witnesses and who was notified.","Use medical language only if a medical provider gave it; otherwise describe symptoms accurately."])}<br><br><strong>Important:</strong> Be truthful, accurate, and complete. This tool does not guarantee workers’ compensation acceptance, but complete factual reporting helps the claim be reviewed with the correct work-related information.`);
}

function ppeCheck(){
  const raw=rawValue("ppeText"); const t=raw.toLowerCase();
  if(!raw){write("ppeResult","Describe the exposure first. Example: haboob, construction dust, unknown liquid, glycol odor, high noise, heat, cold, fuel spill.");return;}
  let guidance=[];
  if(has(t, keywordSets.chemical)) guidance.push("Do not touch, step in, clean, or move unknown material until the substance is identified and the proper response/PPE is confirmed. Isolate the area and escalate through the proper spill/environmental process.");
  if(has(t, keywordSets.respiratory)) guidance.push("Evaluate visibility and respiratory exposure. Consider stopping/relocating work, sheltering, dust controls, and respiratory protection only under an approved program when required.");
  if(has(t, keywordSets.noise)) guidance.push("Use hearing protection where required and report uncontrolled noise exposure concerns. Consider whether monitoring/hearing conservation requirements apply.");
  if(has(t, keywordSets.heat)) guidance.push("Use heat controls: water, rest, shade/cooling, buddy checks, acclimatization, symptom monitoring, and supervisor awareness when conditions are elevated.");
  if(has(t,["cold","ice","snow","winter","freezing"])) guidance.push("Use cold-weather PPE, traction awareness, warm-up breaks, and controls for slippery surfaces.");
  if(has(t, keywordSets.walking)) guidance.push("Control the walking surface hazard first: barricade/mark the area, clean only if safe and trained to do so, and report if correction is delayed or recurring.");
  if(has(t, keywordSets.jetblast)) guidance.push("Jet blast/engine exhaust exposure is not a PPE-only issue. Move people and equipment out of the hazard zone and report the condition.");
  if(!guidance.length) guidance.push("Identify the hazard, control exposure first, then select PPE based on the task, SDS/policy, OSHA requirements, and local procedure. PPE is the last line of defense after eliminating or controlling the hazard.");
  const scenario=rampScenarioGuidance(t);
  write("ppeResult",`<strong>Exposure / PPE guidance for:</strong> ${esc(raw)}<br><br>${bullets(guidance)}<br><br>${scenario.length?"<strong>Real ramp context:</strong><br>"+bullets(scenario)+"<br><br>":""}<strong>Next steps:</strong><br>${bullets(commonNextSteps(t))}<br><br><strong>${realTalkLine(t)}</strong>`);
}

function stopWorkCheck(){
  const raw=rawValue("stopWorkText"); const t=raw.toLowerCase();
  if(!raw){write("stopWorkResult","Describe the situation first. Example: no wingwalker, lightning nearby, unknown spill, tug losing power, blocked visibility.");return;}
  const scenario=rampScenarioGuidance(t);
  let response="Use STOP: Stop, Think, Observe, and Proceed only after the hazard is understood and controlled. Pause the task, reassess conditions, confirm roles, and proceed only when the crew can complete the task safely.";
  if(has(t,[...keywordSets.chemical,...keywordSets.weather,...keywordSets.equipment,...keywordSets.aircraftContact,"no visibility","blocked view","no wingwalker","injury","accident","damage","collapse"])) response="Do not continue until the hazard is controlled. Use STOP: Stop, Think, Observe, and Proceed. Protect people first, notify the crew chief/supervisor/safety rep, document the condition, and restart only after the responsible process confirms safe conditions.";
  write("stopWorkResult",`<strong>STOP guidance:</strong><br>${response}<br><br>${scenario.length?"<strong>Real ramp context:</strong><br>"+bullets(scenario)+"<br><br>":""}<strong>Professional language to use:</strong><br>“I am using STOP — Stop, Think, Observe, and Proceed. I am stopping to verify safe conditions before continuing.”<br><br><strong>What to do next:</strong><br>${bullets(commonNextSteps(t))}<br><br><strong>Nothing we do is worth getting hurt over or damaging an aircraft because we rushed past a known hazard.</strong>`);
}

function timePressureCheck(){
  const raw=rawValue("timePressureText"); const t=raw.toLowerCase();
  if(!raw){write("timePressureResult","Describe the time pressure, staffing, task overlap, or operational pressure first.");return;}
  let flags=[];
  if(has(t, keywordSets.staffing)) flags.push("staffing/resource gap, task overlap, or operational pressure");
  if(has(t, keywordSets.weather)) flags.push("weather/environmental pressure");
  if(has(t, keywordSets.equipment)) flags.push("equipment/resource issue");
  if(has(t, keywordSets.wingwalker)) flags.push("movement/guide/visibility concern");
  if(!flags.length) flags.push("possible operational pressure");
  write("timePressureResult",`<strong>Risk factors identified:</strong> ${flags.join(", ")}.<br><br><strong>Guidance:</strong><br>Time pressure is an error-producing condition. Slow the operation down enough to complete required safety steps. Reconfirm roles, avoid combining critical duties, verify equipment/resources, and do not allow speed to replace safety checks.<br><br><strong>AYR reminder:</strong><br>Make sure all proper AYR protocols are completed before performing the task. If the crew is not ready, stop and reset before proceeding.<br><br><strong>Proactive reporting:</strong><br>File proactive reports through the GSAP/ASAP program when time pressure, staffing/resource gaps, task overlap, or operational conditions create a safety risk or make it difficult to complete required steps safely.<br><br><strong>Real talk:</strong> If the only way to finish the assignment is to skip a safety step, then the plan is already broken.`);
}

function nearMissBuilder(){
  const raw=rawValue("nearMissText"); const t=raw.toLowerCase();
  if(!raw){write("nearMissResult","Describe what almost happened first. Example: tug almost contacted aircraft, pedestrian crossed behind equipment, wingtip clearance was close.");return;}
  let hazard="potential injury, equipment damage, or aircraft damage";
  if(has(t, keywordSets.aircraftContact) || has(t,["wing","aircraft","tug","beltloader","door","tail","towbar"])) hazard="potential aircraft/equipment contact or damage";
  if(has(t, keywordSets.traffic)) hazard="potential pedestrian/vehicle strike";
  const scenario=rampScenarioGuidance(t);
  write("nearMissResult",`<strong>Near-miss wording:</strong><br>A near miss occurred when: ${esc(raw)}.<br><br>No injury or damage should be stated unless confirmed, but the situation created risk of ${hazard}.<br><br>${scenario.length?"<strong>Real ramp scenario prompts:</strong><br>"+bullets(scenario)+"<br><br>":""}<strong>Facts to include:</strong><br>${bullets(["exact location/gate/spot and approximate time","equipment asset number and aircraft/tail number if involved","who was present and who was notified","visibility, lighting, weather, ramp traffic, and communication conditions","what stopped the event from becoming an injury or damage event"])}<br><br><strong>Prevention focus:</strong><br>Identify what control would prevent recurrence: better communication, additional guide/wingwalker, equipment removal, staffing/resource adjustment, traffic control, weather response, or SOP clarification. Consider filing a proactive GSAP/ASAP report when it involves operational safety risk.`);
}

function reportRoute(){
  const raw=rawValue("routeText"); const t=raw.toLowerCase();
  if(!raw){write("routeResult","Describe the issue first. Example: injury, aircraft contact, unknown spill, PPE concern, staffing/time pressure, near miss.");return;}
  let routes=["Start with the safety rep, crew chief, supervisor, or manager based on immediacy and local process."];
  if(has(t, keywordSets.medical)) routes.push("Use the injury/medical reporting process immediately and seek medical evaluation when needed.");
  if(has(t, keywordSets.aircraftContact)) routes.push("If an accident or aircraft/equipment damage occurs, always freeze the scene, preserve evidence, notify supervision/safety, and follow accident reporting procedures.");
  if(has(t, keywordSets.chemical)) routes.push("Use the environmental/spill response process. Keep employees away until the substance is identified and response/PPE is confirmed.");
  if(has(t,["near miss","unsafe","hazard","wet floor","noise","ppe","staffing","time pressure","communication","procedure","equipment", "gsap", "asap"])) routes.push("Use the safety concern/JSC process for hazard tracking and corrective action. File proactive reports through GSAP/ASAP when the issue involves operational safety risk.");
  if(routes.length===1) routes.push("If unsure, document the condition and route through safety concern or GSAP/ASAP if it involves operational safety risk.");
  write("routeResult",`<strong>Suggested reporting route:</strong><br>${bullets(routes)}<br><br><strong>Close-the-loop reminder:</strong><br>Ask who owns the corrective action, when follow-up will occur, and how the frontline will know the hazard was corrected.<br><br><strong>Real talk:</strong> Reporting is preventing. If it does not get documented, it is too easy for the system to say it never happened.`);
}

function freezeSceneTool(){
  const raw=rawValue("freezeText"); const t=raw.toLowerCase();
  const eventText = raw ? esc(raw) : "the accident/incident scene";
  const scenario=rampScenarioGuidance(t);
  write("freezeResult",`<strong>Freeze-the-scene guidance for:</strong> ${eventText}<br><br>${scenario.length?"<strong>Real ramp scenario prompts:</strong><br>"+bullets(scenario)+"<br><br>":""}${bullets(["Stop the operation and protect people from further harm.","Call emergency response or medical support when needed.","Do not move equipment, tools, cords, ladders, vehicles, aircraft items, spill evidence, or PPE unless needed to prevent further injury.","Secure the area with cones, tape, barricades, or a posted person.","Identify witnesses and keep statements factual.","Take photos: wide view, mid-range, and close-up before anything changes.","Capture time, exact location, weather/lighting, equipment asset numbers, aircraft/tail numbers, manager/lead names, and who was notified.","Preserve defective equipment or parts until released by the proper process.","Report through supervisor/safety channels, injury reporting, environmental/spill process, and GSAP/ASAP when applicable."])}<br><br><strong>Key reminder:</strong><br>If an accident occurs, always freeze the scene and report it through the proper process. Do not let the operation clean up the evidence before the facts are captured.`);
}

document.addEventListener("DOMContentLoaded", function(){
  const form=document.getElementById("contactForm");
  if(!form) return;
  form.addEventListener("submit", function(){
    alert("Thank you. Your submission is being sent to UnionSafe141.");
  });
});
