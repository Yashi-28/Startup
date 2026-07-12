import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  ArrowRight, ArrowLeft, Sparkles, Lightbulb, 
  Target, Rocket, CheckCircle, ShieldAlert, Cpu
} from 'lucide-react';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';

const EvaluationForm = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    expected_launch_date: '',
    industry: 'AI',
    country: 'India',
    description: '',
    problem: '',
    solution: '',
    target_audience: '',
    business_model: 'B2B SaaS',
    revenue_model: 'Subscription',
    expected_pricing: 0,
    expected_investment: 0,
    marketing_budget: 0,
    team_size: 0,
    founder_experience: 0,
    competition_level: 'Medium'
  });

  const [loading, setLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : (type === 'number' || type === 'range' ? Number(value) : value)
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      return !!(formData.name && formData.expected_launch_date);
    }
    if (step === 2) {
      return !!(formData.description && formData.problem && formData.solution && formData.target_audience);
    }
    if (step === 3) {
      return !!(formData.business_model && formData.revenue_model && Number(formData.expected_pricing) >= 0);
    }
    if (step === 4) {
      return !!(Number(formData.expected_investment) >= 0 && Number(formData.team_size) >= 0);
    }
    return false;
  };

  const nextStep = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStep(prev => {
      const next = Number(prev) + 1;
      return next > 4 ? 4 : next;
    });
    setErr('');
  };

  const prevStep = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStep(prev => {
      const prevVal = Number(prev) - 1;
      return prevVal < 1 ? 1 : prevVal;
    });
    setErr('');
  };

  const validateAllSteps = () => {
    return !!(
      formData.name && 
      formData.expected_launch_date && 
      formData.description && 
      formData.problem && 
      formData.solution && 
      formData.target_audience && 
      formData.business_model && 
      formData.revenue_model && 
      Number(formData.expected_pricing) >= 0 && 
      Number(formData.expected_investment) >= 0 && 
      Number(formData.team_size) >= 0
    );
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateAllSteps()) {
      setErr('Please complete all form steps and required fields correctly before running AI evaluation.');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      setLoadStatus("Registering startup idea entry...");
      const resCreate = await fetch(`${API_BASE_URL}/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!resCreate.ok) {
        const errorData = await resCreate.json();
        let errMsg = "Failed to save startup idea.";
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errMsg = errorData.detail.map(err => {
              const field = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : "Field";
              return `${field}: ${err.msg}`;
            }).join(", ");
          } else if (typeof errorData.detail === 'object') {
            errMsg = JSON.stringify(errorData.detail);
          }
        }
        throw new Error(errMsg);
      }

      const ideaData = await resCreate.json();
      const ideaId = ideaData.id;

      setLoadStatus("Feeding features to Random Forest classification models...");
      await new Promise(r => setTimeout(r, 800));

      setLoadStatus("Analyzing text features for category classification...");
      await new Promise(r => setTimeout(r, 600));

      setLoadStatus("Consulting Gemini AI Business Mentor for SWOT & Canvas...");
      
      const resEvaluate = await fetch(`${API_BASE_URL}/evaluate/${ideaId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!resEvaluate.ok) {
        const errorData = await resEvaluate.json();
        let errMsg = "Failed during AI evaluation process.";
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errMsg = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errMsg = errorData.detail.map(err => {
              const field = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : "Field";
              return `${field}: ${err.msg}`;
            }).join(", ");
          } else if (typeof errorData.detail === 'object') {
            errMsg = JSON.stringify(errorData.detail);
          }
        }
        throw new Error(errMsg);
      }

      setLoadStatus("Compiling data into ReportLab PDF structure...");
      await new Promise(r => setTimeout(r, 800));

      setLoadStatus("Finished evaluation!");
      navigate(`/report/${ideaId}`);
    } catch (e) {
      setErr(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Startup Idea Evaluator</h1>
            <p className="text-sm text-slate-400 mt-1">Provide information about your startup idea to trigger AI evaluation.</p>
          </div>

          {loading ? (
            <div className="glass-panel p-10 rounded-[18px] border border-slate-800/80 shadow-xl flex flex-col items-center justify-center min-h-[400px] animate-fade-in bg-[#111827]/40">
              <div className="relative mb-8">
                {/* Double ring animated spinner */}
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10" />
                <div className="h-16 w-16 rounded-full border-4 border-t-indigo-500 border-r-indigo-400 border-b-cyan-400 border-l-cyan-500 animate-spin" />
                <div className="absolute inset-2 h-12 w-12 rounded-full bg-[#111827] flex items-center justify-center text-indigo-400">
                  <Cpu className="h-6 w-6 animate-pulse text-indigo-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center">Analyzing your startup data...</h3>
              <p className="text-xs text-indigo-455 font-semibold tracking-wide mt-2 animate-pulse">{loadStatus}</p>
              
              <div className="w-64 h-1.5 bg-slate-850 rounded-full overflow-hidden mt-6">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 animate-infinite-loading rounded-full" />
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-[18px] border border-slate-800/60 shadow-sm relative animate-fade-in bg-[#111827]/40">
              {/* Error box */}
              {err && (
                <div className="mb-6 flex items-center gap-2 bg-rose-950/20 border border-rose-900/60 text-rose-400 p-4 rounded-xl text-xs">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              {/* Progress Steps Header */}
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
                {[1, 2, 3, 4].map(idx => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setStep(idx);
                      setErr('');
                    }}
                    className="flex items-center gap-2 focus:outline-none hover:opacity-85 transition-opacity"
                  >
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-extrabold text-xs transition-all ${
                      step === idx 
                        ? 'bg-gradient-to-br from-indigo-500 to-violet-650 border-indigo-500 text-white shadow-md' 
                        : step > idx 
                          ? 'bg-indigo-950/60 border-indigo-905 text-indigo-400' 
                          : 'border-slate-800 text-slate-500 bg-slate-900/40'
                    }`}>
                      {step > idx ? '✓' : idx}
                    </div>
                    <span className={`text-xs font-bold ${
                      step === idx ? 'text-indigo-400' : 'text-slate-500'
                    }`}>
                      {idx === 1 ? 'Core' : idx === 2 ? 'Concept' : idx === 3 ? 'Model' : 'Finance'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Form Container */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (step < 4) {
                    nextStep(e);
                  } else {
                    handleSubmit(e);
                  }
                }} 
                className="space-y-6"
              >
                {/* STEP 1: CORE CONCEPT */}
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-4 border-indigo-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-indigo-400" /> Startup Core Details
                      </h4>
                      <p className="text-xs text-slate-450">Establish the basic identity of your startup project.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Startup Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Healthflow AI"
                          className="block w-full px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Expected Launch Date</label>
                        <input
                          type="date"
                          name="expected_launch_date"
                          value={formData.expected_launch_date}
                          onChange={handleChange}
                          onClick={(e) => e.target.showPicker?.()}
                          className="block w-full px-4 py-3 bg-[#0D0E12] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-apple-blue transition-all cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Industry Sector</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="AI" className="bg-[#111827]">AI & Machine Learning</option>
                          <option value="EdTech" className="bg-[#111827]">EdTech (Education)</option>
                          <option value="HealthTech" className="bg-[#111827]">HealthTech (Medical)</option>
                          <option value="FinTech" className="bg-[#111827]">FinTech (Financial)</option>
                          <option value="E-commerce" className="bg-[#111827]">E-commerce / Retail</option>
                          <option value="Agriculture" className="bg-[#111827]">Agriculture / AgTech</option>
                          <option value="Travel" className="bg-[#111827]">Travel & Tourism</option>
                          <option value="Gaming" className="bg-[#111827]">Gaming & Interactive</option>
                          <option value="Other" className="bg-[#111827]">Other / Traditional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Target Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="USA" className="bg-[#111827]">United States</option>
                          <option value="India" className="bg-[#111827]">India</option>
                          <option value="UK" className="bg-[#111827]">United Kingdom</option>
                          <option value="Germany" className="bg-[#111827]">Germany</option>
                          <option value="Canada" className="bg-[#111827]">Canada</option>
                          <option value="Other" className="bg-[#111827]">Other Global</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: CONCEPT DESCRIPTION */}
                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-4 border-indigo-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-indigo-400" /> Business Concept & Value
                      </h4>
                      <p className="text-xs text-slate-450">Describe the problem, target audience, and solution in detail.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Business Description (min 10 chars)</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Describe what your startup does in a clear and detailed manner..."
                          className="block w-full px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-slate-650"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Problem Being Solved (min 10 chars)</label>
                        <textarea
                          name="problem"
                          value={formData.problem}
                          onChange={handleChange}
                          rows="3"
                          placeholder="What specific pain point or efficiency gap in the market are you tackling?"
                          className="block w-full px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-slate-650"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Your Solution (min 10 chars)</label>
                        <textarea
                          name="solution"
                          value={formData.solution}
                          onChange={handleChange}
                          rows="3"
                          placeholder="How does your product solve the identified problem? What is the product experience?"
                          className="block w-full px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none placeholder-slate-650"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Target Audience / Customer Profile</label>
                        <input
                          type="text"
                          name="target_audience"
                          value={formData.target_audience}
                          onChange={handleChange}
                          placeholder="e.g. Remote developers, small accounting firms, high-school students"
                          className="block w-full px-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-650"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: BUSINESS MODEL */}
                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-4 border-indigo-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-indigo-400" /> Business Model & Pricing Structure
                      </h4>
                      <p className="text-xs text-slate-450">Specify how you plan to monetize and charge your audience.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Business Model Type</label>
                        <select
                          name="business_model"
                          value={formData.business_model}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="B2B SaaS" className="bg-[#111827]">B2B SaaS (Software as a Service)</option>
                          <option value="B2C SaaS" className="bg-[#111827]">B2C SaaS</option>
                          <option value="E-commerce Marketplace" className="bg-[#111827]">E-commerce Marketplace</option>
                          <option value="Direct to Consumer (D2C)" className="bg-[#111827]">D2C Physical Goods</option>
                          <option value="Ad-supported Media" className="bg-[#111827]">Ad-Supported Free Model</option>
                          <option value="Transactional Fee" className="bg-[#111827]">Transactional / FinTech Fee</option>
                          <option value="Enterprise License" className="bg-[#111827]">Enterprise Custom License</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Revenue Model</label>
                        <select
                          name="revenue_model"
                          value={formData.revenue_model}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="Subscription" className="bg-[#111827]">Monthly/Annual Subscription</option>
                          <option value="Usage-based" className="bg-[#111827]">Usage-based / Pay-per-use</option>
                          <option value="One-time purchase" className="bg-[#111827]">One-time Purchase License</option>
                          <option value="Commission" className="bg-[#111827]">Commission / Percentage of Sale</option>
                          <option value="Freemium" className="bg-[#111827]">Freemium with upgrades</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Expected Average Pricing</label>
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-900/40">₹{formData.expected_pricing} INR</span>
                        </div>
                        <input
                          type="range"
                          name="expected_pricing"
                          min="0"
                          max="50000"
                          step="100"
                          value={formData.expected_pricing}
                          onChange={handleChange}
                          className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>₹0</span>
                          <span>₹25,000</span>
                          <span>₹50,000+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: OPERATIONS & FINANCIALS */}
                {step === 4 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="border-l-4 border-indigo-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-indigo-400" /> Financials & Founder Operations
                      </h4>
                      <p className="text-xs text-slate-450">Outline budgets, team structure, and investment needs.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Expected Investment Needed (₹ INR)</label>
                        <div className="relative rounded-xl shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 text-sm font-semibold">
                            ₹
                          </div>
                          <input
                            type="number"
                            name="expected_investment"
                            value={formData.expected_investment}
                            onChange={handleChange}
                            className="block w-full pl-8 pr-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Expected Annual Marketing Budget (₹ INR)</label>
                        <div className="relative rounded-xl shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 text-sm font-semibold">
                            ₹
                          </div>
                          <input
                            type="number"
                            name="marketing_budget"
                            value={formData.marketing_budget}
                            onChange={handleChange}
                            className="block w-full pl-8 pr-4 py-3 bg-slate-900/40 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Team Size</label>
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{formData.team_size} members</span>
                        </div>
                        <input
                          type="range"
                          name="team_size"
                          min="1"
                          max="50"
                          value={formData.team_size}
                          onChange={handleChange}
                          className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>1 member</span>
                          <span>25 members</span>
                          <span>50+ members</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Founder Domain Experience</label>
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">{formData.founder_experience} years</span>
                        </div>
                        <input
                          type="range"
                          name="founder_experience"
                          min="0"
                          max="30"
                          value={formData.founder_experience}
                          onChange={handleChange}
                          className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[9px] text-slate-500">
                          <span>0 years (Novice)</span>
                          <span>15 years</span>
                          <span>30+ years (Veteran)</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Market Competition Level</label>
                        <select
                          name="competition_level"
                          value={formData.competition_level}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="Low" className="bg-[#111827]">Low Competition (Blue Ocean)</option>
                          <option value="Medium" className="bg-[#111827]">Medium Competition</option>
                          <option value="High" className="bg-[#111827]">High Competition (Crowded Market)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Nav Buttons */}
                <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-1.5 px-4.5 py-3 rounded-xl border border-slate-800 hover:border-indigo-500 text-xs font-bold text-slate-400 hover:text-white transition-all bg-slate-900/40"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-1.5 px-5.5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-500 hover:to-violet-550 text-xs font-bold text-white transition-all shadow-md shadow-indigo-500/10"
                    >
                      Next Step <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="glow-btn flex items-center gap-1.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-500 hover:to-violet-550 text-xs font-extrabold text-white transition-all shadow-lg shadow-indigo-500/20"
                    >
                      Predict Startup Success
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Footer */}
          <footer className="py-12 border-t border-slate-800/60 text-center text-xs text-slate-500 mt-12 bg-[#090D16] rounded-3xl p-6 shadow-sm border border-slate-800/80">
            <div className="max-w-md mx-auto border-t border-dashed border-slate-800 pt-6 space-y-1">
              <p className="font-bold text-slate-400">© 2026 NexalQ. All rights reserved.</p>
              <p className="text-slate-550">Data-driven insights for the next generation of enterprise.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default EvaluationForm;
