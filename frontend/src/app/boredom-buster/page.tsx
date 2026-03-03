"use client";
import DashboardLayout from "@/components/DashboardLayout";

export default function BoredomBusterPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center animate-in fade-in duration-500">
        <div className="text-7xl mb-6 animate-bounce">🎮</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Boredom Buster</h1>
        <p className="text-gray-600 max-w-md text-lg leading-relaxed">
          Taking a brain break is just as important as studying! We are currently developing mini-games and relaxation exercises for this section.
        </p>
        <div className="mt-8 px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-widest uppercase border border-blue-200 shadow-sm">
          Coming Soon 
        </div>
      </div>
    </DashboardLayout>
  );
}