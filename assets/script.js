```javascript
// ==================================================
// ASSURESTATE LLC
// FORMSPREE + ZOHO CRM INTEGRATION
// GitHub Pages Compatible
// ==================================================


// ==================================================
// CONFIGURATION
// ==================================================

const ASSURESTATE_CONFIG = {

  // ------------------------------------------------
  // FORMSPREE
  // ------------------------------------------------
  //
  // This MUST be your Formspree endpoint.
  //
  // Example:
  // https://formspree.io/f/abcdwxyz
  //
  FORMSPREE_ENDPOINT:
    "https://formspree.io/f/xvkgaejz",


  // ------------------------------------------------
  // ZOHO CRM
  // ------------------------------------------------
  //
  // Enable this only if you have a Zoho CRM
  // Webform endpoint that accepts browser POSTs.
  //
  ZOHO_ENABLED:
    false,

  ZOHO_WEBFORM_URL:
    "",


  // ------------------------------------------------
  // LEAD SOURCE
  // ------------------------------------------------

  LEAD_SOURCE:
    "AssureState Website"

};


// ==================================================
// DOM ELEMENTS
// ==================================================

const quoteForm =
  document.getElementById("quoteForm");

const formNote =
  document.getElementById("formNote");

const submitButton =
  document.getElementById("submitButton");

const submitText =
  document.getElementById("submitText");


// ==================================================
// CHECK FORM EXISTS
// ==================================================

if (quoteForm) {

  quoteForm.addEventListener(
    "submit",
    handleQuoteSubmission
  );

}


// ==================================================
// MAIN FORM SUBMISSION
// ==================================================

async function handleQuoteSubmission(event) {

  event.preventDefault();


  // ------------------------------------------------
  // Browser validation
  // ------------------------------------------------

  if (!quoteForm.checkValidity()) {

    quoteForm.reportValidity();

    return;

  }


  // ------------------------------------------------
  // Honeypot protection
  // ------------------------------------------------

  const honeypot =
    document.getElementById("website_url");

  if (
    honeypot &&
    honeypot.value.trim() !== ""
  ) {

    console.warn(
      "Spam submission blocked."
    );

    return;

  }


  // ------------------------------------------------
  // Loading state
  // ------------------------------------------------

  setLoadingState();


  try {


    // ==================================================
    // COLLECT FORM DATA
    // ==================================================

    const formData =
      new FormData(quoteForm);


    // ------------------------------------------------
    // Add lead source
    // ------------------------------------------------

    formData.append(
      "lead_source",
      ASSURESTATE_CONFIG.LEAD_SOURCE
    );


    // ------------------------------------------------
    // Add submission timestamp
    // ------------------------------------------------

    formData.append(
      "submission_date",
      new Date().toISOString()
    );


    // ==================================================
    // SEND TO FORMSPREE
    // ==================================================

    const response =
      await fetch(
        ASSURESTATE_CONFIG.FORMSPREE_ENDPOINT,
        {
          method: "POST",

          body: formData,

          headers: {
            "Accept":
              "application/json"
          }
        }
      );


    // ==================================================
    // READ FORMSPREE RESPONSE
    // ==================================================

    let result = {};

    try {

      result =
        await response.json();

    }

    catch (jsonError) {

      console.warn(
        "Formspree returned a non-JSON response."
      );

    }


    // ==================================================
    // HANDLE FORMSPREE ERROR
    // ==================================================

    if (!response.ok) {

      let message =
        "We could not submit your quote request.";

      if (
        result &&
        Array.isArray(result.errors)
      ) {

        message =
          result.errors
            .map(
              error => error.message
            )
            .join(", ");

      }

      throw new Error(message);

    }


    // ==================================================
    // FORMSPREE SUCCESS
    // ==================================================

    console.log(
      "Formspree submission successful:",
      result
    );


    // ==================================================
    // SEND TO ZOHO
    // ==================================================
    //
    // IMPORTANT:
    //
    // This is optional.
    //
    // If ZOHO_ENABLED is false, this section
    // will be skipped.
    //
    // ==================================================

    if (
      ASSURESTATE_CONFIG.ZOHO_ENABLED &&
      ASSURESTATE_CONFIG.ZOHO_WEBFORM_URL
    ) {

      await sendToZoho(formData);

    }


    // ==================================================
    // DISPLAY SUCCESS MESSAGE
    // ==================================================

    formNote.className =
      "form-status success";

    formNote.textContent =
      "Thank you! Your quote request has been received. An AssureState representative will contact you.";

    submitText.textContent =
      "Request Submitted";


    // ==================================================
    // CLEAR FORM
    // ==================================================

    quoteForm.reset();


  }

  catch (error) {

    console.error(
      "AssureState form error:",
      error
    );


    formNote.className =
      "form-status error";

    formNote.textContent =
      "There was a problem submitting your request. Please try again or contact us directly.";

    submitText.textContent =
      "Submit Quote Request";

  }

  finally {

    submitButton.disabled =
      false;

  }

}


// ==================================================
// LOADING STATE
// ==================================================

function setLoadingState() {

  submitButton.disabled =
    true;

  submitText.textContent =
    "Sending Request...";

  formNote.className =
    "form-status loading";

  formNote.textContent =
    "Submitting your quote request...";

}


// ==================================================
// ZOHO CRM WEBFORM
// ==================================================

async function sendToZoho(formData) {

  if (
    !ASSURESTATE_CONFIG.ZOHO_WEBFORM_URL
  ) {

    console.warn(
      "Zoho Webform URL has not been configured."
    );

    return;

  }


  // ==================================================
  // CREATE ZOHO FORM DATA
  // ==================================================

  const zohoData =
    new FormData();


  // ------------------------------------------------
  // Customer name
  // ------------------------------------------------

  zohoData.append(
    "Last Name",
    formData.get("name") || ""
  );


  // ------------------------------------------------
  // Email
  // ------------------------------------------------

  zohoData.append(
    "Email",
    formData.get("email") || ""
  );


  // ------------------------------------------------
  // Phone
  // ------------------------------------------------

  zohoData.append(
    "Phone",
    formData.get("phone") || ""
  );


  // ------------------------------------------------
  // Company
  // ------------------------------------------------

  zohoData.append(
    "Company",
    formData.get("business") || ""
  );


  // ------------------------------------------------
  // Insurance type
  // ------------------------------------------------

  zohoData.append(
    "Insurance_Type",
    formData.get("insurance_type") || ""
  );


  // ------------------------------------------------
  // ZIP
  // ------------------------------------------------

  zohoData.append(
    "ZIP_Code",
    formData.get("zip") || ""
  );


  // ------------------------------------------------
  // Current insurer
  // ------------------------------------------------

  zohoData.append(
    "Current_Insurer",
    formData.get("current_insurer") || ""
  );


  // ------------------------------------------------
  // Renewal date
  // ------------------------------------------------

  zohoData.append(
    "Renewal_Date",
    formData.get("renewal_date") || ""
  );


  // ------------------------------------------------
  // Additional details
  // ------------------------------------------------

  zohoData.append(
    "Description",
    formData.get("details") || ""
  );


  // ------------------------------------------------
  // Lead source
  // ------------------------------------------------

  zohoData.append(
    "Lead_Source",
    ASSURESTATE_CONFIG.LEAD_SOURCE
  );


  // ==================================================
  // SUBMIT TO ZOHO
  // ==================================================

  try {

    await fetch(
      ASSURESTATE_CONFIG.ZOHO_WEBFORM_URL,
      {
        method: "POST",

        body: zohoData,

        mode: "no-cors"
      }
    );


    console.log(
      "Zoho submission sent."
    );

  }

  catch (error) {

    console.error(
      "Zoho submission error:",
      error
    );

    // Do NOT throw the error.
    //
    // Formspree already succeeded.
    //
    // Therefore the customer's submission
    // should still be considered successful.

  }

}


// ==================================================
// PHONE NUMBER FORMATTING
// ==================================================

const phoneInput =
  document.getElementById("phone");


if (phoneInput) {

  phoneInput.addEventListener(
    "input",
    function () {

      let numbers =
        this.value.replace(/\D/g, "");


      if (numbers.length > 10) {

        numbers =
          numbers.substring(0, 10);

      }


      if (numbers.length >= 6) {

        this.value =
          `(${numbers.substring(0, 3)}) ` +
          `${numbers.substring(3, 6)}-` +
          `${numbers.substring(6)}`;

      }

      else if (numbers.length >= 3) {

        this.value =
          `(${numbers.substring(0, 3)}) ` +
          numbers.substring(3);

      }

      else {

        this.value =
          numbers;

      }

    }
  );

}


// ==================================================
// ZIP VALIDATION
// ==================================================

const zipInput =
  document.getElementById("zip");


if (zipInput) {

  zipInput.addEventListener(
    "input",
    function () {

      this.value =
        this.value.replace(
          /[^0-9-]/g,
          ""
        );

    }
  );

}


// ==================================================
// COPYRIGHT YEAR
// ==================================================

const yearElement =
  document.getElementById("year");


if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}
```
