import { useState } from "react";
import {
  LayoutDashboard, Users, FileText, Receipt, DollarSign,
  Mail, Phone, Bot, Wrench, Menu, X,
} from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Quotes from "./pages/Quotes";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Emails from "./pages/Emails";
import Calls from "./pages/Calls";
import Agent from "./pages/Agent";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "customers", label: "Customers", icon: Users },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "invoices", label: "Invoices", icon: Receipt },
  { id: "payments", label: "Payments", icon: DollarSign },
  { id: "emails", label: "Email", icon: Mail },
  { id: "calls", label: "Calls", icon: Phone },
  { id: "agent", label: "AI Agent", icon: Bot },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [pageData, setPageData] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (p: string, data?: any) => {
    setPage(p);
    setPageData(data || null);
    setSidebarOpen(false);
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard onNavigate={navigate} />;
      case "customers": return <Customers onNavigate={navigate} />;
      case "quotes": return <Quotes onNavigate={navigate} initialData={pageData} />;
      case "invoices": return <Invoices onNavigate={navigate} />;
      case "payments": return <Payments onNavigate={navigate} />;
      case "emails": return <Emails onNavigate={navigate} />;
      case "calls": return <Calls onNavigate={navigate} initialData={pageData} />;
      case "agent": return <Agent onNavigate={navigate} />;
      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile menu button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md">
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white flex flex-col
        transform transition-transform lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">PlumbVoice</h1>
              <p className="text-xs text-slate-400">Brandon Robertson</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${page === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"}
              `}>
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.id === "agent" && (
                <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-indigo-500 rounded-full">AI</span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 text-xs text-slate-500">
          <p>345 Brock St S</p>
          <p>Sarnia, ON N7T 2W7</p>
          <p className="mt-1 text-slate-400">519-402-0576</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
