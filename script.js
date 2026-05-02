function oshaRef(){
  document.getElementById("oshaRefResult").innerText = "Check OSHA walking surfaces, PPE, and hazard communication standards.";
}

function oshaCheck(){
  document.getElementById("oshaCheckResult").innerText = "Evaluate if condition creates a hazard. If yes, report immediately.";
}

function ppeCheck(){
  document.getElementById("ppeResult").innerText = "Use proper PPE. Unknown spill: do NOT touch until identified.";
}

function stopWorkCheck(){
  document.getElementById("stopWorkResult").innerText = "If unsafe conditions exist, stop work and escalate immediately.";
}

function timePressureCheck(){
  document.getElementById("timePressureResult").innerText = "Time pressure increases risk. Slow down and reassess.";
}

function nearMissCheck(){
  document.getElementById("nearMissResult").innerText = "Describe what almost happened, contributing factors, and prevention.";
}

function reportCheck(){
  document.getElementById("reportResult").innerText = "Report to supervisor, safety, or GSAP depending on severity.";
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new URLSearchParams();
    data.append("name", form.name.value);
    data.append("email", form.email.value);
    data.append("organization", form.organization.value);
    data.append("mailing_list", form.mailing_list.checked ? "Yes" : "No");
    data.append("message", form.message.value);

    fetch("https://script.google.com/macros/s/AKfycbwYxk-n5C7LnhtT3g1CTEX3HxoH-PSBK8xVYC5VHLw7CzWJFzBq0k6FjwPeDcWK6pqo/exec", {
      method: "POST",
      mode: "no-cors",
      body: data
    });

    alert("Thank you! Submission received.");
    form.reset();
  });
});
