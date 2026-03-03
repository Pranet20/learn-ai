"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [todayEvents, setTodayEvents] = useState<any[]>([]);
  const [remindersOn, setRemindersOn] = useState(false);
  
  // NEW: State for Study Peers
  const [peerCount, setPeerCount] = useState(0);
  
  const router = useRouter();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const userRes = await api.get("/users/me");
        setProfile(userRes.data);

        // Load Timetable events & reminders
        const savedReminders = localStorage.getItem("learnai_reminders");
        if (savedReminders) setRemindersOn(JSON.parse(savedReminders));

        const savedEvents = localStorage.getItem("learnai_timetable");
        if (savedEvents) setTodayEvents(JSON.parse(savedEvents));
        
        // NEW: Load Connected Peers Count
        const savedConnections = localStorage.getItem("learnai_connections");
        if (savedConnections) {
          const peersList = JSON.parse(savedConnections);
          setPeerCount(peersList.length);
        }

      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-gray-500 animate-pulse font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  if (!profile) return null;

  let avgProficiency = 0;
  if (profile.subjects) {
    try {
      const subData = JSON.parse(profile.subjects);
      const scores = Object.values(subData) as number[];
      if (scores.length > 0) avgProficiency = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    } catch(e) {}
  }

  return (
    <DashboardLayout>
      <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome back, {profile.name}! 👋</h1>
        <p className="text-gray-600 mb-8">Here is an overview of your learning progress.</p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 font-bold text-xl">📚</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900">4</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-200 flex items-center gap-4 bg-gradient-to-r from-green-50 to-white hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 font-bold text-xl">📈</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Avg. Proficiency</p>
              <p className="text-2xl font-bold text-green-700">{avgProficiency}%</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600 font-bold text-xl">⏱️</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Hours Learned</p>
              <p className="text-2xl font-bold text-gray-900">12h</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600 font-bold text-xl">👥</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Study Peers</p>
              {/* THIS WILL NOW UPDATE DYNAMICALLY! */}
              <p className="text-2xl font-bold text-gray-900">{peerCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Today's Timetable</h2>
              <Link href="/timetable" className="text-blue-600 text-sm font-semibold hover:text-blue-800 hover:underline">Manage Schedule</Link>
            </div>
            
            <div className="flex-grow flex flex-col space-y-4 overflow-y-auto">
              {!remindersOn ? (
                <div className="p-8 rounded-xl flex flex-col items-center justify-center bg-gray-50 text-center h-full">
                  <div className="text-4xl mb-3 opacity-50">🔕</div>
                  <h3 className="text-gray-700 font-medium mb-1">Reminders are OFF</h3>
                  <span className="text-gray-500 text-sm max-w-sm mb-4">Turn on Study Reminders in your timetable to view upcoming events here.</span>
                  <Link href="/timetable" className="px-6 py-2 bg-white border border-gray-200 text-gray-800 rounded-xl text-sm font-bold hover:bg-gray-100 shadow-sm transition-colors">Go to Timetable</Link>
                </div>
              ) : todayEvents.length > 0 ? (
                <div className="space-y-3">
                  {todayEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                      <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold text-center flex-shrink-0">
                        <div className="text-[10px] text-blue-500 uppercase tracking-wider">{event.date}</div>
                        <div>{event.time}</div>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{event.title}</h4>
                        <p className="text-xs text-gray-500">{event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 text-center h-full">
                    <div className="text-4xl mb-3 opacity-50">📅</div>
                    <h3 className="text-gray-700 font-medium mb-1">Your schedule is empty</h3>
                    <Link href="/timetable" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-colors">+ Add Study Session</Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-xl shadow-md border border-blue-500 text-white h-full flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl rotate-12 translate-x-4 -translate-y-4 group-hover:rotate-45 transition-transform duration-700">🧠</div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">System Active</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-2">StudySync Insights</h2>
              <p className="text-sm text-blue-100 leading-relaxed mb-6">
                Your latest quiz data has been processed by our ML algorithm. View your personalized learning path and connect with your top match.
              </p>
            </div>
            
            <Link 
              href="/studysync" 
              className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold transition-all text-center backdrop-blur-sm border border-white/20 shadow-inner flex items-center justify-center gap-2 relative z-10"
            >
              <span>Open ML Dashboard</span> 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}