document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  if (!form) {
    alert("FORM NOT FOUND");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("FORM SUBMIT INTERCEPTED");
  });
});
