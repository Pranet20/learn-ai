"use client";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

export default function StudySyncPage() {
  const [mlData, setMlData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // NEW: State to track who we have connected with
  const [connectedPeers, setConnectedPeers] = useState<string[]>([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get("/ml/match");
        setMlData(res.data);
      } catch (err) {
        console.error("Failed to load ML data");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();

    // Load previously sent connections from memory
    const savedConnections = localStorage.getItem("learnai_connections");
    if (savedConnections) {
      setConnectedPeers(JSON.parse(savedConnections));
    }
  }, []);

  // NEW: Function to handle sending the request
  const handleConnect = () => {
    if (!mlData?.top_match) return;
    
    const peerName = mlData.top_match.name;
    
    // Prevent connecting with the same person twice
    if (!connectedPeers.includes(peerName)) {
      const updatedPeers = [...connectedPeers, peerName];
      setConnectedPeers(updatedPeers);
      
      // Save it so the Dashboard can read it!
      localStorage.setItem("learnai_connections", JSON.stringify(updatedPeers));
      alert(`Connection request sent to ${peerName}! They have been added to your Study Peers.`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-lg font-medium text-blue-600 animate-pulse">🧠 Running ML Skill Analysis...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Check if we already requested this specific top match
  const hasRequestedCurrentMatch = mlData?.top_match && connectedPeers.includes(mlData.top_match.name);

  return (
    <DashboardLayout>
      <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StudySync Match</h1>
          <p className="text-gray-600">Our Machine Learning algorithm pairs you with the perfect study partner based on your skill gaps.</p>
        </div>

        {!mlData?.focus_areas?.length && !mlData?.strengths?.length ? (
          <div className="bg-white p-12 rounded-[32px] border border-gray-200 text-center shadow-sm">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">Not enough data yet!</h2>
            <p className="text-gray-500">Take a few quizzes in the Assessments tab so our model can map your skill levels.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT COLUMN: Skill Profile */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span>🎯</span> Your Priority Focus
                </h2>
                {mlData.focus_areas.length > 0 ? (
                  <div className="space-y-4">
                    {mlData.focus_areas.map((area: any, idx: number) => (
                      <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <strong className="text-gray-800">{area.subject}</strong>
                          <span className="text-red-600 font-bold text-sm">Score: {area.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: `${area.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">You have no weak subjects! Great job.</p>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: The Top Match Card */}
            <div>
              <div className="bg-white p-8 rounded-3xl border border-blue-200 shadow-lg h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 text-8xl">🤝</div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <h2 className="text-2xl font-bold text-gray-900">Top Partner Match</h2>
                  <div className="bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl text-xl border border-green-200 shadow-sm">
                    {mlData.top_match?.match_rate}% Match
                  </div>
                </div>

                {mlData.top_match ? (
                  <div className="flex-grow flex flex-col justify-center relative z-10">
                    <div className="flex items-center gap-6 mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                      <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-md">
                        {mlData.top_match.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">{mlData.top_match.name}</h3>
                        <p className="text-blue-700 font-medium bg-blue-100 inline-block px-3 py-1 rounded-full text-sm">
                          Strong in {mlData.top_match.expertise} (Score: {mlData.top_match.peer_score}%)
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-8 text-center px-4">
                      We matched you with <b>{mlData.top_match.name}</b> because they excel in <b>{mlData.top_match.expertise}</b>, which is your highest priority focus area right now.
                    </p>

                    {/* DYNAMIC BUTTON */}
                    <button 
                      onClick={handleConnect}
                      disabled={hasRequestedCurrentMatch}
                      className={`w-full font-bold py-4 rounded-xl shadow-md transition-colors text-lg ${
                        hasRequestedCurrentMatch 
                          ? "bg-green-500 text-white cursor-not-allowed" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {hasRequestedCurrentMatch ? "✓ Request Sent" : "Send Connection Request"}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No compatible matches found at this time.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}