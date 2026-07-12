import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SuccessGauge from '../components/SuccessGauge';
import RiskGauge from '../components/RiskGauge';
import CompetitorAnalysis from '../components/CompetitorAnalysis';
import FinancialForecast from '../components/FinancialForecast';
import { 
  FileText, Download, MessageSquare, ArrowLeft, BarChart3, 
  Sparkles, Layers, ListOrdered, Calendar, ShieldCheck, Users, TrendingUp
} from 'lucide-react';

const ReportDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); 
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
        loading(false);
      }
    };

    if (token) {
      fetchReportDetail();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-dark-bg text-gray-200">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-10 text-center">
            <h3 className="text-xl font-bold text-rose-400">Error loading report</h3>
            <p className="text-sm text-gray-500 mt-2">{error || "Report details not found."}</p>
            <Link to="/dashboard" className="mt-4 inline-block text-sm text-brand-400 hover:underline">
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

  const handleDownloadPDF = () => {
    if (report && report.pdf_path) {
      window.open(report.pdf_path, '_blank');
    } else {
      alert("PDF report is not available for this startup.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-7xl space-y-8">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-2.5 bg-dark-card border border-dark-border/80 text-gray-400 hover:text-white rounded-xl transition-all">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">{idea.industry} Startup</span>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">{idea.name}</h1>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Link 
                to={`/mentor-chat?idea_id=${idea.id}`}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-brand-500/25 hover:border-brand-500/60 bg-brand-500/5 hover:bg-brand-500/10 text-brand-300 font-bold text-sm transition-all"
              >
                <MessageSquare className="h-4 w-4" /> Consult Mentor
              </Link>
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white text-sm transition-all shadow-lg shadow-brand-500/20"
              >
                <Download className="h-4 w-4" /> Download PDF Report
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Competitors aur Financials yahan line-up ho gaye hain) */}
          <div className="flex flex-wrap border-b border-dark-border/80 gap-6 text-sm font-semibold">
            {[
              { id: 'overview', label: 'Evaluation Overview', icon: BarChart3 },
              { id: 'competitors', label: 'Market Analysis', icon: Users },
              { id: 'financials', label: 'Financial Forecast', icon: TrendingUp },
              { id: 'lean', label: 'Lean Business Canvas', icon: Layers },
              { id: 'swot', label: 'SWOT Analysis', icon: Sparkles },
              { id: 'pitch', label: 'Slide Pitch Deck', icon: ListOrdered }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-all ${
                    activeTab === tab.id 
                      ? 'border-brand-500 text-white font-bold' 
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SuccessGauge score={prediction?.success_probability} />
                
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-dark-border/60">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Funding Readiness</span>
                    <h3 className="text-3xl font-extrabold text-white mt-1">{prediction?.funding_readiness}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">
                      A high score reflects a strong founder experience background, healthy budget alignment, and low key operational risks.
                    </p>
                  </div>
                  <div className="mt-4 p-3 bg-dark-bg/60 rounded-xl border border-dark-border/50 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-brand-400 shrink-0" />
                    <span className="text-[11px] text-gray-400">Classified category: <strong className="text-white">{prediction?.predicted_category}</strong></span>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-dark-border/60 flex flex-col justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Launch Operations</span>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-5 w-5 text-brand-400" />
                      <span className="text-sm font-semibold text-white">Target launch: {idea.expected_launch_date}</span>
                    </div>
                    <ul className="text-xs text-gray-400 space-y-2 mt-4">
                      <li>• Team composition: <strong>{idea.team_size} members</strong></li>
                      <li>• Founder experience: <strong>{idea.founder_experience} years</strong></li>
                      <li>• Competition level: <strong>{idea.competition_level}</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Financial Baseline Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-dark-border/60">
                  <h3 className="text-lg font-bold text-white mb-4">Estimated Revenues Forecast (Baseline)</h3>
                  <div className="overflow-hidden rounded-xl border border-dark-border/80">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-dark-card/50 border-b border-dark-border/80 text-[10px] uppercase font-bold text-gray-400">
                          <th className="p-3">Horizon</th>
                          <th className="p-3 text-right">Projected Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/40">
                        <tr>
                          <td className="p-3 font-semibold text-white">Year 1 Projected Revenue</td>
                          <td className="p-3 text-right text-emerald-400 font-bold">₹{prediction?.revenue_y1?.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-white">Year 2 Projected Revenue</td>
                          <td className="p-3 text-right text-emerald-400 font-bold">₹{prediction?.revenue_y2?.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-white">Year 3 Projected Revenue</td>
                          <td className="p-3 text-right text-emerald-400 font-bold">₹{prediction?.revenue_y3?.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-dark-border/60 space-y-4">
                  <h3 className="text-lg font-bold text-white">Startup Risk Profile</h3>
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

              {/* Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border-dark-border/60">
                  <h3 className="text-lg font-bold text-white mb-4">Marketing Suggestions</h3>
                  <ul className="space-y-3">
                    {marketing.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-xs leading-relaxed text-gray-400">
                        <span className="text-brand-400 font-bold font-mono">0{idx+1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-dark-border/60">
                  <h3 className="text-lg font-bold text-white mb-4">Growth & Scaling roadmap</h3>
                  <ul className="space-y-3">
                    {growth.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-xs leading-relaxed text-gray-400">
                        <span className="text-emerald-400 font-bold font-mono">0{idx+1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC TAB: MARKET ANALYSIS */}
          {activeTab === 'competitors' && (
            <div className="animate-fade-in bg-dark-card border border-dark-border/60 p-6 rounded-3xl">
              <CompetitorAnalysis reportData={report} />
            </div>
          )}

          {/* DYNAMIC TAB: FINANCIAL FORECAST (CHART-JS VIEW) */}
          {activeTab === 'financials' && (
            <div className="animate-fade-in bg-dark-card border border-dark-border/60 p-6 rounded-3xl text-gray-900">
              <FinancialForecast predictionData={prediction} />
            </div>
          )}

          {/* TAB: LEAN BUSINESS CANVAS */}
          {activeTab === 'lean' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-brand-950/20 border border-brand-900/60 rounded-2xl text-xs text-brand-300">
                💡 <strong>What is a Lean Canvas?</strong> A fast, structured 1-page template designed by Ash Maurya that deconstructs your business idea into key building blocks.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 border border-dark-border rounded-3xl overflow-hidden bg-dark-bg">
                <div className="border-r border-b border-dark-border p-5 md:col-span-1 md:row-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">1. Problem</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.problem?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="border-r border-b border-dark-border p-5 md:col-span-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">2. Solution</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.solution?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
                
                <div className="border-r border-b border-dark-border p-5 md:col-span-1 md:row-span-2 bg-brand-950/5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">4. Unique Value Prop</h4>
                  <ul className="space-y-2 text-xs text-gray-300">
                    {leanCanvas.unique_value_proposition?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="border-r border-b border-dark-border p-5 md:col-span-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">5. Unfair Advantage</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.unfair_advantage?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="border-b border-dark-border p-5 md:col-span-1 md:row-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">7. Customer Segments</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.customer_segments?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="border-r border-b border-dark-border p-5 md:col-span-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">3. Key Metrics</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.key_metrics?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="border-r border-b border-dark-border p-5 md:col-span-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">6. Channels</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.channels?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="border-r p-5 md:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">8. Cost Structure</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.cost_structure?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>

                <div className="p-5 md:col-span-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-3">9. Revenue Streams</h4>
                  <ul className="space-y-2 text-xs text-gray-400">
                    {leanCanvas.revenue_streams?.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SWOT ANALYSIS */}
          {activeTab === 'swot' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border-emerald-500/20 hover:border-emerald-500/50 bg-emerald-500/[0.02] transition-all">
                  <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    💪 Strengths (Internal, Help)
                  </h3>
                  <ul className="space-y-3 text-xs leading-relaxed text-gray-300">
                    {swot.strengths?.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-rose-500/20 hover:border-rose-500/50 bg-rose-500/[0.02] transition-all">
                  <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
                    ⚠️ Weaknesses (Internal, Harm)
                  </h3>
                  <ul className="space-y-3 text-xs leading-relaxed text-gray-300">
                    {swot.weaknesses?.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-sky-500/20 hover:border-sky-500/50 bg-sky-500/[0.02] transition-all">
                  <h3 className="text-lg font-bold text-sky-400 mb-4 flex items-center gap-2">
                    🚀 Opportunities (External, Help)
                  </h3>
                  <ul className="space-y-3 text-xs leading-relaxed text-gray-300">
                    {swot.opportunities?.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl border-amber-500/20 hover:border-amber-500/50 bg-amber-500/[0.02] transition-all">
                  <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                    🛑 Threats (External, Harm)
                  </h3>
                  <ul className="space-y-3 text-xs leading-relaxed text-gray-300">
                    {swot.threats?.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span>•</span> <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PITCH DECK SLIDES */}
          {activeTab === 'pitch' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
              <div className="p-4 bg-brand-950/20 border border-brand-900/60 rounded-2xl text-xs text-brand-300">
                📢 <strong>Investor Ready Pitch Content:</strong> A structural slide-by-slide guide you can copy directly to build your presentations.
              </div>

              {pitchDeck.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-panel p-4 rounded-2xl md:col-span-1 border-dark-border/60 max-h-[400px] overflow-y-auto space-y-1">
                    {pitchDeck.map((slide, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSlide(idx)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          activeSlide === idx 
                            ? 'bg-brand-600 text-white font-bold' 
                            : 'text-gray-400 hover:text-white hover:bg-dark-border/40'
                        }`}
                      >
                        Slide {slide.slide_number}: {slide.title}
                      </button>
                    ))}
                  </div>

                  <div className="glass-panel p-8 rounded-3xl md:col-span-3 border-dark-border/60 flex flex-col justify-between min-h-[300px] bg-gradient-to-b from-dark-card/50 to-dark-bg relative overflow-hidden">
                    <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-brand-500/5 blur-2xl" />
                    <div>
                      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">
                        Slide {pitchDeck[activeSlide]?.slide_number} of {pitchDeck.length}
                      </span>
                      <h3 className="text-xl font-bold text-white mt-1 border-b border-dark-border/50 pb-4 mb-6">
                        {pitchDeck[activeSlide]?.title}
                      </h3>
                      <ul className="space-y-4">
                        {pitchDeck[activeSlide]?.bullets?.map((bullet, bidx) => (
                          <li key={bidx} className="flex gap-3 text-sm leading-relaxed text-gray-300">
                            <span className="text-brand-500 font-extrabold">&bull;</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center mt-8 border-t border-dark-border/50 pt-4">
                      <button
                        disabled={activeSlide === 0}
                        onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
                        className="text-xs font-bold text-gray-400 hover:text-white disabled:opacity-40 disabled:pointer-events-none"
                      >
                        &larr; Prev Slide
                      </button>
                      <button
                        disabled={activeSlide === pitchDeck.length - 1}
                        onClick={() => setActiveSlide(prev => Math.min(pitchDeck.length - 1, prev + 1))}
                        className="text-xs font-bold text-brand-400 hover:text-brand-300 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Next Slide &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">No pitch deck content generated.</div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportDetail;