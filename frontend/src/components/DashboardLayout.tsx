"use client";
import Sidebar from './Sidebar';
import AIChatbot from './AIChatbot'; 

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative">
        {children}
        <AIChatbot /> 
      </main>
    </div>
  );
}