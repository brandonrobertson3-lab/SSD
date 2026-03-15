import { Router } from "express";
import { insertCustomerSchema } from "../../shared/schema";
import { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "../services/storage";

const router = Router();

router.get("/", (_req, res) => { res.json({ success: true, data: getCustomers() }); });

router.get("/:id", (req, res) => {
  const c = getCustomerById(parseInt(req.params.id));
  if (!c) return res.status(404).json({ success: false, error: "Customer not found" });
  res.json({ success: true, data: c });
});

router.post("/", (req, res) => {
  const parsed = insertCustomerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, error: parsed.error.message });
  res.status(201).json({ success: true, data: createCustomer(parsed.data) });
});

router.put("/:id", (req, res) => {
  const c = updateCustomer(parseInt(req.params.id), req.body);
  if (!c) return res.status(404).json({ success: false, error: "Customer not found" });
  res.json({ success: true, data: c });
});

router.delete("/:id", (req, res) => {
  if (!deleteCustomer(parseInt(req.params.id))) return res.status(404).json({ success: false, error: "Customer not found" });
  res.json({ success: true });
});

export default router;
