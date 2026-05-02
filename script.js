document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm"); 

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      name: form.name.value,
      email: form.email.value,
      organization: form.organization.value,
      mailing_list: form.mailing_list.checked ? "Yes" : "No",
      message: form.message.value
    };

    fetch(https://script.google.com/macros/s/AKfycbwYxk-n5C7LnhtT3g1CTEX3HxoH-PSBK8xVYC5VHLw7CzWJFzBq0k6FjwPeDcWK6pqo/exec, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(() => {
      alert("Thank you! Submission received.");
      form.reset();
    })
    .catch(() => {
      alert("Submission failed. Check your script URL.");
    });
  });
});
