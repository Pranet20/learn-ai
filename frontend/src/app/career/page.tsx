'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Briefcase, ChevronRight, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

export default function CareerRoadmap() {
  const [paths, setPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await api.get('/career/recommendations');
        setPaths(res.data);
      } catch (err) { console.error("Career API failed"); }
      finally { setLoading(false); }
    };
    fetchCareers();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Career Roadmap</h2>
          <p className="text-slate-500 mt-2 text-lg">AI-powered career matching based on your real-time skill proficiency.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {paths.map((path, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-8 items-center">
              
              {/* Match Circular Progress */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * path.match_score) / 100}
                    className={path.match_score > 80 ? "text-emerald-500" : "text-blue-600"} 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-800">{path.match_score}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Match</span>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold text-slate-800">{path.role}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    path.match_score > 80 ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {path.status}
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed">{path.description}</p>
                
                {/* Requirements Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {Object.entries(path.requirements).map(([skill, level]: any) => (
                    <div key={skill} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                      <span className="text-xs font-bold text-slate-700">{skill}</span>
                      <span className="text-xs font-medium text-slate-400">Req: {level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="shrink-0 w-full md:w-auto">
                <button className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  path.match_score > 80 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200" 
                    : "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200"
                }`}>
                  {path.match_score > 80 ? <CheckCircle2 size={20} /> : <TrendingUp size={20} />}
                  {path.match_score > 80 ? "View Jobs" : "Start Roadmap"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}