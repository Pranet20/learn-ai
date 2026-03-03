"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";

// Simplified Event interface (No more 'tab' needed!)
interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
}

export default function TimetablePage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventTime, setNewEventTime] = useState("");

  // Load events AND reminder settings when the page opens
  useEffect(() => {
    const savedEvents = localStorage.getItem("learnai_timetable");
    if (savedEvents) setEvents(JSON.parse(savedEvents));

    const savedReminders = localStorage.getItem("learnai_reminders");
    if (savedReminders) setNotificationsEnabled(JSON.parse(savedReminders));
  }, []);

  // Toggle reminders and save to memory for the Dashboard to see
  const toggleReminders = () => {
    const newVal = !notificationsEnabled;
    setNotificationsEnabled(newVal);
    localStorage.setItem("learnai_reminders", JSON.stringify(newVal));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim() || !newEventTime.trim()) return;

    const newEvent: Event = {
      id: Date.now(),
      title: newEventTitle,
      date: newEventDate,
      time: newEventTime,
      type: "Study Session",
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem("learnai_timetable", JSON.stringify(updatedEvents));

    setIsModalOpen(false);
    setNewEventTitle("");
    setNewEventDate("");
    setNewEventTime("");
  };

  const handleDeleteEvent = (id: number) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem("learnai_timetable", JSON.stringify(updatedEvents));
  };

  return (
    <DashboardLayout>
      <div className="p-8 w-full max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Timetable</h1>
            <p className="text-gray-600">Plan your academic journey and track your daily tasks.</p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors" onClick={toggleReminders}>
            <span className="text-xl">{notificationsEnabled ? "🔔" : "🔕"}</span>
            <div>
              <p className="text-sm font-bold text-gray-800">Study Reminders</p>
              <p className="text-xs text-gray-500">{notificationsEnabled ? "Dashboard alerts ON" : "Dashboard alerts OFF"}</p>
            </div>
            <button 
              className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* TIMETABLE CONTENT AREA */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 min-h-[500px] flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">Your Schedule</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-md"
            >
              + Add New Event
            </button>
          </div>

          {events.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4 opacity-30">🗓️</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Your schedule is empty</h3>
              <p className="text-gray-500 max-w-md">
                You haven't added any study sessions yet. Click "Add New Event" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex gap-4 items-center">
                    <div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-bold text-center">
                      <div className="text-xs text-blue-500 uppercase tracking-wider">{event.date}</div>
                      <div>{event.time}</div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg">{event.title}</h4>
                      <p className="text-sm text-gray-500">{event.type}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:bg-red-100 p-2 rounded-lg transition-colors font-bold text-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL POPUP FOR ADDING EVENTS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Study Session</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">What do you need to do?</label>
                <input 
                  type="text" required autoFocus
                  value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g., Read Physics Chapter 3"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                  <input 
                    type="date" required
                    value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Time</label>
                  <input 
                    type="time" required
                    value={newEventTime} onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}