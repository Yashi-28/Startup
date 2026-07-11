import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SuccessGauge from '../components/SuccessGauge';
import RiskGauge from '../components/RiskGauge';
import { 
  FileText, Download, MessageSquare, ArrowLeft, BarChart3, 
  Sparkles, Layers, ListOrdered, Calendar, ShieldCheck,
  AlertTriangle, TrendingUp
} from 'lucide-react';

const ReportDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview, lean, swot, pitch
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const fetchReportDetail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const resData = await response.json();
          setData(resData);
        } else {
          setError("Failed to fetch evaluation report.");
        }
      } catch (err) {
        setError("Error loading report detail.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReportDetail();
    }
  }, [id, token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-slate-200">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-10 text-center">
            <h3 className="text-xl font-bold text-rose-400">Error loading report</h3>
            <p className="text-sm text-slate-500 mt-2">{error || "Report details not found."}</p>
            <Link to="/dashboard" className="mt-4 inline-block text-sm text-indigo-400 hover:underline">
              &larr; Back to Dashboard
            </Link>
          </main>
        </div>
      </div>
    );
  }

  const { idea, prediction, report } = data;

  // Safe parsing of JSON fields from report model
  const swot = report?.swot_analysis ? JSON.parse(report.swot_analysis) : { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const leanCanvas = report?.lean_canvas ? JSON.parse(report.lean_canvas) : {};
  const marketing = report?.marketing_suggestions ? JSON.parse(report.marketing_suggestions) : [];
  const growth = report?.growth_strategy ? JSON.parse(report.growth_strategy) : [];
  const pitchDeck = report?.pitch_deck_content ? JSON.parse(report.pitch_deck_content) : [];

  const tabs = [
    { id: 'overview', label: 'Evaluation Overview', icon: BarChart3 },
    { id: 'lean', label: 'Lean Business Canvas', icon: Layers },
    { id: 'swot', label: 'SWOT Analysis', icon: Sparkles },
    { id: 'pitch', label: 'Slide Pitch Deck', icon: ListOrdered }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard" className="text-slate-500 hover:text-slate-350 transition-colors">
                  <ArrowLeft className="h-4.5 w-4.5" />
                </Link>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{idea.industry} Startup Evaluation</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">{idea.name} Analysis Report</h1>
            </div>
            
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-indigo-500 text-xs font-bold text-slate-350 hover:text-indigo-400 transition-all shadow-sm"
            >
              <Download className="h-4 w-4" /> Print Evaluation Report
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800/80 gap-6 overflow-x-auto scrollbar-thin">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all shrink-0 ${
                    activeTab === tab.id 
                      ? 'border-indigo-500 text-indigo-450' 
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              {/* Prediction Result Card */}
              {(() => {
                const isPositive = (prediction?.success_probability || 0) >= 50;
                return (
                  <div className={`p-6 rounded-[18px] border-y border-r bg-[#111827]/40 ${
                    isPositive 
                      ? 'border-emerald-500/20 text-emerald-450 border-l-4 border-l-emerald-500' 
                      : 'border-rose-500/20 text-rose-400 border-l-4 border-l-rose-500'
                  } flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm`}>
                    <div className="flex items-start gap-4">
                      <div className={`p-3.5 rounded-2xl shrink-0 ${
                        isPositive ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                      }`}>
                        {isPositive ? <ShieldCheck className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7 animate-pulse" />}
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h3 className="text-lg font-bold text-white tracking-tight">
                          {isPositive ? 'Strong Potential Concept' : 'Operational Adjustments Needed'}
                        </h3>
                        <p className={`text-xs max-w-xl leading-relaxed ${isPositive ? 'text-emerald-400' : 'text-rose-400/90'}`}>
                          {isPositive 
                            ? 'Your startup shows strong potential for success.' 
                            : 'Your startup idea exhibits critical risk metrics. Review target scale, experience parameters, or budget structures to enhance viability.'}
                        </p>
                        
                        {!isPositive && (
                          <div className="mt-4 p-4 bg-[#0B0F19] border border-rose-900/40 rounded-2xl text-[11px] text-rose-450 space-y-2">
                            <span className="font-bold text-rose-400 block uppercase tracking-wider text-[9px]">Suggested Improvements & Recommendations</span>
                            <ul className="list-disc pl-4 space-y-1 text-rose-500">
                              <li><strong>Augment Founder Domain Experience:</strong> Partner with domain veterans or onboard experienced advisors.</li>
                              <li><strong>Optimize Investment Allocation:</strong> Leverage lower early capital ask with a higher early marketing ratio.</li>
                              <li><strong>Market Competition Alignment:</strong> Target low/medium blue-ocean segments or redefine value propositions.</li>
                              <li><strong>Balance Burn Rate:</strong> Minimize early team size and test core products with a lean operational model.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end justify-center shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Confidence Score</span>
                      <span className={`text-4xl font-extrabold tracking-tight ${isPositive ? 'text-emerald-450' : 'text-rose-400'}`}>
                        {prediction?.success_probability}%
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Summary Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Prediction Result */}
                <div className="glass-panel p-5 flex items-center gap-4 bg-[#111827]/40 border-slate-800/80">
                  <div className="p-3 bg-indigo-950/60 text-indigo-400 rounded-[18px] border border-indigo-900">
                    <FileText className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Prediction</span>
                    <span className="text-sm font-extrabold text-white">
                      {prediction?.success_probability >= 50 ? 'Success' : 'High Risk'}
                    </span>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="glass-panel p-5 flex items-center gap-4 bg-[#111827]/40 border-slate-800/80">
                  <div className="p-3 bg-cyan-950/60 text-cyan-400 rounded-[18px] border border-cyan-900">
                    <Sparkles className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Confidence Score</span>
                    <span className="text-sm font-extrabold text-white">{prediction?.success_probability}%</span>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="glass-panel p-5 flex items-center gap-4 bg-[#111827]/40 border-slate-800/80">
                  <div className="p-3 bg-rose-950/60 text-rose-405 rounded-[18px] border border-rose-900">
                    <AlertTriangle className="h-5.5 w-5.5 animate-pulse" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Level</span>
                    <span className="text-sm font-extrabold text-white">
                      {prediction?.risk_market > 60 ? 'High' : prediction?.risk_market > 35 ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="glass-panel p-5 flex items-center gap-4 bg-[#111827]/40 border-slate-800/80">
                  <div className="p-3 bg-emerald-950/60 text-emerald-450 rounded-[18px] border border-emerald-900">
                    <TrendingUp className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recommendation</span>
                    <span className="text-xs font-extrabold text-white truncate max-w-[150px] block">
                      {prediction?.success_probability >= 50 ? 'Proceed to MVP' : 'Optimize Inputs'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Visualizations & Detail Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Probability Gauge */}
                <div className="lg:col-span-1">
                  <SuccessGauge score={prediction?.success_probability} />
                </div>

                {/* Feature Importance Representation */}
                <div className="glass-panel p-6 border-slate-800/80 lg:col-span-2 space-y-4 bg-[#111827]/40">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="h-4.5 w-4.5 text-indigo-400" /> Key Feature Influences
                  </h3>
                  <p className="text-[11px] text-slate-405 leading-relaxed">
                    Estimated weight of user inputs on the ML classifier's decision boundaries.
                  </p>
                  
                  <div className="space-y-3.5">
                    {/* Founder Experience */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-350">Founder Domain Experience ({idea.founder_experience} years)</span>
                        <span className="text-emerald-450">High Influence (+{Math.min(10, Math.max(2, idea.founder_experience)) * 8}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(100, 30 + idea.founder_experience * 3.5)}%` }} />
                      </div>
                    </div>

                    {/* Marketing Budget */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-350">Annual Marketing Allocation (₹{idea.marketing_budget?.toLocaleString()})</span>
                        <span className="text-indigo-400">Medium Influence</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, 40 + (idea.marketing_budget / 500000) * 10)}%` }} />
                      </div>
                    </div>

                    {/* Investment Needed */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-350">Initial Funding Leverage (₹{idea.expected_investment?.toLocaleString()})</span>
                        <span className="text-indigo-400">High Influence</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(100, 20 + (idea.expected_investment / 1000000) * 8)}%` }} />
                      </div>
                    </div>

                    {/* Team Size */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-semibold">
                        <span className="text-slate-350">Operational Scale ({idea.team_size} Team Members)</span>
                        <span className="text-slate-500">Low Influence</span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-[#111827] rounded-full" style={{ width: `${Math.min(100, 15 + idea.team_size * 2.5)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Summary Card */}
              <div className="glass-panel p-6 border border-slate-800/80 space-y-4 bg-[#111827]/40">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ListOrdered className="h-4.5 w-4.5 text-indigo-400" /> Startup Input Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Target Market</span>
                    <span className="font-semibold text-white mt-0.5 block">{idea.country}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Pricing Point</span>
                    <span className="font-semibold text-white mt-0.5 block">₹{idea.expected_pricing}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Business Model</span>
                    <span className="font-semibold text-white mt-0.5 block">{idea.business_model}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Revenue Stream</span>
                    <span className="font-semibold text-white mt-0.5 block">{idea.revenue_model}</span>
                  </div>
                </div>
              </div>

              {/* Financial & Risks Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Financial Revenues table */}
                <div className="glass-panel p-6 border border-slate-800/80 bg-[#111827]/40">
                  <h3 className="text-sm font-bold text-white mb-4">Estimated Revenues Forecast</h3>
                  <div className="overflow-hidden rounded-xl border border-slate-800/80">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-800 text-[9px] uppercase font-bold text-slate-450">
                          <th className="p-3.5">Horizon</th>
                          <th className="p-3.5 text-right">Projected Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-[#111827]/20">
                        <tr>
                          <td className="p-3.5 font-semibold text-slate-300">Year 1 Projected Revenue</td>
                          <td className="p-3.5 text-right text-emerald-450 font-bold">₹{prediction?.revenue_y1?.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-semibold text-slate-300">Year 2 Projected Revenue</td>
                          <td className="p-3.5 text-right text-emerald-450 font-bold">₹{prediction?.revenue_y2?.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-3.5 font-semibold text-slate-300">Year 3 Projected Revenue</td>
                          <td className="p-3.5 text-right text-emerald-450 font-bold">₹{prediction?.revenue_y3?.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Risk matrix segment bars */}
                <div className="glass-panel p-6 border border-slate-800/80 bg-[#111827]/40 space-y-4">
                  <h3 className="text-sm font-bold text-white">Startup Risk Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RiskGauge title="Market Risk" value={prediction?.risk_market} />
                    <RiskGauge title="Financial Risk" value={prediction?.risk_financial} />
                    <RiskGauge title="Execution Risk" value={prediction?.risk_execution} />
                    <RiskGauge title="Technology Risk" value={prediction?.risk_technology} />
                    <div className="sm:col-span-2">
                      <RiskGauge title="Regulatory & Legal Risk" value={prediction?.risk_legal} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 bg-[#111827]/40 border-slate-800/80">
                  <h3 className="text-sm font-bold text-white mb-4">Marketing Suggestions</h3>
                  <ul className="space-y-3">
                    {marketing.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-400">
                        <span className="text-indigo-400 font-bold font-mono">0{idx+1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 bg-[#111827]/40 border-slate-800/80">
                  <h3 className="text-sm font-bold text-white mb-4">Growth & Scaling Roadmap</h3>
                  <ul className="space-y-3">
                    {growth.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-xs leading-relaxed text-slate-400">
                        <span className="text-emerald-450 font-bold font-mono">0{idx+1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LEAN BUSINESS CANVAS */}
          {activeTab === 'lean' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl text-xs text-indigo-400">
                💡 <strong>What is a Lean Canvas?</strong> A fast, structured 1-page template designed by Ash Maurya that deconstructs your business idea into key building blocks.
              </div>

              {/* Lean Canvas 5-column CSS grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-5 border border-slate-800 rounded-3xl overflow-hidden bg-slate-900 shadow-sm">
                {/* 1. Problem (Left col, top half) */}
                <div className="border-r border-b border-slate-800 p-5 md:col-span-1 md:row-span-2 bg-[#111827]/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">1. Problem</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.problem?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                {/* 2. Solution & Key Metrics (Middle Left) */}
                <div className="border-r border-b border-slate-800 p-5 md:col-span-1 bg-[#111827]/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">2. Solution</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.solution?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
                
                {/* 4. Unique Value Proposition (Center) */}
                <div className="border-r border-b border-slate-800 p-5 md:col-span-1 md:row-span-2 bg-indigo-950/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-450 mb-3">4. Unique Value Prop</h4>
                  <ul className="space-y-2 text-xs text-slate-300 text-left">
                    {leanCanvas.value_proposition?.map((item, i) => <li key={i} className="font-semibold">• {item}</li>)}
                  </ul>
                </div>

                {/* 5. Unfair Advantage (Middle Right) */}
                <div className="border-r border-b border-slate-800 p-5 md:col-span-1 bg-[#111827]/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">5. Unfair Advantage</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.unfair_advantage?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                {/* 3. Customer Segments (Right col, top half) */}
                <div className="border-b border-slate-800 p-5 md:col-span-1 md:row-span-2 bg-[#111827]/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">3. Customer Segments</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.customer_segments?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                {/* 8. Key Metrics (Row 2, Left Middle) */}
                <div className="border-r border-b border-slate-800 p-5 md:col-span-1 bg-[#111827]/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">8. Key Metrics</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.key_metrics?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                {/* 9. Channels (Row 2, Right Middle) */}
                <div className="border-r border-b border-slate-800 p-5 md:col-span-1 bg-[#111827]/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">9. Channels</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.channels?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                {/* 6. Cost Structure (Bottom Left, spanning cols) */}
                <div className="border-r border-slate-800 p-5 md:col-span-2.5 bg-slate-950/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">6. Cost Structure</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.cost_structure?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                {/* 7. Revenue Streams (Bottom Right, spanning cols) */}
                <div className="p-5 md:col-span-2.5 bg-slate-950/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-450 mb-3">7. Revenue Streams</h4>
                  <ul className="space-y-2 text-xs text-slate-400 text-left">
                    {leanCanvas.revenue_streams?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SWOT ANALYSIS */}
          {activeTab === 'swot' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl text-xs text-indigo-400">
                📊 <strong>SWOT Framework:</strong> An analytical model used to identify Strengths, Weaknesses, Opportunities, and Threats to help startup strategies align with market environments.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-6 rounded-[18px] border border-emerald-500/20 bg-emerald-950/10 text-slate-205 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-400" /> Strengths
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-350 text-left">
                    {swot.strengths?.map((str, i) => <li key={i} className="leading-relaxed">• {str}</li>)}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="p-6 rounded-[18px] border border-rose-500/20 bg-rose-950/10 text-slate-205 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-400" /> Weaknesses
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-350 text-left">
                    {swot.weaknesses?.map((wk, i) => <li key={i} className="leading-relaxed">• {wk}</li>)}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="p-6 rounded-[18px] border border-blue-500/20 bg-blue-950/10 text-slate-205 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-405" /> Opportunities
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-350 text-left">
                    {swot.opportunities?.map((op, i) => <li key={i} className="leading-relaxed">• {op}</li>)}
                  </ul>
                </div>

                {/* Threats */}
                <div className="p-6 rounded-[18px] border border-amber-500/20 bg-amber-950/10 text-slate-205 space-y-3 shadow-sm">
                  <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-405" /> Threats
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-355 text-left">
                    {swot.threats?.map((th, i) => <li key={i} className="leading-relaxed">• {th}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SLIDE PITCH DECK */}
          {activeTab === 'pitch' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl text-xs text-indigo-400">
                🎤 <strong>Pitch Deck Slides:</strong> Instantly generated structural outline to present your startup idea to potential angel investors and venture funds.
              </div>

              {pitchDeck.length > 0 ? (
                <div className="glass-panel border border-slate-800/80 overflow-hidden shadow-md bg-[#111827]/45">
                  {/* Slide Main Body */}
                  <div className="p-8 md:p-12 min-h-[300px] flex flex-col justify-between relative bg-gradient-to-b from-[#111827] to-[#0B0F19]/40">
                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest bg-indigo-950 px-3 py-1 rounded-full border border-indigo-900/40">
                          Slide {activeSlide + 1} of {pitchDeck.length}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{pitchDeck[activeSlide]?.title}</span>
                      </div>
                      
                      <h2 className="text-2xl font-extrabold text-white tracking-tight border-b border-slate-800/80 pb-3">{pitchDeck[activeSlide]?.title}</h2>
                      
                      <ul className="space-y-3.5 text-xs text-slate-350 pl-2">
                        {pitchDeck[activeSlide]?.points?.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="text-indigo-400 font-bold mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center mt-8 border-t border-slate-800 pt-4">
                      <button
                        disabled={activeSlide === 0}
                        onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                        className="text-xs font-bold text-slate-500 hover:text-slate-350 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        &larr; Prev Slide
                      </button>
                      <button
                        disabled={activeSlide === pitchDeck.length - 1}
                        onClick={() => setActiveSlide(prev => Math.min(pitchDeck.length - 1, prev + 1))}
                        className="text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Next Slide &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 bg-[#111827]/40 rounded-2xl border border-slate-800/80">No pitch deck content generated.</div>
              )}
            </div>
          )}

          {/* Footer */}
          <footer className="py-12 border-t border-slate-800/60 text-center text-xs text-slate-500 mt-12 bg-[#090D16] rounded-3xl p-6 shadow-sm border border-slate-800/80">
            <div className="max-w-md mx-auto border-t border-dashed border-slate-800 pt-6 space-y-1">
              <p className="font-bold text-slate-400">Developed by Utkarsh Kumar</p>
              <p className="text-slate-550">Startup Success Prediction System</p>
              <p className="text-[10px] text-slate-650 font-bold uppercase tracking-wider mt-1">Powered by Machine Learning</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default ReportDetail;
