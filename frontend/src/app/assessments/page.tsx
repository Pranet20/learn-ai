"use client";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import api from "@/lib/api";

// UPDATED: Replaced Algebra with Mathematics, Coding with Chemistry
const QUIZ_DB: Record<string, { question: string, options: string[], answer: string }[]> = {
  "Mathematics": [
    { question: "What is the value of x in 2x + 6 = 14?", options: ["2", "4", "6", "8"], answer: "4" },
    { question: "What is the area of a circle with radius r?", options: ["πr", "2πr", "πr²", "2πr²"], answer: "πr²" },
    { question: "If y = 3x - 2, what is y when x = 5?", options: ["13", "15", "17", "10"], answer: "13" }
  ],
  "Physics": [
    { question: "What is the SI unit of Force?", options: ["Joule", "Watt", "Newton", "Pascal"], answer: "Newton" },
    { question: "Which law states F = ma?", options: ["Newton's 1st Law", "Newton's 2nd Law", "Newton's 3rd Law", "Law of Gravity"], answer: "Newton's 2nd Law" },
    { question: "What is the acceleration due to gravity on Earth?", options: ["9.8 m/s²", "10.5 m/s²", "8.9 m/s²", "9.2 m/s²"], answer: "9.8 m/s²" }
  ],
  "Chemistry": [
    { question: "What is the chemical symbol for Gold?", options: ["Ag", "Au", "Pb", "Fe"], answer: "Au" },
    { question: "What is the pH level of pure water?", options: ["5", "7", "9", "14"], answer: "7" },
    { question: "Which subatomic particle carries a negative charge?", options: ["Proton", "Neutron", "Electron", "Photon"], answer: "Electron" }
  ],
  "Literature": [
    { question: "Who wrote 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
    { question: "What is the main theme of '1984' by George Orwell?", options: ["Romance", "Totalitarianism", "Space Exploration", "Magic"], answer: "Totalitarianism" },
    { question: "Which literary device gives human traits to non-human things?", options: ["Simile", "Metaphor", "Personification", "Hyperbole"], answer: "Personification" }
  ]
};

// UPDATED: Colors and Icons for the new subjects
const SUBJECT_META: Record<string, { icon: string, color: string }> = {
  "Mathematics": { icon: "∑", color: "text-blue-600 bg-blue-100" },
  "Physics": { icon: "⚛️", color: "text-emerald-600 bg-emerald-100" },
  "Chemistry": { icon: "🧪", color: "text-rose-600 bg-rose-100" },
  "Literature": { icon: "📚", color: "text-amber-600 bg-amber-100" }
};

export default function AssessmentsPage() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUserEmail(res.data.email);
      } catch (err) {
        console.error("Could not fetch user");
      }
    };
    fetchUser();
  }, []);

  const startQuiz = (subject: string) => {
    setActiveSubject(subject);
    setCurrentQuestion(0);
    setScore(0);
    setIsFinished(false);
  };

  const handleAnswer = (selectedOption: string) => {
    if (!activeSubject) return;
    
    const quiz = QUIZ_DB[activeSubject];
    const isCorrect = selectedOption === quiz[currentQuestion].answer;
    
    if (isCorrect) setScore(score + 1);

    if (currentQuestion + 1 < quiz.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz(isCorrect ? score + 1 : score, activeSubject, quiz.length);
    }
  };

  const finishQuiz = async (finalScore: number, subject: string, totalQuestions: number) => {
    setIsFinished(true);
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    try {
      await api.post("/assessments/submit", {
        email: userEmail,
        subject: subject,
        score: percentage
      });
    } catch (error) {
      console.error("Failed to save score", error);
      alert("Error saving score to database.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 w-full max-w-5xl mx-auto h-full flex flex-col animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Assessments</h1>
        <p className="text-gray-600 mb-8">Take quizzes to update your proficiency and get better AI peer matches.</p>

        {!activeSubject ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(QUIZ_DB).map((subject) => (
              <div key={subject} className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center group">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 font-bold transition-transform group-hover:scale-110 ${SUBJECT_META[subject].color}`}>
                  {SUBJECT_META[subject].icon}
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{subject} Mastery</h2>
                <p className="text-sm text-gray-500 mb-6">{QUIZ_DB[subject].length} Questions • Updates Skill Radar</p>
                <button 
                  onClick={() => startQuiz(subject)}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        ) : !isFinished ? (
          <div className="bg-white p-8 rounded-[32px] border border-gray-200 shadow-lg max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6 text-sm font-bold text-gray-500">
              <span>Question {currentQuestion + 1} of {QUIZ_DB[activeSubject].length}</span>
              <span className="text-blue-600">{activeSubject} Mastery</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-8">{QUIZ_DB[activeSubject][currentQuestion].question}</h3>
            
            <div className="space-y-4">
              {QUIZ_DB[activeSubject][currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 text-gray-700 font-medium transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[32px] border border-gray-200 shadow-lg max-w-2xl mx-auto w-full text-center">
            <div className="text-6xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeSubject} Quiz Complete!</h2>
            <p className="text-xl text-gray-600 mb-8">
              You scored <span className="font-bold text-blue-600">{Math.round((score / QUIZ_DB[activeSubject].length) * 100)}%</span>
            </p>
            <button 
              onClick={() => setActiveSubject(null)}
              className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-md"
            >
              Back to Assessments
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}