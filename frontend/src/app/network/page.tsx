'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, UserPlus, MessageCircle, Zap, Star } from 'lucide-react';
import api from '@/lib/api';

export default function StudySyncNetwork() {
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await api.get('/ai/studysync/match');
        setMatch(res.data);
      } catch (err) {
        console.error("Failed to load match");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" /> StudySync Network
          </h2>
          <p className="text-slate-500 mt-2 text-lg">Our AI analyzes your Skill Radar to find your perfect study partners.</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-blue-600 font-medium">Calculating ML Vectors...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Top Match Highlight */}
            <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="flex items-center gap-2 text-blue-300 font-bold tracking-wider text-sm uppercase mb-6">
                <Zap size={18} /> Top AI Match
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-32 h-32 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center text-4xl font-black shadow-inner">
                  {match?.match_name?.charAt(0) || 'A'}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-2">{match?.match_name || 'Alex Johnson'}</h3>
                  <p className="text-blue-100 mb-6 text-lg">{match?.reason || 'High proficiency in your weakest subject (Algebra).'}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg">
                      <UserPlus size={20} /> Connect
                    </button>
                    <button className="bg-blue-800/50 hover:bg-blue-700/50 text-white px-6 py-3 rounded-xl font-bold border border-blue-400/30 transition-colors flex items-center gap-2 backdrop-blur-sm">
                      <MessageCircle size={20} /> Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Match Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-white mb-1">94%</div>
                  <div className="text-blue-300 text-sm font-medium">Complementary Score</div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-3xl font-black text-white mb-1">Algebra</div>
                  <div className="text-blue-300 text-sm font-medium">They can teach you</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-white mb-1">Coding</div>
                  <div className="text-blue-300 text-sm font-medium">You can teach them</div>
                </div>
              </div>
            </div>

            {/* Other Potential Matches */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-6 text-lg">Other Potential Peers</h3>
              <div className="space-y-4">
                {[
                  { name: 'Sarah M.', subject: 'Physics', match: '88%' },
                  { name: 'David L.', subject: 'Literature', match: '75%' },
                  { name: 'Emma W.', subject: 'Calculus', match: '72%' }
                ].map((peer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
                        {peer.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{peer.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">Excels in {peer.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-bold text-sm">{peer.match}</div>
                      <button className="text-xs text-slate-400 hover:text-blue-600 font-medium transition-colors mt-1 opacity-0 group-hover:opacity-100">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}