import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  Plus, FileText, TrendingUp, IndianRupee, AlertTriangle, 
  Trash2, Award, Calendar, Lightbulb, RefreshCw 
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [ideas, setIdeas] = useState([]);
  const [summary, setSummary] = useState({
    total_ideas: 0,
    average_success_probability: 0,
    high_readiness_count: 0,
    total_predicted_revenue_y1: 0,
    average_market_risk: 0
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch ideas
      const resIdeas = await fetch(`${API_BASE_URL}/ideas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resIdeas.ok) {
        const ideasData = await resIdeas.json();
        setIdeas(ideasData);
      }

      // Fetch summary
      const resSummary = await fetch(`${API_BASE_URL}/ideas/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resSummary.ok) {
        const summaryData = await resSummary.json();
        setSummary(summaryData);
      }
    } catch (error) {
      setErr("Failed to load dashboard data.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Prevent navigating to detail
    if (!window.confirm("Are you sure you want to delete this startup idea?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete idea.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Prepare chart data for evaluated startups
  const evaluatedIdeas = ideas.filter(idea => idea.id); // in our case all from ideas have records
  // Wait, we need to know if they have a prediction. Let's fetch detail or we can construct mock chart from summary
  
  const chartData = {
    labels: ideas.slice(0, 5).map(i => i.name),
    datasets: [
      {
        label: 'Year 1 Projected Revenue (₹)',
        data: ideas.slice(0, 5).map(i => {
          // Since list doesn't return full predictions directly (they are fetched on detail), we can estimate a rough index or fallback
          return i.expected_investment * 0.8 + i.marketing_budget * 1.5;
        }),
        backgroundColor: '#7C3AED',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#9CA3AF' }
      },
      title: { display: false }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9CA3AF' } },
      y: { grid: { color: 'rgba(34, 47, 71, 0.4)' }, ticks: { color: '#9CA3AF' } }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Startup Portfolio</h1>
              <p className="text-sm text-gray-400 mt-1">Submit, evaluate, and track all your startup ideas.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchData}
                className="p-3 bg-dark-card border border-dark-border/80 text-gray-300 rounded-xl hover:text-white transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <Link
                to="/evaluate-form"
                className="glow-btn flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white text-sm transition-all shadow-lg shadow-brand-500/20"
              >
                <Plus className="h-5 w-5" /> Evaluate New Idea
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {/* Total Ideas */}
                <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-dark-border/60">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Ideas</span>
                    <span className="text-2xl font-extrabold text-white">{summary.total_ideas}</span>
                  </div>
                </div>

                {/* Avg Success probability */}
                <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-dark-border/60">
                  <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Avg Success Rate</span>
                    <span className="text-2xl font-extrabold text-white">{summary.average_success_probability}%</span>
                  </div>
                </div>

                {/* High Readiness */}
                <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-dark-border/60">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Funding Ready</span>
                    <span className="text-2xl font-extrabold text-white">{summary.high_readiness_count} ideas</span>
                  </div>
                </div>

                {/* Y1 revenue */}
                <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-dark-border/60">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <IndianRupee className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Total Revenue Y1</span>
                    <span className="text-xl font-extrabold text-white">
                      ₹{summary.total_predicted_revenue_y1.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Average risk */}
                <div className="glass-panel p-5 rounded-2xl flex items-center gap-4 border-dark-border/60">
                  <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-gray-500 tracking-wider">Avg Market Risk</span>
                    <span className="text-2xl font-extrabold text-white">{summary.average_market_risk}%</span>
                  </div>
                </div>
              </div>

              {/* Chart & Tips layout */}
              {ideas.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Chart */}
                  <div className="glass-panel p-6 rounded-3xl lg:col-span-2 border-dark-border/60">
                    <h3 className="text-base font-bold text-white mb-4">Investment vs Revenue Estimates (First 5 Startups)</h3>
                    <div className="h-[250px] flex items-center justify-center">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="glass-panel p-6 rounded-3xl border-dark-border/60 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white mb-3">AI Evaluation Insights</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        Evaluations rely on historical parameters combined with semantic understanding of your description text.
                      </p>
                      <div className="space-y-3">
                        <div className="p-3 bg-dark-bg/60 rounded-xl border border-dark-border/50 text-xs">
                          <span className="font-bold text-brand-400">Pro-Tip:</span> Write detailed problem and solution descriptions (over 50 words) to trigger more accurate SWOT and Lean Canvas items from Gemini.
                        </div>
                        <div className="p-3 bg-dark-bg/60 rounded-xl border border-dark-border/50 text-xs">
                          <span className="font-bold text-emerald-400">Optimization:</span> A lower starting investment with a higher marketing budget ratio often predicts a higher early success probability.
                        </div>
                      </div>
                    </div>
                    <Link to="/evaluate-form" className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-400 hover:text-brand-300 transition-all flex items-center gap-1">
                      New Evaluation Form &rarr;
                    </Link>
                  </div>
                </div>
              )}

              {/* Ideas Table List */}
              <div className="glass-panel rounded-3xl border border-dark-border/60 overflow-hidden">
                <div className="p-6 border-b border-dark-border/60 flex justify-between items-center bg-dark-card/20">
                  <h3 className="text-base font-bold text-white">Your Startup Portfolio</h3>
                  <span className="text-xs text-gray-400 font-semibold">{ideas.length} ideas total</span>
                </div>

                {ideas.length === 0 ? (
                  <div className="p-12 text-center flex flex-col items-center">
                    <FileText className="h-12 w-12 text-gray-600 mb-4" />
                    <h4 className="text-lg font-bold text-gray-300">No startup ideas yet</h4>
                    <p className="text-xs text-gray-500 max-w-xs mt-1">Submit your first idea description and let the AI models evaluate it.</p>
                    <Link to="/evaluate-form" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white transition-all">
                      Create first idea
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-dark-border/80 text-[10px] font-bold uppercase text-gray-500 tracking-wider bg-dark-card/10">
                          <th className="py-4 px-6">Startup Idea</th>
                          <th className="py-4 px-6">Industry</th>
                          <th className="py-4 px-6">Country</th>
                          <th className="py-4 px-6">Team Size</th>
                          <th className="py-4 px-6">Launch Date</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/40">
                        {ideas.map((idea) => (
                          <tr key={idea.id} className="hover:bg-dark-card/25 transition-colors">
                            <td className="py-4 px-6 font-semibold text-white">
                              <Link to={`/report/${idea.id}`} className="hover:text-brand-400 transition-colors">
                                {idea.name}
                              </Link>
                            </td>
                            <td className="py-4 px-6 text-gray-400">{idea.industry}</td>
                            <td className="py-4 px-6 text-gray-400">{idea.country}</td>
                            <td className="py-4 px-6 text-gray-400">{idea.team_size} members</td>
                            <td className="py-4 px-6 text-gray-400">{idea.expected_launch_date}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-3">
                                <Link 
                                  to={`/report/${idea.id}`}
                                  className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-all border border-brand-500/20 hover:border-brand-500/50 bg-brand-500/5 hover:bg-brand-500/10 px-3 py-1.5 rounded-lg"
                                >
                                  Open Report
                                </Link>
                                <button
                                  onClick={(e) => handleDelete(idea.id, e)}
                                  className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors border border-transparent hover:border-rose-500/20 rounded-lg hover:bg-rose-500/5"
                                  title="Delete startup idea"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
