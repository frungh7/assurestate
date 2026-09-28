// ==================================================
// ASSURESTATE LLC
// FORM + CRM INTEGRATION
// ==================================================


// ==================================================
// CONFIGURATION
// ==================================================

const ASSURESTATE_CONFIG = {

  /*
   * Replace this with the Formspree endpoint
   * from your Formspree dashboard.
   *
   * Example:
   *
   * https://formspree.io/f/abcdwxyz
   */

  FORMSPREE_ENDPOINT:
    "https://formspree.io/f/xvkgaejz",
    "https://formspree.io/f/xvkgaejz",


  /*
   * Zoho Webform endpoint.
   *
   * IMPORTANT:
   *
   * Do NOT put a Zoho API secret/client secret here.
   *
   * This value will come from the HTML generated
   * by your Zoho CRM Webform.
   */

  ZOHO_ENABLED: false,

  ZOHO_WEBFORM_URL:
    "",


  /*
   * Website information
   */

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
// FORM SUBMISSION
// ==================================================

quoteForm.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();


    // ----------------------------------------------
    // Browser validation
    // ----------------------------------------------

    if (!quoteForm.checkValidity()) {

      quoteForm.reportValidity();

      return;

    }


    // ----------------------------------------------
    // Honeypot protection
    // ----------------------------------------------

    const honeypot =
      document.getElementById("website_url");

    if (honeypot && honeypot.value.trim() !== "") {

      return;

    }


    // ----------------------------------------------
    // Loading state
    // ----------------------------------------------

    submitButton.disabled = true;

    submitText.textContent =
      "Sending Request...";

    formNote.className =
      "form-status loading";

    formNote.textContent =
      "Submitting your quote request...";


    try {


      // ------------------------------------------
      // Collect form information
      // ------------------------------------------

      const formData =
        new FormData(quoteForm);


      // ------------------------------------------
      // Add timestamp
      // ------------------------------------------

      formData.append(
        "submission_date",
        new Date().toISOString()
      );


      // ------------------------------------------
      // Send to Formspree
      // ------------------------------------------

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


      const result =
        await response.json();


      // ------------------------------------------
      // Formspree error
      // ------------------------------------------

      if (!response.ok) {

        let message =
          "We could not submit your request.";

        if (result.errors) {

          message =
            result.errors
              .map(error => error.message)
              .join(", ");

        }

        throw new Error(message);

      }


      // ------------------------------------------
      // Success
      // ------------------------------------------

      formNote.className =
        "form-status success";

      formNote.textContent =
        "Thank you! Your quote request has been received. An AssureState representative will contact you.";

      submitText.textContent =
        "Request Submitted";


      // ------------------------------------------
      // Optional Zoho integration
      // ------------------------------------------

      if (
        ASSURESTATE_CONFIG.ZOHO_ENABLED &&
        ASSURESTATE_CONFIG.ZOHO_WEBFORM_URL
      ) {

        await sendToZoho(formData);

      }


      // ------------------------------------------
      // Clear form after success
      // ------------------------------------------

      quoteForm.reset();


    } catch (error) {

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


    } finally {

      submitButton.disabled = false;

    }

  }
);



// ==================================================
// ZOHO CRM WEBFORM
// ==================================================

async function sendToZoho(formData) {

  /*
   * This function is intentionally separated from
   * the Formspree submission.
   *
   * Zoho CRM Webforms use the field names and
   * hidden fields generated by Zoho.
   *
   * Once you provide the Zoho Webform HTML,
   * those fields can be mapped here.
   */


  if (
    !ASSURESTATE_CONFIG.ZOHO_WEBFORM_URL
  ) {

    return;

  }


  const zohoData =
    new FormData();


  // ----------------------------------------------
  // Map AssureState fields to Zoho
  // ----------------------------------------------

  zohoData.append(
    "Last Name",
    formData.get("name") || ""
  );


  zohoData.append(
    "Email",
    formData.get("email") || ""
  );


  zohoData.append(
    "Phone",
    formData.get("phone") || ""
  );


  zohoData.append(
    "Company",
    formData.get("business") || ""
  );


  zohoData.append(
    "Insurance_Type",
    formData.get("insurance_type") || ""
  );


  zohoData.append(
    "ZIP_Code",
    formData.get("zip") || ""
  );


  zohoData.append(
    "Current_Insurer",
    formData.get("current_insurer") || ""
  );


  zohoData.append(
    "Renewal_Date",
    formData.get("renewal_date") || ""
  );


  zohoData.append(
    "Description",
    formData.get("details") || ""
  );


  zohoData.append(
    "Lead_Source",
    ASSURESTATE_CONFIG.LEAD_SOURCE
  );


  /*
   * Send to Zoho Webform
   *
   * NOTE:
   *
   * The exact Zoho field names must match
   * your Zoho Webform generated fields.
   */

  try {

    await fetch(
      ASSURESTATE_CONFIG.ZOHO_WEBFORM_URL,
      {

        method: "POST",

        body: zohoData,

        mode: "no-cors"

      }
    );

  } catch (error) {

    console.error(
      "Zoho submission error:",
      error
    );

  }

}



// ==================================================
// PHONE NUMBER FORMATTING
// ==================================================

const phoneInput =
  document.getElementById("phone");


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



// ==================================================
// ZIP VALIDATION
// ==================================================

const zipInput =
  document.getElementById("zip");


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



// ==================================================
// COPYRIGHT YEAR
// ==================================================

const yearElement =
  document.getElementById("year");


if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}