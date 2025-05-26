const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors"); // Import cors
const upload = require("./middleware/uploadMiddleware");
const fileController = require("./controllers/fileController");
const db = require("./models"); // Import Sequelize instance and models

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", 
};
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend static files - adjust if your frontend build output is elsewhere
// For a typical Vite build, it might be '../frontend/dist'
// app.use(express.static(path.join(__dirname, "../frontend/dist"))); 
app.use(express.static(path.join(__dirname, "../frontend")));


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/upload", upload.single("imageFile"), fileController.uploadFile);

// Sync database and start server
db.sequelize.sync() // Use { force: true } during development to drop and recreate tables
  .then(() => {
    console.log("Database synced.");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      const uploadsDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created directory: ${uploadsDir}`);
      }
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
