import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import routers from "./routes/routes.js";
import dbCon from "./utlis/db.js";

// Load environment variables
dotenv.config();

// Create __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
dbCon();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", routers);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendPath));

    // Catch-all route for React
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(frontendPath, "index.html"));
    });
}

// Port setup
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
