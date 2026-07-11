import React from 'react';

const SuccessGauge = ({ score }) => {
  const percentage = Math.min(100, Math.max(0, score || 0));
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Determine color theme based on score
  let strokeColor = "url(#successGradient)";
  let textColor = "text-emerald-400";
  let statusText = "Excellent";

  if (percentage < 40) {
    strokeColor = "url(#dangerGradient)";
    textColor = "text-rose-400";
    statusText = "High Risk";
  } else if (percentage < 65) {
    strokeColor = "url(#warningGradient)";
    textColor = "text-amber-400";
    statusText = "Moderate";
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#111827]/40 rounded-[18px] border border-slate-800/80">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* SVG Circle Gauge */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <defs>
            <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            <linearGradient id="warningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* Background Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />

          {/* Foreground Colored Circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Text Inside Circular Progress */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
            {percentage}%
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Probability
          </span>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <span className="text-xs text-slate-550 font-medium">Success Outlook</span>
        <h4 className={`text-base font-bold ${textColor}`}>{statusText}</h4>
      </div>
    </div>
  );
};

export default SuccessGauge;
