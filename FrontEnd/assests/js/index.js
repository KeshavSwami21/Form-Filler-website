document.addEventListener("DOMContentLoaded", function () {
  const cardGrid = document.querySelector(".card-grid");


// replace with your backend URL
//  fetch("http://127.0.0.1:8000/api/get_field_list/")

  // Fetch template list from backend
  fetch("http://127.0.0.1:8000/api/get_field_list/")
    .then((res) => res.json())
    .then((data) => {
      const templates = data.data;

      templates.forEach((template) => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("data-template-id", template.template_id);
        card.innerHTML = `
          <h3>${template.field}</h3>
          <p>${template.template_desc}</p>
        `;

        // When clicked, save template_id and navigate to corresponding form
        card.addEventListener("click", () => {
          localStorage.setItem("selectedTemplateId", template.template_id);

          // Sanitize the field to create a valid filename
          const sanitizedField = template.field
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");
          
          console.log("Sanitized field:", sanitizedField); // Debugging line

          const formPath = `assests/applicationInputform/${sanitizedField}.html`;

          // Check if the form file exists
          fetch(formPath, { method: "HEAD" })
            .then((response) => {
              if (response.ok) {
                // If the file exists, navigate to it with the template_id as a query parameter
                window.location.href = `${formPath}?template_id=${template.template_id}`;
              } else {
                // If the file doesn't exist, handle accordingly
                alert("Form not found for the selected template.");
              }
            })
            .catch((error) => {
              console.error("Error checking form file:", error);
              alert("An error occurred while checking the form file.");
            });
        });

        cardGrid.appendChild(card);
      });
    })
    .catch((error) => {
      console.error("Error loading templates:", error);
      cardGrid.innerHTML = "<p>Error loading templates. Please try again later.</p>";
    });
});
