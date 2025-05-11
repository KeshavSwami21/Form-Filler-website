function setupDownloadAndDelete() {
  const downloadButton = document.getElementById("downloadButton");

  downloadButton.addEventListener("click", async () => {
    const previewData = JSON.parse(localStorage.getItem("previewResponse"));

if (!previewData?.data?.file_url || !previewData?.data?.template_id) {
  alert("Required data not found. Please go back and regenerate the form.");
  return;
}

const fileUrl = previewData.data.file_url;
const templateId = previewData.data.template_id;

    downloadButton.disabled = true;
    downloadButton.textContent = "Downloading and preparing print...";

    try {
      const response = await fetch(fileUrl);
      const htmlContent = await response.text();

      const htmlWithPrint = `
        <html>
          <head>
            <title>Print Document</title>
            <script>
              window.onload = function () {
                window.print();
                window.onafterprint = function () {
                  window.close();
                };
              };
            </script>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `;

      const blob = new Blob([htmlWithPrint], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);


      // replace with your backend URL
      // const deleteUrl = "http://your-backend-url/api/filled_doc/delete/${templateId}";
      
      // 🔥 Trigger DELETE after opening the print window
      const deleteUrl = `http://127.0.0.1:8000/api/filled_doc/delete/${templateId}/`;
      await fetch(deleteUrl, { method: "DELETE" });

      console.log("Template deleted:", templateId);

    } catch (error) {
      console.error("Error while downloading or deleting:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      downloadButton.textContent = "Download PDF";
      downloadButton.disabled = false;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupDownloadAndDelete();
});
