import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/queryClient";
import { formatCurrency, formatDateTime, getStatusColor, cn } from "@/lib/utils";
import {
  Users,
  FileText,
  Receipt,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Bot,
  ArrowRight,
  Wrench,
} from "lucide-react";

interface Props {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiGet("/api/dashboard"),
  });

  const { data: config } = useQuery({
    queryKey: ["dashboard-config"],
    queryFn: () => apiGet("/api/dashboard/config"),
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
              <div className="h-8 bg-slate-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Customers",
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      color: "bg-blue-500",
      page: "customers",
    },
    {
      label: "Active Quotes",
      value: stats?.activeQuotes ?? 0,
      icon: FileText,
      color: "bg-amber-500",
      page: "quotes",
    },
    {
      label: "Pending Invoices",
      value: stats?.pendingInvoices ?? 0,
      icon: Receipt,
      color: "bg-orange-500",
      page: "invoices",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: DollarSign,
      color: "bg-emerald-500",
      page: "payments",
    },
  ];

  const quickActions = [
    { label: "New Quote", icon: FileText, page: "quotes", desc: "Create a quote with AI assistance" },
    { label: "New Invoice", icon: Receipt, page: "invoices", desc: "Bill a customer for work done" },
    { label: "Add Customer", icon: Users, page: "customers", desc: "Add a new customer" },
    { label: "Send Email", icon: Mail, page: "emails", desc: "Email a customer directly" },
    { label: "Make a Call", icon: Phone, page: "calls", desc: "Call via Google Voice" },
    { label: "AI Agent", icon: Bot, page: "agent", desc: "Get AI quote estimates" },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            <Wrench className="inline-block w-8 h-8 mr-2 text-blue-600" />
            PlumbVoice
          </h1>
          <p className="text-slate-500 mt-1">
            {config?.business?.owner} &middot; {config?.business?.phone}
          </p>
        </div>
        <div className="flex gap-2">
          {config?.integrations?.stripe && (
            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Stripe Active</span>
          )}
          {config?.integrations?.gmail && (
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Gmail Active</span>
          )}
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Google Voice</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <button
            key={card.label}
            onClick={() => onNavigate(card.page)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all text-left border border-slate-100"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.label}</span>
              <div className={cn("p-2 rounded-lg text-white", card.color)}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-100 text-left group"
            >
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900">{action.label}</p>
                <p className="text-sm text-slate-500">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {stats?.recentActivity?.length ? (
            <div className="divide-y divide-slate-100">
              {stats.recentActivity.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getStatusColor(item.type))}>
                      {item.type}
                    </span>
                    <span className="text-sm text-slate-700">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {item.amount != null && (
                      <span className="text-sm font-medium text-slate-900">{formatCurrency(item.amount)}</span>
                    )}
                    <span className="text-xs text-slate-400">{formatDateTime(item.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <p>No activity yet. Start by creating a quote!</p>
            </div>
          )}
        </div>
      </div>

      {/* Business Info Footer */}
      <div className="bg-slate-800 text-white rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg">PlumbVoice</h3>
            <p className="text-slate-300 text-sm">
              {config?.business?.owner} &middot; {config?.business?.address}, {config?.business?.city},{" "}
              {config?.business?.province} {config?.business?.postalCode}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-300" />
            <span className="text-slate-300">{config?.business?.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
