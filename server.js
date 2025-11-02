import express from "express";
import multer from "multer";
import fs from "fs";

const app = express();
const PORT = 3000;

// Serve static files from 'public' folder
app.use(express.static("public"));

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed!"));
  }
});

// Upload route
app.post("/upload", upload.single("pdfFile"), (req, res) => {
  res.redirect("/");
});

// Get list of uploaded PDFs
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).send("Error reading uploads folder");
    const pdfs = files.filter(f => f.endsWith(".pdf"));
    res.json(pdfs);
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
