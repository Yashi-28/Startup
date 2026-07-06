import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, TrendingUp, Sparkles, FileBarChart, MessagesSquare, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 relative overflow-hidden bg-grid-pattern">
      <Navbar />

      {/* Hero Section */}
      <header className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 text-center sm:px-8 lg:px-10 lg:pt-24 lg:pb-32">
        <div className="absolute top-[-10%] left-[20%] w-[30rem] h-[30rem] rounded-full bg-brand-500/10 blur-[100px] -z-10" />
        <div className="absolute top-[20%] right-[10%] w-[25rem] h-[25rem] rounded-full bg-purple-500/10 blur-[120px] -z-10" />

        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1 text-xs font-semibold text-brand-300 mb-6">
            <Sparkles className="h-4 w-4" /> Powered by Machine Learning & Gemini
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
            Evaluate Your Startup Idea <br />
            <span className="gradient-text">With Scientific Precision</span>
          </h1>
          
          <p className="mt-6 text-lg leading-relaxed text-gray-400 max-w-2xl mx-auto">
            Stop guessing. StartSmart AI uses trained predictive models and advanced generative AI to score your concept, forecast revenues, identify risks, and map your business model in seconds.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="glow-btn flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-bold text-white shadow-xl shadow-brand-500/20 hover:bg-brand-500 transition-all w-full sm:w-auto justify-center"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-dark-border bg-dark-card/50 px-6 py-3.5 text-base font-bold text-gray-300 hover:text-white hover:border-brand-500/50 transition-all w-full sm:w-auto justify-center text-center"
            >
              Learn More
            </a>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-dark-border/50 bg-dark-card/10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Equipped with Enterprise-Grade Evaluators
            </h2>
            <p className="mt-4 text-gray-400">
              Launch smarter. Evaluate all quantitative and qualitative aspects of your startup idea instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              const destination = token ? feat.to : "/register";
              return (
                <Link 
                  key={index}
                  to={destination}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col gap-4 transition-all hover:scale-[1.02] hover:border-brand-500/50 cursor-pointer block group text-left"
                >
                  <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/20 group-hover:text-brand-300 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors flex items-center gap-2">
                    {feat.title} <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">{feat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dummy Pricing */}
      <section id="pricing" className="py-20 border-t border-dark-border/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Transparent, Flexible Plans
            </h2>
            <p className="mt-4 text-gray-400">
              No credit card required to test your first idea. Upgrade as your portfolio grows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Plan 1 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border-dark-border/40">
              <div>
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <p className="text-xs text-gray-400 mt-1">Perfect for solo founders exploring concepts.</p>
                <div className="mt-4 text-3xl font-extrabold text-white">₹0</div>
                <ul className="mt-6 space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-2">✓ 1 Startup Idea Evaluation</li>
                  <li className="flex items-center gap-2">✓ Basic ML Success Probability</li>
                  <li className="flex items-center gap-2">✓ AI SWOT Report</li>
                  <li className="flex items-center gap-2">✓ Standard Mentor Chat (5 messages)</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block text-center w-full py-2.5 rounded-xl border border-dark-border hover:border-brand-500 text-sm font-semibold hover:text-white transition-all bg-dark-bg/40">
                Get Started
              </Link>
            </div>

            {/* Plan 2 - Pro */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border-brand-500/50 shadow-xl shadow-brand-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand-600 text-[10px] font-extrabold tracking-wider uppercase text-white px-3 py-1 rounded-bl-xl">
                Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Growth Pro</h3>
                <p className="text-xs text-brand-300 mt-1">Best for serial builders and small agencies.</p>
                <div className="mt-4 text-3xl font-extrabold text-white">
                  ₹2,499 <span className="text-sm font-medium text-gray-400">/mo</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-2 text-gray-300">✓ Unlimited Idea Evaluations</li>
                  <li className="flex items-center gap-2 text-gray-300">✓ Full ML Model Suite Pro</li>
                  <li className="flex items-center gap-2 text-gray-300">✓ Complete Lean Canvas & SWOT</li>
                  <li className="flex items-center gap-2 text-gray-300">✓ Unlimited Mentor Chat & History</li>
                  <li className="flex items-center gap-2 text-gray-300">✓ Printable PDF Downloadable Reports</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block text-center w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-sm font-bold text-white transition-all shadow-lg shadow-brand-500/20">
                Start 7-Day Trial
              </Link>
            </div>

            {/* Plan 3 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between border-dark-border/40">
              <div>
                <h3 className="text-lg font-bold text-white">Enterprise</h3>
                <p className="text-xs text-gray-400 mt-1">For incubators, VCs, and accelerator programs.</p>
                <div className="mt-4 text-3xl font-extrabold text-white">Custom</div>
                <ul className="mt-6 space-y-3 text-sm text-gray-400">
                  <li className="flex items-center gap-2">✓ Shared workspaces for team</li>
                  <li className="flex items-center gap-2">✓ Advanced API usage parameters</li>
                  <li className="flex items-center gap-2">✓ Custom model weights training</li>
                  <li className="flex items-center gap-2">✓ Dedicated account manager</li>
                </ul>
              </div>
              <Link to="/register" className="mt-8 block text-center w-full py-2.5 rounded-xl border border-dark-border hover:border-brand-500 text-sm font-semibold hover:text-white transition-all bg-dark-bg/40">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-dark-border/50 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} StartSmart AI – Startup Evaluator & Business Mentor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
