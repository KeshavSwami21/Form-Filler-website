/**
 * Preview Page Script
 * ------------------
 * This script handles:
 * - Loading form data from localStorage and rendering it inside the iframe preview.
 * - Payment initialization using Razorpay.
 * - Security features: shortcut disabling, print disabling, DevTools detection.
 * - AJAX component: On page load, send form data to backend for saving/final verification.
 *
 * Integration Guide:
 * ------------------
 * Backend endpoint (optional save): POST https://your-backend-domain.com/api/save-preview
 * Request body: { applicationData: { ...userFormData } }
 * Response: { success: true }
 *
 * Form Preview Mapping:
 * ----------------------
 * 1. Ensure that in your preview HTML (iframe template, e.g., stc.html),
 *    each element that needs to display data has an "id" matching the form field.
 *    Example: <span id="fullName"></span>
 *
 * 2. Data from localStorage will auto-fill these fields when the page loads.
 *
 * Payment Integration:
 * --------------------
 * Razorpay key placeholder must be replaced with your live/test Razorpay key.
 * The handler function redirects user to payment confirmation page upon success.
 *
 * Security Note:
 * - DevTools detection is in place.
 * - Further security like token verification should be handled in backend.
 */

// Disable shortcuts for copy, paste, screenshot attempts
// function disableShortcuts(event) {
//   if (
//     event.keyCode === 44 || // PrintScreen
//     (event.ctrlKey &&
//       (event.key === "s" || event.key === "p" || event.key === "c"))
//   ) {
//     event.preventDefault();
//     alert("Action disabled for security reasons.");
//     return false;
//   }
// }

// Disable printing
// function disablePrint() {
//   const style = document.createElement("style");
//   style.type = "text/css";
//   style.media = "print";
//   style.appendChild(
//     document.createTextNode("body { display: none !important; }")
//   );
//   document.head.appendChild(style);

//   window.onbeforeprint = () => {
//     document.body.style.display = "none";
//     alert("Printing is disabled for security reasons.");
//   };

//   window.onafterprint = () => {
//     document.body.style.display = "block";
//   };

//   window.addEventListener("beforeprint", () => {
//     document.body.style.display = "none";
//     alert("Printing is disabled for security reasons.");
//   });

//   window.addEventListener("afterprint", () => {
//     document.body.style.display = "block";
//   });
// }

// Detect Print Screen key press attempt
// function detectPrintScreen() {
//   document.addEventListener("keyup", function (e) {
//     if (e.keyCode === 44) {
//       alert("Screenshot is disabled for security reasons.");
//     }
//   });

//   setInterval(() => {
//     navigator.clipboard
//       .writeText("Action disabled for security reasons.")
//       .catch(() => {});
//   }, 3000);
// }

// Detect window blur
// let blurListener;
// function detectWindowBlur() {
//   blurListener = () => {
//     alert("Security alert: Switching tabs or taking screenshots is disabled.");
//   };
//   window.addEventListener("blur", blurListener);
// }

// Temporarily disable blur detection (for Razorpay payment popup)
// function disableBlurDetectionTemporarily() {
//   window.removeEventListener("blur", blurListener);
// }

// Detect if DevTools is open
// function detectDevTools() {
//   let devtoolsOpen = false;
//   const threshold = 160;

//   setInterval(() => {
//     const widthThreshold = window.outerWidth - window.innerWidth > threshold;
//     const heightThreshold = window.outerHeight - window.innerHeight > threshold;
//     if (widthThreshold || heightThreshold) {
//       if (!devtoolsOpen) {
//         devtoolsOpen = true;
//         alert("Developer Tools are not allowed on this page.");
//         document.body.innerHTML =
//           '<h1 style="text-align:center; margin-top: 20%;">Access Denied</h1>';
//       }
//     } else {
//       devtoolsOpen = false;
//     }
//   }, 500);
// }

// Disable right-click in iframe
// function disableIframeContextMenu() {
//   const iframe = document.getElementById("previewFrame");
//   iframe.onload = () => {
//     const iframeDocument =
//       iframe.contentDocument || iframe.contentWindow.document;
//     iframeDocument.addEventListener("contextmenu", function (e) {
//       e.preventDefault();
//       e.stopPropagation();
//       alert("Right-click is disabled for security reasons.");
//     });
//   };
// }

/**
 * Load application data from localStorage into preview iframe.
 * Sends data to backend for optional verification/save before proceeding.
 */
function loadPreviewData() {
  try {
    const previewResponse = JSON.parse(localStorage.getItem("previewResponse"));

    if (!previewResponse || !previewResponse.data) {
      throw new Error("Missing preview data");
    }

    const fileUrl = previewResponse.data.file_url;
    const newTemplateId = previewResponse.data.template_id;

    const iframe = document.getElementById("previewFrame");

    if (iframe && fileUrl) {
      iframe.src = fileUrl; // ✅ Load the preview
      localStorage.setItem("generatedFileUrl", fileUrl); // ✅ Save for later
    } else {
      throw new Error("Invalid file URL or iframe");
    }

    if (newTemplateId) {
      localStorage.setItem("generatedTemplateId", newTemplateId); // ✅ Save for later
    }

  } catch (err) {
    console.error("Preview loading error:", err);
    alert("Preview data not found. Please go back and resubmit the form.");
  }
}


/**
 * Initialize Razorpay Payment
 * Replace placeholder key with your actual Razorpay Key.
 * Handler will redirect to confirmation page after successful payment.
 */
function setupPayment() {
  const payButton = document.getElementById("payButton");

  payButton.addEventListener("click", async function () {
    // disableBlurDetectionTemporarily();

    const phone = document.getElementById("Phoneno").value;
    const promo = document.querySelector("input[name='PromoCode']").value;

    if (!phone) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      // 1. Create Razorpay order via backend
      // replace with your backend URL
      // const response = await fetch("https://your-backend-domain.com/api/create_order/"
      
      const response = await fetch("http://127.0.0.1:8000/billing/create_order/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: phone,
          promocode: promo
        })
      });

      const data = await response.json();

      if (!data.order_id || !data.key_id) {
        alert("Error creating payment order.");
        return;
      }

      // 2. Initialize Razorpay with data from backend
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Application Fee",
        description: "Pay ₹30 for PDF download",
        order_id: data.order_id,
        handler: function (paymentResponse) {
          alert("Payment successful! Payment ID: " + paymentResponse.razorpay_payment_id);
        
          // Get the stored file URL from localStorage
          const fileUrl = localStorage.getItem("generatedFileUrl");        
          // Optional: Redirect to a confirmation page if needed
          window.location.href = "payment.html";
        },       
        prefill: {
          contact: phone
        },
        theme: {
          color: "#6200ee"
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment setup failed:", error);
      alert("Something went wrong. Please try again.");
    }
  });
}


// Initialize everything
/**
 * On DOM Content Loaded:
 * - Setup security features.
 * - Load preview data from localStorage and send to backend.
 * - Initialize payment gateway.
 */
document.addEventListener("DOMContentLoaded", () => {
  // disablePrint();
  // detectPrintScreen();
  // detectWindowBlur();
  // detectDevTools();
  // document.addEventListener("keydown", disableShortcuts);

  loadPreviewData();
  setupPayment();

  // Disable right-click context menu to prevent Save As
  // document.addEventListener("contextmenu", function (e) {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   isRightClick = true;
  //   alert("Right-click is disabled for security reasons.");
  //   setTimeout(() => {
  //     isRightClick = false;
  //   }, 500);
  // });

  // Disable right-click inside iframe
  disableIframeContextMenu();
});
