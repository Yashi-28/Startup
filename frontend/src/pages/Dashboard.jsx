import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext, API_BASE_URL } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { 
  Plus, FileText, TrendingUp, AlertTriangle, 
  Trash2, Calendar, RefreshCw, Cpu, Activity, ShieldCheck
} from 'lucide-react';

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
  const navigate = useNavigate();

  const [ideas, setIdeas] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const ideasResponse = await fetch(`${API_BASE_URL}/ideas`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ideasResponse.ok) {
        const ideasData = await ideasResponse.json();
        setIdeas(ideasData);

        // Fetch prediction details for each idea
        const predsObj = {};
        await Promise.all(ideasData.map(async (idea) => {
          try {
            const predRes = await fetch(`${API_BASE_URL}/ideas/${idea.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (predRes.ok) {
              const fullData = await predRes.json();
              predsObj[idea.id] = fullData.prediction;
            }
          } catch (e) {
            console.error("Error loading prediction detail", e);
          }
        }));
        setPredictions(predsObj);
      } else {
        setErr("Failed to load dashboard metrics.");
      }
    } catch (e) {
      setErr("Error loading dashboard data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this startup evaluation record?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/ideas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setIdeas(prev => prev.filter(idea => idea.id !== id));
      } else {
        alert("Failed to delete record.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting record.");
    }
  };

  // Calculations for KPI Cards
  const totalEvaluated = ideas.length;
  const averageProbability = totalEvaluated > 0
    ? Math.round(Object.values(predictions).reduce((acc, pred) => acc + (pred?.success_probability || 0), 0) / totalEvaluated)
    : 0;
  const maxInvestment = totalEvaluated > 0
    ? Math.max(...ideas.map(idea => idea.expected_investment || 0))
    : 0;
  const highRiskIdeas = Object.values(predictions).filter(pred => (pred?.success_probability || 0) < 50).length;

  // Chart Setup
  const chartData = {
    labels: ideas.map(idea => idea.name.length > 10 ? idea.name.slice(0, 10) + '...' : idea.name),
    datasets: [
      {
        label: 'Success Probability (%)',
        data: ideas.map(idea => predictions[idea.id]?.success_probability || 0),
        backgroundColor: '#6366F1', // Brand Indigo-500
        borderColor: '#4F46E5',
        borderWidth: 1,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: 'Poppins' }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: { family: 'Poppins' }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-7xl space-y-8 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Portfolio</h1>
              <p className="text-sm text-slate-400 mt-1">Review aggregated analytics of evaluated startups and portfolio lists.</p>
            </div>
            
            <Link
              to="/evaluate-form"
              className="glow-btn flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-500 hover:to-violet-550 text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all"
            >
              <Plus className="h-4 w-4" /> Evaluate New Startup
            </Link>
          </div>

          {err && (
            <div className="bg-rose-950/20 border border-rose-900/60 text-rose-400 p-4 rounded-xl text-xs">
              {err}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              <p className="text-xs text-slate-400 mt-3 font-semibold">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Average Feasibility */}
                <div className="glass-panel p-6 flex flex-col justify-between bg-[#111827]/40 border-slate-800/80">
                  <div>
                    <div className="p-2.5 bg-indigo-950/60 border border-indigo-900 text-indigo-400 rounded-xl w-fit mb-4">
                      <Activity className="h-5.5 w-5.5" />
                    </div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Success Prob.</span>
                    <span className="text-2xl font-extrabold text-white mt-1 block">{averageProbability}%</span>
                    <p className="text-[10px] text-slate-550 mt-1">Average of evaluated concepts</p>
                  </div>
                </div>

                {/* Maximum Funding Needed */}
                <div className="glass-panel p-6 flex flex-col justify-between bg-[#111827]/40 border-slate-800/80">
                  <div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl w-fit mb-4">
                      <Cpu className="h-5.5 w-5.5" />
                    </div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Max Capital Ask</span>
                    <span className="text-2xl font-extrabold text-white mt-1 block">₹{maxInvestment.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-550 mt-1">Highest target funding requested</p>
                  </div>
                </div>

                {/* Total Evaluated Ideas */}
                <div className="glass-panel p-6 flex flex-col justify-between bg-[#111827]/40 border-slate-800/80">
                  <div>
                    <div className="p-2.5 bg-cyan-950/60 border border-cyan-900 text-cyan-400 rounded-xl w-fit mb-4">
                      <TrendingUp className="h-5.5 w-5.5" />
                    </div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Evaluated Concepts</span>
                    <span className="text-2xl font-extrabold text-white mt-1 block">{totalEvaluated}</span>
                    <p className="text-[10px] text-slate-550 mt-1">Total database ideas registered</p>
                  </div>
                </div>

                {/* High Risk Records */}
                <div className="glass-panel p-6 flex flex-col justify-between bg-[#111827]/40 border-slate-800/80">
                  <div>
                    <div className="p-2.5 bg-rose-950/60 border border-rose-900 text-rose-400 rounded-xl w-fit mb-4">
                      <AlertTriangle className="h-5.5 w-5.5 text-rose-400" />
                    </div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">High Risk Records</span>
                    <span className="text-2xl font-extrabold text-rose-450 mt-1 block">{highRiskIdeas}</span>
                    <p className="text-[10px] text-slate-550 mt-1">Startups with feasibility &lt; 50%</p>
                  </div>
                </div>
              </div>

              {totalEvaluated > 0 ? (
                <>
                  {/* Chart Representation */}
                  <div className="glass-panel p-6 border-slate-800/80 bg-[#111827]/40">
                    <h3 className="text-sm font-bold text-white mb-4">Feasibility Score Comparisons</h3>
                    <div className="h-64 relative">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>

                  {/* Predictions List Table */}
                  <div className="glass-panel overflow-hidden border-slate-800/80 bg-[#111827]/40 shadow-md">
                    <div className="p-5 border-b border-slate-800">
                      <h3 className="text-sm font-bold text-white">Recent Evaluations</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                            <th className="p-4">Date</th>
                            <th className="p-4">Startup Idea</th>
                            <th className="p-4">Prediction</th>
                            <th className="p-4">Probability</th>
                            <th className="p-4">Risk Level</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-[#111827]/20">
                          {ideas.map(idea => {
                            const pred = predictions[idea.id];
                            const dateStr = idea.expected_launch_date 
                              ? new Date(idea.expected_launch_date).toLocaleDateString()
                              : 'N/A';
                            const probability = pred ? pred.success_probability : 0;
                            const isPositive = probability >= 50;

                            return (
                              <tr key={idea.id} className="hover:bg-slate-900/30 transition-colors">
                                <td className="p-4 text-slate-350">{dateStr}</td>
                                <td className="p-4 font-bold text-slate-100">{idea.name}</td>
                                <td className="p-4">
                                  {pred ? (
                                    <span className={`inline-flex items-center gap-1 font-bold ${isPositive ? 'text-emerald-450' : 'text-rose-400'}`}>
                                      {isPositive ? <ShieldCheck className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                                      {isPositive ? 'Success' : 'High Risk'}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">Uncalculated</span>
                                  )}
                                </td>
                                <td className="p-4 font-extrabold text-slate-200">
                                  {pred ? `${probability}%` : '—'}
                                </td>
                                <td className="p-4">
                                  {pred ? (
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                                      pred.risk_market > 60 
                                        ? 'bg-rose-950/40 border border-rose-900/60 text-rose-400' 
                                        : pred.risk_market > 35 
                                          ? 'bg-amber-950/40 border border-amber-900/60 text-amber-400' 
                                          : 'bg-emerald-950/40 border border-emerald-900/60 text-emerald-450'
                                    }`}>
                                      {pred.risk_market > 60 ? 'High' : pred.risk_market > 35 ? 'Medium' : 'Low'}
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">—</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <span className="inline-flex items-center gap-1.5 text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                    <RefreshCw className="h-3 w-3 animate-spin-slow" /> Evaluated
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-4">
                                    <Link
                                      to={`/report/${idea.id}`}
                                      className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-all"
                                    >
                                      <FileText className="h-4 w-4" /> View Report
                                    </Link>
                                    <button
                                      onClick={() => handleDelete(idea.id)}
                                      className="text-slate-500 hover:text-rose-400 transition-colors"
                                      title="Delete prediction"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="glass-panel p-12 text-center border-slate-800/80 bg-[#111827]/40 shadow-sm">
                  <h3 className="text-lg font-bold text-white mb-2">No Evaluations Found</h3>
                  <p className="text-xs text-slate-450 mb-6">You haven't submitted any startup ideas for AI analysis yet.</p>
                  <Link
                    to="/evaluate-form"
                    className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-650 hover:from-indigo-500 hover:to-violet-550 text-xs font-bold text-white shadow-md"
                  >
                    <Plus className="h-4 w-4" /> Start Your First Prediction
                  </Link>
                </div>
              )}
            </>
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

export default Dashboard;
