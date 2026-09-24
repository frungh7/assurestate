// ==================================================
// ASSURESTATE WEBSITE JAVASCRIPT
// ==================================================


// ==================================================
// QUOTE FORM
// ==================================================

const quoteForm = document.getElementById("quoteForm");

const formNote = document.getElementById("formNote");


quoteForm.addEventListener("submit", function (event) {

  // Prevent the browser from actually submitting
  // the form to the "#" URL.
  event.preventDefault();


  // Display confirmation message
  formNote.textContent =
    "Thanks! In this starter version, your submission is not sent. I can help you connect it to email/CRM.";


  // Optional: scroll to the message
  formNote.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });

});


// ==================================================
// COPYRIGHT YEAR
// ==================================================

const yearElement = document.getElementById("year");

yearElement.textContent = new Date().getFullYear();