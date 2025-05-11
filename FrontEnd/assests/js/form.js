// -----------Form Page Starts--------------
/**
 * Form Page Script
 * ----------------
 * This script handles:
 * - Live form input updates to preview iframe.
 * - Security features: shortcut disabling, print disabling, DevTools detection, right-click disabling.
 * - AJAX form submission to external backend before moving to preview page.
 *
 * Integration Guide:
 * ------------------
 * Backend endpoint: POST https://your-backend-domain.com/api/submit-form
 * Request body: { applicationData: { ...userFormData } }
 * Response: { success: true }
 *
 * Form Preview Mapping:
 * ----------------------
 * 1. Ensure that in your form.html, each input field has an "id" attribute.
 *    Example:
 *    <input type="text" id="fullName" name="fullName" />
 *
 * 2. In your preview HTML (inside the iframe template, e.g., stc.html),
 *    ensure there is an element with the same "id" where you want the data to show.
 *    Example:
 *    <span id="fullName"></span>
 *
 * 3. The script will automatically detect inputs and update the corresponding span/div in the preview live.
 *
 * Security Note:
 * - DevTools detection is in place.
 * - Further security like token verification should be handled in backend.
 */

// Loading the Iframe for regular varibale updates from the fomr
window.addEventListener("load", () => {
  initFormListeners();
});

let isRightClick = false; // Flag to prevent blur spam

// Disable shortcuts for copy, paste, screenshot attempts
function disableShortcuts(event) {
  if (
    event.keyCode === 44 || // PrintScreen
    (event.ctrlKey &&
      (event.key === "s" || event.key === "p" || event.key === "c"))
  ) {
    event.preventDefault();
    alert("Action disabled for security reasons.");
    return false;
  }
}

// Stronger disable printing via media query and JS event
function disablePrint() {
  const style = document.createElement("style");
  style.type = "text/css";
  style.media = "print";
  style.appendChild(
    document.createTextNode("body { display: none !important; }")
  );
  document.head.appendChild(style);

  window.onbeforeprint = () => {
    document.body.style.display = "none";
    alert("Printing is disabled for security reasons.");
  };

  window.onafterprint = () => {
    document.body.style.display = "block";
  };

  window.addEventListener("beforeprint", () => {
    document.body.style.display = "none";
    alert("Printing is disabled for security reasons.");
  });

  window.addEventListener("afterprint", () => {
    document.body.style.display = "block";
  });
}

// Detect Print Screen key press attempt
function detectPrintScreen() {
  document.addEventListener("keyup", function (e) {
    if (e.keyCode === 44) {
      alert("Screenshot is disabled for security reasons.");
    }
  });

  setInterval(() => {
    navigator.clipboard
      .writeText("Action disabled for security reasons.")
      .catch(() => {});
  }, 3000);
}

// Detect if window loses focus (blur detection)
let blurListener;
function detectWindowBlur() {
  blurListener = () => {
    if (!isRightClick) {
      alert(
        "Security alert: Switching tabs or taking screenshots is disabled."
      );
    }
  };
  window.addEventListener("blur", blurListener);
}

// Temporarily disable blur detection (for safe navigation)
function disableBlurDetectionTemporarily() {
  window.removeEventListener("blur", blurListener);
}

//Detect if DevTools is open
function detectDevTools() {
  let devtoolsOpen = false;
  const threshold = 160;

  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        alert("Developer Tools are not allowed on this page.");
        document.body.innerHTML =
          '<h1 style="text-align:center; margin-top: 20%;">Access Denied</h1>';
      }
    } else {
      devtoolsOpen = false;
    }
  }, 500);
}

//Disable right-click in iframe
function disableIframeContextMenu() {
  const iframe = document.getElementById("previewFrame");
  iframe.onload = () => {
    const iframeDocument =
      iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      e.stopPropagation();
      alert("Right-click is disabled for security reasons.");
    });
  };
}

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.querySelector("#profileImage"); // File input element
  const removeButton = document.querySelector("#removePhoto"); // Remove button element

  if (photoInput) {
    photoInput.addEventListener("click", () => {
      disableBlurDetectionTemporarily(); // 🔒 Call it here
    });
  }

  

  // If the photo input exists, add change listener
  if (photoInput) {
    photoInput.addEventListener("change", handleImageUpload);
  }

  // If the remove button exists, add click listenerconst imageInput = document.querySelector('input[type="file"]'); // File input to select image
const modal = document.getElementById("cropperModal"); // Modal that holds the cropper
const imageToCrop = document.getElementById("imageToCrop"); // Image element that will be cropped
const cropButton = document.getElementById("cropButton"); // Button to apply the crop
const cancelButton = document.getElementById("cancelButton"); // Button to cancel cropping
const photoUpload = document.getElementById("profileImage");
const removePhotoButton = document.getElementById("removePhoto");

let cropper = null; // Global cropper instance

// Initially hide the modal on page load
modal.style.display = "none";

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  // If no file is selected, return early
  if (!file) return;

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size exceeds 10MB!");
    return;
  }

  disableBlurDetectionTemporarily();

  const reader = new FileReader();
  reader.onload = function (e) {
    imageToCrop.src = e.target.result; // Set the image source to the uploaded file
    modal.style.display = "flex"; // Show the cropper modal after the image is loaded

    disableBlurDetectionTemporarily();

    // Initialize Cropper.js if it’s not already initialized
    if (cropper) {
      cropper.destroy(); // Destroy any existing cropper instance
    }

    // Initialize Cropper with specific options
    cropper = new Cropper(imageToCrop, {
      aspectRatio: 7 / 9, // Aspect ratio of 7:9 (customizable)
      viewMode: 1, // Restrict crop area inside the image
      movable: true, // Allow the crop area to be moved
      zoomable: true, // Allow zooming
      cropBoxResizable: true, // Allow resizing the crop box

      ready() {
        // When cropper is ready, forcibly resize container
        const cropperContainer = document.querySelector(".cropper-container");
        if (cropperContainer) {
          cropperContainer.style.height = "740px";
        }
      },
    });
  };
  reader.readAsDataURL(file); // Read the selected file

  // Show the Remove Photo button when an image is selected
  removePhotoButton.style.display = "inline-block";
});

// Event listener for remove photo button
removePhotoButton.addEventListener("click", function () {
  // Reset the file input (clears the selected image)
  photoUpload.value = "";

  // Hide the Remove Photo button
  removePhotoButton.style.display = "none";
});

/**
 * Open cropper modal when user selects image.
 */
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  // If no file is selected, return early
  if (!file) return;

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size exceeds 10MB!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    imageToCrop.src = e.target.result; // Set the image source to the uploaded file
    modal.style.display = "flex"; // Show the cropper modal after the image is loaded

    disableBlurDetectionTemporarily();

    // Initialize Cropper.js if it’s not already initialized
    if (cropper) {
      cropper.destroy(); // Destroy any existing cropper instance
    }

    // Initialize Cropper with specific options
    cropper = new Cropper(imageToCrop, {
      aspectRatio: 7 / 9, // Aspect ratio of 7:9 (customizable)
      viewMode: 1, // Restrict crop area inside the image
      movable: true, // Allow the crop area to be moved
      zoomable: true, // Allow zooming
      cropBoxResizable: true, // Allow resizing the crop box

      ready() {
        // When cropper is ready, forcibly resize container
        const cropperContainer = document.querySelector(".cropper-container");
        if (cropperContainer) {
          cropperContainer.style.height = "740px";
        }
      },
    });
  };
  reader.readAsDataURL(file); // Read the selected file
});

/**
 * Handle cropping and uploading the image.
 */
cropButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  if (!cropper) return; // Ensure cropper is initialized

  // Get the cropped image as a canvas
  const canvas = cropper.getCroppedCanvas({
    width: 650, // Set desired width for the cropped image
    height: 550, // Set desired height for the cropped image
  });

  if (canvas) {
    const croppedImageDataURL = canvas.toDataURL("image/png"); // Convert canvas to image URL

    // Find the target image element in the iframe
    const previewFrame = document.getElementById("previewFrame");
    const previewDoc =
      previewFrame.contentDocument || previewFrame.contentWindow.document;
    const targetImg = previewDoc.getElementById("profileImage"); // Image placeholder in the iframe

    // If the target image exists, set its source to the cropped image
    if (targetImg) {
      targetImg.src = croppedImageDataURL;
    } else {
      alert("Image placeholder not found in preview!");
    }

    closeCropper(); // Close the cropper modal
  }
});

/**
 * Handle canceling the cropping operation.
 */
cancelButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission
  closeCropper(); // Close the cropper modal
});

/**
 * Close the cropper modal and reset the cropper instance.
 */
function closeCropper() {
  modal.style.display = "none"; // Hide the modal
  if (cropper) {
    cropper.destroy(); // Destroy the cropper instance
    cropper = null; // Reset cropper variable
  }
  detectWindowBlur();
}
  if (removeButton) {
    removeButton.addEventListener("click", () => {
      clearImage(); // Clear the image from preview
      photoInput.value = ""; // Reset the input field
      showMessage("Image removed."); // Show feedback message
    });
  }
});

/**
 * Handles image cropping and passing to preview frame.
 * Uses Cropper.js for manual cropping before upload.
 */

// Elements
const imageInput = document.querySelector('input[type="file"]'); // File input to select image
const modal = document.getElementById("cropperModal"); // Modal that holds the cropper
const imageToCrop = document.getElementById("imageToCrop"); // Image element that will be cropped
const cropButton = document.getElementById("cropButton"); // Button to apply the crop
const cancelButton = document.getElementById("cancelButton"); // Button to cancel cropping
const photoUpload = document.getElementById("profileImage");
const removePhotoButton = document.getElementById("removePhoto");

let cropper = null; // Global cropper instance

// Initially hide the modal on page load
modal.style.display = "none";

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  // If no file is selected, return early
  if (!file) return;

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size exceeds 10MB!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    imageToCrop.src = e.target.result; // Set the image source to the uploaded file
    modal.style.display = "flex"; // Show the cropper modal after the image is loaded

    disableBlurDetectionTemporarily();

    // Initialize Cropper.js if it’s not already initialized
    if (cropper) {
      cropper.destroy(); // Destroy any existing cropper instance
    }

    // Initialize Cropper with specific options
    cropper = new Cropper(imageToCrop, {
      aspectRatio: 7 / 9, // Aspect ratio of 7:9 (customizable)
      viewMode: 1, // Restrict crop area inside the image
      movable: true, // Allow the crop area to be moved
      zoomable: true, // Allow zooming
      cropBoxResizable: true, // Allow resizing the crop box

      ready() {
        // When cropper is ready, forcibly resize container
        const cropperContainer = document.querySelector(".cropper-container");
        if (cropperContainer) {
          cropperContainer.style.height = "740px";
        }
      },
    });
  };
  reader.readAsDataURL(file); // Read the selected file

  // Show the Remove Photo button when an image is selected
  removePhotoButton.style.display = "inline-block";
});

// Event listener for remove photo button
removePhotoButton.addEventListener("click", function () {
  // Reset the file input (clears the selected image)
  photoUpload.value = "";

  // Hide the Remove Photo button
  removePhotoButton.style.display = "none";
});

/**
 * Open cropper modal when user selects image.
 */
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  // If no file is selected, return early
  if (!file) return;

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("File size exceeds 10MB!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    imageToCrop.src = e.target.result; // Set the image source to the uploaded file
    modal.style.display = "flex"; // Show the cropper modal after the image is loaded

    disableBlurDetectionTemporarily();

    // Initialize Cropper.js if it’s not already initialized
    if (cropper) {
      cropper.destroy(); // Destroy any existing cropper instance
    }

    // Initialize Cropper with specific options
    cropper = new Cropper(imageToCrop, {
      aspectRatio: 7 / 9, // Aspect ratio of 7:9 (customizable)
      viewMode: 1, // Restrict crop area inside the image
      movable: true, // Allow the crop area to be moved
      zoomable: true, // Allow zooming
      cropBoxResizable: true, // Allow resizing the crop box

      ready() {
        // When cropper is ready, forcibly resize container
        const cropperContainer = document.querySelector(".cropper-container");
        if (cropperContainer) {
          cropperContainer.style.height = "740px";
        }
      },
    });
  };
  reader.readAsDataURL(file); // Read the selected file
});

/**
 * Handle cropping and uploading the image.
 */
cropButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission

  if (!cropper) return; // Ensure cropper is initialized

  // Get the cropped image as a canvas
  const canvas = cropper.getCroppedCanvas({
    width: 650, // Set desired width for the cropped image
    height: 550, // Set desired height for the cropped image
  });

  if (canvas) {
    const croppedImageDataURL = canvas.toDataURL("image/png"); // Convert canvas to image URL

    // Find the target image element in the iframe
    const previewFrame = document.getElementById("previewFrame");
    const previewDoc =
      previewFrame.contentDocument || previewFrame.contentWindow.document;
    const targetImg = previewDoc.getElementById("profileImage"); // Image placeholder in the iframe

    // If the target image exists, set its source to the cropped image
    if (targetImg) {
      targetImg.src = croppedImageDataURL;
    } else {
      alert("Image placeholder not found in preview!");
    }

    closeCropper(); // Close the cropper modal
  }
});

/**
 * Handle canceling the cropping operation.
 */
cancelButton.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent form submission
  closeCropper(); // Close the cropper modal
});

/**
 * Close the cropper modal and reset the cropper instance.
 */
function closeCropper() {
  modal.style.display = "none"; // Hide the modal
  if (cropper) {
    cropper.destroy(); // Destroy the cropper instance
    cropper = null; // Reset cropper variable
  }

  detectWindowBlur();
  
}

/**
 * Zoom the image in or out based on mouse wheel movement.
 */
imageToCrop.addEventListener("wheel", function (e) {
  e.preventDefault(); // Prevent default wheel behavior (scrolling)
  if (e.deltaY < 0) {
    cropper.zoom(0.1); // Zoom in
  } else {
    cropper.zoom(-0.1); // Zoom out
  }
});

/**
 * Function to update the background color of a specific target element
 * inside the preview iframe when a color input field is changed.
 *
 * @param {HTMLInputElement} colorInput - The color input field element.
 */
function updateColorField(colorInput) {
  const targetId = colorInput.getAttribute("data-target"); // Get the target element's ID to update
  if (targetId) {
    const targetElement = iframeDocument.getElementById(targetId); // Get the target element inside the iframe
    if (targetElement) {
      targetElement.style.backgroundColor = colorInput.value; // Set the background color
    }
  }
}

/**
 * Function to initialize form listeners for all input, textarea, and select fields.
 * This function listens for 'input' events and updates the preview in real-time.
 */
function initFormListeners() {
  // Select all input, textarea, and select elements in the form
  const formElements = document.querySelectorAll(
    "#applicationForm input, #applicationForm textarea, #applicationForm select"
  );
  const iframe = document.getElementById("previewFrame"); // Get the iframe to display preview
  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow.document; // Get the iframe document

  /**
   * Update the preview content with smooth transition. If the value is empty, set it to '______'.
   * @param {string} targetId - The ID of the target element inside the iframe.
   * @param {string} value - The value to display in the target element.
   */
  function updatePreview(targetId, value) {
    const targetElement = iframeDocument.getElementById(targetId); // Find the target element inside iframe
    if (targetElement) {
      targetElement.style.transition = "all 0.3s ease"; // Smooth transition effect
      targetElement.textContent = value.trim() !== "" ? value : "______"; // Set value or placeholder
    } else {
      console.warn(`Preview target with ID "${targetId}" not found.`);
    }
  }

  /**
   * Update the radio button group based on which radio is selected.
   *
   * @param {HTMLInputElement} radio - The radio button that was clicked.
   */
  function updateRadioGroup(radio) {
    const radioName = radio.name;
    const radios = document.querySelectorAll(`input[name="${radioName}"]`);
    radios.forEach((radioOption) => {
      const targetId = radioOption.getAttribute("data-target");
      if (targetId) {
        // Update preview with '✔' if checked, otherwise empty
        updatePreview(targetId, radioOption.checked ? "✔" : "");
      }
    });
  }

  /**
   * Update the date or month input field and pass the individual year, month, and day to their respective target IDs.
   * For 'date' type inputs, split it into year, month, and day.
   * For 'month' type inputs, split it into year and month, but pass the last two digits of the year.
   *
   * @param {HTMLInputElement} dateInput - The date or month input field.
   */
  function updateDateField(dateInput) {
    const dateParts = dateInput.value.split("-");
    let year = "";
    let month = "";
    let day = "";

    const shouldSplitYear =
      dateInput.getAttribute("data-split-target") === "true";

    if (dateInput.type === "date") {
      // For full date: yyyy-mm-dd
      [year, month, day] = dateParts;
    } else if (dateInput.type === "month") {
      // For month input: yyyy-mm
      [year, month] = dateParts;
    }

    // If data-split-target="true", use last two digits of the year
    if (shouldSplitYear && year.length === 4) {
      year = year.slice(-2);
    }

    const yearTarget = dateInput.getAttribute("data-year-target");
    const monthTarget = dateInput.getAttribute("data-month-target");
    const dayTarget = dateInput.getAttribute("data-day-target"); // Only for date input type

    if (yearTarget) updatePreview(yearTarget, year);
    if (monthTarget) updatePreview(monthTarget, month);
    if (dayTarget && dateInput.type === "date") updatePreview(dayTarget, day);
  }

  /**
   * Update the generic form fields like text, number, etc., by passing the value in uppercase.
   *
   * @param {HTMLElement} element - The form field element.
   */
  function updateGenericField(element) {
    const targetId = element.getAttribute("data-target") || element.id;
    const forceLowerCase = element.getAttribute("data-lower-case") === "true";

    if (targetId) {
      const value = forceLowerCase
        ? element.value
        : element.value.toUpperCase();
      updatePreview(targetId, value);
    }
  }

  /**
   * Update checkbox fields with '✔' when checked, and empty when unchecked.
   *
   * @param {HTMLInputElement} element - The checkbox element.
   */
  function updateCheckbox(element) {
    const targetId = element.getAttribute("data-target");
    if (targetId) updatePreview(targetId, element.checked ? "✔" : ""); // Update preview based on checkbox state
  }

  /**
   * Handle the updates for different types of form elements (radio, date, checkbox, etc.).
   *
   * @param {HTMLElement} element - The form element that triggered the update.
   */
  function handleUpdate(element) {
    if (element.type === "radio") {
      updateRadioGroup(element);
    } else if (element.type === "date" || element.type === "month") {
      updateDateField(element); // Handle both date and month inputs
    } else if (element.type === "checkbox") {
      updateCheckbox(element);
    } else {
      updateGenericField(element); // For text and other inputs
    }
    updateCharacterCount(element); // Update character count for textarea or input with a counter
  }

  /**
   * Initialize input mask for phone number, passport number, or other custom formats.
   *
   * @param {HTMLInputElement} element - The input field element to apply the mask on.
   */
  function applyInputMask(element) {
    const maskType = element.getAttribute("data-mask");
    if (!maskType) return;

    element.addEventListener("input", () => {
      let value = element.value.replace(/\D/g, ""); // Remove non-digit characters
      if (maskType === "phone") {
        value = value.replace(/^(\d{0,3})(\d{0,3})(\d{0,4}).*/, "($1) $2-$3");
      } else if (maskType === "passport") {
        value = value.replace(/^([A-Z]{0,1})(\d{0,7}).*/, "$1$2");
      }
      element.value = value.trim(); // Update the element value with the formatted input
    });
  }

  // Attach listeners to all form fields
  formElements.forEach((element) => {
    applyInputMask(element); // Apply input masks for fields like phone, passport, etc.
    element.addEventListener("input", () => handleUpdate(element)); // Handle updates for each input
  });

  // Initialize form when the page loads
  window.addEventListener("DOMContentLoaded", () => {
    formElements.forEach((element) => handleUpdate(element)); // Update the preview on page load
  });
}

/**
 * Update the character count for all fields with a 'data-counter' attribute.
 *
 * @param {HTMLElement} element - The form element that triggered the update.
 */
function updateCharacterCount(element) {
  const counterId = element.getAttribute("data-counter"); // Get the counter ID from data attribute
  if (counterId) {
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
      const maxLength = element.getAttribute("maxlength"); // Get the maxLength from the textarea
      counterElement.textContent = `${element.value.length} / ${maxLength}`; // Update the character count
    }
  }
}

/**
 * Initializes listeners for all textareas or inputs with character count feature.
 */
function initCharacterCount() {
  const formElements = document.querySelectorAll(
    "textarea[data-counter], input[data-counter]"
  ); // Select all relevant fields

  formElements.forEach((element) => {
    element.addEventListener("input", () => updateCharacterCount(element)); // Add input event listener
    updateCharacterCount(element); // Initialize the counter on page load
  });
}

// Call the initialization function once the DOM is ready
document.addEventListener("DOMContentLoaded", initCharacterCount);

function validateFormFields() {
  const formElements = document.querySelectorAll(
    "#applicationForm input, #applicationForm textarea, #applicationForm select"
  );

  let isValid = true;
  let firstInvalidElement = null;
  const radioGroupsChecked = new Set();

  // Clear old styles
  formElements.forEach((el) => {
    el.style.border = "";
    el.style.outline = "";
    if (el.type === "radio") el.style.borderRadius = "50px";
  });

  formElements.forEach((element) => {
    const isRequired = element.hasAttribute("required");
    const value = element.value.trim();
    const type = element.type;

    if (
      type === "radio" &&
      isRequired &&
      !radioGroupsChecked.has(element.name)
    ) {
      const radioGroup = document.querySelectorAll(
        `input[name="${element.name}"]`
      );
      const anyChecked = Array.from(radioGroup).some((el) => el.checked);

      if (!anyChecked) {
        isValid = false;
        firstInvalidElement = firstInvalidElement || element;
        radioGroup.forEach((el) => {
          el.style.outline = "2px solid red";
          el.style.borderRadius = "50px";
        });
      }

      radioGroupsChecked.add(element.name);
      return;
    }

    if (type === "checkbox" && isRequired && !element.checked) {
      isValid = false;
      firstInvalidElement = firstInvalidElement || element;
      element.style.outline = "2px solid red";
      return;
    }

    if (isRequired && !value && type !== "radio" && type !== "checkbox") {
      isValid = false;
      firstInvalidElement = firstInvalidElement || element;
      element.style.border = "2px solid red";
      return;
    }

    if (type === "email" && value && !/^\S+@\S+\.\S+$/.test(value)) {
      isValid = false;
      firstInvalidElement = firstInvalidElement || element;
      element.style.border = "2px solid red";
      return;
    }

    if (type === "number" && value && isNaN(value)) {
      isValid = false;
      firstInvalidElement = firstInvalidElement || element;
      element.style.border = "2px solid red";
      return;
    }

    if (type === "date" && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      isValid = false;
      firstInvalidElement = firstInvalidElement || element;
      element.style.border = "2px solid red";
      return;
    }
  });

  if (firstInvalidElement) {
    firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
    disableBlurDetectionTemporarily();
    alert("Please fill all required fields correctly.");
  }

  return isValid;
}

/**
 * Handles form submission.
 * Collects all form data and sends it to external backend before redirecting to preview page.
 *
 * Backend Integration:
 * - Endpoint: POST https://your-backend-domain.com/api/submit-form
 * - Request: { applicationData: { ...userFormData } }
 * - On success: saves data to localStorage and redirects to preview page.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  if (!validateFormFields()) return; // ✅ stop if validation fails

  const imageInput = document.getElementById("profileImage");
  const imageFile = imageInput?.files[0];

  const templateId = localStorage.getItem("selectedTemplateId");
  if (!templateId) {
    alert("Template ID not found. Please start again.");
    return;
  }

  // collect all form fields
  const formElements = document.querySelectorAll(
    "#applicationForm input, #applicationForm textarea, #applicationForm select"
  );

  const templateInputArray = [];
  formElements.forEach((element) => {
    const name =
      element.getAttribute("data-target") ||
      element.getAttribute("data-date-target") ||
      element.name ||
      element.id;

    let value = "";

    if (element.type === "radio" || element.type === "checkbox") {
      if (!element.checked) return;
    }

    value = element.value;

    if (name) {
      templateInputArray.push({
        id: name,
        value: value,
      });
    }
  });

  // ✅ Ensure valid input
  if (!templateInputArray.length) {
    alert("Missing form data.");
    return;
  }

  // ✅ Build FormData to match backend expectations
  const formData = new FormData();
  formData.append("template_id", templateId);
  formData.append("template_input", JSON.stringify(templateInputArray)); // 💡 as string
  if (imageFile) {
    formData.append("image", imageFile); // optional file
    formData.append("image_id", imageInput.id);
  }

// Replace the URL with your backend endpoint
// fetch("http://127.0.0.1:8000/api/preview_file/"

  // 🚀 Submit request
  fetch("http://127.0.0.1:8000/api/preview_file/", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      console.log("Preview API response:", data); // ✅ TEMP LOG FOR DEBUG
      localStorage.setItem(
        "applicationData",
        JSON.stringify(templateInputArray)
      );
      localStorage.setItem("previewResponse", JSON.stringify(data)); // ✅ REQUIRED
      disableBlurDetectionTemporarily?.();
      window.location.href = "../../preview.html";
    })

    .catch((error) => {
      console.error("Error submitting form:", error);
      disableBlurDetectionTemporarily();
      alert("There was an error submitting your form. Please try again later.");
    });
}

// Initialize everything after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.querySelector(".left-preview");
  const toggleBtn = document.getElementById("togglePreviewBtn");
  const previewBtn = document.getElementById("previewSubmitBtn");

  if (toggleBtn && previewContainer) {
    toggleBtn.addEventListener("click", () => {
      previewContainer.classList.toggle("show");

      if (previewContainer.classList.contains("show")) {
        toggleBtn.textContent = "Hide Preview";
      } else {
        toggleBtn.textContent = "Show Preview";
      }
    });
  }

  if (previewBtn) {
    previewBtn.addEventListener("click", handleFormSubmit);
  }

  initFormListeners();
  disablePrint();
  detectPrintScreen();
  detectWindowBlur();
  detectDevTools();

  const form = document.getElementById("applicationForm");
  form.addEventListener("submit", handleFormSubmit);

  document.addEventListener("keydown", disableShortcuts);

  //Disable right-click context menu to prevent Save As
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    e.stopPropagation();
    isRightClick = true;
    alert("Right-click is disabled for security reasons.");
    setTimeout(() => {
      isRightClick = false;
    }, 500);
  });

  // Disable right-click inside iframe
  disableIframeContextMenu();
});

// -----------Form Page Ends----------------
