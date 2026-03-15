import { Router } from "express";
import { getDashboardStats } from "../services/storage";
import { isStripeConfigured } from "../services/stripeService";
import { isGmailConfigured } from "../services/gmailService";
import { BUSINESS_CONFIG } from "../../shared/schema";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getDashboardStats() }); });

router.get("/config", (_req, res) => {
  res.json({
    success: true,
    data: {
      business: BUSINESS_CONFIG,
      integrations: { stripe: isStripeConfigured(), gmail: isGmailConfigured(), googleVoice: true },
    },
  });
});

export default router;
