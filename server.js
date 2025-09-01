const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.text({ type: "text/html" }));

app.post("/generate-pdf", (req, res) => {
  const htmlContent = req.body;

  // Save temp HTML file
  const htmlPath = path.join(__dirname, "temp.html");
  const pdfPath = path.join(__dirname, "output.pdf");

  fs.writeFileSync(htmlPath, htmlContent);

  // Run wkhtmltopdf
  exec(`wkhtmltopdf ${htmlPath} ${pdfPath}`, (error) => {
    if (error) {
      console.error("Error generating PDF:", error);
      return res.status(500).send("PDF generation failed");
    }

    // Send PDF back
    res.download(pdfPath, "certificate.pdf", () => {
      fs.unlinkSync(htmlPath);
      fs.unlinkSync(pdfPath);
    });
  });
});

app.listen(3000, () => console.log("PDF Service running on port 3000"));
