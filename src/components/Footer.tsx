import React, { useState } from 'react';
import { 
  Factory, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Award, 
  Zap, 
  Truck, 
  Shield, 
  Send,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  showToast?: (message: string, type?: 'success' | 'info') => void;
}

export default function Footer({ onNavigate, showToast }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    if (showToast) {
      showToast(`Thank you! Corporate procurement updates & price bulletins will be sent to ${newsletterEmail}`, 'success');
    }
    setIsSubmitted(true);
    setNewsletterEmail('');
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <footer id="corporate-footer" className="bg-[#121110] text-stone-300 border-t border-[#2a2622] pt-14 pb-8 transition-colors duration-200">
      {/* Top Banner - Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#1c1917] border border-[#2e2a24] shadow-lg">
          <div className="flex items-center space-x-3.5 p-2">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">SANS & ISO Certified</h4>
              <p className="text-[11px] text-stone-400">Strict mining safety compliance across all gear</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Rapid Site Dispatch</h4>
              <p className="text-[11px] text-stone-400">Copperbelt & regional mine shaft delivery</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Clean Energy Solutions</h4>
              <p className="text-[11px] text-stone-400">Commercial solar PV & backup engineering</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5 p-2">
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Vetted Skilled Labour</h4>
              <p className="text-[11px] text-stone-400">MQA-accredited coded welders & artisans</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Company Profile & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 text-stone-950 p-2.5 rounded-xl flex items-center justify-center shadow-md">
                <Factory className="h-6 w-6 font-black" />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider uppercase block text-amber-400 font-mono">
                  Ndulu
                </span>
                <span className="text-[11px] text-stone-400 uppercase tracking-widest block -mt-1 font-mono font-semibold">
                  General Dealers Ltd.
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Premier industrial distributor, safety equipment supplier, and commercial engineering partner. We supply top-tier heavy-duty mining PPE, certified tools, solar PV infrastructure, vetted technical labour hire, and HACCP-certified industrial catering to commercial mines and industrial operations.
            </p>

            <div className="pt-1 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-stone-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                  Warehouses & Dispatch: Fully Operational
                </span>
              </div>
              <p className="text-[11px] font-mono text-stone-500">
                Registered Vendor • PACRA & ISO Accredited
              </p>
            </div>
          </div>

          {/* Column 2: Procurement & Fast Navigation (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>Quick Portals</span>
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-amber-400 text-stone-400 transition-colors flex items-center space-x-1.5 py-1 text-left w-full cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-amber-500/70 flex-shrink-0" />
                  <span>Product Catalog</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('builder')}
                  className="hover:text-amber-400 text-stone-400 transition-colors flex items-center space-x-1.5 py-1 text-left w-full cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-amber-500/70 flex-shrink-0" />
                  <span>RFQ Quote Builder</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('advisor')}
                  className="hover:text-amber-400 text-stone-400 transition-colors flex items-center space-x-1.5 py-1 text-left w-full cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-amber-500/70 flex-shrink-0" />
                  <span>Safety Advisor (PPE)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('past')}
                  className="hover:text-amber-400 text-stone-400 transition-colors flex items-center space-x-1.5 py-1 text-left w-full cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-amber-500/70 flex-shrink-0" />
                  <span>Procurement Archives</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-amber-400 text-stone-400 transition-colors flex items-center space-x-1.5 py-1 text-left w-full cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-amber-500/70 flex-shrink-0" />
                  <span>Admin Management</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Operational Divisions (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>Supply Divisions</span>
            </h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center space-x-2 py-0.5">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                <span>Heavy Duty Spares, Hydraulics & Liners</span>
              </li>
              <li className="flex items-center space-x-2 py-0.5">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                <span>Heavy Industrial PPE & Boots</span>
              </li>
              <li className="flex items-center space-x-2 py-0.5">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                <span>Digging, Mining & Sledge Tools</span>
              </li>
              <li className="flex items-center space-x-2 py-0.5">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                <span>Commercial Solar PV Systems</span>
              </li>
              <li className="flex items-center space-x-2 py-0.5">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                <span>Coded Welders & Labour Hire</span>
              </li>
              <li className="flex items-center space-x-2 py-0.5">
                <span className="h-1 w-1 bg-amber-500 rounded-full"></span>
                <span>Industrial Shift Meal Supplies</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Procurement Desk (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              <span>Procurement Desk</span>
            </h3>
            
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Chingola, Copperbelt Province</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="font-mono text-stone-200">
                  <a href="tel:+260769973720" className="hover:text-amber-400 transition-colors">+260 769 973 720</a>
                  <span className="mx-1.5 text-stone-500">/</span>
                  <a href="tel:+260977825541" className="hover:text-amber-400 transition-colors">+260 977 825 541</a>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <a href="mailto:ndulugeneraldealers@gmail.com" className="font-mono text-stone-200 hover:text-amber-400 transition-colors">
                  ndulugeneraldealers@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span>Mon – Fri: 07:30 – 17:30 | 24/7 Mine Support</span>
              </div>
            </div>

            {/* Newsletter / Bulletin Signup */}
            <div className="pt-2">
              <span className="text-[11px] font-mono text-stone-400 block mb-1.5 font-semibold">
                Quarterly Mining Supply Bulletin:
              </span>
              {isSubmitted ? (
                <div className="flex items-center space-x-2 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-mono">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  <span>Subscribed to bulletin alerts!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center space-x-1.5">
                  <input
                    type="email"
                    placeholder="Enter corporate email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full bg-[#1c1917] border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 font-mono"
                    required
                  />
                  <button
                    type="submit"
                    title="Subscribe to updates"
                    className="bg-amber-500 hover:bg-amber-400 text-stone-950 p-2 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5 font-bold" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Compliance & Standards Badges Ribbon */}
      <div className="border-t border-[#24201c] bg-[#0c0b0a] py-4 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 text-[11px] font-mono text-stone-400">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-amber-500" />
              <span className="text-stone-300 font-bold">Standard Certifications:</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="hover:text-amber-400 transition-colors">SANS 20345 (Footwear)</span>
              <span className="text-stone-700">•</span>
              <span className="hover:text-amber-400 transition-colors">SANS 434 (Conti-Suits)</span>
              <span className="text-stone-700">•</span>
              <span className="hover:text-amber-400 transition-colors">EN ISO 9001:2015</span>
              <span className="text-stone-700">•</span>
              <span className="hover:text-amber-400 transition-colors">SAPVIA Solar GreenCard</span>
              <span className="text-stone-700">•</span>
              <span className="hover:text-amber-400 transition-colors">HACCP Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <div>
            © {new Date().getFullYear()} Ndulu General Dealers Ltd. All rights reserved. Registered Industrial Supplier.
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-stone-400 transition-colors cursor-default">HSE Safety Policy</span>
            <span>•</span>
            <span className="hover:text-stone-400 transition-colors cursor-default">Terms of Tender Supply</span>
            <span>•</span>
            <span className="hover:text-stone-400 transition-colors cursor-default">Privacy & Governance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
