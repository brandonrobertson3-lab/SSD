import type { QuoteEstimateRequest, QuoteEstimateResponse } from "../../shared/types";
import { createAgentSuggestion } from "./storage";

interface PricingEntry {
  keywords: string[];
  laborHours: number;
  laborRate: number;
  materials: { description: string; cost: number }[];
  additionalItems?: { description: string; cost: number; category: "equipment" | "other" }[];
}

const PRICING_DATABASE: Record<string, PricingEntry> = {
  faucet_replacement: { keywords: ["faucet", "tap", "sink faucet"], laborHours: 1.5, laborRate: 95, materials: [{ description: "Faucet fixture (mid-range)", cost: 250 }, { description: "Supply lines and fittings", cost: 35 }] },
  toilet_repair: { keywords: ["toilet", "running toilet", "toilet leak", "flush"], laborHours: 1, laborRate: 95, materials: [{ description: "Toilet repair kit", cost: 45 }, { description: "Wax ring seal", cost: 15 }] },
  toilet_replacement: { keywords: ["toilet install", "new toilet", "replace toilet"], laborHours: 2, laborRate: 95, materials: [{ description: "Toilet (mid-range)", cost: 350 }, { description: "Wax ring and bolts", cost: 20 }, { description: "Supply line", cost: 15 }], additionalItems: [{ description: "Disposal of old toilet", cost: 40, category: "other" }] },
  water_heater: { keywords: ["water heater", "hot water tank", "hot water", "tankless"], laborHours: 4, laborRate: 95, materials: [{ description: "Water heater (50 gal)", cost: 1200 }, { description: "Copper fittings", cost: 85 }, { description: "Expansion tank", cost: 65 }], additionalItems: [{ description: "Permit and inspection", cost: 150, category: "other" }, { description: "Removal of old unit", cost: 75, category: "other" }] },
  drain_cleaning: { keywords: ["drain", "clogged", "blocked", "slow drain", "snake"], laborHours: 1, laborRate: 95, materials: [], additionalItems: [{ description: "Drain cleaning (power snake)", cost: 175, category: "equipment" }] },
  pipe_repair: { keywords: ["pipe", "leak", "burst pipe", "broken pipe"], laborHours: 2, laborRate: 95, materials: [{ description: "Copper pipe section", cost: 45 }, { description: "Fittings and solder", cost: 30 }] },
  sump_pump: { keywords: ["sump pump", "sump", "basement flooding"], laborHours: 3, laborRate: 95, materials: [{ description: "Sump pump (1/3 HP)", cost: 250 }, { description: "Check valve and PVC piping", cost: 65 }, { description: "Discharge line fittings", cost: 40 }] },
  bathroom_rough_in: { keywords: ["rough in", "roughin", "rough-in", "basement bathroom", "new bathroom"], laborHours: 16, laborRate: 95, materials: [{ description: "PEX piping and fittings", cost: 650 }, { description: "Drain/waste/vent system", cost: 1200 }, { description: "Concrete cutting", cost: 400 }], additionalItems: [{ description: "Permit and inspection", cost: 250, category: "other" }] },
  garbage_disposal: { keywords: ["garbage disposal", "garburator"], laborHours: 1.5, laborRate: 95, materials: [{ description: "Garbage disposal unit", cost: 180 }, { description: "Mounting hardware", cost: 35 }] },
  backflow_preventer: { keywords: ["backflow", "rpz"], laborHours: 3, laborRate: 95, materials: [{ description: "Backflow preventer (RPZ)", cost: 450 }, { description: "Copper fittings", cost: 75 }], additionalItems: [{ description: "Annual testing cert", cost: 125, category: "other" }] },
  shower_valve: { keywords: ["shower", "shower valve", "shower cartridge", "tub"], laborHours: 2, laborRate: 95, materials: [{ description: "Shower valve/cartridge", cost: 120 }, { description: "Trim kit", cost: 85 }, { description: "Wall access panel", cost: 40 }] },
  general_plumbing: { keywords: ["plumbing", "general", "service call", "inspection"], laborHours: 1, laborRate: 95, materials: [{ description: "Miscellaneous supplies", cost: 50 }], additionalItems: [{ description: "Service call fee", cost: 85, category: "other" }] },
};

const URGENCY_MULT = { normal: 1.0, urgent: 1.25, emergency: 1.5 };
const PROPERTY_MULT = { residential: 1.0, commercial: 1.15 };

function matchJobType(description: string): PricingEntry {
  const lower = description.toLowerCase();
  for (const entry of Object.values(PRICING_DATABASE)) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) return entry;
    }
  }
  return PRICING_DATABASE.general_plumbing;
}

export function generateQuoteEstimate(request: QuoteEstimateRequest): QuoteEstimateResponse {
  const pricing = matchJobType(request.jobDescription);
  const uMult = URGENCY_MULT[request.urgency];
  const pMult = PROPERTY_MULT[request.propertyType];
  const combined = uMult * pMult;

  const items: QuoteEstimateResponse["estimatedLineItems"] = [];
  items.push({
    description: `Labor - ${request.jobDescription}${request.urgency !== "normal" ? ` (${request.urgency} rate)` : ""}`,
    quantity: pricing.laborHours, unitPrice: Math.round(pricing.laborRate * combined), category: "labor",
  });
  for (const mat of pricing.materials) {
    items.push({ description: mat.description, quantity: 1, unitPrice: Math.round(mat.cost * (pMult > 1 ? 1.05 : 1)), category: "materials" });
  }
  if (pricing.additionalItems) {
    for (const item of pricing.additionalItems) {
      items.push({ description: item.description, quantity: 1, unitPrice: item.cost, category: item.category });
    }
  }
  if (request.urgency === "emergency") {
    items.push({ description: "Emergency call-out fee", quantity: 1, unitPrice: 125, category: "other" });
  }

  const estimatedTotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const notes: string[] = [];
  if (request.urgency === "emergency") notes.push("Emergency rate applied (50% surcharge).");
  else if (request.urgency === "urgent") notes.push("Urgent rate applied (25% surcharge).");
  if (request.propertyType === "commercial") notes.push("Commercial property rates applied.");
  notes.push("Prices are estimates. Final price may vary based on site conditions.");
  notes.push("All prices in CAD. Ontario HST (13%) added to final total.");
  notes.push("Quote valid for 30 days.");

  const lower = request.jobDescription.toLowerCase();
  let confidence = 0.5;
  for (const entry of Object.values(PRICING_DATABASE)) {
    for (const kw of entry.keywords) { if (lower.includes(kw)) confidence = Math.min(confidence + 0.15, 0.95); }
  }

  const response: QuoteEstimateResponse = {
    estimatedLineItems: items, estimatedTotal,
    estimatedDuration: pricing.laborHours <= 1 ? "Under 1 hour" : pricing.laborHours <= 4 ? "Half day" : pricing.laborHours <= 8 ? "Full day" : `${Math.ceil(pricing.laborHours / 8)} days`,
    notes: notes.join("\n"), confidence,
  };

  createAgentSuggestion({ type: "quote_estimate", input: JSON.stringify(request), suggestion: response });
  return response;
}

export function getJobTypes() {
  return [
    { value: "faucet_replacement", label: "Faucet Replacement", description: "Kitchen or bathroom faucet" },
    { value: "toilet_repair", label: "Toilet Repair", description: "Fix running or leaking toilet" },
    { value: "toilet_replacement", label: "Toilet Replacement", description: "Remove old, install new" },
    { value: "water_heater", label: "Water Heater", description: "Install or replace water heater" },
    { value: "drain_cleaning", label: "Drain Cleaning", description: "Clear clogged drains" },
    { value: "pipe_repair", label: "Pipe Repair", description: "Fix leaking or burst pipes" },
    { value: "sump_pump", label: "Sump Pump", description: "Install or replace sump pump" },
    { value: "bathroom_rough_in", label: "Bathroom Rough-In", description: "New bathroom plumbing" },
    { value: "garbage_disposal", label: "Garbage Disposal", description: "Install or replace garburator" },
    { value: "backflow_preventer", label: "Backflow Preventer", description: "Install RPZ backflow device" },
    { value: "shower_valve", label: "Shower/Tub Repair", description: "Repair or replace shower valve" },
    { value: "general_plumbing", label: "General Service", description: "General plumbing service call" },
  ];
}
