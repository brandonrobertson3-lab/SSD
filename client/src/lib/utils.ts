import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(num);
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "draft": return "bg-slate-100 text-slate-700";
    case "sent": return "bg-blue-100 text-blue-700";
    case "accepted": return "bg-green-100 text-green-700";
    case "declined": return "bg-red-100 text-red-700";
    case "expired": return "bg-amber-100 text-amber-700";
    case "paid": return "bg-emerald-100 text-emerald-700";
    case "overdue": return "bg-red-100 text-red-700";
    case "cancelled": return "bg-gray-100 text-gray-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "completed": return "bg-green-100 text-green-700";
    case "failed": return "bg-red-100 text-red-700";
    case "quote": return "bg-amber-100 text-amber-700";
    case "invoice": return "bg-blue-100 text-blue-700";
    case "payment": return "bg-emerald-100 text-emerald-700";
    default: return "bg-gray-100 text-gray-700";
  }
}
