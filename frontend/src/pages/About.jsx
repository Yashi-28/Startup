import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Cpu, Database, Award, Info, Code2, CheckCircle2 } from 'lucide-react';

const About = () => {
  const techStack = [
    { name: 'Python & FastAPI', desc: 'Robust machine learning execution, report compilation, and RESTful API endpoints.' },
    { name: 'Scikit-learn', desc: 'Random Forest classifiers trained to predict category boundaries and success rates.' },
    { name: 'Pandas & NumPy', desc: 'Pre-processing logic, numerical scaling, and structured dataframe manipulation.' },
    { name: 'React & Tailwind', desc: 'Sleek, glassmorphism-based single-page application and responsive dashboards.' },
    { name: 'Gemini AI', desc: 'Generative SWOT models, lean canvas summaries, and business pitch advisory.' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-4xl space-y-8 animate-fade-in">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Info className="h-8 w-8 text-indigo-400" /> About the Project
            </h1>
            <p className="text-sm text-slate-405 mt-1">Discover the inner workings, dataset, and technology stack powering the Startup success platform.</p>
          </div>

          {/* Project Objective Card */}
          <div className="glass-panel p-6 md:p-8 border border-slate-800/80 shadow-sm bg-[#111827]/40">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-455" /> Project Objective
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Evaluating the success potential of early-stage startups is a notoriously complex problem. NexalQ bridges the gap between raw concept and market viability. By analyzing key operational indicators—such as domain experience, funding requirements, marketing budgets, and target market contexts—against structured historical models, we provide founders with immediate quantitative and qualitative business intelligence.
            </p>
          </div>

          {/* Core Methodology / Algorithm & Dataset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 border border-slate-800/80 shadow-sm flex flex-col justify-between bg-[#111827]/40">
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-400" /> Training Dataset
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The machine learning model is trained on a comprehensive historical dataset of tech and service-oriented startups. The dataset contains features capturing initial investments, founder experience levels, industry segments, competition matrices, and launch timeframes, mapped to final success/failure markers.
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 border border-slate-800/80 shadow-sm flex flex-col justify-between bg-[#111827]/40">
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-400" /> ML Classifier
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We use an advanced **Random Forest Classifier** model. Random Forests handle non-linear operations, outliers, and feature interactions exceptionally well. The model outputs a probability value representing the likelihood of startup success alongside categorizing descriptions into target verticals.
                </p>
              </div>
            </div>
          </div>

          {/* Technologies Grid */}
          <div className="glass-panel p-6 md:p-8 border border-slate-800/80 shadow-sm bg-[#111827]/40">
            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-indigo-400" /> Technologies Used
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techStack.map((tech, idx) => (
                <div key={idx} className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{tech.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{tech.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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

export default About;
