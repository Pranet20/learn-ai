import { Users, ArrowRight } from 'lucide-react';

export default function StudySyncWidget() {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-white/20 rounded-lg">
          <Users className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-semibold">StudySync Match</h2>
      </div>
      
      <p className="text-indigo-100 mb-6 text-sm">
        We found a peer who excels in Algebra and needs help with Physics. Schedule a 1-on-1 session to trade knowledge.
      </p>

      <button className="w-full py-2.5 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center space-x-2">
        <span>Connect Now</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}