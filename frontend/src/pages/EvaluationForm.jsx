import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  ArrowRight, ArrowLeft, BrainCircuit, Sparkles, Lightbulb, 
  Target, Rocket, CheckCircle, ShieldAlert, Cpu
} from 'lucide-react';

const EvaluationForm = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState('');
  const [err, setErr] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    industry: 'AI',
    country: 'USA',
    description: '',
    problem: '',
    solution: '',
    target_audience: '',
    business_model: 'B2B SaaS',
    revenue_model: 'Subscription',
    expected_pricing: 29.00,
    marketing_budget: 10000.00,
    team_size: 3,
    founder_experience: 2,
    competition_level: 'Medium',
    expected_investment: 50000.00,
    expected_launch_date: '2026-10-01'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'expected_pricing' || name === 'marketing_budget' || name === 'expected_investment'
        ? parseFloat(value) || 0
        : name === 'team_size' || name === 'founder_experience'
          ? parseInt(value) || 0
          : value
    }));
  };

  const nextStep = () => setStep(prev => Math.min(4, prev + 1));
  const prevStep = () => setStep(prev => Math.max(1, prev - 1));

  const validateStep = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.expected_launch_date !== '';
    }
    if (step === 2) {
      return (
        formData.description.trim().length >= 10 &&
        formData.problem.trim().length >= 10 &&
        formData.solution.trim().length >= 10 &&
        formData.target_audience.trim() !== ''
      );
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      // Step 1: Create Idea Entry
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
        throw new Error(errorData.detail || "Failed to save startup idea.");
      }

      const ideaData = await resCreate.json();
      const ideaId = ideaData.id;

      // Step 2: Run ML evaluation
      setLoadStatus("Feeding features to Random Forest classification models...");
      // Artificial delay to make it feel premium
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
        throw new Error(errorData.detail || "Failed during AI evaluation process.");
      }

      setLoadStatus("Compiling data into ReportLab PDF structure...");
      await new Promise(r => setTimeout(r, 800));

      setLoadStatus("Finished evaluation!");
      navigate(`/report/${ideaId}`);

    } catch (error) {
      setErr(error.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Startup Idea Evaluator</h1>
            <p className="text-sm text-gray-400 mt-1">Provide information about your startup idea to trigger AI evaluation.</p>
          </div>

          {loading ? (
            <div className="glass-panel p-10 rounded-3xl border border-dark-border/80 shadow-2xl flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative mb-8">
                <div className="animate-ping absolute inset-0 rounded-full bg-brand-500/20 opacity-75"></div>
                <div className="h-16 w-16 rounded-full bg-brand-600/10 border border-brand-500/40 flex items-center justify-center text-brand-400">
                  <Cpu className="h-8 w-8 animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white text-center">Processing AI Evaluation</h3>
              <p className="text-sm text-brand-400 font-semibold tracking-wide animate-pulse mt-2">{loadStatus}</p>
              <div className="w-64 h-1 bg-dark-border rounded-full overflow-hidden mt-6">
                <div className="h-full bg-brand-500 animate-infinite-loading rounded-full" />
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-dark-border/60 shadow-xl relative">
              {/* Error box */}
              {err && (
                <div className="mb-6 flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-xs">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <span>{err}</span>
                </div>
              )}

              {/* Progress Steps Header */}
              <div className="flex justify-between items-center mb-8 border-b border-dark-border/40 pb-6">
                {[1, 2, 3, 4].map(idx => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center font-bold text-xs transition-all ${
                      step === idx 
                        ? 'bg-brand-600 border-brand-500 text-white shadow-md' 
                        : step > idx 
                          ? 'bg-brand-950 border-brand-800 text-brand-300' 
                          : 'border-dark-border text-gray-500 bg-dark-bg/20'
                    }`}>
                      {step > idx ? '✓' : idx}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:inline ${
                      step === idx ? 'text-white' : 'text-gray-500'
                    }`}>
                      {idx === 1 ? 'Core' : idx === 2 ? 'Concept' : idx === 3 ? 'Model' : 'Finance'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form Container */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* STEP 1: CORE CONCEPT */}
                {step === 1 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-2 border-brand-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-brand-400" /> Startup Core Details
                      </h4>
                      <p className="text-xs text-gray-400">Establish the basic identity of your startup project.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Startup Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Healthflow AI"
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Launch Date</label>
                        <input
                          type="date"
                          name="expected_launch_date"
                          value={formData.expected_launch_date}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Industry Sector</label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        >
                          <option value="AI">AI & Machine Learning</option>
                          <option value="EdTech">EdTech (Education)</option>
                          <option value="HealthTech">HealthTech (Medical)</option>
                          <option value="FinTech">FinTech (Financial)</option>
                          <option value="E-commerce">E-commerce / Retail</option>
                          <option value="Agriculture">Agriculture / AgTech</option>
                          <option value="Travel">Travel & Tourism</option>
                          <option value="Gaming">Gaming & Interactive</option>
                          <option value="Other">Other / Traditional</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Country</label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        >
                          <option value="USA">United States</option>
                          <option value="India">India</option>
                          <option value="UK">United Kingdom</option>
                          <option value="Germany">Germany</option>
                          <option value="Canada">Canada</option>
                          <option value="Other">Other Global</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: CONCEPT DESCRIPTION */}
                {step === 2 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-2 border-brand-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Target className="h-5 w-5 text-brand-400" /> Business Concept & Value
                      </h4>
                      <p className="text-xs text-gray-400">Describe the problem, target audience, and solution in detail.</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Description (min 10 chars)</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Describe what your startup does in a clear and detailed manner..."
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Problem Being Solved (min 10 chars)</label>
                        <textarea
                          name="problem"
                          value={formData.problem}
                          onChange={handleChange}
                          rows="3"
                          placeholder="What specific pain point or efficiency gap in the market are you tackling?"
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Solution (min 10 chars)</label>
                        <textarea
                          name="solution"
                          value={formData.solution}
                          onChange={handleChange}
                          rows="3"
                          placeholder="How does your product solve the identified problem? What is the product experience?"
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Audience / Customer Profile</label>
                        <input
                          type="text"
                          name="target_audience"
                          value={formData.target_audience}
                          onChange={handleChange}
                          placeholder="e.g. Remote developers, small accounting firms, high-school students"
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: BUSINESS MODEL */}
                {step === 3 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-2 border-brand-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-brand-400" /> Business Model & Pricing Structure
                      </h4>
                      <p className="text-xs text-gray-400">Specify how you plan to monetize and charge your audience.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Model Type</label>
                        <select
                          name="business_model"
                          value={formData.business_model}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        >
                          <option value="B2B SaaS">B2B SaaS (Software as a Service)</option>
                          <option value="B2C SaaS">B2C SaaS</option>
                          <option value="E-commerce Marketplace">E-commerce Marketplace</option>
                          <option value="Direct to Consumer (D2C)">D2C Physical Goods</option>
                          <option value="Ad-supported Media">Ad-Supported Free Model</option>
                          <option value="Transactional Fee">Transactional / FinTech Fee</option>
                          <option value="Enterprise License">Enterprise Custom License</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Revenue Model</label>
                        <select
                          name="revenue_model"
                          value={formData.revenue_model}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        >
                          <option value="Subscription">Monthly/Annual Subscription</option>
                          <option value="Usage-based">Usage-based / Pay-per-use</option>
                          <option value="One-time purchase">One-time Purchase License</option>
                          <option value="Commission">Commission / Percentage of Sale</option>
                          <option value="Freemium">Freemium with upgrades</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Average Pricing (₹ INR)</label>
                        <input
                          type="number"
                          name="expected_pricing"
                          value={formData.expected_pricing}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: OPERATIONS & FINANCIALS */}
                {step === 4 && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="border-l-2 border-brand-500 pl-3 mb-6">
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Rocket className="h-5 w-5 text-brand-400" /> Financials & Founder Operations
                      </h4>
                      <p className="text-xs text-gray-400">Outline budgets, team structure, and investment needs.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Investment Needed (₹ INR)</label>
                        <input
                          type="number"
                          name="expected_investment"
                          value={formData.expected_investment}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expected Annual Marketing Budget (₹ INR)</label>
                        <input
                          type="number"
                          name="marketing_budget"
                          value={formData.marketing_budget}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Team Size (members)</label>
                        <input
                          type="number"
                          name="team_size"
                          value={formData.team_size}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Founder Domain Experience (years)</label>
                        <input
                          type="number"
                          name="founder_experience"
                          value={formData.founder_experience}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market Competition Level</label>
                        <select
                          name="competition_level"
                          value={formData.competition_level}
                          onChange={handleChange}
                          className="block w-full px-4 py-3 bg-dark-bg/60 border border-dark-border/80 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500 transition-all"
                        >
                          <option value="Low">Low Competition (Blue Ocean)</option>
                          <option value="Medium">Medium Competition</option>
                          <option value="High">High Competition (Crowded Market)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Nav Buttons */}
                <div className="flex justify-between items-center border-t border-dark-border/40 pt-6 mt-8">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dark-border hover:border-brand-500 text-xs font-bold text-gray-300 hover:text-white transition-all bg-dark-bg/25"
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
                      disabled={!validateStep()}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Next Step <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="glow-btn flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all shadow-md shadow-brand-500/20"
                    >
                      Submit & Run AI Evaluation
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EvaluationForm;
