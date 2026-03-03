import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Welcome to LearnAI</h1>
      <p className="text-gray-600 mb-8">Empowering your education with AI-driven Peer Matching.</p>
      <div className="space-x-4">
        <Link href="/login" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Login</Link>
        <Link href="/register" className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">Sign Up</Link>
      </div>
    </div>
  );
}