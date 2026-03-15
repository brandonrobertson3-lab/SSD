import { Router } from "express";
import { getDialInfo, logCall, getAllCallLogs, getCustomerCallLogs, completeCall } from "../services/callingService";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getAllCallLogs() }); });

router.get("/customer/:customerId", (req, res) => {
  res.json({ success: true, data: getCustomerCallLogs(parseInt(req.params.customerId)) });
});

router.post("/dial", (req, res) => {
  const { phoneNumber, customerId } = req.body;
  if (!phoneNumber) return res.status(400).json({ success: false, error: "phoneNumber is required" });
  const dialInfo = getDialInfo(phoneNumber, customerId);
  const callLog = logCall({ customerId: customerId || null, phoneNumber: dialInfo.phoneNumber, direction: "outbound", status: "completed" });
  res.json({ success: true, data: { ...dialInfo, callLogId: callLog.id } });
});

router.post("/:id/complete", (req, res) => {
  const updated = completeCall(parseInt(req.params.id), req.body.duration || 0, req.body.notes);
  if (!updated) return res.status(404).json({ success: false, error: "Call log not found" });
  res.json({ success: true, data: updated });
});

export default router;
