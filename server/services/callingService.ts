import { createCallLog, getCallLogs, getCallLogsByCustomer, getCustomerById } from "./storage";
import type { CallLog, InsertCallLog } from "../../shared/schema";

export interface DialInfo {
  phoneNumber: string;
  telUri: string;
  googleVoiceUrl: string;
  customerName?: string;
}

export function getDialInfo(phoneNumber: string, customerId?: number): DialInfo {
  const digits = phoneNumber.replace(/\D/g, "");
  const fullNumber = digits.length === 10 ? `1${digits}` : digits;
  const formatted = `+${fullNumber}`;
  let customerName: string | undefined;
  if (customerId) {
    const customer = getCustomerById(customerId);
    if (customer) customerName = `${customer.firstName} ${customer.lastName}`;
  }
  return {
    phoneNumber: formatted,
    telUri: `tel:${formatted}`,
    googleVoiceUrl: `https://voice.google.com/u/0/calls?a=nc,%2B${fullNumber}`,
    customerName,
  };
}

export function logCall(data: InsertCallLog): CallLog { return createCallLog(data); }
export function getAllCallLogs(): CallLog[] { return getCallLogs(); }
export function getCustomerCallLogs(customerId: number): CallLog[] { return getCallLogsByCustomer(customerId); }

export function completeCall(callLogId: number, duration: number, notes?: string): CallLog | undefined {
  const logs = getCallLogs();
  const log = logs.find((l) => l.id === callLogId);
  if (!log) return undefined;
  (log as any).duration = duration;
  if (notes) (log as any).notes = notes;
  (log as any).status = "completed";
  return log;
}
