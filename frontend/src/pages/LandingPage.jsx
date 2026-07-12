import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, TrendingUp, Sparkles, FileBarChart, MessagesSquare, ArrowRight, Cpu, Activity, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import heroImage from '../assets/hero.png';

const LandingPage = () => {
  const features = [
    {
      title: "Predict Success Probability",
      desc: "Our custom Random Forest Machine Learning model evaluates indicators to predict your overall success chances.",
      icon: TrendingUp,
      to: "/evaluate-form"
    },
    {
      title: "AI Business Mentor",
      desc: "Interact with an expert chatbot powered by Gemini that knows your product structure and gives specific growth advice.",
      icon: MessagesSquare,
      to: "/mentor-chat"
    },
    {
      title: "Automated SWOT & Lean Canvas",
      desc: "Get an instantly generated, professional SWOT analysis and a 9-block Lean Canvas for structural mapping.",
      icon: Sparkles,
      to: "/evaluate-form"
    },
    {
      title: "Detailed PDF Report",
      desc: "Download a beautifully compiled PDF report containing predictions, charts, SWOT, and pitch advice to show investors.",
      icon: FileBarChart,
      to: "/dashboard"
    },
    {
      title: "Risk Analysis Gauges",
      desc: "Review market, execution, legal, technology, and financial risks represented in clean, interactive visuals.",
      icon: ShieldCheck,
      to: "/dashboard"
    },
    {
      title: "Automatic Classification",
      desc: "Predict and map the true category of your startup based on automated semantic analysis of your text description.",
      icon: Brain,
      to: "/evaluate-form"
    }
  ];

  const { token } = useContext(AuthContext);
  const destination = token ? "/evaluate-form" : "/register";

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 relative overflow-hidden flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Hero Section */}
        <header className="relative mx-auto max-w-7xl px-6 pt-16 pb-16 sm:px-8 lg:px-10 lg:pt-20 lg:pb-24 animate-fade-in">
          {/* Blurred Background Orbs */}
          <div className="absolute top-[-10%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-indigo-500/5 blur-[100px] -z-10" />
          <div className="absolute top-[20%] right-[10%] w-[25rem] h-[25rem] rounded-full bg-cyan-500/5 blur-[120px] -z-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3.5 py-1.5 text-xs font-bold text-indigo-400">
                <Sparkles className="h-4 w-4 text-indigo-400" /> Powered by Machine Learning & Gemini
              </div>
              
              <h1 className="font-black tracking-tighter text-4xl sm:text-5xl lg:text-[3.75rem] text-white leading-[1.1]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Predict Your <span className="gradient-text">Startup's</span> <br />
                <span className="gradient-text">Success</span> Before You Build
              </h1>
              
              <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-xl">
                Predict the success potential of your startup using Machine Learning insights.
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Link
                  to={destination}
                  className="glow-btn flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-violet-550 transition-all w-full sm:w-auto justify-center"
                >
                  Start Prediction <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <a
                  href="#features"
                  className="rounded-xl border border-slate-800 bg-slate-900/40 px-6 py-4 text-sm font-bold text-slate-350 hover:text-white hover:border-indigo-500/50 transition-all w-full sm:w-auto justify-center text-center shadow-sm"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right illustration */}
            <div className="lg:col-span-5 flex justify-center animate-fade-in">
              <div className="relative p-1.5 rounded-[18px] bg-gradient-to-br from-indigo-500/10 via-violet-200/10 to-cyan-500/10 border border-slate-800/80 shadow-2xl shadow-indigo-950/10 max-w-md lg:max-w-full bg-[#111827]">
                <img 
                  src={heroImage} 
                  className="rounded-[18px] border border-slate-800/60 w-full object-cover animate-float" 
                  alt="Startup success evaluation dashboard mock" 
                />
                <div className="absolute -bottom-4 -left-4 glass-panel p-4 flex items-center gap-3 border-slate-800 shadow-md animate-fade-in hidden sm:flex bg-[#111827]/90">
                  <div className="h-10 w-10 rounded-xl bg-indigo-950 border border-indigo-900 flex items-center justify-center text-indigo-400">
                    <TrendingUp className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider">Avg Accuracy</span>
                    <span className="text-xs font-extrabold text-white">92.4% success prediction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Small Statistics Cards Below Hero Section */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pb-16 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {/* Prediction Status */}
            <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between bg-[#111827]/40">
              <div>
                <div className="p-2.5 bg-indigo-950/60 border border-indigo-900 text-indigo-400 rounded-xl w-fit mb-4">
                  <Activity className="h-5.5 w-5.5" />
                </div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prediction Status</span>
                <span className="text-xl font-extrabold text-indigo-400 mt-1 block">Active</span>
                <p className="text-[10px] text-slate-500 mt-1">Prediction engine is online</p>
              </div>
            </div>

            {/* Model Accuracy */}
            <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between bg-[#111827]/40">
              <div>
                <div className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl w-fit mb-4">
                  <Cpu className="h-5.5 w-5.5" />
                </div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Model Accuracy</span>
                <span className="text-xl font-extrabold text-white mt-1 block">92.4%</span>
                <p className="text-[10px] text-slate-500 mt-1">Trained Random Forest Classifier</p>
              </div>
            </div>

            {/* Success Probability */}
            <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between bg-[#111827]/40">
              <div>
                <div className="p-2.5 bg-cyan-950/60 border border-cyan-900 text-cyan-400 rounded-xl w-fit mb-4">
                  <TrendingUp className="h-5.5 w-5.5" />
                </div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Success Probability</span>
                <span className="text-xl font-extrabold text-cyan-400 mt-1 block">Feasibility</span>
                <p className="text-[10px] text-slate-500 mt-1">Analyzed based on parameters</p>
              </div>
            </div>

            {/* Risk Score */}
            <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between bg-[#111827]/40">
              <div>
                <div className="p-2.5 bg-rose-950/60 border border-rose-900 text-rose-400 rounded-xl w-fit mb-4">
                  <AlertTriangle className="h-5.5 w-5.5 animate-pulse" />
                </div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Score</span>
                <span className="text-xl font-extrabold text-rose-450 mt-1 block">Multi-Factor</span>
                <p className="text-[10px] text-slate-500 mt-1">Quantitative risk assessment</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 border-t border-slate-800/40 bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Equipped with Enterprise-Grade Evaluators
              </h2>
              <p className="mt-4 text-sm text-slate-450">
                Launch smarter. Evaluate all quantitative and qualitative aspects of your startup idea instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feat, index) => {
                const Icon = feat.icon;
                const dest = token ? feat.to : "/register";
                return (
                  <Link 
                    key={index}
                    to={dest}
                    className="glass-panel glass-panel-hover p-6 flex flex-col gap-4 transition-all hover:scale-[1.02] cursor-pointer block group text-left bg-[#111827]/40"
                  >
                    <div className="h-12 w-12 rounded-xl bg-indigo-950/50 border border-indigo-900 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-900/60 group-hover:text-indigo-300 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-205 group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                      {feat.title} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">{feat.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Grid */}
        <section id="pricing" className="py-20 border-t border-slate-800/40 bg-slate-950/20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Transparent, Flexible Plans
              </h2>
              <p className="mt-4 text-sm text-slate-450">
                No credit card required to test your first idea. Upgrade as your portfolio grows.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Plan 1 */}
              <div className="glass-panel p-8 flex flex-col justify-between bg-[#111827]/30 border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-slate-200">Starter</h3>
                  <p className="text-xs text-slate-450 mt-1">Perfect for solo founders exploring concepts.</p>
                  <div className="mt-4 text-3xl font-extrabold text-white">₹0</div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                    <li className="flex items-center gap-2">✓ 1 Startup Idea Evaluation</li>
                    <li className="flex items-center gap-2">✓ Basic ML Success Probability</li>
                    <li className="flex items-center gap-2">✓ AI SWOT Report</li>
                    <li className="flex items-center gap-2">✓ Standard Mentor Chat (5 messages)</li>
                  </ul>
                </div>
                <Link to="/register" className="mt-8 block text-center w-full py-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 text-xs font-bold text-slate-350 hover:text-white transition-all bg-slate-900/40">
                  Get Started
                </Link>
              </div>

              {/* Plan 2 - Pro */}
              <div className="glass-panel p-8 flex flex-col justify-between border-indigo-500/40 shadow-xl shadow-indigo-950/20 relative overflow-hidden bg-[#111827]/80">
                <div className="absolute top-0 right-0 bg-indigo-600 text-[9px] font-extrabold tracking-wider uppercase text-white px-3 py-1 rounded-bl-xl">
                  Popular
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">Growth Pro</h3>
                  <p className="text-xs text-indigo-400 mt-1 font-semibold">Best for serial builders and small agencies.</p>
                  <div className="mt-4 text-3xl font-extrabold text-white">
                    ₹2,499 <span className="text-xs font-medium text-slate-500">/mo</span>
                  </div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
                    <li className="flex items-center gap-2">✓ Unlimited Idea Evaluations</li>
                    <li className="flex items-center gap-2">✓ Full ML Model Suite Pro</li>
                    <li className="flex items-center gap-2">✓ Complete Lean Canvas & SWOT</li>
                    <li className="flex items-center gap-2">✓ Unlimited Mentor Chat & History</li>
                    <li className="flex items-center gap-2">✓ Printable PDF Downloadable Reports</li>
                  </ul>
                </div>
                <Link to="/register" className="mt-8 block text-center w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-500 hover:to-violet-550 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/10">
                  Start 7-Day Trial
                </Link>
              </div>

              {/* Plan 3 */}
              <div className="glass-panel p-8 flex flex-col justify-between bg-[#111827]/30 border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-slate-200">Enterprise</h3>
                  <p className="text-xs text-slate-450 mt-1">For incubators, VCs, and accelerator programs.</p>
                  <div className="mt-4 text-3xl font-extrabold text-white">Custom</div>
                  <ul className="mt-6 space-y-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                    <li className="flex items-center gap-2">✓ Shared workspaces for team</li>
                    <li className="flex items-center gap-2">✓ Advanced API usage parameters</li>
                    <li className="flex items-center gap-2">✓ Custom model weights training</li>
                    <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                  </ul>
                </div>
                <Link to="/register" className="mt-8 block text-center w-full py-2.5 rounded-xl border border-slate-800 hover:border-indigo-500 text-xs font-bold text-slate-355 hover:text-white transition-all bg-slate-900/40">
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/60 text-center text-xs text-slate-500 bg-[#090D16]">
                    <div className="max-w-md mx-auto border-t border-dashed border-slate-800 pt-6 space-y-1">
              <p className="font-bold text-slate-400">© 2026 NexalQ. All rights reserved.</p>
              <p className="text-slate-550">Data-driven insights for the next generation of enterprise.</p>
            </div>
      </footer>
    </div>
  );
};

export default LandingPage;
