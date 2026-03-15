import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Route imports
import customerRoutes from "./routes/customerRoutes";
import quoteRoutes from "./routes/quoteRoutes";
import invoiceRoutes from "./routes/invoiceRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import emailRoutes from "./routes/emailRoutes";
import callRoutes from "./routes/callRoutes";
import agentRoutes from "./routes/agentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "10mb" }));

// ─── API Routes ──────────────────────────────────────────────────────
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/agent", agentRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "PlumbVoice", version: "1.0.0" });
});

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist/public")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist/public/index.html"));
  });
}

// Create HTTP server
const server = createServer(app);

server.listen(port, () => {
  console.log(`PlumbVoice Server running on port ${port}`);
  console.log(`API: http://localhost:${port}/api/health`);
});
