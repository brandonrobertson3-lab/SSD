import { Router } from "express";
import { getPayments, getPaymentsByInvoice, getPaymentsByCustomer, createPayment } from "../services/storage";
import { isStripeConfigured } from "../services/stripeService";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getPayments() }); });

router.get("/invoice/:invoiceId", (req, res) => {
  res.json({ success: true, data: getPaymentsByInvoice(parseInt(req.params.invoiceId)) });
});

router.get("/customer/:customerId", (req, res) => {
  res.json({ success: true, data: getPaymentsByCustomer(parseInt(req.params.customerId)) });
});

router.post("/", (req, res) => {
  try { res.status(201).json({ success: true, data: createPayment(req.body) }); }
  catch (e: any) { res.status(400).json({ success: false, error: e.message }); }
});

router.get("/config", (_req, res) => {
  res.json({
    success: true,
    data: {
      stripeConfigured: isStripeConfigured(),
      acceptedMethods: [
        { id: "stripe", label: "Credit/Debit Card (Stripe)", enabled: isStripeConfigured() },
        { id: "e-transfer", label: "Interac e-Transfer", enabled: true },
        { id: "cash", label: "Cash", enabled: true },
        { id: "cheque", label: "Cheque", enabled: true },
      ],
    },
  });
});

export default router;
