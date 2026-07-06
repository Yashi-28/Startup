import React from 'react';

const RiskGauge = ({ title, value }) => {
  const score = Math.min(100, Math.max(0, value || 0));
  
  // Calculate labels and colors
  let colorClass = "bg-emerald-500 shadow-emerald-500/20";
  let textClass = "text-emerald-400";
  let label = "Low Risk";
  
  if (score > 70) {
    colorClass = "bg-rose-500 shadow-rose-500/20";
    textClass = "text-rose-400";
    label = "High Risk";
  } else if (score > 40) {
    colorClass = "bg-amber-500 shadow-amber-500/20";
    textClass = "text-amber-400";
    label = "Medium Risk";
  }

  return (
    <div className="w-full p-4 bg-dark-card/40 rounded-xl border border-dark-border/40 hover:border-dark-border transition-all duration-300">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-300">{title}</span>
        <span className={`text-xs font-bold uppercase tracking-wider ${textClass}`}>
          {score}% - {label}
        </span>
      </div>
      
      {/* Background Track */}
      <div className="relative w-full h-2.5 bg-dark-border rounded-full overflow-hidden">
        {/* Fill Indicator */}
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Segment Indicators */}
      <div className="flex justify-between text-[9px] text-gray-500 mt-1.5 px-0.5">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
    </div>
  );
};

export default RiskGauge;
