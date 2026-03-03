"use client";
import { useState, useEffect } from "react";
import DashboardLayout from '@/components/DashboardLayout';
import { Loader2, Save, BookOpen, Clock } from 'lucide-react';
import api from '@/lib/api';

const TEXTBOOKS = [
  { id: 1, title: "Mathematics (NCERT)", class: "Class 10", subject: "Math", color: "bg-blue-500" },
  { id: 2, title: "Science (Physics, Chem, Bio)", class: "Class 10", subject: "Science", color: "bg-green-500" },
  { id: 3, title: "Physics Part I & II", class: "Class 11", subject: "Physics", color: "bg-indigo-500" },
  { id: 4, title: "Chemistry Part I & II", class: "Class 11", subject: "Chemistry", color: "bg-purple-500" },
  { id: 5, title: "Mathematics Part I & II", class: "Class 12", subject: "Math", color: "bg-blue-600" },
  { id: 6, title: "Biology", class: "Class 12", subject: "Biology", color: "bg-emerald-500" },
];

export default function CoursesPage() {
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  
  // New state to hold ALL notes for ALL books
  const [allNotes, setAllNotes] = useState<Record<number, string>>({});
  const [currentNotes, setCurrentNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Load saved notes from memory on initial load
  useEffect(() => {
    const savedNotes = localStorage.getItem("learnai_saved_notes");
    if (savedNotes) {
      setAllNotes(JSON.parse(savedNotes));
    }
  }, []);

  // When a book is clicked, load its specific notes into the text box
  useEffect(() => {
    if (selectedBook) {
      setCurrentNotes(allNotes[selectedBook.id] || "");
    }
  }, [selectedBook, allNotes]);

  const filteredBooks = selectedClass === "All" ? TEXTBOOKS : TEXTBOOKS.filter(book => book.class === selectedClass);

  const handleSaveNotes = async () => {
    if (!selectedBook) return;
    setSavingNotes(true);
    
    try {
      // Save to Backend (Optional, keeping your original code)
      await api.post('/notes/save', { course_id: selectedBook.id, content: currentNotes }).catch(() => {});
      
      // Save locally so the student can actually read it when they come back!
      const updatedNotes = { ...allNotes, [selectedBook.id]: currentNotes };
      setAllNotes(updatedNotes);
      localStorage.setItem("learnai_saved_notes", JSON.stringify(updatedNotes));
      
      alert("Notes saved successfully!");
    } finally {
      setSavingNotes(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto h-full flex flex-col animate-in fade-in duration-500">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Textbook Library</h1>
            <p className="text-gray-600">Access your standard textbooks and view your saved notes.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 overflow-x-auto max-w-full">
            {["All", "Class 10", "Class 11", "Class 12"].map((cls) => (
              <button
                key={cls} onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${selectedClass === cls ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBooks.map((book) => (
            <div key={book.id} onClick={() => setSelectedBook(book)} className={`cursor-pointer rounded-xl border-2 transition-all hover:shadow-lg overflow-hidden group ${selectedBook?.id === book.id ? "border-blue-500 ring-4 ring-blue-50" : "border-gray-200"}`}>
              <div className={`${book.color} h-32 flex items-center justify-center p-6 text-white relative`}>
                <span className="absolute top-4 right-4 text-xs font-bold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">{book.class}</span>
                <BookOpen size={40} className="absolute left-4 bottom-4 opacity-20 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-center z-10">{book.title}</h3>
              </div>
              <div className="p-4 bg-white flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">{book.subject}</span>
                <div className="flex items-center gap-2">
                  {allNotes[book.id] && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">Has Notes</span>}
                  <button className={`text-sm font-bold hover:underline ${selectedBook?.id === book.id ? "text-blue-700" : "text-blue-600"}`}>
                    {selectedBook?.id === book.id ? "Taking Notes..." : "Open Book"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedBook && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col flex-grow min-h-[300px] animate-in fade-in slide-in-from-bottom-4 mb-8">
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center rounded-t-xl">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <span>✍️</span> Notes: {selectedBook.title}
              </h3>
              <div className="flex items-center gap-4">
                {allNotes[selectedBook.id] && <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12}/> Last saved</span>}
                <button 
                  onClick={handleSaveNotes} disabled={savingNotes}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm disabled:bg-blue-400 transition-colors"
                >
                  {savingNotes ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  {savingNotes ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
            <textarea
              className="w-full flex-grow min-h-[200px] p-6 focus:outline-none resize-none text-gray-700 leading-relaxed rounded-b-xl"
              placeholder={`Start typing your notes for ${selectedBook.title} here...`}
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}