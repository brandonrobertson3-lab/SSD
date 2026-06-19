import {
  Wrench, Phone, Mail, MapPin, Star, Clock, Shield, Droplets,
  Flame, ThermometerSun, PipelineIcon, CheckCircle2, ArrowRight,
  Facebook, ExternalLink, MessageCircle, Globe,
} from "lucide-react";

const PHONE = "519-402-0576";
const PHONE_HREF = "tel:+15194020576";
const EMAIL = "brandonrobertson3@gmail.com";
const ADDRESS = "345 Brock St S, Sarnia, Ontario N7T 2W7";
const GOOGLE_MAPS = "https://maps.google.com/?q=345+Brock+St+S+Sarnia+Ontario+N7T+2W7";
const FB_URL = "https://www.facebook.com/PlumbVoiceSarnia";
const GOOGLE_BIZ = "https://g.page/PlumbVoiceSarnia";

const services = [
  { icon: Droplets, title: "Drain Cleaning", desc: "Clogged drains, sewer line cleaning, and camera inspections for residential and commercial." },
  { icon: Flame, title: "Water Heater Service", desc: "Installation, repair, and replacement of tank and tankless water heaters." },
  { icon: PipelineIcon, title: "Pipe Repair & Replacement", desc: "Burst pipe repair, re-piping, copper and PEX installations." },
  { icon: ThermometerSun, title: "Fixture Installation", desc: "Faucets, toilets, sinks, bathtubs, and shower installations." },
  { icon: Wrench, title: "Renovation Plumbing", desc: "Kitchen and bathroom renovations, basement rough-ins, and new construction." },
  { icon: Shield, title: "Emergency Service", desc: "24/7 emergency plumbing for burst pipes, flooding, and gas leaks in Sarnia." },
];

const testimonials = [
  { name: "John M.", location: "Sarnia", stars: 5, text: "Brandon replaced our hot water tank same day. Fair price, clean work, and he explained everything. Highly recommend PlumbVoice!" },
  { name: "Sarah C.", location: "Sarnia", stars: 5, text: "Had a basement bathroom rough-in done for our renovation. Professional, on time, and the quote was accurate to the penny." },
  { name: "Mike T.", location: "Sarnia", stars: 5, text: "Manage multiple rental units and Brandon handles all our plumbing. Fast response for emergencies, reasonable rates." },
  { name: "Lisa R.", location: "Sarnia", stars: 5, text: "Kitchen faucet replaced quickly and affordably. Love the online invoice and payment option. Very modern plumber!" },
];

const serviceAreas = [
  "Sarnia", "Point Edward", "Bright's Grove", "Corunna", "Mooretown",
  "Courtright", "Petrolia", "Oil Springs", "Forest", "Lambton County",
];

interface LandingPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a href={PHONE_HREF} className="flex items-center gap-1 hover:text-blue-300 transition-colors">
              <Phone className="w-3.5 h-3.5" /> {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`} className="hidden sm:flex items-center gap-1 hover:text-blue-300 transition-colors">
              <Mail className="w-3.5 h-3.5" /> {EMAIL}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={GOOGLE_BIZ} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors" aria-label="Google Business">
              <Globe className="w-4 h-4" />
            </a>
            <span className="text-green-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> 24/7 Emergency
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 leading-tight">PlumbVoice</h1>
              <p className="text-xs text-slate-500">Licensed Plumber &bull; Sarnia, ON</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF}
              className="hidden sm:inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <button onClick={() => onNavigate("quotes")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              Get a Quote <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6">
              <Star className="w-4 h-4 text-yellow-300" />
              Sarnia's Trusted Local Plumber
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Professional Plumbing<br />
              <span className="text-blue-200">Services in Sarnia</span>
            </h2>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl">
              From emergency repairs to full renovations, PlumbVoice delivers reliable,
              honest plumbing services across Sarnia and Lambton County. Fair prices,
              quality work, guaranteed.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href={PHONE_HREF}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-green-500/30">
                <Phone className="w-5 h-5" /> Call 519-402-0576
              </a>
              <button onClick={() => onNavigate("agent")}
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors border border-white/30">
                Get Instant Estimate <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-blue-100">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-300" /> Free Estimates</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-300" /> 24/7 Emergency</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-300" /> Licensed & Insured</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-300" /> Online Payments</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50" id="services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Our Plumbing Services</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Full-service plumbing for residential and commercial properties in Sarnia and surrounding areas.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                <div className="p-3 bg-blue-50 rounded-lg w-fit mb-4">
                  <svc.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900 mb-2">{svc.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Why Sarnia Chooses<br /><span className="text-blue-600">PlumbVoice</span>
              </h3>
              <div className="space-y-5">
                {[
                  { title: "Honest, Upfront Pricing", desc: "Detailed quotes before we start. No surprise charges, ever." },
                  { title: "Fast Response Times", desc: "Same-day service for most jobs. Emergency calls answered 24/7." },
                  { title: "Quality Workmanship", desc: "Licensed, experienced, and committed to doing the job right the first time." },
                  { title: "Modern Convenience", desc: "Online quotes, digital invoices, and easy online payment options." },
                  { title: "Local & Trusted", desc: "Born and raised in Sarnia. Your neighbours trust us with their homes." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6">Get a Free Quote Today</h4>
              <p className="text-blue-100 mb-6">
                Tell us about your plumbing needs and we'll provide a detailed, no-obligation quote.
                Our AI estimator can give you an instant ballpark price!
              </p>
              <div className="space-y-3">
                <a href={PHONE_HREF}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Call Us</p>
                    <p className="text-sm text-blue-200">{PHONE}</p>
                  </div>
                </a>
                <a href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 bg-white/20 hover:bg-white/30 rounded-lg p-4 transition-colors">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="font-semibold">Email Us</p>
                    <p className="text-sm text-blue-200">{EMAIL}</p>
                  </div>
                </a>
                <button onClick={() => onNavigate("agent")}
                  className="flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 rounded-lg p-4 transition-colors w-full">
                  <MessageCircle className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">AI Instant Estimate</p>
                    <p className="text-sm text-blue-500">Get a price in 30 seconds</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50" id="reviews">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">What Our Customers Say</h3>
            <p className="text-slate-600">Real reviews from real Sarnia homeowners.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xs">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Service Area ────────────────────────────────────────── */}
      <section className="py-20 bg-white" id="service-area">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">Service Areas</h3>
            <p className="text-slate-600">Proudly serving Sarnia and all of Lambton County.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {serviceAreas.map((area) => (
              <span key={area} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-100">
                <MapPin className="w-3.5 h-3.5 inline mr-1" />{area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Fix Your Plumbing?</h3>
          <p className="text-blue-200 text-lg mb-8">
            Call now for fast, reliable plumbing service in Sarnia. Free estimates on all jobs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={PHONE_HREF}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-lg">
              <Phone className="w-5 h-5" /> Call 519-402-0576
            </a>
            <button onClick={() => onNavigate("quotes")}
              className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors">
              Request a Quote <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Connect ──────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Follow Us & Stay Connected</h3>
            <p className="text-slate-600">See our latest projects and promotions on social media.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={FB_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm">
              <Facebook className="w-5 h-5" /> Follow on Facebook
            </a>
            <a href={GOOGLE_BIZ} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm border border-slate-200">
              <Globe className="w-5 h-5 text-blue-500" /> Google Business
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
            <a href={`mailto:${EMAIL}`}
              className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm border border-slate-200">
              <Mail className="w-5 h-5 text-red-500" /> Email Us
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="font-bold text-lg">PlumbVoice</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional plumbing services for Sarnia and Lambton County.
                Licensed, insured, and committed to quality workmanship.
              </p>
              <div className="flex gap-3 mt-4">
                <a href={FB_URL} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={GOOGLE_BIZ} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors" aria-label="Google">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                {services.map((s) => <li key={s.title}>{s.title}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-blue-400" />
                  <a href={PHONE_HREF} className="hover:text-white transition-colors">{PHONE}</a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-0.5 text-blue-400" />
                  <a href={`mailto:${EMAIL}`} className="hover:text-white transition-colors">{EMAIL}</a>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-blue-400" />
                  <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    {ADDRESS}
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-blue-400" />
                  <span>Mon-Sat 7am-7pm | 24/7 Emergency</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-xs">
            <p>&copy; {new Date().getFullYear()} PlumbVoice &mdash; Brandon Robertson. All rights reserved.</p>
            <p className="mt-1">Serving Sarnia, Point Edward, Bright's Grove, and all of Lambton County.</p>
          </div>
        </div>
      </footer>

      {/* ── Floating Call Button (mobile) ───────────────────────── */}
      <a href={PHONE_HREF}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-500/40 transition-colors"
        aria-label="Call PlumbVoice">
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
