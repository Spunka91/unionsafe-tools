document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new URLSearchParams();
    data.append("name", form.name.value);
    data.append("email", form.email.value);
    data.append("organization", form.organization.value);
    data.append("mailing_list", form.mailing_list.checked ? "Yes" : "No");
    data.append("message", form.message.value);

    fetch(https://script.google.com/macros/s/AKfycbwRNhBxPdep1HjRQ1acPONWaFlgMxNc7n5Kuj-HCViHpRpFMqfs_XCZCwzK6_x2cRr_/exec, {
      method: "POST",
      mode: "no-cors",
      body: data
    });

    alert("Thank you! Submission received.");
    form.reset();
  });
});
