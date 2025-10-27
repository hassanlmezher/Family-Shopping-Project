import { Router } from "express";
const r = Router();

// Simple health check endpoint for CI / uptime tests
r.get("/", (_, res) => {
  res.json({ ok: true });
});

export default r;