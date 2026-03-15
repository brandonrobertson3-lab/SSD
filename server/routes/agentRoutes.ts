import { Router } from "express";
import { generateQuoteEstimate, getJobTypes } from "../services/agentService";

const router = Router();

router.get("/job-types", (_req, res) => { res.json({ success: true, data: getJobTypes() }); });

router.post("/estimate", (req, res) => {
  try {
    const request = {
      jobDescription: req.body.jobDescription || "",
      jobType: req.body.jobType || "general_plumbing",
      urgency: req.body.urgency || "normal",
      propertyType: req.body.propertyType || "residential",
    };
    if (!request.jobDescription) return res.status(400).json({ success: false, error: "jobDescription is required" });
    res.json({ success: true, data: generateQuoteEstimate(request) });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

export default router;
