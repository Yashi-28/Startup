import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { 
  TrendingUp, Target, Rocket, DollarSign, Brain, Sparkles, 
  BarChart3, Shield, Building2, Users, Lightbulb, Globe,
  ShieldCheck, AlertTriangle, ArrowRight, Info, Eye, Maximize2, Minimize2
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Legend, LineChart, Line, ComposedChart
} from 'recharts';

// --- 3D PIE COMPONENT (Three.js Segment) ---
function ThreePieSegment({ color, rotation, size, exploded, onClick }) {
  const meshRef = React.useRef();
  const position = exploded ? [0.2, 0, 0.2] : [0, 0, 0];
  
  return (
    <mesh 
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
    >
      <cylinderGeometry args={[size, size, 0.4, 32, 1, false, 0, Math.PI * 1.2]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

// --- 3D BAR COMPONENT ---
function ThreeBar({ position, height, color }) {
  const meshRef = React.useRef();
  return (
    <mesh ref={meshRef} position={[position[0], height / 2, position[2]]}>
      <boxGeometry args={[0.4, height, 0.4]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

// CountUp helper component
const CountUp = ({ to, duration = 1.5, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to);
    if (start === end) {
      setCount(end);
      return;
    }
    
    const totalMiliseconds = duration * 1000;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, Math.max(incrementTime, 15));
    
    return () => clearInterval(timer);
  }, [to, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const IndianRupee = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 3a7.5 7.5 0 0 1 0 15h2" />
    <path d="m14 21-6-3" />
  </svg>
);

const InteractiveAnalytics = ({ idea, prediction, report }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, canvas, financial

  // Parse SWOT & suggestions
  const swot = report?.swot_analysis ? JSON.parse(report.swot_analysis) : { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const leanCanvas = report?.lean_canvas ? JSON.parse(report.lean_canvas) : {};
  const marketing = report?.marketing_suggestions ? JSON.parse(report.marketing_suggestions) : [];
  const growth = report?.growth_strategy ? JSON.parse(report.growth_strategy) : [];

  // 3D Pie Chart state
  const [pieExploded, setPieExploded] = useState(false);

  // Real-time calculations
  const successRate = prediction?.success_probability || 50;
  const confidenceScore = 92; // ML Fit metric
  const initialPricing = idea?.expected_pricing || 1500;
  const fundingNeed = idea?.expected_investment || 100000;
  const marketingBudget = idea?.marketing_budget || 20000;
  
  // Calculate expected ROI and runway
  const runwayMonths = fundingNeed > 0 ? Math.round((fundingNeed / (marketingBudget + 10000)) * 1.5) : 12;
  const expectedRoi = successRate > 50 ? Math.round((successRate * 2.4)) : Math.round((successRate * 1.1));

  // Visualizations datasets
  const revenueData = [
    { year: 'Year 1', Revenue: prediction?.revenue_y1 || 120000, Expenses: fundingNeed * 0.4 },
    { year: 'Year 2', Revenue: prediction?.revenue_y2 || 350000, Expenses: fundingNeed * 0.3 },
    { year: 'Year 3', Revenue: prediction?.revenue_y3 || 800000, Expenses: fundingNeed * 0.2 }
  ];

  const monthlyGrowthData = [
    { name: 'Month 1', Revenue: (prediction?.revenue_y1 || 120000) / 12, Users: 100, Orders: 25 },
    { name: 'Month 3', Revenue: (prediction?.revenue_y1 || 120000) / 6, Users: 350, Orders: 90 },
    { name: 'Month 6', Revenue: (prediction?.revenue_y1 || 120000) / 3, Users: 980, Orders: 260 },
    { name: 'Month 9', Revenue: (prediction?.revenue_y1 || 120000) / 1.5, Users: 2400, Orders: 590 },
    { name: 'Month 12', Revenue: prediction?.revenue_y1 || 120000, Users: 5000, Orders: 1200 }
  ];

  const radarData = [
    { subject: 'Finance', A: 100 - (prediction?.risk_financial || 30), fullMark: 100 },
    { subject: 'Competition', A: 100 - (prediction?.risk_market || 40), fullMark: 100 },
    { subject: 'Technology', A: 100 - (prediction?.risk_technology || 20), fullMark: 100 },
    { subject: 'Marketing', A: 85, fullMark: 100 },
    { subject: 'Scalability', A: 78, fullMark: 100 },
    { subject: 'Customer Demand', A: 90, fullMark: 100 },
    { subject: 'Legal', A: 100 - (prediction?.risk_legal || 15), fullMark: 100 },
    { subject: 'Team', A: Math.min(100, 30 + (idea?.team_size || 1) * 8), fullMark: 100 }
  ];

  const comparisonData = [
    { category: 'Feasibility %', 'Your Startup': successRate, 'Average Startup': 45, 'Successful Startup': 85 },
    { category: 'Founder Exp (Yrs)', 'Your Startup': idea?.founder_experience || 2, 'Average Startup': 3, 'Successful Startup': 8 },
    { category: 'Team Size', 'Your Startup': idea?.team_size || 3, 'Average Startup': 4, 'Successful Startup': 12 }
  ];

  const handleExportPDF = () => {
    window.print();
  };

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 overflow-y-auto bg-[#0B0F19] p-8"
    : "space-y-8";

  return (
    <div className={containerClass}>
      {/* Top Banner Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Info className="h-4.5 w-4.5 text-indigo-400" />
          <span className="text-xs text-slate-350">Interactive 3D Visualizations & Metric Sandbox</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white transition-all shadow-sm flex items-center gap-1.5 text-xs font-semibold"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          </button>
          
          <button
            onClick={handleExportPDF}
            className="glow-btn px-4.5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-650 text-xs font-bold text-white shadow-md shadow-indigo-500/10 hover:from-indigo-500 hover:to-violet-550 transition-all"
          >
            Export Dashboard PDF
          </button>
        </div>
      </div>

      {/* 5. Business KPI Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Total Predictions", value: "1", prefix: "", suffix: "", desc: "Evaluation entries logged", icon: Rocket, color: "text-indigo-400" },
          { label: "Success Probability", value: successRate, prefix: "", suffix: "%", desc: "Predicted feasibility", icon: Target, color: "text-emerald-400" },
          { label: "Investment Score", value: expectedRoi, prefix: "", suffix: "/100", desc: "Capital readiness index", icon: IndianRupee, color: "text-blue-400" },
          { label: "Risk Mitigation", value: 100 - Math.round(((prediction?.risk_market || 40) + (prediction?.risk_financial || 30)) / 2), prefix: "", suffix: "%", desc: "Low exposure index", icon: Shield, color: "text-rose-400" }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-5 border border-slate-800/80 bg-slate-900/25 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">{kpi.label}</span>
                <Icon className={`h-4.5 w-4.5 ${kpi.color}`} />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-white">
                  <CountUp to={kpi.value} prefix={kpi.prefix} suffix={kpi.suffix} />
                </span>
                <p className="text-[9px] text-slate-500 mt-1 font-semibold">{kpi.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Section 1: 3D Canvas Visualizer Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. 3D Pie Chart (Success vs Failure Segments) */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[360px] bg-slate-950/20 relative">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-400" /> 1. Success vs Failure
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Interactive 3D representation. Hover to explode.</p>
          </div>

          <div className="flex-1 w-full relative">
            <Canvas camera={{ position: [0, 1.5, 3] }}>
              <ambientLight intensity={1.3} />
              <directionalLight position={[2, 5, 2]} intensity={1.6} />
              <ThreePieSegment 
                color="#818CF8" 
                rotation={[0, 0, 0]} 
                size={0.8} 
                exploded={pieExploded}
                onClick={() => setPieExploded(!pieExploded)}
              />
              <ThreePieSegment 
                color="#F87171" 
                rotation={[0, Math.PI * 1.2, 0]} 
                size={0.8} 
                exploded={false}
              />
              <OrbitControls enableZoom={false} />
            </Canvas>
            <div className="absolute bottom-2 left-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-450">
                <span className="h-2 w-2 rounded-full bg-indigo-500" /> Success ({successRate}%)
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-450">
                <span className="h-2 w-2 rounded-full bg-red-500" /> Failure ({100 - successRate}%)
              </span>
            </div>
          </div>
        </div>

        {/* 2. 3D Bar Chart (Feature Importance Box) */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[360px] bg-slate-950/20">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-400" /> 2. Feature Importance
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">3D feature weights generated on model training fit.</p>
          </div>

          <div className="flex-1 w-full relative">
            <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
              <ambientLight intensity={1.3} />
              <directionalLight position={[2, 5, 2]} intensity={1.6} />
              {/* Bars: Experience, Marketing, Funding, Team */}
              <ThreeBar position={[-1.2, 0, 0]} height={(idea?.founder_experience || 2) * 0.15} color="#34D399" />
              <ThreeBar position={[-0.4, 0, 0]} height={(marketingBudget / 5000) * 0.15} color="#60A5FA" />
              <ThreeBar position={[0.4, 0, 0]} height={(fundingNeed / 25000) * 0.15} color="#818CF8" />
              <ThreeBar position={[1.2, 0, 0]} height={(idea?.team_size || 3) * 0.25} color="#A78BFA" />
              <OrbitControls enableZoom={false} />
            </Canvas>
            <div className="absolute bottom-2 inset-x-2 flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider">
              <span>Exp</span>
              <span>Mkt</span>
              <span>Fund</span>
              <span>Team</span>
            </div>
          </div>
        </div>

        {/* 3. 3D Revenue Projection Chart */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[360px] bg-slate-950/20">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-400" /> 3. Revenue & Burn Horizon
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Curved financial trajectories mapped to runway limits.</p>
          </div>

          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="year" stroke="#475569" fontSize={9} />
                <YAxis stroke="#475569" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', fontSize: 10 }} />
                <Area type="monotone" dataKey="Revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Expenses" stroke="#EF4444" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="glass-panel p-6 border-slate-800/80 bg-slate-950/20">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">4. Startup Growth Timeline</h3>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 relative">
          {[
            { step: "Idea", desc: "Core Concept", color: "border-indigo-500/20 bg-indigo-500/5 text-indigo-400" },
            { step: "Prototype", desc: "Mock validation", color: "border-blue-500/20 bg-blue-500/5 text-blue-400" },
            { step: "MVP", desc: "Basic functional version", color: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400" },
            { step: "Early Users", desc: "Cohort testing", color: "border-purple-500/20 bg-purple-500/5 text-purple-400" },
            { step: "Funding", desc: "Raise capital ask", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
            { step: "Scaling", desc: "Market growth", color: "border-pink-500/20 bg-pink-500/5 text-pink-400" },
            { step: "Growth", desc: "Profitable scale", color: "border-amber-500/20 bg-amber-500/5 text-amber-400" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-4 rounded-xl border flex flex-col justify-between ${item.color} relative`}
            >
              <div>
                <span className="text-xs font-bold block">{item.step}</span>
                <span className="text-[9px] text-slate-500 font-semibold block mt-1 leading-relaxed">{item.desc}</span>
              </div>
              <div className="mt-4 flex justify-between items-center text-[9px] font-bold">
                <span>Phase 0{idx+1}</span>
                {idx < 6 && <ArrowRight className="h-3 w-3 hidden md:inline shrink-0" />}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Row 2: Gauges & Radar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 6. Investment Speedometer Gauge */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[360px] bg-slate-950/20 relative">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" /> 6. Investment Probability
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Probability needle based on comparative funding metrics.</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative mt-4">
            <svg className="w-48 h-24" viewBox="0 0 100 50">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeDasharray="125 125" />
              {/* Highlight path based on success rate */}
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#6366f1" strokeWidth="10" strokeDasharray={`${(successRate / 100) * 125} 125`} />
            </svg>
            <div className="text-center mt-3">
              <span className="text-3xl font-extrabold text-white">{successRate}%</span>
              <p className="text-[10px] font-extrabold uppercase text-slate-400 mt-0.5 tracking-widest">
                {successRate > 80 ? "Excellent" : successRate > 60 ? "Good" : successRate > 30 ? "Moderate" : "High Risk"}
              </p>
            </div>
          </div>
        </div>

        {/* 7. Startup Health Meter */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[360px] bg-slate-950/20">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> 7. Startup Health Meter
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Multi-vector radial indicators tracking operations.</p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 mt-6">
            {[
              { label: "Innovation", value: Math.round(successRate * 0.95), color: "stroke-indigo-500" },
              { label: "Market Fit", value: Math.round(successRate * 0.9), color: "stroke-emerald-500" },
              { label: "Finance", value: 100 - (prediction?.risk_financial || 30), color: "stroke-blue-500" },
              { label: "Execution", value: 100 - (prediction?.risk_execution || 25), color: "stroke-purple-500" }
            ].map((health, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center p-2 bg-slate-900/35 border border-slate-800/40 rounded-2xl">
                <svg className="w-12 h-12" viewBox="0 0 36 36">
                  <path className="stroke-slate-800" strokeWidth="3.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={health.color} strokeWidth="3.5" strokeDasharray={`${health.value}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-1">{health.label}</span>
                <span className="text-[11px] font-extrabold text-white mt-0.5">{health.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Risk Analysis Radar */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[360px] bg-slate-950/20">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" /> 9. Risk Radar Index
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Multi-axis index tracking domain risk profiles.</p>
          </div>

          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="95%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#64748B" fontSize={8} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" fontSize={8} />
                <Radar name="Startup Risk" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Funnel & Business Canvas Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 10. Startup Funnel Visualization */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[420px] bg-slate-950/20">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" /> 10. Conversion Funnel
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Projected user conversion metrics for year one.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3 mt-4">
            {[
              { phase: "Visitors", val: "100k", width: "w-full", bg: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" },
              { phase: "Interested Users", val: "40k", width: "w-[85%]", bg: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
              { phase: "Registered", val: "15k", width: "w-[70%]", bg: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
              { phase: "Paying", val: "2.5k", width: "w-[50%]", bg: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
              { phase: "Retention", val: "1.8k", width: "w-[40%]", bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center w-full">
                <div className={`py-2 px-4 rounded-xl border ${step.width} ${step.bg} flex justify-between items-center text-[10px] font-bold shadow-sm`}>
                  <span>{step.phase}</span>
                  <span>{step.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 11. Investor Confidence & 12. Monthly Growth Line Chart */}
        <div className="glass-panel p-6 border-slate-800/80 flex flex-col justify-between h-[420px] bg-slate-950/20 col-span-2">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-400" /> 12. Monthly User & Revenue Growth
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Projected user acquisition and orders over 12 months.</p>
          </div>

          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="90%">
              <ComposedChart data={monthlyGrowthData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                <YAxis stroke="#475569" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', fontSize: 10 }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="Orders" barSize={20} fill="#4F46E5" radius={[5, 5, 0, 0]} />
                <Line type="monotone" dataKey="Users" stroke="#06B6D4" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 4: Business Model Canvas Block */}
      <div className="glass-panel p-6 border-slate-800/80 bg-slate-950/20">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">14. Business Model Canvas</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2">Key Partners</h4>
            <ul className="text-[10px] text-slate-400 space-y-1">
              <li>• Cloud providers</li>
              <li>• Industry integrations</li>
              <li>• Channel distributors</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2">Key Activities</h4>
            <ul className="text-[10px] text-slate-400 space-y-1">
              <li>• Product development</li>
              <li>• CAC optimization</li>
              <li>• Customer onboarding</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/10">
            <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-2">Value Prop</h4>
            <ul className="text-[10px] text-slate-300 font-medium space-y-1">
              <li>• Resolves: {idea?.problem?.slice(0, 40)}...</li>
              <li>• Scalable pricing tiers</li>
              <li>• Automated reporting</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2">Customer Relations</h4>
            <ul className="text-[10px] text-slate-400 space-y-1">
              <li>• Self-serve onboarding</li>
              <li>• Dedicated Slack channels</li>
              <li>• Weekly email updates</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2">Customer Segments</h4>
            <ul className="text-[10px] text-slate-400 space-y-1">
              <li>• {idea?.target_audience?.slice(0, 40)}...</li>
              <li>• Tech-forward SMBs</li>
              <li>• Early scale adapters</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Row 5: Startup Comparison & Heatmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 17. Startup Comparison */}
        <div className="glass-panel p-6 border-slate-800/80 bg-slate-950/20 col-span-2 h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-400" /> 17. Startup Performance Comparison
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Comparing key variables against standard benchmarks.</p>
          </div>

          <div className="flex-1 w-full mt-4">
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="category" stroke="#475569" fontSize={9} />
                <YAxis stroke="#475569" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#fff', fontSize: 10 }} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 9 }} />
                <Bar dataKey="Your Startup" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Average Startup" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Successful Startup" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 20. AI Heatmap */}
        <div className="glass-panel p-6 border-slate-800/80 bg-slate-950/20 h-[380px] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" /> 20. AI Correlation Heatmap
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Matrix representing correlation variables.</p>
          </div>

          <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-1.5 mt-6 text-[8px] font-black uppercase tracking-tighter text-center">
            {/* Headers row */}
            <div className="flex items-center justify-center text-slate-500 font-semibold">Exp</div>
            <div className="flex items-center justify-center text-slate-500 font-semibold">Mkt</div>
            <div className="flex items-center justify-center text-slate-500 font-semibold">Fund</div>
            <div className="flex items-center justify-center text-slate-500 font-semibold">Risk</div>

            {/* Row 1 */}
            <div className="bg-indigo-950/80 text-indigo-400 p-2 rounded flex items-center justify-center">1.00</div>
            <div className="bg-indigo-900/60 text-indigo-300 p-2 rounded flex items-center justify-center">0.45</div>
            <div className="bg-indigo-900/30 text-indigo-200 p-2 rounded flex items-center justify-center">0.20</div>
            <div className="bg-red-950/40 text-red-400 p-2 rounded flex items-center justify-center">-0.35</div>

            {/* Row 2 */}
            <div className="bg-indigo-900/60 text-indigo-300 p-2 rounded flex items-center justify-center">0.45</div>
            <div className="bg-indigo-950/80 text-indigo-400 p-2 rounded flex items-center justify-center">1.00</div>
            <div className="bg-indigo-900/50 text-indigo-300 p-2 rounded flex items-center justify-center">0.55</div>
            <div className="bg-red-950/30 text-red-300 p-2 rounded flex items-center justify-center">-0.22</div>

            {/* Row 3 */}
            <div className="bg-indigo-900/20 text-indigo-200 p-2 rounded flex items-center justify-center">0.20</div>
            <div className="bg-indigo-900/50 text-indigo-300 p-2 rounded flex items-center justify-center">0.55</div>
            <div className="bg-indigo-950/80 text-indigo-400 p-2 rounded flex items-center justify-center">1.00</div>
            <div className="bg-red-950/50 text-red-400 p-2 rounded flex items-center justify-center">-0.50</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveAnalytics;
