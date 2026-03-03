'use client';

import { useState } from 'react';
import { Target, Map, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

export default function CareerRoadmap() {
  const [role, setRole] = useState('AI Engineer');
  
  // Mocking the Skill Radar data from Module 7
  const currentSkills = { "Math": 65, "Logic": 80, "Coding": 40 };

  const roadmap = [
    { skill: "Coding", gap: 45, task: "Complete Python Data Structures" },
    { skill: "Math", gap: 25, task: "Master Linear Algebra" }
  ];

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Career Roadmap Generator</h1>
            <p className="text-gray-500">Mapping your AI profile to industry standards</p>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-6 mb-8 shadow-sm">
          <label className="block text-sm font-bold text-gray-700 mb-2">Target Career Path</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>AI Engineer</option>
            <option>Data Scientist</option>
            <option>Full Stack Developer</option>
          </select>
        </div>

        <div className="space-y-6">
          <h3 className="font-bold text-lg flex items-center">
            <Map className="mr-2 w-5 h-5 text-indigo-600" /> Your Path to {role}
          </h3>
          
          {roadmap.map((item, idx) => (
            <div key={idx} className="relative pl-8 pb-8 border-l-2 border-indigo-100 last:border-0">
              <div className="absolute left-[-9px] top-0 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white"></div>
              <div className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-indigo-600">{item.skill}</span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">-{item.gap}% Gap</span>
                </div>
                <p className="text-gray-700 mb-4">{item.task}</p>
                <button className="text-sm font-bold text-indigo-600 flex items-center hover:underline">
                  View Recommended Course <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}