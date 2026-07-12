import React from 'react';

const CompetitorAnalysis = ({ reportData }) => {
  if (!reportData?.competitor_analysis) {
    return <div className="text-gray-500 p-4 text-center">No market analysis data available. Run evaluation first.</div>;
  }

  let analysis = {};
  try {
    analysis = typeof reportData.competitor_analysis === 'string' 
      ? JSON.parse(reportData.competitor_analysis) 
      : reportData.competitor_analysis;
  } catch (e) {
    return <div className="text-red-500 p-4">Error parsing competitor data.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Overview Block */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-2">Market Overview</h3>
        <p className="text-gray-700 leading-relaxed">{analysis.market_overview}</p>
      </div>

      {/* Competitor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analysis.competitors?.map((comp, idx) => (
          <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold text-gray-900">{comp.name}</h4>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                comp.type === 'Direct' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                {comp.type} Competitor
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <strong className="text-emerald-700 block mb-0.5">🚀 Core Strengths:</strong>
                <p className="text-gray-600">{comp.strengths}</p>
              </div>
              <div>
                <strong className="text-rose-700 block mb-0.5">⚠️ Core Weaknesses:</strong>
                <p className="text-gray-600">{comp.weaknesses}</p>
              </div>
              <div className="pt-2 border-t border-gray-50">
                <strong className="text-indigo-700 block mb-0.5">💡 Our Unfair Advantage:</strong>
                <p className="text-gray-900 font-medium bg-indigo-50/50 p-2 rounded mt-1">{comp.our_advantage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Playbook */}
      <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
        <h3 className="text-lg font-bold text-emerald-900 mb-2">💡 Recommended Strategic Playbook</h3>
        <p className="text-gray-700 leading-relaxed">{analysis.recommended_strategy}</p>
      </div>
    </div>
  );
};

export default CompetitorAnalysis;