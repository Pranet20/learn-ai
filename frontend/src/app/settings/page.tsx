"use client";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // User Data State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [studySyncDiscovery, setStudySyncDiscovery] = useState(true);

  // A reference to secretly trigger the file explorer
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real user data when the page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Handle image selection from file explorer
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a temporary URL to preview the image instantly
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving to database
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="animate-pulse text-gray-500 font-medium">Loading your settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 w-full max-w-6xl mx-auto animate-in fade-in duration-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, preferences, and StudySync visibility.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-full md:w-64 space-y-2">
            {["Profile", "Notifications", "Security", "Privacy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab === "Profile" && "👤"}
                {tab === "Notifications" && "🔔"}
                {tab === "Security" && "🔒"}
                {tab === "Privacy" && "🛡️"}
                {tab}
              </button>
            ))}
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="flex-1">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
              
              {/* --- PROFILE TAB --- */}
              {activeTab === "Profile" && (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    👤 Personal Information
                  </h2>
                  
                  {/* Avatar Upload Section */}
                  <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-600 font-bold text-2xl overflow-hidden">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      {/* Hidden file input */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors mb-2 text-sm"
                      >
                        Upload Avatar
                      </button>
                      <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        readOnly
                        className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400 mt-1">Email addresses cannot be changed once registered.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- NOTIFICATIONS TAB --- */}
              {activeTab === "Notifications" && (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🔔 Platform Preferences
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div>
                        <p className="font-bold text-gray-800">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive updates about new courses and quiz reminders.</p>
                      </div>
                      <button 
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SECURITY TAB --- */}
              {activeTab === "Security" && (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🔒 Update Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* --- PRIVACY TAB --- */}
              {activeTab === "Privacy" && (
                <div className="space-y-8 animate-in fade-in">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    🛡️ Privacy Settings
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-blue-100 rounded-xl bg-blue-50">
                      <div>
                        <p className="font-bold text-blue-900">StudySync Discovery</p>
                        <p className="text-sm text-blue-700">Allow the ML algorithm to match you with peers.</p>
                      </div>
                      <button 
                        onClick={() => setStudySyncDiscovery(!studySyncDiscovery)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${studySyncDiscovery ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${studySyncDiscovery ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GLOBAL SAVE BUTTON */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors disabled:bg-blue-400"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}